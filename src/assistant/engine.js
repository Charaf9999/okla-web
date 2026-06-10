// ──────────────────────────────────────────────────────────────────────────
// Moteur de l'assistant OKLA — 100 % SCÉNARISÉ (aucun vrai LLM).
//
// Le composant Assistant envoie le texte tapé par l'utilisateur à answer().
// Le moteur :
//   1. normalise le texte (minuscules, accents retirés, ponctuation enlevée)
//   2. détecte la langue (français ou darija marocaine en lettres latines)
//   3. fait correspondre le texte à une INTENTION via des mots-clés pondérés
//   4. renvoie { reply, action, sources, lang }
//
// `sources` simule la couche RAG (documents « récupérés ») — pur affichage,
// cohérent avec l'architecture LLM+RAG modélisée dans le rapport PFE.
// Pour ajouter une question : ajouter une entrée dans INTENTS ci-dessous.
// ──────────────────────────────────────────────────────────────────────────

const strip = (s) => s.toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[’'`´]/g, ' ')
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ').trim()

// Marqueurs darija (arabizi) — si l'un d'eux apparaît, on répond en darija.
const DARIJA_MARKERS = [
  'salam', 'labas', 'bghit', 'bghyt', 'wach', 'wash', 'chno', 'shno', 'chnou',
  'kayn', 'kayna', 'kaynin', 'fin', 'fink', 'dyali', 'dyal', 'liya', 'lia',
  'choukran', 'chokran', 'shukran', 'mzyan', 'mzian', 'bzaf', 'lyouma', 'lyoma',
  'had', 'hadi', 'lila', 'l7out', 'lhout', 'rkhis', 'rkhes', 'rkhisa', 'ghir',
  'warrini', 'werini', 'akkad', 'akked', '3afak', 'afak', '3tini', 'atini',
  'nakol', 'naklo', 'makla', 'blassa', 'blasa', 'tabla', 'jouj', 'joj',
  'tlata', 'telata', 'rb3a', 'reb3a', 'khamsa', 'maghribi', 'meghribi',
  'beldi', '9rib', 'qrib', 'lb7er', 'lbhar', 'atay', 'nsa7ni', 'nse7ni',
]

const detectLang = (norm) => {
  const tokens = new Set(norm.split(' '))
  return DARIJA_MARKERS.some(m => tokens.has(m)) ? 'da' : 'fr'
}

// ── Analyse de l'heure et du nombre de personnes ──────────────────────────
const DA_NUMBERS = { jouj: 2, joj: 2, tlata: 3, telata: 3, rb3a: 4, reb3a: 4, khamsa: 5 }
const FR_NUMBERS = { deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6 }

function parseParty(norm) {
  const m = norm.match(/(?:pour|table\s+(?:de|pour)?|l)\s*(\d{1,2})\b/) || norm.match(/(\d{1,2})\s*(?:personnes?|pers|gens|nas)/)
  if (m) { const n = +m[1]; if (n >= 1 && n <= 12) return n }
  for (const [w, n] of Object.entries({ ...DA_NUMBERS, ...FR_NUMBERS }))
    if (new RegExp(`\\b${w}\\b`).test(norm)) return n
  return null
}

function parseTime(norm) {
  const m = norm.match(/\b(\d{1,2})\s*(?:h|:)\s*(\d{2})?\b/)
  if (!m) return null
  let h = +m[1]; const mn = m[2] || '00'
  if (h < 1 || h > 23) return null
  const evening = /\b(soir|lila|nuit|dinner|3chiya)\b/.test(norm)
  if (h < 12 && (evening || h <= 9)) h += 12        // « 8h ce soir » → 20:00
  return `${String(h).padStart(2, '0')}:${mn}`
}

// ── Helpers de contexte ───────────────────────────────────────────────────
const byTag = (list, tag) => list.filter(r => (r.tags || []).includes(tag))
const topRated = (list, pred = () => true) =>
  [...list].filter(pred).sort((a, b) => b.rating - a.rating)[0]

// ── INTENTIONS ────────────────────────────────────────────────────────────
// kw : mots-clés (les expressions de plusieurs mots pèsent plus lourd)
// respond(ctx) → { fr, da, action, sources }
const INTENTS = [
  {
    id: 'greeting', priority: 1,
    kw: ['bonjour', 'bonsoir', 'salut', 'hello', 'salam', 'labas', 'cc', 'coucou'],
    respond: () => ({
      fr: "Bonjour ! 👋 Je suis l'assistant OKLA. Dites-moi ce qui vous ferait plaisir — un restaurant marocain, du poisson, une table ce soir… et je m'occupe du reste.",
      da: "Salam ! 👋 Ana l'assistant dyal OKLA. Goul liya ach bghiti — makla maghribiya, l7out, wla tabla had lila… w ana ntkellef b kolchi.",
      sources: null, action: null,
    }),
  },
  {
    id: 'recommend', priority: 5,
    kw: ['recommande', 'recommandation', 'conseille', 'conseil', 'meilleur', 'suggere', 'suggestion',
      'marocain', 'marocaine', 'traditionnel', 'traditionnelle', 'tajine', 'couscous',
      'ahsan', 'nsa7ni', 'nse7ni', 'maghribi', 'meghribi', 'beldi', 'bghit nakol', 'chno naklo', 'makla'],
    respond: ({ list }) => {
      const r = topRated(list, x => /marocaine?/i.test(x.cuisine)) || topRated(list)
      return {
        fr: `Je vous recommande ${r.name} (${r.rating}★, ${r.reviews} avis) dans la ${r.area} — cuisine marocaine traditionnelle, tajines mijotés et patio verdoyant. Je l'affiche sur la carte 🗺️`,
        da: `Kan nsa7ek b ${r.name} (${r.rating}★, ${r.reviews} avis) f ${r.area} — kouzina maghribiya beldiya, tajine tay-tiyeb 3la nar hadya. Warritou lik f lkharita 🗺️`,
        action: { type: 'select', id: r.id },
        sources: [`Fiche · ${r.name}`, `Avis clients (${r.reviews})`],
      }
    },
  },
  {
    id: 'fish', priority: 6,
    kw: ['poisson', 'poissons', 'fruits de mer', 'mer fraiche', 'l7out', 'lhout', 'hout', 'crevettes', 'seafood'],
    respond: ({ list }) => {
      const r = topRated(list, x => /poisson/i.test(x.cuisine)) || list[0]
      return {
        fr: `Pour le poisson, la référence à Tanger c'est ${r.name} (${r.rating}★) près du port : poissons frais du jour servis en cinq services. Je vous le montre sur la carte 🐟`,
        da: `Ila bghiti l7out, ahsan blassa f Tanja hiya ${r.name} (${r.rating}★) 7da lminaa : l7out tari dyal nhar. Warritha lik f lkharita 🐟`,
        action: { type: 'select', id: r.id },
        sources: [`Fiche · ${r.name}`, 'Arrivage du jour · port de Tanger'],
      }
    },
  },
  {
    id: 'kasbah', priority: 6,
    kw: ['kasbah', 'pres de la kasbah', 'autour de la kasbah', '9rib', 'qrib', 'medina haute'],
    respond: ({ list }) => {
      const ids = list.filter(r => /kasbah|port/i.test(r.area)).map(r => r.id)
      const names = list.filter(r => ids.includes(r.id)).map(r => `${r.name} (${r.rating}★)`).join(' et ')
      return {
        fr: `Près de la Kasbah, deux belles adresses : ${names}. Je les mets en avant sur la carte ✨`,
        da: `9rib mn la Kasbah, 3andek jouj blayes mzyanin : ${names}. Bayyenthom lik f lkharita ✨`,
        action: { type: 'highlight', ids },
        sources: ['Recherche géolocalisée · Kasbah', 'Fiches restaurants (2)'],
      }
    },
  },
  {
    id: 'romantic', priority: 6,
    kw: ['romantique', 'amoureux', 'couple', 'anniversaire', 'romansi', 'romansiya', 'vue mer', 'vue sur mer', 'lb7er', 'lbhar', 'terrasse'],
    respond: ({ list, norm }) => {
      const sea = /vue|mer|lb7er|lbhar/.test(norm)
      const picks = sea ? byTag(list, 'Vue mer') : byTag(list, 'Romantique')
      const ids = (picks.length ? picks : byTag(list, 'Terrasse')).map(r => r.id)
      const names = list.filter(r => ids.includes(r.id)).map(r => r.name).join(', ')
      return {
        fr: sea
          ? `Avec vue sur la mer : ${names}. Les deux dominent la baie — parfait au coucher du soleil. Regardez la carte 🌅`
          : `Pour une soirée romantique, je pense à ${names} : patio aux chandelles et thé à la menthe. Je les surligne sur la carte 🕯️`,
        da: sea
          ? `B vue 3la lb7er : ${names}. Bjouj mtellin 3la lkhalij — top f lmghreb dyal chems 🌅`
          : `Ila bghiti chi blassa romansiya, 3andek ${names} : patio b chmou3 w atay. Bayyenthom lik f lkharita 🕯️`,
        action: { type: 'highlight', ids },
        sources: ['Filtre par ambiance · tags', `Fiches restaurants (${ids.length})`],
      }
    },
  },
  {
    id: 'offers', priority: 6,
    kw: ['offre', 'offres', 'promo', 'promotion', 'promotions', 'reduction', 'remise', 'solde', 't5fid', 'tkhfid', 'promos'],
    respond: ({ list }) => {
      const offs = list.filter(r => r.offer)
      const names = offs.map(r => `${r.name} (${r.offer})`).join(', ')
      return {
        fr: `Bonne nouvelle — ${offs.length} restaurants ont une offre aujourd'hui : ${names}. J'active le filtre « Offres » pour vous 🏷️`,
        da: `Khbar zwin — ${offs.length} dyal restaurants 3andhom promo lyouma : ${names}. Activit lik filtre « Offres » 🏷️`,
        action: { type: 'offers', ids: offs.map(r => r.id) },
        sources: ['Offres du jour · 10 juin', `Fiches restaurants (${offs.length})`],
      }
    },
  },
  {
    id: 'budget', priority: 6,
    kw: ['pas cher', 'petit budget', 'economique', 'abordable', 'rkhis', 'rkhes', 'rkhisa', 'budget sghir', 'moins cher'],
    respond: ({ list }) => {
      const cheap = [...list].sort((a, b) => a.priceLevel - b.priceLevel || b.rating - a.rating).slice(0, 2)
      const names = cheap.map(r => `${r.name} (${r.price}, ${r.rating}★)`).join(' et ')
      return {
        fr: `Côté budget, le meilleur rapport qualité-prix : ${names}. Je trie la liste par prix croissant 💸`,
        da: `Ila bghiti chi haja rkhisa w mzyana : ${names}. Rattabt lik lista 3la 7sab taman 💸`,
        action: { type: 'budget', ids: cheap.map(r => r.id) },
        sources: ['Tri par prix', 'Rapport qualité-prix · avis'],
      }
    },
  },
  {
    id: 'prefill', priority: 7,
    kw: ['table pour', 'une table', 'reserver une table', 'ce soir a', 'disponibilite', 'dispo ce soir',
      'tabla', 'bghit tabla', 'had lila', 'hadi lila', 'reserver pour', 'place pour'],
    respond: ({ list, selectedId, party, time }) => {
      const r = list.find(x => x.id === selectedId) || list[0]
      const t = time || '20:00'
      const p = party || 2
      return {
        fr: `C'est tout bon — ${r.name} a de la disponibilité ce soir à ${t} pour ${p} personne${p > 1 ? 's' : ''}. J'ai pré-rempli votre réservation, il ne reste qu'à confirmer ✅`,
        da: `Safi tbarkellah — ${r.name} fiha blassa had lila m3a ${t} l ${p} dyal nas. 3emmert lik réservation, b9a ghir t'confirmé ✅`,
        action: { type: 'prefill', id: r.id, time: t, party: p },
        sources: [`Disponibilités · ${r.name}`, 'Créneaux du 10 juin'],
      }
    },
  },
  {
    id: 'confirm', priority: 8,
    kw: ['confirme', 'confirmer', 'confirmation', 'valide ma reservation', 'je confirme', 'akkad', 'akked', 'akkad liya', 'confirmi', 'safi reservi'],
    respond: ({ list, selectedId }) => {
      const r = list.find(x => x.id === selectedId) || list[0]
      return {
        fr: `Parfait, je finalise votre réservation chez ${r.name}. Vous recevrez un rappel une heure avant. Bon appétit ! 🎉`,
        da: `Wakha, kan confirmé lik réservation f ${r.name}. Ghadi yjik rappel sa3a 9bel lwe9t. Bsa7a w ra7a ! 🎉`,
        action: { type: 'confirm' },
        sources: [`Réservation · ${r.name}`, 'Notification programmée'],
      }
    },
  },
  {
    id: 'myres', priority: 6,
    kw: ['mes reservations', 'reservations dyali', 'reservation dyali warrini', 'warrini reservations', 'voir mes reservations', 'historique', 'warrini'],
    respond: () => ({
      fr: "Voici vos réservations — je vous ouvre le panneau « Mes réservations » 📋",
      da: "Hahoma réservations dyalek — 7ellit lik « Mes réservations » 📋",
      action: { type: 'drawer' },
      sources: ['Réservations · session en cours'],
    }),
  },
  {
    id: 'menu', priority: 5,
    kw: ['menu', 'carte des plats', 'quoi manger', 'plats', 'specialites', 'chno kayn f lmenu', 'ach kayn', 'lmenu'],
    respond: ({ list, selectedId }) => {
      const r = list.find(x => x.id === selectedId) || list[0]
      const dishes = (r.menu || []).slice(0, 2).map(([n, p]) => `${n} (${p})`).join(', ')
      return {
        fr: `Chez ${r.name}, je vous conseille : ${dishes}. J'ouvre la fiche complète avec tout le menu 🍽️`,
        da: `F ${r.name}, kan nsa7ek b : ${dishes}. 7ellit lik la fiche kamla m3a lmenu 🍽️`,
        action: { type: 'detail', id: r.id },
        sources: [`Menu · ${r.name}`, 'Prix en DH · mis à jour'],
      }
    },
  },
  {
    id: 'thanks', priority: 1,
    kw: ['merci', 'parfait merci', 'super merci', 'choukran', 'chokran', 'shukran', 'top', 'nickel'],
    respond: () => ({
      fr: "Avec plaisir ! Je reste là si vous avez besoin d'autre chose. Bon appétit 🌿",
      da: "B kol farah ! Ana hna ila 7tajiti chi haja okhra. Bsa7tek 🌿",
      sources: null, action: null,
    }),
  },
]

// Réponse de repli quand rien ne correspond.
const FALLBACK = {
  fr: "Je n'ai pas bien saisi 🤔 Essayez par exemple : « Recommande-moi un restaurant marocain », « Une table pour 2 ce soir à 20h » ou « Quelles sont les offres du jour ? »",
  da: "Ma fhemtch mzyan 🤔 Jerreb matalan : « Chno ahsan restaurant maghribi ? », « Bghit tabla l jouj had lila » wla « Wach kaynin promotions lyouma ? »",
}

// ── Correspondance ────────────────────────────────────────────────────────
export function answer(text, ctx) {
  const norm = strip(text)
  const lang = detectLang(norm)
  const party = parseParty(norm)
  const time = parseTime(norm)

  let best = null, bestScore = 0
  for (const intent of INTENTS) {
    let score = 0
    for (const kw of intent.kw) {
      const k = strip(kw)
      if (new RegExp(`\\b${k}\\b`).test(norm))
        score += k.split(' ').length * 2 // les expressions pèsent double
    }
    if (score > bestScore || (score === bestScore && score > 0 && intent.priority > (best?.priority || 0))) {
      best = intent; bestScore = score
    }
  }

  if (!best || bestScore === 0)
    return { reply: FALLBACK[lang], action: null, sources: null, lang }

  const out = best.respond({ ...ctx, norm, party, time })
  return { reply: lang === 'da' ? out.da : out.fr, action: out.action, sources: out.sources, lang }
}

// Suggestions affichées sous forme de puces (mélange FR / darija).
export const SUGGESTIONS = [
  'Recommande-moi un restaurant marocain',
  'Une table pour 2 ce soir à 20h',
  'Wach kaynin promotions lyouma ?',
  'Des adresses près de la Kasbah ?',
  'Fin nakol l7out mzyan ?',
  'Confirme ma réservation',
]
