
function formatSolvedAnswer(riddle, answer){
  if(riddle?.type === "breakfast"){
    const saved = JSON.parse(localStorage.getItem('petitDejeunerIdeal') || '[]');
    if(saved.length){
      return 'Ton petit-déjeuner idéal :<br><ul>' +
        saved.map(i => `<li>${i}</li>`).join('') +
        '</ul>';
    }
    return 'Épreuve validée';
  }

  if(riddle?.type === "memory"){
    return 'Memory réussi';
  }

  if(answer === 'VALID'){
    return 'Épreuve validée';
  }

  if(answer === 'MEMORY_DONE'){
    return 'Memory réussi';
  }

  return `${formatSolvedAnswer(riddle, answer)}`;
}


window.restoreBreakfast=function(index){
  // Les choix sont conservés dans localStorage mais ne sont plus affichés
  // automatiquement avant la validation de l'épreuve.
  return;
}


window.toggleBreakfast=function(index,btn){
 const container = btn.closest('.breakfast-grid');
 const active = [...container.querySelectorAll('.breakfast-item.active')];

 if(!btn.classList.contains('active') && active.length>=4){
   return;
 }

 btn.classList.toggle('active');
}

window.validateBreakfast=function(index){
 const hidden = document.getElementById(`answer-${index}`);
 const container = hidden.parentElement.querySelector('.breakfast-grid');

 const selected = [...container.querySelectorAll('.breakfast-item.active')]
   .map(b => b.dataset.value);

 if(selected.length!==4){
   showInlineMessage('Choisis exactement 4 éléments.');
   return;
 }

 localStorage.setItem('petitDejeunerIdeal', JSON.stringify(selected));

 const result = document.getElementById(`breakfast-result-${index}`);
 if(result){
   result.innerHTML = `<h4>Ton petit-déjeuner idéal :</h4><ul>${selected.map(i => `<li>${i}</li>`).join('')}</ul>`;
 }

 hidden.value='VALID';
 checkAnswer(currentTicketId,index);
}

window._memory={};
window.flipMemory=function(index,btn){
 if(btn.classList.contains('found')||btn.classList.contains('open')) return;
 const state=window._memory[index]||{open:[],found:0,lock:false};
 if(state.lock) return;
 btn.classList.add('open'); btn.innerHTML=`<span>${btn.dataset.value}</span>`; state.open.push(btn);
 if(state.open.length===2){
   state.lock=true;
   const [a,b]=state.open;
   if(a.dataset.value===b.dataset.value){
      a.classList.add('found'); b.classList.add('found');
      state.found++;
      state.open=[]; state.lock=false;
      if(state.found===5){ document.getElementById(`answer-${index}`).value='MEMORY_DONE'; checkAnswer(currentTicketId,index); }
   } else {
      setTimeout(()=>{a.classList.remove('open');b.classList.remove('open');a.innerHTML='<span>❓</span>';b.innerHTML='<span>❓</span>';state.open=[];state.lock=false;},900);
   }
 }
 window._memory[index]=state;
}

var currentTicketId=null;

const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
window._mobileSelectedCard = null;

function selectMobileCard(card){
  if(!isTouchDevice) return;
  document.querySelectorAll('.selected-card').forEach(el => el.classList.remove('selected-card'));
  window._mobileSelectedCard = card;
  card.classList.add('selected-card');
}

function placeMobileCard(slot){
  if(!isTouchDevice || !window._mobileSelectedCard) return;

  const existing = slot.querySelector('.timeline-card, .fill-card');
  if(existing){
    existing.parentNode.appendChild(window._mobileSelectedCard);
  } else {
    slot.appendChild(window._mobileSelectedCard);
  }

  window._mobileSelectedCard.classList.remove('selected-card');
  window._mobileSelectedCard = null;
}


function showInlineMessage(text, type='error'){
  let box = document.getElementById('inline-message');
  if(!box){
    box = document.createElement('div');
    box.id = 'inline-message';
    document.body.appendChild(box);
  }
  box.className = `inline-message ${type}`;
  box.textContent = text;
  box.classList.add('visible');
  clearTimeout(window._inlineMessageTimer);
  window._inlineMessageTimer = setTimeout(()=>{
    box.classList.remove('visible');
  }, 2500);
}


window.chooseMonument = function(index, btn, value){
  document.querySelectorAll(`#monuments-${index} .monument-choice`).forEach(el=>el.classList.remove('selected'));
  btn.classList.add('selected');
  const input = document.getElementById(`answer-${index}`);
  if(input) input.value = value;
  const feedback = document.getElementById(`monument-feedback-${index}`);
  if(feedback) feedback.textContent = '';
}


window.selectMonument = function(ticketId, index, value){
  const ticket = tickets.find(t => t.id === ticketId);
  if(!ticket) return;

  const riddle = ticket.riddles[index];
  const validAnswers = riddle.answers || [];

  const feedback = document.getElementById(`monument-feedback-${index}`);

  if(validAnswers.some(answer => normalize(answer) === normalize(value))){
    if(feedback) feedback.textContent = '';
    completeRiddle(ticketId, index);
  } else {
    if(feedback) feedback.textContent = "❌ Ce n'est pas le bon monument.";
  }
}

const tickets = [
  {
    "id": 1,
    "code": "REFUGE-DORÉ",
    "title": "Le Refuge Doré",
    "gift": "Doudou",
    "teaser": "Un mystère doux, discret, pensé pour les choses que tu gardes près de toi sans toujours l’expliquer.",
    "intro": "<p>Certains trésors ne brillent pas.</p><p>Ils ne sont pas faits pour impressionner, ni pour être utiles à tout prix.</p><p>Ils restent là. Ils rassurent. Et parfois, ils accompagnent une vie plus longtemps qu’on ne l’avoue.</p>",
    "riddles": [
      {
        "type": "hidden-ending",
        "title": "Épreuve I — Au bord des phrases",
        "q": "<p class=\"instruction\">Pour trouver certains indices, il faut savoir regarder. Les détails racontent parfois plus que le reste.</p><div class=\"cipher-text ending-cipher\"><p>Il y a des objets qu’on garde plus longtemps que prévu, parfois toujours.</p><p>On les croit parfois inutiles, jusqu’au moment où ils comptent encore.</p><p>Certains souvenirs reviennent surtout quand tombe la nuit.</p><p>Ce qui rassure le plus ne fait pas toujours beaucoup de bruit doucement.</p><p>Une simple présence peut parfois faire plus qu’un discours et rassure.</p><p>Les choses les plus petites peuvent porter un morceau d’enfance.</p><p>On ne sait pas toujours expliquer pourquoi elles deviennent un souvenir.</p><p>Mais quand elles restent, c’est souvent qu’elles protègent un secret.</p><p>Et parfois, ce qui paraît enfantin devient simplement essentiel.</p></div><p><strong>Quel est ce mot ?</strong></p>",
        "answers": [
          "tendresse"
        ],
        "hints": [
          "Les phrases ne sont pas seulement là pour être lues dans leur ensemble.",
          "Certaines réponses se trouvent là où une phrase s’arrête.",
          "Observe les mots qui arrivent juste avant chaque point.",
          "Prends la première lettre de chaque mot placé juste avant un point."
        ],
        "success": "Le premier mot est trouvé. Ici, tout commence par la tendresse."
      },
      {
        "type": "rebus",
        "title": "Épreuve II — Le rébus du silence",
        "q": "<p class=\"instruction\">Deux images. Un seul mot à entendre.</p><div class=\"rebus-card image-rebus\"><figure class=\"rebus-image-card\"><img src=\"assets/roi-k.jpg\" alt=\"Carte roi K\" /></figure><span class=\"rebus-plus\">+</span><figure class=\"rebus-image-card\"><img src=\"assets/lin.jpg\" alt=\"Tissu de lin\" /></figure></div><p><strong>Quel mot se cache derrière ce rébus ?</strong></p>",
        "answers": [
          "calin",
          "câlin"
        ],
        "hints": [
          "Les deux images ne doivent pas être lues comme de simples objets.",
          "La première image représente surtout un symbole inscrit sur la carte.",
          "La seconde image montre une matière que l’on retrouve dans certains vêtements, comme des chemises ou des pantalons.",
          "Assemble le son de la lettre de la carte avec le nom de la matière."
        ],
        "success": "Oui. Un câlin ne dit rien, mais il peut rassurer beaucoup."
      },
      {
        "type": "concept",
        "title": "Épreuve III — Ce que l’on cherche",
        "q": "<p>Je ne suis ni une personne, ni un lieu.</p><p>Pourtant, beaucoup me cherchent.</p><p>Certains me trouvent dans une présence.</p><p>D’autres dans une habitude.</p><p>D’autres encore dans quelque chose qu’ils gardent depuis longtemps.</p><p>On peut avoir besoin de moi après une mauvaise nouvelle, un moment difficile, ou simplement lorsqu’on a envie de quelque chose qui fait du bien.</p><p><strong>Que suis-je ?</strong></p>",
        "answers": [
          "reconfort",
          "réconfort"
        ],
        "hints": [
          "La réponse ne peut pas se voir ni se toucher.",
          "Elle se ressent plus qu’elle ne se possède.",
          "Elle est proche du calme, de l’apaisement et de la sécurité.",
          "On la cherche souvent quand on a besoin d’aller mieux."
        ],
        "success": "Exact. Le réconfort peut parfois tenir dans très peu de choses."
      },
      {
        "type": "personal",
        "title": "Épreuve IV — Ce qui reste",
        "q": "<p>Un objet peut rester dans une chambre pendant des années.</p><p>Pour quelqu’un d’autre, il ne vaut presque rien.</p><p>Pour toi, il peut rappeler une époque, une présence, une habitude ou un moment.</p><p>Ce n’est donc pas seulement l’objet qui compte.</p><p>C’est le lien invisible qui s’est créé avec lui.</p><p><strong>Quel mot décrit ce lien ?</strong></p>",
        "answers": [
          "attachement"
        ],
        "hints": [
          "La réponse n’est pas un objet.",
          "Elle peut exister entre une personne et un objet.",
          "Elle peut aussi exister entre deux personnes.",
          "Elle décrit un lien émotionnel que l’on crée avec quelque chose ou quelqu’un."
        ],
        "success": "Oui. Certains objets restent parce qu’on s’y attache."
      },
      {
        "type": "final",
        "title": "Épreuve V — Le vrai nom du refuge",
        "q": "<p>Certaines personnes l’oublient.</p><p>D’autres le retrouvent des années plus tard.</p><p>Il ne possède aucune valeur particulière.</p><p>Pourtant peu accepteraient qu’on le jette sans leur demander.</p><p>Il accompagne souvent les premiers rêves.</p><p>Et parfois même quelques rêves d’adulte.</p><p><strong>Qui est-il ?</strong></p>",
        "answers": [
          "doudou"
        ],
        "hints": [
          "La réponse est un objet.",
          "Beaucoup en ont possédé un durant l’enfance.",
          "Certains le conservent même en grandissant.",
          "Il est souvent associé au sommeil, à la douceur et au réconfort."
        ],
        "success": "Tu as trouvé le vrai nom du Refuge Doré."
      }
    ],
    "reveal": "<div class=\"reveal-card\"><div class=\"stamp\">DÉCOUVERT</div><h3>Le Refuge Doré cachait un doudou.</h3><p>Pas seulement une peluche : un petit refuge à garder près de toi, pour les jours où un simple câlin vaut plus qu’un grand discours.</p></div>",
    "memory": "Le Refuge Doré — un souvenir doux, gardé pour toi.",
    "theme": "refuge"
  },
  {
    "id": 2,
    "code": "ROSE-NOIRE",
    "title": "La Rose Noire",
    "gift": "Fleurs",
    "teaser": "Une porte faite pour comprendre comment un message peut exister sans être écrit clairement.",
    "intro": "<p>Cette porte ne commence pas par le cadeau. Elle commence par une idée : certaines attentions parlent sans utiliser beaucoup de mots.</p>",
    "riddles": [
      {
        "type": "deduction",
        "title": "Épreuve I — Les quatre messagers",
        "q": "<p>Quatre messagers veulent porter une attention jusqu’à toi.</p><ul><li>Le papier garde les mots, mais demande qu’on le lise.</li><li>Le parfum laisse une trace, mais disparaît trop vite.</li><li>La lumière révèle, mais ne reste pas entre les mains.</li><li>Le végétal ne parle pas, mais peut transmettre quelque chose par sa présence.</li></ul><p>Cette porte cherche le messager qui peut être offert, gardé un moment, puis devenir souvenir.</p><p><strong>Quel messager choisis-tu ?</strong></p>",
        "answers": [
          "vegetal",
          "végétal"
        ],
        "hints": [
          "Ce n’est pas un objet fabriqué.",
          "Il peut vivre, changer, puis faner.",
          "On peut l’offrir sans écrire une phrase.",
          "La réponse désigne ce qui pousse."
        ],
        "success": "Tu as choisi le messager vivant."
      },
      {
        "type": "caesar",
        "title": "Épreuve II — Les lettres trop avancées",
        "q": "<p>Un mot devrait t’indiquer ce qu’il y a derrière un geste préparé pour toi.</p><p>Mais ses lettres semblent avoir trop avancé :</p><div class=\"cipher-text\"><strong>DWWHQWLRQ</strong></div><p><strong>Quel mot devait apparaître ?</strong></p>",
        "answers": [
          "attention"
        ],
        "hints": [
          "Le mot n’est pas mélangé : toutes les lettres ont bougé de la même manière.",
          "Pense à un ancien chef romain souvent associé à une couronne de laurier.",
          "Les lettres semblent être parties trop loin dans l’alphabet.",
          "Pour retrouver le mot, recule chaque lettre de trois positions."
        ],
        "success": "Oui : l’attention est retrouvée."
      },
      {
        "type": "logic",
        "title": "Épreuve III — Pourquoi ce geste ?",
        "q": "<p>Deux gestes peuvent se ressembler de l’extérieur.</p><p>Pourtant, l’un peut être fait au hasard, l’autre parce qu’il a été pensé pour toi.</p><p>Ce n’est pas ce qu’on tient dans la main qui change.</p><p>C’est la raison silencieuse derrière le geste.</p><p><strong>Quel mot désigne cette raison ?</strong></p>",
        "answers": [
          "intention"
        ],
        "hints": [
          "Ce mot ne désigne pas un objet.",
          "Il répond à la question : “pourquoi ?”.",
          "Il existe avant même que le geste soit fait.",
          "Il commence par INT."
        ],
        "success": "Oui : l’intention donne du sens au geste."
      },
      {
        "type": "morse",
        "title": "Épreuve IV — Points et traits",
        "q": "<p>Un petit message a été laissé comme une suite de battements.</p><div class=\"cipher-text\"><strong>.-. ..- -... .- -.</strong></div><p>Ce mot ne désigne pas le cadeau. Il désigne ce qui peut l’accompagner.</p><p><strong>Quel mot entends-tu derrière ces signes ?</strong></p>",
        "answers": [
          "ruban"
        ],
        "hints": [
          "Ce message n’utilise presque rien : seulement deux signes différents.",
          "Ces signes peuvent se lire comme des battements courts et longs.",
          "Ce système servait à transmettre des messages à distance.",
          "C’est du Morse : traduis les points et les traits en lettres."
        ],
        "success": "Oui : un ruban peut accompagner le message sans être le message."
      },
      {
        "type": "final",
        "title": "Épreuve V — Le message sans phrase",
        "q": "<p>Tu as retrouvé un messager vivant, une attention, une intention et un ruban.</p><p>Il reste à nommer ce qui peut porter tout cela à la fois.</p><p>On ne l’offre pas pour son utilité.</p><p>On l’offre parce qu’il y a quelque chose à dire sans forcément le prononcer.</p><p><strong>Quel cadeau se cache ici ?</strong></p>",
        "answers": [
          "fleurs",
          "fleur"
        ],
        "hints": [
          "La réponse désigne un cadeau vivant.",
          "Il peut être accompagné d’un ruban.",
          "Il peut faner, mais le geste reste.",
          "On peut l’offrir en bouquet."
        ],
        "success": "Tu as trouvé le secret de la Rose Noire."
      }
    ],
    "reveal": "<div class=\"reveal-card\"><div class=\"stamp\">DÉCOUVERT</div><h3>La Rose Noire cachait des fleurs.</h3><p>Des fleurs choisies pour te transmettre un message sans avoir besoin de trop en dire.</p></div>",
    "theme": "rose"
  },
  {
    "id": 3,
    "code": "10-AVRIL",
    "title": "Le Parc des Premiers Secrets",
    "gift": "Date avec toi",
    "teaser": "Chaque souvenir ouvre la porte au prochain.",
    "intro": "<p>Chaque histoire commence par un détail auquel on ne prête pas forcément attention.</p><p>Un regard, quelques mots, un lieu, un instant.</p><p>Les souvenirs les plus précieux ne sont pas toujours les plus spectaculaires.</p><p>Parfois, ils commencent simplement par un rayon de soleil.</p>",
    "riddles": [
      {
        "type": "memory",
        "title": "Épreuve I — Le début de l’histoire",
        "q": "<p>Avant même notre première conversation, je me trouvais entre toi et quelque chose qui t’éblouissait.</p><p>Sans le vouloir, c’est peut-être ce qui a lancé toute cette histoire.</p><p><strong>Quel était cet élément ?</strong></p>",
        "answers": [
          "soleil"
        ],
        "hints": [
          "Tout s’est passé au lycée.",
          "Je me trouvais devant toi.",
          "Tu voulais que je me décale.",
          "Cet élément brillait très fort.",
          "Réponse : soleil."
        ],
        "success": "C’est bien ça. Parfois, les plus belles histoires commencent grâce à un simple rayon de soleil."
      },
      {
        "type": "timeline",
        "title": "Épreuve II — Les souvenirs dans le bon ordre",
        "q": "<p>Certains souvenirs prennent tout leur sens lorsqu’on les remet dans le bon ordre.</p><ol class=\"timeline-list\"><li>Cinéma</li><li>Parc d’Isle</li><li>Paris</li><li>Feu d’artifice du 14 juillet</li></ol><p><strong>Replace les souvenirs dans les emplacements ci-dessous, puis clique sur « Valider l’ordre ».</strong></p>",
        "timeline": [
          "Cinéma",
          "Parc d’Isle",
          "Paris",
          "Feu d’artifice du 14 juillet"
        ],
        "answers": [
          "Cinéma|Parc d’Isle|Feu d’artifice du 14 juillet|Paris"
        ],
        "hints": [
          "Le premier élément est une activité en intérieur.",
          "Le deuxième a eu lieu juste après.",
          "Paris n’est pas le dernier souvenir.",
          "Le feu d’artifice est le plus récent.",
          "Cinéma → Parc d’Isle → Paris → Feu d’artifice."
        ],
        "success": "Les souvenirs retrouvent leur place."
      },
      {
        "type": "monuments",
        "title": "Épreuve III — Paris",
        "q": "<p>Lors de notre voyage à Paris, il y avait un monument que tu n’avais encore jamais vu en vrai.</p><p>Pourtant, tu le connaissais déjà depuis longtemps.</p><p>Sélectionne la bonne silhouette puis clique sur « Valider ».",
        "answers": [
          "toureiffel",
          "tour eiffel",
          "tour-eiffel"
        ],
        "hints": [
          "Ce n’est pas une cathédrale.",
          "Ce n’est pas un arc.",
          "On la voit dans de nombreux films.",
          "C’est le symbole le plus connu de Paris.",
          "Réponse : Tour Eiffel."
        ],
        "success": "Tu l’as reconnue."
      },
      {
        "type": "fill-blanks",
        "choices": [
          "Fenêtre",
          "Instagram",
          "22 avril 2025",
          "Willow",
          "Natation"
        ],
        "title": "Épreuve IV — Complète notre histoire",
        "q": "<p>Complète notre histoire.</p><p>Avant même notre première conversation, tu as tapé contre une <strong>______</strong>.</p><p>Quelques jours plus tard, tu m’as ajouté sur <strong>______</strong>.</p><p>Depuis le <strong>______</strong>.</p><p>Mots proposés : <span class=\"keyword\">lycée</span> · <span class=\"keyword\">cinéma</span> · <span class=\"keyword\">parc d’Isle</span> · <span class=\"keyword\">Paris</span> · <span class=\"keyword\">Willow</span></p><p><strong>Replace les mots dans les bons emplacements, puis clique sur « Valider ».</strong></p>",
        "answers": [
          "Fenêtre|Instagram|22 avril 2025"
        ],
        "hints": [
          "Tout a commencé pendant les cours.",
          "Votre premier rendez-vous s’est déroulé devant un écran.",
          "Vous avez continué cette journée à l’extérieur.",
          "Le dernier lieu est un parc.",
          "Réponses : lycée → cinéma → parc d’Isle."
        ],
        "success": "Les meilleurs souvenirs racontent toujours une histoire."
      },
      {
        "type": "final",
        "title": "Épreuve V — Le temps offert",
        "q": "<p>Je ne suis pas un lieu.</p><p>Je ne suis pas un objet.</p><p>Pourtant, je crée souvent les meilleurs souvenirs.</p><p>On me prépare parfois longtemps à l’avance.</p><p>À deux, je prends encore plus de valeur.</p><p><strong>Qui suis-je ?</strong></p>",
        "answers": [
          "date"
        ],
        "hints": [
          "La réponse ne s’achète pas vraiment.",
          "Elle se partage.",
          "Elle se prépare parfois plusieurs jours à l’avance.",
          "Elle permet de créer des souvenirs.",
          "Réponse : date."
        ],
        "success": "Tu as trouvé le secret du Parc des Premiers Secrets."
      }
    ],
    "reveal": "<div class=\"reveal-card\"><div class=\"stamp\">DÉCOUVERT</div><h3>Le Parc des Premiers Secrets cachait une journée rien que pour nous.</h3><p>Prépare-toi pour une nouvelle aventure à deux. Une journée spéciale t’attend bientôt… et j’ai hâte de la partager avec toi. 💛</p></div>",
    "theme": "parc"
  },
  {
    "id": 4,
    "code": "AUBE-ROYALE",
    "gift": "Petit-déjeuner",
    "teaser": "Une porte qui commence avant que la journée ne décide vraiment de commencer.",
    "intro": "<p>Cette porte parle du début d’une journée, mais elle ne doit pas donner le cadeau trop vite.</p>",
    "riddles": [
      {
        "type": "text",
        "title": "Épreuve I — Les lumières allumées",
        "q": "<p>Décrypte ce code binaire :</p><div class='cipher-text'><strong>01010010 01000101 01010110 01000101 01001001 01001100</strong></div>",
        "answers": [
          "reveil",
          "réveil"
        ],
        "success": "Le jour peut commencer."
      },
      {
        "type": "timeline",
        "title": "Épreuve II — Le rituel du matin",
        "q": "<p>Remets ces moments dans le bon ordre.</p>",
        "timeline": [
          "👀 Ouvrir les yeux",
          "😘 Faire un bisou à l’amour de sa vie",
          "☀️ Se lever",
          "🐱 Aller voir Willow"
        ],
        "answers": [
          "👀 Ouvrir les yeux|😘 Faire un bisou à l’amour de sa vie|☀️ Se lever|🐱 Aller voir Willow"
        ],
        "success": "Voilà un réveil parfait."
      },
      {
        "type": "breakfast",
        "title": "Épreuve III — Ton petit-déjeuner idéal",
        "q": "<p>Choisis exactement 4 éléments.</p>",
        "options": [
          "Croissant",
          "Pain au chocolat",
          "Pancakes",
          "Fruits frais",
          "Pain grillé",
          "Confiture",
          "Céréales",
          "Café",
          "Chocolat chaud",
          "Thé",
          "Jus d’orange",
          "Jus de pomme",
          "Lait",
          "Œufs",
          "Jambon",
          "Fromage"
        ],
        "answers": [
          "VALID"
        ],
        "success": "Épreuve validée. Tes choix ont été soigneusement notés pour plus tard… ✨"
      },
      {
        "type": "memory",
        "title": "Épreuve IV — Le matin parfait",
        "q": "<p>Retrouve les 5 paires du matin parfait.</p>",
        "pairs": [
          "☕",
          "🥐",
          "🍓",
          "🐱",
          "⏰"
        ],
        "answers": [
          "MEMORY_DONE"
        ],
        "success": "Memory réussi. Tu as retrouvé tous les souvenirs du matin parfait. 🃏"
      },
      {
        "type": "text",
        "title": "Épreuve V — Le dernier indice",
        "q": "<p>Je peux être sucré ou salé.</p><p>Certains me prennent rapidement, d'autres aiment prendre leur temps.</p><p>Je marque le début d'une nouvelle journée.</p><p><strong>Qui suis-je ?</strong></p>",
        "answers": [
          "petit-déjeuner",
          "petit déjeuner",
          "petitdejeuner",
          "petit-dejeuner"
        ],
        "success": "✨ Exactement ! Le plus beau des réveils commence souvent autour d’une bonne table."
      }
    ],
    "reveal": "<div class='reveal-card'><div class='stamp'>DÉCOUVERT</div><h3>L’Aube Royale cachait un petit-déjeuner.</h3><p>Un matin préparé pour toi, avec de quoi commencer la journée tout en douceur. 💛</p></div>",
    "memory": "L’Aube Royale — un matin préparé pour toi.",
    "theme": "aube",
    "title": "L’Aube Royale"
  },
  {
    "id": 5,
    "code": "JOKER-18",
    "title": "Après Minuit",
    "gift": "Pyjama",
    "teaser": "Une salle plus douce qu'elle n'y paraît...",
    "intro": "Quand le monde ralentit, certains secrets se révèlent.",
    "riddles": [
      {
        "type": "text",
        "title": "Épreuve I — Les lettres endormies",
        "q": "<p>Les lettres se sont mélangées avant d'aller dormir.</p><p><strong>T R O N O F C</strong></p>",
        "answers": [
          "confort"
        ],
        "success": "Le confort accompagne les plus belles nuits."
      },
      {
        "type": "text",
        "title": "Épreuve II — Le clavier oublié",
        "q": "<p>Un ancien appareil peut t'aider à déchiffrer cette suite de chiffres.</p><p><strong>777 33 7 666 7777</strong></p><p><em>Indice : avant les écrans tactiles, chaque touche cachait plusieurs lettres.</em></p>",
        "answers": [
          "repos"
        ],
        "success": "Le repos est essentiel après une longue journée."
      },
      {
        "type": "text",
        "title": "Épreuve III — Le rébus du soir",
        "q": "<p>Assemble ces deux éléments pour former un mot.</p><div class='rebus-row'><img src='assets/rebus-sceau.png' class='rebus-img'><span class='rebus-plus'>+</span><img src='assets/rebus-mail.png' class='rebus-img'></div>",
        "answers": [
          "sommeil"
        ],
        "success": "Le sommeil cache bien des rêves."
      },
      {
        "type": "text",
        "title": "Épreuve IV — Le reflet de la nuit",
        "q": "<p>Certains secrets ne se révèlent qu'à travers leur reflet.</p><p>De quoi parle cette phrase ?</p><div class='mirror-clue'>LES PLUS BEAUX NE SE RACONTENT PAS, ILS SE VIVENT LES YEUX FERMÉS</div>",
        "answers": [
          "reves",
          "rêves"
        ],
        "success": "Les rêves accompagnent les nuits les plus douces."
      },
      {
        "type": "final",
        "title": "Épreuve V — La surprise de nuit",
        "q": "<p>Je suis doux et confortable.</p><p>On m'enfile avant de dormir.</p><p>Je suis souvent associé aux soirées cocooning.</p><p><strong>Qui suis-je ?</strong></p>",
        "answers": [
          "pyjama",
          "le pyjama"
        ],
        "success": "Tu as trouvé le cadeau caché."
      }
    ],
    "reveal": "<div class='reveal-card'><div class='stamp'>DÉCOUVERT</div><h3>Après Minuit cachait un pyjama.</h3><p>De quoi rendre tes soirées encore plus douces et confortables. 🌙</p></div>",
    "memory": "Le Pyjama — Un pyjama confortable pour accompagner tes soirées et tes nuits. 🌙.",
    "theme": "nuit"
  },
  {
    "id": 106,
    "code": "APRÈS-MINUIT",
    "title": "Après Minuit",
    "gift": "ARCHIVE",
    "teaser": "Une porte douce, intime et élégante, pensée pour la nuit sans tout révéler trop vite.",
    "intro": "<p>Cette porte avance dans une ambiance de nuit, de confort et de confiance.</p>",
    "riddles": [
      {
        "type": "observation",
        "title": "Épreuve I — Quand le jour se retire",
        "q": "<p>Je ne suis pas le titre de cette porte.</p><p>Je suis ce qui arrive quand le bruit retombe, quand la lumière baisse, quand le monde paraît plus calme.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "nuit"
        ],
        "hints": [
          "La réponse est un moment.",
          "Elle vient après le soir.",
          "On y associe souvent le silence et le sommeil.",
          "Le mot commence par N."
        ],
        "success": "La nuit ouvre la porte."
      },
      {
        "type": "texture",
        "title": "Épreuve II — Ce qui se ressent",
        "q": "<p>Ce mot ne désigne pas le vêtement.</p><p>Il désigne la sensation que l’on cherche quand quelque chose touche la peau sans gêner.</p><p>Il peut exister dans un tissu, dans une voix, dans un geste.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "douceur"
        ],
        "hints": [
          "La réponse n’est pas une matière précise.",
          "Elle se ressent plus qu’elle ne se voit.",
          "Elle peut être physique ou émotionnelle.",
          "Elle commence par D."
        ],
        "success": "Oui : la douceur."
      },
      {
        "type": "deduction",
        "title": "Épreuve III — Ce qui met à l’aise",
        "q": "<p>Un bel objet peut être inconfortable.</p><p>Un objet simple peut devenir précieux s’il te laisse respirer, bouger, dormir, te sentir bien.</p><p>Ce mot désigne cette sensation d’être à l’aise.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "confort"
        ],
        "hints": [
          "Ce n’est pas le style.",
          "Il peut compter autant que l’apparence.",
          "On le cherche souvent pour dormir.",
          "Le mot commence par C."
        ],
        "success": "Oui : le confort."
      },
      {
        "type": "trust",
        "title": "Épreuve IV — Ce qui ne se montre pas à tout le monde",
        "q": "<p>Cette porte ne parle pas seulement d’apparence.</p><p>Elle parle d’un espace où l’on peut être soi, sans regard extérieur.</p><p>Un espace de confiance, de proximité, et de pudeur choisie.</p><p><strong>Quel mot résume cela ?</strong></p>",
        "answers": [
          "intimite",
          "intimité"
        ],
        "hints": [
          "La réponse n’est pas un objet.",
          "Elle demande de la confiance.",
          "Elle ne se partage pas avec tout le monde.",
          "Le mot commence par INT."
        ],
        "success": "Oui : l’intimité."
      },
      {
        "type": "final",
        "title": "Épreuve V — La surprise de nuit",
        "q": "<p>Tu as trouvé la nuit, la douceur, le confort et l’intimité.</p><p>Cette porte cache quelque chose à porter, pensé pour toi, pour les moments calmes ou plus précieux.</p><p><strong>Quel cadeau se cache ici ?</strong></p>",
        "answers": [
          "pyjama",
          "lingerie",
          "pyjama lingerie",
          "pyjamaetlingerie",
          "pyjama lingerie"
        ],
        "hints": [
          "C’est quelque chose à porter.",
          "C’est lié aux moments plus calmes ou à la nuit.",
          "Cela peut être confortable, élégant ou intime.",
          "La réponse peut être “pyjama” ou “lingerie”."
        ],
        "success": "Tu as trouvé Après Minuit."
      }
    ],
    "reveal": "<div class=\"reveal-card\"><div class=\"stamp\">DÉCOUVERT</div><h3>Après Minuit cachait un pyjama / de la lingerie.</h3><p>Un cadeau pensé pour toi, entre confort, douceur et élégance.</p></div>",
    "memory": "Après Minuit — une surprise à porter, pensée pour tes moments à toi.",
    "theme": "minuit"
  },
  {
    "id": 7,
    "code": "CHAPITRE-XII",
    "title": "Chapitre XII",
    "gift": "Livre au choix",
    "teaser": "Une porte pour ouvrir une histoire qui ne sera pas imposée, mais choisie par toi.",
    "intro": "<p>Cette porte parle d’histoires, mais elle ne donne pas le livre avant la dernière page.</p>",
    "riddles": [
      {
        "type": "morse",
        "title": "Épreuve I — Signes courts et longs",
        "q": "<p>Un mot a été écrit sans lettres :</p><div class=\"cipher-text\"><strong>.. -- .- --. .. -. .- - .. --- -.</strong></div><p>Il désigne ce qui permet à une histoire d’exister avant même d’être lue.</p><p><strong>Quel mot se cache ici ?</strong></p>",
        "answers": [
          "imagination"
        ],
        "hints": [
          "Ce ne sont pas des chiffres.",
          "Le message utilise seulement deux types de signes.",
          "Ce système sert à coder des lettres avec points et traits.",
          "Déchiffre le Morse."
        ],
        "success": "L’imagination est trouvée."
      },
      {
        "type": "deduction",
        "title": "Épreuve II — Celui qui construit sans marteau",
        "q": "<p>Il peut créer des lieux où il n’est jamais allé.</p><p>Il peut faire parler des personnes qui n’existent pas.</p><p>Il peut déclencher des émotions avec seulement des phrases.</p><p><strong>Qui est-il ?</strong></p>",
        "answers": [
          "auteur",
          "ecrivain",
          "écrivain"
        ],
        "hints": [
          "La réponse désigne une personne.",
          "Elle crée avec des mots.",
          "Elle peut inventer des personnages.",
          "On trouve souvent son nom sur une couverture."
        ],
        "success": "Oui : l’auteur."
      },
      {
        "type": "sequence",
        "title": "Épreuve III — Du plus grand au plus petit",
        "q": "<p>Remets cette idée dans le bon sens :</p><div class=\"logic-grid\"><span>histoire</span><span>chapitre</span><span>page</span><span>ligne</span></div><p>Le mot cherché est l’étape qui se lit d’un seul regard, mais qui appartient à une page.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "ligne"
        ],
        "hints": [
          "On descend vers quelque chose de plus petit.",
          "Ce n’est pas toute la page.",
          "C’est plus petit qu’un paragraphe.",
          "On lit parfois entre elles."
        ],
        "success": "Oui : une ligne."
      },
      {
        "type": "choice",
        "title": "Épreuve IV — Ce qui t’appartient",
        "q": "<p>Une histoire peut être offerte.</p><p>Mais celle-ci aura quelque chose de différent : elle ne sera pas décidée sans toi.</p><p>Ce mot désigne ce que tu devras faire avant que le cadeau existe vraiment.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "choix"
        ],
        "hints": [
          "La réponse dépend de toi.",
          "Il peut y avoir plusieurs possibilités.",
          "Ce n’est pas le cadeau, mais la manière de le rendre tien.",
          "Le mot commence par CH."
        ],
        "success": "Oui : le choix."
      },
      {
        "type": "final",
        "title": "Épreuve V — La première page",
        "q": "<p>Tu as trouvé l’imagination, l’auteur, la ligne et le choix.</p><p>Il reste à nommer l’objet qui peut contenir tout cela.</p><p>Cette fois, l’histoire ne sera pas choisie à ta place.</p><p><strong>Quel cadeau se cache ici ?</strong></p>",
        "answers": [
          "livre"
        ],
        "hints": [
          "C’est un objet.",
          "Il contient des pages.",
          "Tu pourras le choisir toi-même.",
          "Le mot commence par L."
        ],
        "success": "Tu as trouvé Chapitre XII."
      }
    ],
    "reveal": "<div class=\"reveal-card\"><div class=\"stamp\">DÉCOUVERT</div><h3>Chapitre XII cachait un livre au choix.</h3><p>Une histoire que tu pourras choisir toi-même, parce que celle-ci sera la tienne.</p></div>",
    "memory": "Chapitre XII — une histoire que tu choisiras toi-même.",
    "theme": "chapitre"
  },
  {
    "id": 8,
    "code": "FESTIN-DORÉ",
    "title": "Le Festin Doré",
    "gift": "Pack nourriture",
    "teaser": "Une porte gourmande, faite de petites envies choisies pour toi.",
    "intro": "<p>Cette porte ne parle pas d’un grand repas. Elle parle plutôt de petits plaisirs rassemblés.</p>",
    "riddles": [
      {
        "type": "senses",
        "title": "Épreuve I — Le premier sens",
        "q": "<p>Je peux changer ton humeur avec presque rien.</p><p>Je peux être sucré, salé, doux, fort, réconfortant.</p><p>Je ne suis pas un aliment, mais ce que l’aliment laisse sur la langue.</p><p><strong>Que suis-je ?</strong></p>",
        "answers": [
          "gout",
          "goût",
          "saveur"
        ],
        "hints": [
          "Ce n’est pas un objet.",
          "On le découvre en mangeant.",
          "Il peut être sucré ou salé.",
          "On peut dire “goût” ou “saveur”."
        ],
        "success": "Le goût est trouvé."
      },
      {
        "type": "personal",
        "title": "Épreuve II — Le plat repère",
        "q": "<p>Un indice personnel se cache dans cette porte.</p><p>Il ne donne pas le cadeau final, mais il rappelle une envie que tu aimes bien.</p><p>Ce plat mélange des pâtes, une sauce crémeuse et une envie simple.</p><p><strong>Quel plat est-ce ?</strong></p>",
        "answers": [
          "patescarbo",
          "pâtescarbo",
          "pates carbonara",
          "pâtes carbonara",
          "carbonara"
        ],
        "hints": [
          "C’est un plat.",
          "Il contient des pâtes.",
          "Son nom est souvent raccourci.",
          "Tu as déjà dit aimer les pâtes carbo."
        ],
        "success": "Oui : les pâtes carbo."
      },
      {
        "type": "sorting",
        "title": "Épreuve III — Rassembler sans cuisiner",
        "q": "<p>Ce n’est pas un plat unique.</p><p>C’est plutôt une manière de réunir plusieurs petites choses au même endroit.</p><p>On peut y mettre du sucré, du salé, du simple, du réconfortant.</p><p><strong>Quel mot désigne ce rassemblement ?</strong></p>",
        "answers": [
          "assortiment",
          "selection",
          "sélection"
        ],
        "hints": [
          "La réponse désigne plusieurs choses ensemble.",
          "Ce n’est pas forcément cuisiné.",
          "On y choisit ce qui va bien ensemble.",
          "On peut dire “sélection”."
        ],
        "success": "Oui : une sélection."
      },
      {
        "type": "real",
        "title": "Épreuve IV — Dans le vrai monde",
        "q": "<p>Cette porte pourra sortir du site.</p><p>Le jour venu, un indice pourra se cacher directement parmi ce qui se mange.</p><p>Si tu vois une étiquette étrange, un mot sous un paquet, ou un détail doré, ne l’ignore pas.</p><p><strong>Quel mot décrit cette recherche ?</strong></p>",
        "answers": [
          "fouille",
          "recherche"
        ],
        "hints": [
          "La réponse n’est pas un aliment.",
          "C’est une action.",
          "Elle consiste à regarder attentivement.",
          "On peut fouiller un panier."
        ],
        "success": "Oui : il faudra peut-être fouiller."
      },
      {
        "type": "final",
        "title": "Épreuve V — Les petites envies réunies",
        "q": "<p>Tu as trouvé le goût, les pâtes carbo, la sélection et la fouille.</p><p>Cette porte cache plusieurs petites choses choisies pour toi, à manger ou à grignoter.</p><p><strong>Quel cadeau se cache ici ?</strong></p>",
        "answers": [
          "packnourriture",
          "pack de nourriture",
          "paniergourmand",
          "panier gourmand",
          "pack gourmand"
        ],
        "hints": [
          "Ce n’est pas un seul aliment.",
          "Il réunit plusieurs envies.",
          "On peut le présenter dans un panier.",
          "C’est un pack/panier de nourriture."
        ],
        "success": "Tu as trouvé le Festin Doré."
      }
    ],
    "reveal": "<div class=\"reveal-card\"><div class=\"stamp\">DÉCOUVERT</div><h3>Le Festin Doré cachait un pack nourriture.</h3><p>Un petit panier rempli de choses que tu aimes, préparé pour tes envies.</p></div>",
    "memory": "Le Festin Doré — un panier de petites envies pour toi.",
    "theme": "festin"
  },
  {
    "id": 9,
    "code": "FIL-DORÉ",
    "title": "Le Fil Doré",
    "gift": "Tee-shirts",
    "teaser": "Une porte à porter, pensée pour ton style sans dévoiler trop vite le cadeau.",
    "intro": "<p>Cette porte avance par matière, forme et choix, avant d’arriver à ce que tu pourras porter.</p>",
    "riddles": [
      {
        "type": "material",
        "title": "Épreuve I — La base douce",
        "q": "<p>Je peux être tissé, lavé, porté.</p><p>Je ne suis pas le vêtement complet.</p><p>Je suis souvent choisi parce que je est agréable sur la peau.</p><p><strong>Que suis-je ?</strong></p>",
        "answers": [
          "coton"
        ],
        "hints": [
          "La réponse est une matière.",
          "On la retrouve dans beaucoup de vêtements.",
          "Elle est souvent douce et simple.",
          "Le mot commence par C."
        ],
        "success": "Le coton est trouvé."
      },
      {
        "type": "shape",
        "title": "Épreuve II — Ce qui tombe juste",
        "q": "<p>Deux vêtements peuvent être faits de la même matière.</p><p>Pourtant l’un peut aller parfaitement, l’autre non.</p><p>Ce mot parle de la manière dont quelque chose se pose sur toi.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "coupe"
        ],
        "hints": [
          "Ce n’est pas la couleur.",
          "Ce n’est pas la matière.",
          "Cela change la forme portée.",
          "On parle de la coupe d’un vêtement."
        ],
        "success": "Oui : la coupe."
      },
      {
        "type": "choice",
        "title": "Épreuve III — L’accord",
        "q": "<p>Il ne suffit pas qu’un vêtement existe.</p><p>Il faut qu’il te corresponde.</p><p>Ce mot peut parler d’une ambiance, d’une couleur, d’une façon de s’habiller.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "style"
        ],
        "hints": [
          "La réponse n’est pas un objet.",
          "Elle parle de ce qui te correspond.",
          "Elle peut être personnel.",
          "Le mot commence par ST."
        ],
        "success": "Oui : le style."
      },
      {
        "type": "code",
        "title": "Épreuve IV — Trois lettres courantes",
        "q": "<p>Un vêtement peut parfois se résumer à une courte indication.</p><div class=\"choice-line\"><span>S</span><span>M</span><span>L</span><span>XL</span></div><p>Ce n’est pas le cadeau. C’est ce qu’il faut connaître pour qu’il tombe bien.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "taille"
        ],
        "hints": [
          "Ce n’est pas une couleur.",
          "Cela aide à choisir le bon vêtement.",
          "S, M et L sont des exemples.",
          "Le mot commence par T."
        ],
        "success": "Oui : la taille."
      },
      {
        "type": "final",
        "title": "Épreuve V — Ce que tu porteras",
        "q": "<p>Tu as trouvé le coton, la coupe, le style et la taille.</p><p>Cette porte cache quelque chose à porter, simple mais choisi pour toi.</p><p><strong>Quel cadeau se cache ici ?</strong></p>",
        "answers": [
          "teeshirt",
          "tee shirt",
          "tshirt",
          "t shirt",
          "tee-shirts",
          "t-shirts"
        ],
        "hints": [
          "C’est un vêtement.",
          "Il peut être en coton.",
          "Il se choisit avec une taille.",
          "Le mot commence souvent par T."
        ],
        "success": "Tu as trouvé le Fil Doré."
      }
    ],
    "reveal": "<div class=\"reveal-card\"><div class=\"stamp\">DÉCOUVERT</div><h3>Le Fil Doré cachait des tee-shirts.</h3><p>Des vêtements choisis pour toi, pour ton style et ton confort.</p></div>",
    "memory": "Le Fil Doré — des tee-shirts pensés pour toi.",
    "theme": "fil"
  },
  {
    "id": 10,
    "code": "PETIT-MONDE",
    "title": "Le Petit Monde",
    "gift": "Figurines",
    "teaser": "Une porte miniature, construite autour de petits personnages et d’univers à collectionner.",
    "intro": "<p>Cette porte parle de choses petites par la taille, mais pas forcément petites par l’attachement.</p>",
    "riddles": [
      {
        "type": "scale",
        "title": "Épreuve I — Changer d’échelle",
        "q": "<p>Je ne suis pas moins important parce que je suis petit.</p><p>Je reprends une forme plus grande, mais réduite.</p><p>Je peux tenir dans une main tout en représentant un univers.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "miniature"
        ],
        "hints": [
          "La réponse parle de taille.",
          "Elle désigne une version réduite.",
          "Elle peut représenter quelque chose de plus grand.",
          "Le mot commence par MINI."
        ],
        "success": "La miniature est trouvée."
      },
      {
        "type": "identity",
        "title": "Épreuve II — Celui qui habite l’univers",
        "q": "<p>Dans une histoire, il peut avoir une apparence, un caractère, un rôle.</p><p>Il n’est pas forcément réel, mais on peut s’y attacher.</p><p><strong>Quel mot désigne cet être d’histoire ?</strong></p>",
        "answers": [
          "personnage"
        ],
        "hints": [
          "La réponse n’est pas un objet.",
          "On peut le trouver dans des films, livres ou univers.",
          "Il peut être représenté en petit.",
          "Le mot commence par P."
        ],
        "success": "Oui : un personnage."
      },
      {
        "type": "collection",
        "title": "Épreuve III — Quand un seul ne suffit pas",
        "q": "<p>Un objet peut exister seul.</p><p>Mais parfois, ce qui devient amusant, c’est d’en avoir plusieurs qui se répondent.</p><p>Chaque nouveau morceau complète l’ensemble.</p><p><strong>Quel mot désigne cet ensemble ?</strong></p>",
        "answers": [
          "collection"
        ],
        "hints": [
          "La réponse parle de plusieurs objets.",
          "Elle grandit avec le temps.",
          "Chaque élément peut être différent.",
          "Le mot commence par C."
        ],
        "success": "Oui : une collection."
      },
      {
        "type": "theme",
        "title": "Épreuve IV — Le monde autour",
        "q": "<p>Sommeil, yoga, animaux, personnages, couleurs…</p><p>Ce mot désigne l’idée commune qui rassemble plusieurs éléments.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "theme",
          "thème"
        ],
        "hints": [
          "Ce n’est pas un objet.",
          "Il rassemble plusieurs éléments sous une même idée.",
          "Il peut changer d’une série à l’autre.",
          "Le mot commence par TH."
        ],
        "success": "Oui : le thème."
      },
      {
        "type": "final",
        "title": "Épreuve V — Les petits habitants",
        "q": "<p>Tu as trouvé miniature, personnage, collection et thème.</p><p>Cette porte cache de petits objets qui représentent des univers ou des personnages.</p><p><strong>Quel cadeau se cache ici ?</strong></p>",
        "answers": [
          "figurines",
          "figurine"
        ],
        "hints": [
          "La réponse désigne de petits objets.",
          "Ils peuvent former une collection.",
          "Ils représentent souvent des personnages.",
          "Le mot commence par F."
        ],
        "success": "Tu as trouvé le Petit Monde."
      }
    ],
    "reveal": "<div class=\"reveal-card\"><div class=\"stamp\">DÉCOUVERT</div><h3>Le Petit Monde cachait des figurines.</h3><p>De petits personnages à collectionner, chacun avec son univers.</p></div>",
    "memory": "Le Petit Monde — de petites figurines choisies pour toi.",
    "theme": "monde"
  },
  {
    "id": 11,
    "code": "JARDIN-SECRET",
    "title": "Le Jardin Secret",
    "gift": "Cadeau intime",
    "teaser": "Une porte plus discrète, pensée autour de confiance, pudeur et complicité.",
    "intro": "<p>Cette porte reste élégante. Elle ne cherche pas à tout dire trop vite : elle avance par confiance.</p>",
    "riddles": [
      {
        "type": "trust",
        "title": "Épreuve I — La condition",
        "q": "<p>Sans moi, cette porte n’aurait pas sa place.</p><p>Je ne suis pas un objet.</p><p>Je permets de recevoir une surprise sans malaise, parce qu’elle vient de quelqu’un en qui tu peux croire.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "confiance"
        ],
        "hints": [
          "La réponse n’est pas matérielle.",
          "Elle se construit avec le temps.",
          "Elle rend possible les surprises plus personnelles.",
          "Le mot commence par CONF."
        ],
        "success": "Oui : la confiance."
      },
      {
        "type": "boundary",
        "title": "Épreuve II — Ce qui t’appartient",
        "q": "<p>Tout ne se partage pas avec tout le monde.</p><p>Certains espaces, certaines pensées, certains moments restent à toi.</p><p>Ce mot désigne ce qui est personnel et protégé.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "intimite",
          "intimité"
        ],
        "hints": [
          "La réponse n’est pas un objet.",
          "Elle parle de quelque chose de personnel.",
          "Elle demande du respect.",
          "Le mot commence par INT."
        ],
        "success": "Oui : l’intimité."
      },
      {
        "type": "discretion",
        "title": "Épreuve III — Le voile",
        "q": "<p>Ce mot ne cache pas par honte.</p><p>Il cache parce que certaines choses gagnent à rester délicates.</p><p>Il évite d’être trop direct, trop visible, trop brutal.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "pudeur"
        ],
        "hints": [
          "La réponse est liée à la délicatesse.",
          "Elle protège ce qui est intime.",
          "Elle évite d’en dire trop.",
          "Le mot commence par P."
        ],
        "success": "Oui : la pudeur."
      },
      {
        "type": "complicity",
        "title": "Épreuve IV — À deux seulement",
        "q": "<p>Ce mot existe quand un geste ou une blague n’a pas besoin d’être expliqué aux autres.</p><p>Il appartient à deux personnes qui se comprennent.</p><p>Il rend certaines choses plus simples, parce qu’il y a déjà un lien.</p><p><strong>Quel mot cherches-tu ?</strong></p>",
        "answers": [
          "complicite",
          "complicité"
        ],
        "hints": [
          "Ce mot parle d’un lien.",
          "Il peut exister dans un couple.",
          "Il permet de se comprendre avec peu de mots.",
          "Le mot commence par COMP."
        ],
        "success": "Oui : la complicité."
      },
      {
        "type": "final",
        "title": "Épreuve V — Le cadeau discret",
        "q": "<p>Tu as trouvé confiance, intimité, pudeur et complicité.</p><p>Cette porte cache un cadeau plus personnel que les autres.</p><p>Il n’est pas fait pour être expliqué à tout le monde.</p><p><strong>Quel cadeau se cache ici ?</strong></p>",
        "answers": [
          "cadeauintime",
          "cadeau intime",
          "sextoy",
          "jouet intime"
        ],
        "hints": [
          "La réponse n’est pas un cadeau public.",
          "Il appartient au domaine intime.",
          "Il demande confiance et pudeur.",
          "On peut l’appeler un cadeau intime."
        ],
        "success": "Tu as trouvé le Jardin Secret."
      }
    ],
    "reveal": "<div class=\"reveal-card\"><div class=\"stamp\">DÉCOUVERT</div><h3>Le Jardin Secret cachait un cadeau intime.</h3><p>Un cadeau discret, pensé avec confiance et respect, seulement pour toi.</p></div>",
    "memory": "Le Jardin Secret — une porte intime, pensée avec respect.",
    "theme": "jardin"
  },
  {
    "id": 12,
    "code": "DERNIER-MASQUE",
    "title": "Le Dernier Masque",
    "gift": "Cadeau final",
    "teaser": "La dernière porte n’est pas encore figée : elle pourra rassembler les souvenirs de l’année.",
    "intro": "<p>Cette porte restera volontairement en construction. Elle pourra devenir le final de toute l’aventure.</p>",
    "riddles": [
      {
        "type": "archive",
        "title": "Épreuve I — Ce qui reste",
        "q": "<p>Quand une année avance, certains moments disparaissent.</p><p>D’autres restent grâce aux traces qu’on garde : photos, mots, tickets, petits objets.</p><p><strong>Quel mot désigne ce que l’on garde du passé ?</strong></p>",
        "answers": [
          "souvenir"
        ],
        "hints": [
          "La réponse n’est pas un objet précis.",
          "Elle peut être gardée dans une boîte ou dans la tête.",
          "Elle parle du passé.",
          "Le mot commence par S."
        ],
        "success": "Premier fragment trouvé."
      },
      {
        "type": "collection",
        "title": "Épreuve II — Rassembler",
        "q": "<p>Un souvenir seul peut compter.</p><p>Mais plusieurs souvenirs réunis racontent une histoire plus grande.</p><p><strong>Quel mot désigne l’action de les mettre ensemble ?</strong></p>",
        "answers": [
          "rassembler",
          "collectionner"
        ],
        "hints": [
          "C’est une action.",
          "Elle transforme plusieurs morceaux en ensemble.",
          "On peut le faire avec des photos ou des petits mots.",
          "Le mot peut être “rassembler”."
        ],
        "success": "Deuxième fragment trouvé."
      },
      {
        "type": "real",
        "title": "Épreuve III — Hors du site",
        "q": "<p>Un jour, cette porte pourra te demander de chercher ailleurs que dans l’écran.</p><p>Pas maintenant forcément.</p><p>Mais certains secrets sont plus beaux quand ils existent vraiment.</p><p><strong>Quel mot désigne ce qui existe hors du site ?</strong></p>",
        "answers": [
          "reel",
          "réel",
          "realite",
          "réalité"
        ],
        "hints": [
          "La réponse s’oppose au virtuel.",
          "Elle peut se toucher.",
          "Elle peut être cachée chez toi.",
          "Le mot commence par R."
        ],
        "success": "Troisième fragment trouvé."
      },
      {
        "type": "patience",
        "title": "Épreuve IV — Attendre le bon moment",
        "q": "<p>Toutes les portes ne doivent pas être terminées trop tôt.</p><p>Certaines gagnent du sens parce qu’on les laisse mûrir.</p><p><strong>Quel mot faut-il parfois accepter ?</strong></p>",
        "answers": [
          "patience"
        ],
        "hints": [
          "Ce mot parle du temps.",
          "Il demande de ne pas tout avoir immédiatement.",
          "Il peut rendre une surprise meilleure.",
          "Le mot commence par P."
        ],
        "success": "Oui : patience."
      },
      {
        "type": "final",
        "title": "Épreuve V — Porte à compléter",
        "q": "<p>Cette dernière porte n’a pas encore son cadeau définitif.</p><p>Elle sera gardée pour la fin, quand l’année aura laissé assez de traces.</p><p><strong>Quel mot résume ce rôle ?</strong></p>",
        "answers": [
          "final",
          "conclusion"
        ],
        "hints": [
          "La réponse parle de la fin.",
          "Elle ne donne pas encore le cadeau.",
          "Elle ferme une histoire.",
          "On peut dire “final”."
        ],
        "success": "Le Dernier Masque restera prêt pour la suite."
      }
    ],
    "reveal": "<div class=\"reveal-card\"><div class=\"stamp\">DÉCOUVERT</div><h3>Le Dernier Masque reste à compléter.</h3><p>Cette porte pourra devenir le coffre final des souvenirs, ou une surprise encore meilleure quand elle apparaîtra.</p></div>",
    "memory": "Le Dernier Masque — une porte gardée pour la fin.",
    "theme": "masque"
  }
];


const COLLECTION_CARDS = [
  { id: 'parc-isle', title: "Parc d’Isle", rarity: 'rare', emoji: '🌿', text: "Là où un souvenir a commencé." },
  { id: 'cinema', title: 'Cinéma', rarity: 'commune', emoji: '🎬', text: "Une sortie simple qui peut devenir un souvenir." },
  { id: 'premier-bisou', title: 'Premier bisou', rarity: 'legendaire', emoji: '💫', text: "Certaines dates prennent plus de place que prévu." },
  { id: 'bocal', title: 'Bocal réconfort', rarity: 'rare', emoji: '🫙', text: "Quelques mots peuvent attendre le bon moment." },
  { id: 'bal', title: 'Bal des Secrets', rarity: 'epique', emoji: '🎭', text: "Un monde créé juste pour toi." },
  { id: 'petitdej', title: 'Matin préparé', rarity: 'commune', emoji: '☕', text: "Un début de journée pensé doucement." },
  { id: 'rose', title: 'Message vivant', rarity: 'rare', emoji: '🌹', text: "Dire quelque chose sans forcément le prononcer." },
  { id: 'doudou', title: 'Refuge doux', rarity: 'epique', emoji: '🧸', text: "Les refuges ne sont pas toujours des lieux." },
  { id: 'ticket-or', title: 'Ticket d’or', rarity: 'commune', emoji: '🎟️', text: "Une clé qui attend son mois." },
  { id: 'souvenir-flou', title: 'Photo à remplacer', rarity: 'commune', emoji: '📷', text: "Emplacement temporaire pour une future photo." },
  { id: 'sortie', title: 'Sortie surprise', rarity: 'commune', emoji: '🗺️', text: "Un moment qui n’existe pas encore." },
  { id: 'nous', title: 'Nous deux', rarity: 'legendaire', emoji: '❤️', text: "Une carte rare, à remplacer par une vraie photo." }
];



const RARITY_WEIGHTS = [
  { rarity: 'commune', weight: 40 },
  { rarity: 'rare', weight: 30 },
  { rarity: 'epique', weight: 20 },
  { rarity: 'legendaire', weight: 10 }
];


function formatDateTime(ts) {
  try {
    return new Date(ts).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
}

function logEvent(state, title, text, type = 'info') {
  state.journal = state.journal || [];
  state.journal.unshift({ ts: Date.now(), title, text, type });
  state.journal = state.journal.slice(0, 80);
}

const BADGE_DEFINITIONS = [
  { id: 'first-door', icon: '🚪', title: 'Première porte', text: 'Tu as terminé une première porte du Bal.', objective: 'Termine n’importe quelle porte complète.' },
  { id: 'three-doors', icon: '🎭', title: 'Invitée du Bal', text: 'Tu as terminé 3 portes.', objective: 'Termine 3 portes complètes.' },
  { id: 'five-doors', icon: '🏛️', title: 'Exploratrice', text: 'Tu as terminé 5 portes.', objective: 'Termine 5 portes complètes.' },
  { id: 'ten-doors', icon: '👑', title: 'Presque au bout du Bal', text: 'Tu as terminé 10 portes.', objective: 'Termine 10 portes complètes.' },
  { id: 'five-riddles', icon: '🧩', title: 'Esprit d’enquête', text: 'Tu as résolu 5 énigmes.', objective: 'Résous 5 énigmes au total.' },
  { id: 'twenty-five-riddles', icon: '🔎', title: 'Regard attentif', text: 'Tu as résolu 25 énigmes.', objective: 'Résous 25 énigmes au total.' },
  { id: 'all-riddles', icon: '🌟', title: 'Toutes les clés', text: 'Tu as résolu les 55 énigmes des 11 portes.', objective: 'Résous les 55 énigmes des 11 portes.' },
  { id: 'first-card', icon: '📸', title: 'Première carte', text: 'Tu as obtenu ta première carte souvenir.', objective: 'Ouvre un booster et obtiens ta première carte.' },
  { id: 'ten-cards', icon: '🃏', title: 'Début de collection', text: 'Tu as obtenu 10 cartes.', objective: 'Obtiens 10 cartes au total, doublons compris.' },
  { id: 'twenty-cards', icon: '📚', title: 'Album vivant', text: 'Tu as obtenu 20 cartes.', objective: 'Obtiens 20 cartes au total, doublons compris.' },
  { id: 'thirty-cards', icon: '💫', title: 'Collection dorée', text: 'Tu as obtenu 30 cartes.', objective: 'Obtiens 30 cartes au total, doublons compris.' },
  { id: 'legendary-card', icon: '✨', title: 'Instant légendaire', text: 'Tu as trouvé une carte légendaire.', objective: 'Obtiens au moins une carte légendaire dans un booster.' },
  { id: 'secret-logos', icon: '🕵️', title: 'Chasseuse de secrets', text: 'Tu as retrouvé les 5 logos cachés du site.', objective: 'Trouve les 5 logos cachés dans le site.' },
  { id: 'all-badges', icon: '🏆', title: 'Staff complète', text: 'Tu as terminé tous les objectifs du Bal.', objective: 'Débloque tous les autres badges pour compléter la staff.' }
];

function solvedRiddleCount(state) {
  return Object.values(state.answers || {}).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
}

function awardBadges(state) {
  state.badges = state.badges || [];
  const counts = collectionCounts(state);
  const ownedCards = Object.keys(counts);
  const unlocked = [];
  const hasLegendary = ownedCards.some(id => (COLLECTION_CARDS.find(c => c.id === id) || {}).rarity === 'legendaire');
  const completedDoors = (state.completed || []).filter(id => id <= 11).length;
  const solved = solvedRiddleCount(state);
  const totalCardsOwned = (state.collection || []).length;
  const foundLogos = (state.secretLogos || []).length;
  const checks = {
    'first-door': completedDoors >= 1,
    'three-doors': completedDoors >= 3,
    'five-doors': completedDoors >= 5,
    'ten-doors': completedDoors >= 10,
    'five-riddles': solved >= 5,
    'twenty-five-riddles': solved >= 25,
    'all-riddles': solved >= 55,
    'first-card': totalCardsOwned >= 1,
    'ten-cards': totalCardsOwned >= 10,
    'twenty-cards': totalCardsOwned >= 20,
    'thirty-cards': totalCardsOwned >= 30,
    'legendary-card': hasLegendary,
    'secret-logos': foundLogos >= 5
  };
  checks['all-badges'] = BADGE_DEFINITIONS.filter(b => b.id !== 'all-badges').every(b => checks[b.id] || state.badges.includes(b.id));
  Object.entries(checks).forEach(([id, ok]) => {
    if (ok && !state.badges.includes(id)) {
      state.badges.push(id);
      const badge = BADGE_DEFINITIONS.find(b => b.id === id);
      if (badge) {
        logEvent(state, `Badge débloqué : ${badge.title}`, badge.text, 'badge');
        unlocked.push(badge);
      }
    }
  });
  return unlocked;
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function collectionCounts(state) {
  const counts = {};
  (state.collection || []).forEach(id => { counts[id] = (counts[id] || 0) + 1; });
  return counts;
}

function weightedRandomCard() {
  const total = RARITY_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  let chosen = RARITY_WEIGHTS[0].rarity;
  for (const item of RARITY_WEIGHTS) {
    if (roll < item.weight) { chosen = item.rarity; break; }
    roll -= item.weight;
  }
  const pool = COLLECTION_CARDS.filter(card => card.rarity === chosen);
  const source = pool.length ? pool : COLLECTION_CARDS;
  return source[Math.floor(Math.random() * source.length)];
}

function drawCards(count) {
  return Array.from({ length: count }, () => weightedRandomCard());
}

function packLabel(type) {
  return type === 'daily' ? 'Carte du jour' : type === 'mini' ? 'Mini booster' : 'Grand booster';
}

const ROOM_THEMES = {
  refuge: { label: 'Refuge Doré', tone: 220 }, rose: { label: 'Rose Noire', tone: 196 }, parc: { label: 'Parc des Premiers Secrets', tone: 174 },
  aube: { label: 'Aube Royale', tone: 262 }, pyjama: { label: 'Le Pyjama', tone: 146 }, minuit: { label: 'Après Minuit', tone: 116 },
  chapitre: { label: 'Chapitre XII', tone: 185 }, festin: { label: 'Festin Doré', tone: 246 }, fil: { label: 'Fil Doré', tone: 208 },
  monde: { label: 'Petit Monde', tone: 164 }, jardin: { label: 'Jardin Secret', tone: 132 }, masque: { label: 'Dernier Masque', tone: 98 }
};

const STORAGE_KEY = 'bal_des_secrets_state_v4';

function normalize(value) {
  return String(value || '')
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`´]/g, '')
    .replace(/[\s\-_/\.]+/g, '')
    .replace(/[^A-Z0-9À-ÖØ-Ý]/g, '');
}

function defaultState() {
  return { unlocked: [], lastUnlockMonth: null, answers: {}, answerTexts: {}, hints: {}, completed: [], boosters: 0, miniBoosters: 0, collection: [], openedBoosters: [], lastDailyBooster: null, journal: [], badges: [], claimedBadgeRewards: [], secretLogos: [] };
}

function loadState() {
  try {
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaultState()));
    state.unlocked = state.unlocked || [];
    state.lastUnlockMonth = state.lastUnlockMonth || null;
    state.answers = state.answers || {};
    state.answerTexts = state.answerTexts || {};
    state.hints = state.hints || {};
    state.completed = state.completed || [];
    state.boosters = Number(state.boosters || 0);
    state.miniBoosters = Number(state.miniBoosters || 0);
    state.collection = state.collection || [];
    state.openedBoosters = state.openedBoosters || [];
    state.lastDailyBooster = state.lastDailyBooster || null;
    state.journal = state.journal || [];
    state.badges = state.badges || [];
    state.claimedBadgeRewards = state.claimedBadgeRewards || [];
    state.secretLogos = state.secretLogos || [];
    return state;
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function daysUntilNextMonth() {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return Math.ceil((next - now) / (1000 * 60 * 60 * 24));
}

function showView(id) {
  document.body.dataset.currentView = id;
  document.querySelectorAll('.nav-group.open').forEach(g => g.classList.remove('open'));
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  if (id !== 'room') clearRoomTheme();
  if (id === 'doors') renderMemories();
  if (id === 'boosters') renderBoosters();
  if (id === 'collection') renderCollection();
  if (id === 'progression') renderProgression();
  if (id === 'journal') renderJournal();
  if (id === 'chronicles') renderChronicles();
  if (id === 'finalRoom') renderFinalRoom();
  if (id === 'code') renderCodeRecap();
  updateBoosterBadge();
  updateHiddenLogos();
}

document.querySelectorAll('[data-view]').forEach(btn => {
  btn.addEventListener('click', () => showView(btn.dataset.view));
});

document.querySelectorAll('.nav-group > button').forEach(btn => {
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    const group = btn.closest('.nav-group');
    const wasOpen = group.classList.contains('open');
    document.querySelectorAll('.nav-group.open').forEach(g => g.classList.remove('open'));
    if (!wasOpen) group.classList.add('open');
  });
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-group')) {
    document.querySelectorAll('.nav-group.open').forEach(g => g.classList.remove('open'));
  }
});

function findTicket(code) {
  return tickets.find(t => normalize(t.code) === normalize(code));
}

function unlockTicket(ticket) {
  const state = loadState();
  const alreadyUnlocked = state.unlocked.includes(ticket.id);
  const thisMonth = currentMonthKey();

  if (!alreadyUnlocked && state.lastUnlockMonth === thisMonth) {
    setMessage(`Cette porte est encore scellée. Tu as déjà ouvert un ticket ce mois-ci. Prochain mystère dans environ ${daysUntilNextMonth()} jour(s).`, 'error');
    return;
  }

  if (!alreadyUnlocked) {
    state.unlocked.push(ticket.id);
    state.lastUnlockMonth = thisMonth;
    saveState(state);
  }

  setMessage('Porte déverrouillée.', 'success');
  renderRoom(ticket);
  showView('room');
}

function setMessage(text, type) {
  const el = document.getElementById('message');
  el.textContent = text;
  el.className = `message ${type || ''}`;
}

const unlockBtn = document.getElementById('unlockBtn');
const codeInput = document.getElementById('codeInput');

unlockBtn.addEventListener('click', () => {
  const ticket = findTicket(codeInput.value);
  if (!ticket) {
    setMessage('Code inconnu. Vérifie les lettres, les accents ou les tirets.', 'error');
    return;
  }
  unlockTicket(ticket);
});

codeInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') unlockBtn.click();
});

function renderRoom(ticket) { currentTicketId=ticket.id;
  applyRoomTheme(ticket);
  const state = loadState();
  const room = document.getElementById('room');
  const solved = state.answers[ticket.id] || [];
  const total = (ticket.riddles || []).length;
  const completed = total && solved.length >= total;

  let html = `<p class="eyebrow">Porte déverrouillée</p><h2>${ticket.title}</h2><p>${ticket.teaser}</p>`;
  if (ticket.intro) html += `<div class="room-intro">${ticket.intro}<div class="booster-reminder"><strong>Récompenses du Bal :</strong> chaque énigme résolue t’offre un mini booster. En terminant cette porte, tu débloques aussi un grand booster de 3 cartes.</div><div class="room-tools"><button id="ambienceBtn" onclick="toggleAmbience('${ticket.theme || ''}')">Jouer une note d’ambiance</button><span class="theme-chip">Ambiance visuelle : ${ticket.title}</span></div></div>`;

  if (!total) {
    html += `<blockquote>Cette porte est encore en préparation. Le ticket est bien débloqué, mais son mystère complet arrivera plus tard.</blockquote>`;
    room.innerHTML = html;
    return;
  }

  ticket.riddles.forEach((r, index) => {
    const isUnlocked = index === 0 || solved.includes(index - 1);
    const isSolved = solved.includes(index);
    const hintsShown = getHintCount(ticket.id, index);
    const maxHints = (r.hints || []).length;
    const hintsHtml = isUnlocked && !isSolved && maxHints ? renderHints(ticket.id, index, r.hints, hintsShown) : '';

    html += `<div id="room-step-${ticket.id}-${index}" class="room-step ${isUnlocked ? '' : 'locked'} ${isSolved ? 'solved' : ''}">
      <h3>${r.title || `Épreuve ${index + 1}`}</h3>
      <div class="riddle-content">${isUnlocked ? ((r.type === 'fill-blanks') ? '' : r.q) : '<p>Cette épreuve est encore verrouillée.</p>'}</div>
      ${hintsHtml}
      ${isUnlocked && !isSolved ? renderAnswerInput(ticket, r, index) : ''}
      ${isSolved ? `<p class="message success">✓ Résolue — Réponse trouvée : <strong>${getSolvedAnswerText(state, ticket.id, index, r)}</strong></p><p class="solved-note">${r.success || 'Bien joué.'}</p>` : ''}
    </div>`;
  });

  if (completed) {
    if (!state.completed.includes(ticket.id)) {
      state.completed.push(ticket.id);
      saveState(state);
      updateBoosterBadge();
    }
    html += ticket.reveal || `<blockquote>Révélation : ce mystère te mène vers ton cadeau — ${ticket.gift}.</blockquote>`;
    if (ticket.id === 2) {
      html += `<div class="secret-message-card"><p class="eyebrow">Message débloqué</p><h3>Un mot après la Rose Noire</h3><p>Cette porte ne cachait pas seulement des fleurs. Elle cachait aussi une façon de te rappeler que certaines attentions sont pensées longtemps avant d’être offertes.</p><p class="secret-signature">— Un message gardé pour toi</p></div>`;
    }
  }

  room.innerHTML = html;
}


function renderAnswerInput(ticket, r, index){

  if(r.type === "timeline"){
    const items = [...(r.timeline || [])].sort(()=>Math.random()-0.5);
    return `
      <div class="timeline-board" id="timeline-${index}">
        <div class="timeline-slots">
          ${[1,2,3,4].map(i=>`<div class="timeline-slot" ondragover="event.preventDefault()" ondrop="dropTimeline(event, ${index}, ${i-1})" ontouchend="placeMobileCard(this)"><span>${i}</span></div>`).join('')}
        </div>
        <div class="timeline-cards">
          ${items.map(item=>`<div class="timeline-card" draggable="true" ondragstart="dragTimeline(event)" ontouchstart="selectMobileCard(this)" data-value="${item}">${item}</div>`).join('')}
        </div>
        <div class="answer-row"><button onclick="checkAnswer(${ticket.id}, ${index})">Valider l'ordre</button></div>
      </div>`;
  }

  if(r.type === "fill-blanks"){
    const words = r.choices || [];
    const shuffled = [...words].sort(()=>Math.random()-0.5);
    return `
      <div class="fill-story" id="fill-${index}">
        <p>Avant même notre première conversation, tu as tapé contre une <span class="inline-slot" ondragover="event.preventDefault()" ondrop="dropFill(event, ${index})" ontouchend="placeMobileCard(this)"></span>.</p>
        <p>Quelques jours plus tard, tu m’as ajouté sur <span class="inline-slot" ondragover="event.preventDefault()" ondrop="dropFill(event, ${index})" ontouchend="placeMobileCard(this)"></span>.</p>
        <p>Depuis le <span class="inline-slot" ondragover="event.preventDefault()" ondrop="dropFill(event, ${index})" ontouchend="placeMobileCard(this)"></span>, notre histoire continue de s'écrire.</p>
        <div class="fill-cards">
          ${shuffled.map(item=>`<div class="fill-card" draggable="true" ondragstart="dragFill(event)" ontouchstart="selectMobileCard(this)" data-value="${item}">${item}</div>`).join('')}
        </div>
        <div class="answer-row"><button onclick="checkAnswer(${ticket.id}, ${index})">Valider</button></div>
      </div>`;
  }

  if(r.type === "breakfast"){
    const opts=(r.options||[]).map(o=>`<button class="breakfast-item" onclick="toggleBreakfast(${index}, this)" data-value="${o}">${o}</button>`).join('');
    return `<div class="breakfast-grid">${opts}</div><input type="hidden" id="answer-${index}"><div class="breakfast-note" id="breakfast-note-${index}"></div><div class="breakfast-result" id="breakfast-result-${index}"></div><div class="answer-row"><button onclick="validateBreakfast(${index})">Valider</button></div>`;
  }

  if(r.type === "memory"){
    const cards=[...(r.pairs||[]),...(r.pairs||[])].sort(()=>Math.random()-0.5);
    return `<div class="memory-grid" id="memory-${index}">${cards.map(c=>`<button class="memory-card" data-value="${c}" onclick="flipMemory(${index}, this)"><span>❓</span></button>`).join('')}</div><input type="hidden" id="answer-${index}">`;
  }

  if(r.type === "monuments"){
    return `
      <div class="monument-grid" id="monuments-${index}">
        <button class="monument-choice" onclick="chooseMonument(${index}, this, 'Arc de Triomphe')" ontouchend="chooseMonument(${index}, this, 'Arc de Triomphe')"><img src="assets/monuments/arc-triomphe.png"></button>
        <button class="monument-choice" onclick="chooseMonument(${index}, this, 'Notre-Dame')" ontouchend="chooseMonument(${index}, this, 'Notre-Dame')"><img src="assets/monuments/notre-dame.png"></button>
        <button class="monument-choice" onclick="chooseMonument(${index}, this, 'Sacré-Cœur')" ontouchend="chooseMonument(${index}, this, 'Sacré-Cœur')"><img src="assets/monuments/sacre-coeur.png"></button>
        <button class="monument-choice" onclick="chooseMonument(${index}, this, 'Tour Eiffel')" ontouchend="chooseMonument(${index}, this, 'Tour Eiffel')"><img src="assets/monuments/tour-eiffel.png"></button>
      </div>
      <input type="hidden" id="answer-${index}">
      <div class="monument-feedback" id="monument-feedback-${index}"></div>
      <div class="answer-row"><button onclick="checkAnswer(${ticket.id}, ${index})">Valider</button></div>
    `;
  }

  return `<div class="answer-row"><input id="answer-${index}" placeholder="Ta réponse"><button onclick="checkAnswer(${ticket.id}, ${index})">Valider</button></div>`;
}

window._draggedTimeline = null;
window.dragTimeline = function(ev){
  _draggedTimeline = ev.target;
}

window.dropTimeline = function(ev, index, pos){
  ev.preventDefault();
  const slot = ev.currentTarget;
  if(slot.querySelector('.timeline-card')){
    document.querySelector(`#timeline-${index} .timeline-cards`).appendChild(slot.querySelector('.timeline-card'));
  }
  slot.appendChild(_draggedTimeline);
}


window._draggedFill = null;

window.dragFill = function(ev){
  window._draggedFill = ev.target;
}

window.dropFill = function(ev,index){
  ev.preventDefault();
  const slot = ev.currentTarget;

  if(slot.querySelector('.fill-card')){
    document.querySelector(`#fill-${index} .fill-cards`).appendChild(
      slot.querySelector('.fill-card')
    );
  }

  if(window._draggedFill){
    slot.appendChild(window._draggedFill);
  }
}

function getSubmittedAnswer(riddle, index){
  if(riddle.type === "fill-blanks"){
    const slots=[...document.querySelectorAll(`#fill-${index} .inline-slot`)];
    return slots.map(s=>s.querySelector(`.fill-card`)?.dataset.value||``).join(`|`);
  }
  if(riddle.type === "breakfast"){
    return document.getElementById(`answer-${index}`)?.value || '';
  }
  if(riddle.type === "memory"){
    return document.getElementById(`answer-${index}`)?.value || '';
  }
  if(riddle.type === "timeline"){
    const slots = [...document.querySelectorAll(`#timeline-${index} .timeline-slot`)];
    return slots.map(s => s.querySelector('.timeline-card')?.dataset.value || '').join('|');
  }
  const input = document.getElementById(`answer-${index}`);
  return input ? input.value : '';
}


function getSolvedAnswerText(state, ticketId, index, riddle) {
  if (riddle?.type === 'breakfast') {
    const items = JSON.parse(localStorage.getItem('petitDejeunerIdeal') || '[]');

    if (items.length) {
      return 'Ton petit-déjeuner idéal : ' + items.join(', ');
    }

    return 'Épreuve validée';
  }

  if (riddle?.type === 'memory') {
    return 'Memory réussi';
  }

  const saved = (((state.answerTexts || {})[ticketId] || {})[index]);
  const fallback = (riddle.answers || [])[0] || 'réponse validée';

  if (saved === 'VALID') return 'Épreuve validée';
  if (saved === 'MEMORY_DONE') return 'Memory réussi';

  return String(saved || fallback).trim();
}

function getHintCount(ticketId, index) {
  const state = loadState();
  return ((state.hints || {})[ticketId] || {})[index] || 0;
}

function renderHints(ticketId, index, hints, count) {
  const visibleHints = hints.slice(0, count).map((hint, i) => `
    <div class="hint-item"><span>Indice ${i + 1}</span><p>${hint}</p></div>
  `).join('');

  const button = count < hints.length
    ? `<button class="hint-button" onclick="revealHint(${ticketId}, ${index})">${count === 0 ? 'Demander un indice' : 'Demander un indice supplémentaire'}</button>`
    : `<p class="hint-max">Tous les indices de cette épreuve ont été révélés.</p>`;

  return `<div class="hint-panel">
    ${visibleHints}
    ${button}
  </div>`;
}

window.revealHint = function(ticketId, index) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;
  const state = loadState();
  state.hints[ticketId] = state.hints[ticketId] || {};
  const current = state.hints[ticketId][index] || 0;
  const max = (ticket.riddles[index].hints || []).length;
  if (current < max) state.hints[ticketId][index] = current + 1;
  saveState(state);
  renderRoom(ticket);
};

window.checkAnswer = function(ticketId, index) {
  const ticket = tickets.find(t => t.id === ticketId);
  const input = document.getElementById(`answer-${index}`);
  const state = loadState();
  state.answers[ticketId] = state.answers[ticketId] || [];
  const validAnswers = ticket.riddles[index].answers || [];
  const submittedAnswer = getSubmittedAnswer(ticket.riddles[index], index);
  const currentRiddle = ticket.riddles[index];
  if(currentRiddle.type==="breakfast" && submittedAnswer==="VALID"){ validAnswers.push("VALID"); }
  if(currentRiddle.type==="memory" && submittedAnswer==="MEMORY_DONE"){ validAnswers.push("MEMORY_DONE"); }

  if (validAnswers.some(answer => normalize(submittedAnswer) === normalize(answer))) {
    const wasAlreadySolved = state.answers[ticketId].includes(index);
    let earnedMessages = [];
    let rewardType = 'mini';
    if (!wasAlreadySolved) {
      state.answers[ticketId].push(index);
      state.answerTexts[ticketId] = state.answerTexts[ticketId] || {};
      state.answerTexts[ticketId][index] = submittedAnswer;
      const isFinalRiddle = index === (ticket.riddles.length - 1);
      state.miniBoosters = Number(state.miniBoosters || 0) + 1;
      logEvent(state, 'Énigme résolue', `${ticket.title} — ${ticket.riddles[index].title || 'Énigme résolue'}`, 'riddle');
      earnedMessages.push('Tu as gagné un mini booster.');
      if (isFinalRiddle) {
        state.boosters = Number(state.boosters || 0) + 1;
        if (!state.completed.includes(ticket.id)) state.completed.push(ticket.id);
        logEvent(state, 'Porte terminée', `${ticket.title} — grand booster débloqué.`, 'door');
        earnedMessages.push('Tu as aussi gagné un grand booster de 3 cartes.');
        rewardType = 'big';
        pendingRevealTicketId = ticket.id;
      }
      const badges = awardBadges(state);
      if (badges.length) earnedMessages.push(`Badge débloqué : ${badges.map(b => b.title).join(', ')}.`);
    }
    saveState(state);
    renderRoom(ticket);
    updateBoosterBadge();
    triggerLocalGoldBurst(ticketId, index);
    if (earnedMessages.length) showBoosterToast(earnedMessages.join('<br>'), rewardType);
  } else {
    if (ticket.riddles[index].type === 'monuments') {
      const feedback = document.getElementById(`monument-feedback-${index}`);
      if(feedback) feedback.textContent = "❌ Ce n'est pas le bon monument.";
    } else if (input) {
      input.value = '';
      input.placeholder = 'Ce n’est pas encore ça...';
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 350);
      showInlineMessage('Ce n’est pas encore la bonne réponse.', 'error');
    } else {
      showInlineMessage('Ce n’est pas encore le bon ordre.', 'error');
    }
  }
};

let pendingRewardType = 'mini';
let pendingRevealTicketId = null;
function showBoosterToast(message, rewardType = 'mini') {
  pendingRewardType = rewardType;
  let overlay = document.getElementById('boosterRewardOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'boosterRewardOverlay';
    overlay.className = 'booster-reward-overlay';
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="booster-reward-modal" role="dialog" aria-modal="true" aria-label="Récompense gagnée">
      <div class="reward-icon">✦</div>
      <h3>Récompense gagnée</h3>
      <p>${message}</p>
      <div class="reward-actions">
        <button class="secondary" onclick="claimBoosterReward()">Récupérer</button>
        <button class="primary" onclick="openRewardNow()">Ouvrir maintenant</button>
      </div>
      <small>“Récupérer” garde le booster pour plus tard, sans quitter la porte.</small>
    </div>
  `;
  overlay.classList.remove('show');
  void overlay.offsetWidth;
  overlay.classList.add('show');
}

window.claimBoosterReward = function() {
  const overlay = document.getElementById('boosterRewardOverlay');
  if (overlay) overlay.classList.remove('show');
  scrollToPendingReveal();
};

window.openRewardNow = function() {
  const overlay = document.getElementById('boosterRewardOverlay');
  if (overlay) overlay.classList.remove('show');
  setTimeout(() => {
    if (pendingRewardType === 'big') openCardPack(3, 'big', { inline: true });
    else openCardPack(1, 'mini', { inline: true });
    setTimeout(scrollToPendingReveal, 900);
  }, 120);
};

function renderMemories() {
  const state = loadState();
  const list = document.getElementById('memoryList');
  list.innerHTML = tickets.map(t => {
    const open = state.unlocked.includes(t.id);
    const done = state.completed.includes(t.id);
    const solvedCount = (state.answers[t.id] || []).length;
    const total = (t.riddles || []).length;
    const progress = open && total ? `${solvedCount}/${total} épreuve(s) résolue(s)` : '';
    return `<div class="memory-item ${done ? 'completed' : ''}">
      <div>
        <strong>${open ? '✓' : '🔒'} ${open ? t.title : 'Porte inconnue'}</strong><br>
        <span class="${open ? '' : 'locked-text'}">${open ? (done && t.memory ? t.memory : t.teaser) : 'Cette porte attend encore sa clé.'}</span>
        ${open && progress ? `<small class="memory-progress">${progress}</small>` : ''}
      </div>
      ${open ? `<button onclick="openTicketFromMemory(${t.id})">${done ? 'Revoir' : 'Continuer'}</button>` : ''}
    </div>`;
  }).join('');
}

window.openTicketFromMemory = function(ticketId) {
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;
  renderRoom(ticket);
  showView('room');
};

function roman(num) {
  return ['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][num] || num;
}


function updateBoosterBadge() {
  const state = loadState();
  const badge = document.getElementById('boosterCount');
  const totalPacks = Number(state.boosters || 0) + Number(state.miniBoosters || 0);
  if (badge) { badge.textContent = totalPacks ? String(totalPacks) : ''; badge.classList.toggle('visible', !!totalPacks); }
}

function rarityLabel(rarity) {
  return { commune: 'Commune', rare: 'Rare', epique: 'Épique', legendaire: 'Légendaire' }[rarity] || rarity;
}

function getNextCards(count = 3) {
  return drawCards(count);
}

function cardHtml(card, options = {}) {
  const locked = !!options.locked;
  const isNew = !!options.isNew;
  const count = Number(options.count || 0);
  const extraClass = `${locked ? 'locked-card' : ''} ${isNew ? 'new-card' : ''}`;
  return `<article class="collection-card rarity-${card.rarity} ${extraClass}">
    ${isNew ? '<div class="new-badge">NOUVEAU</div>' : ''}
    ${!locked && count > 1 ? `<div class="duplicate-badge">x${count}</div>` : ''}
    <div class="card-number">#${String(card.number || COLLECTION_CARDS.findIndex(c => c.id === card.id) + 1).padStart(2, '0')}</div>
    <div class="card-art">${locked ? '🔒' : card.emoji}</div>
    <div class="card-rarity">${locked ? 'Inconnue' : rarityLabel(card.rarity)}</div>
    <h3>${locked ? 'Carte non découverte' : card.title}</h3>
    <p>${locked ? 'Cette carte attend encore dans un futur booster.' : card.text}</p>
  </article>`;
}

function rarityRatesHtml() {
  return `<div class="rarity-rates">
    <span class="rarity-dot rarity-commune">Commune 40%</span>
    <span class="rarity-dot rarity-rare">Rare 30%</span>
    <span class="rarity-dot rarity-epique">Épique 20%</span>
    <span class="rarity-dot rarity-legendaire">Légendaire 10%</span>
  </div>`;
}

function renderBoosters(lastCards = [], lastType = '') {
  const state = loadState();
  const box = document.getElementById('boosterArea');
  if (!box) return;
  const canOpenBig = Number(state.boosters || 0) > 0;
  const canOpenMini = Number(state.miniBoosters || 0) > 0;
  const canDaily = state.lastDailyBooster !== todayKey();
  const adminTools = document.body.classList.contains('admin-enabled') ? `
    <div class="booster-admin-tools">
      <strong>Admin boosters</strong>
      <button onclick="adminAddMiniBooster()">Ajouter 1 mini booster</button>
      <button onclick="adminAddBooster()">Ajouter 1 grand booster</button>
      <button onclick="adminAddBoosters(5)">Ajouter 5 grands boosters</button>
      <button onclick="adminRepairBoosters()">Réparer boosters manquants</button>
    </div>` : '';
  box.innerHTML = `
    <div class="booster-summary">
      <p class="lead">Mini boosters : <strong>${state.miniBoosters || 0}</strong> · Grands boosters : <strong>${state.boosters || 0}</strong></p>
      <p>Chaque énigme résolue donne un mini booster d’une carte. Quand une porte est terminée, un grand booster de trois cartes est aussi ajouté. Une carte gratuite peut aussi être récupérée une fois par jour.</p>
      ${rarityRatesHtml()}
    </div>
    ${adminTools}
    <div class="booster-actions-grid">
      <div class="booster-pack ${canDaily ? 'ready daily-pack' : ''}" ${canDaily ? 'onclick="openDailyCard()"' : ''}><span>☀️</span><strong>Carte du jour</strong><small>${canDaily ? '1 carte gratuite à récupérer' : 'Déjà récupérée aujourd’hui'}</small></div>
      <div class="booster-pack ${canOpenMini ? 'ready mini-pack' : ''}" ${canOpenMini ? 'onclick="openMiniBooster()"' : ''}><span>✉️</span><strong>Mini booster</strong><small>${canOpenMini ? 'Ouvre 1 carte' : 'Aucun mini booster'}</small></div>
      <div class="booster-pack ${canOpenBig ? 'ready big-pack' : ''}" ${canOpenBig ? 'onclick="openBooster()"' : ''}><span>🎁</span><strong>Grand booster</strong><small>${canOpenBig ? 'Ouvre 3 cartes' : 'Aucun grand booster'}</small></div>
    </div>
    ${lastCards.length ? `<div class="booster-opening"><p class="eyebrow">${packLabel(lastType)} ouvert</p><div class="booster-results opening-animation">${lastCards.map(card => cardHtml(card, { isNew: card.isNew })).join('')}</div></div>` : ''}`;
  updateBoosterBadge();
}

function addCardsToCollection(cards) {
  const state = loadState();
  const countsBefore = collectionCounts(state);
  const results = cards.map(card => ({ ...card, isNew: !countsBefore[card.id] }));
  results.forEach(card => {
    state.collection.push(card.id);
  });
  state.openedBoosters.push(Date.now());
  awardBadges(state);
  saveState(state);
  return results;
}

function openCardPack(count, type, options = {}) {
  const state = loadState();
  if (type === 'daily') {
    if (state.lastDailyBooster === todayKey()) return;
    state.lastDailyBooster = todayKey();
    saveState(state);
  } else if (type === 'mini') {
    if (!state.miniBoosters) return;
    state.miniBoosters -= 1;
    saveState(state);
  } else {
    if (!state.boosters) return;
    state.boosters -= 1;
    saveState(state);
  }
  const results = addCardsToCollection(getNextCards(count));
  if (document.getElementById('boosters')?.classList.contains('active')) renderBoosters(results, type);
  else renderBoosters();
  renderCollection();
  updateBoosterBadge();
  showPackOpeningOverlay(results, type);
}

function showPackOpeningOverlay(cards, type) {
  let overlay = document.getElementById('packOpeningOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'packOpeningOverlay';
    overlay.className = 'pack-opening-overlay';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `
    <div class="pack-opening-modal ${type === 'big' ? 'big-opening' : ''}">
      <p class="eyebrow">${packLabel(type)} ouvert</p>
      <h3>${cards.length > 1 ? 'Tes cartes sont arrivées' : 'Ta carte est arrivée'}</h3>
      <div class="booster-results inline-opening-animation">
        ${cards.map(card => cardHtml(card, { isNew: card.isNew })).join('')}
      </div>
      <p class="pack-flight-note">Les cartes ont été ajoutées à ton album.</p>
      <div class="reward-actions">
        <button class="secondary" onclick="closePackOpening()">Continuer</button>
        <button class="primary" onclick="goToAlbumFromOpening()">Voir l’album</button>
      </div>
    </div>`;
  overlay.classList.remove('show', 'fly-away');
  void overlay.offsetWidth;
  overlay.classList.add('show');
}

window.closePackOpening = function() {
  const overlay = document.getElementById('packOpeningOverlay');
  if (!overlay) return;
  overlay.classList.add('fly-away');
  setTimeout(() => overlay.classList.remove('show', 'fly-away'), 720);
};

window.goToAlbumFromOpening = function() {
  const overlay = document.getElementById('packOpeningOverlay');
  if (overlay) overlay.classList.add('fly-away');
  setTimeout(() => {
    if (overlay) overlay.classList.remove('show', 'fly-away');
    showView('collection');
  }, 720);
};

window.openDailyCard = function() { openCardPack(1, 'daily'); };
window.openMiniBooster = function() { openCardPack(1, 'mini'); };
window.openBooster = function() { openCardPack(3, 'big'); };

function renderCollection() {
  const state = loadState();
  const grid = document.getElementById('collectionGrid');
  const stats = document.getElementById('collectionStats');
  if (!grid) return;
  const counts = collectionCounts(state);
  const ownedIds = Object.keys(counts);
  const totalCards = (state.collection || []).length;
  const duplicates = Math.max(0, totalCards - ownedIds.length);
  const rarityOwned = ['commune','rare','epique','legendaire'].map(r => {
    const total = COLLECTION_CARDS.filter(c => c.rarity === r).length;
    const owned = COLLECTION_CARDS.filter(c => c.rarity === r && counts[c.id]).length;
    return `<span>${rarityLabel(r)} : <strong>${owned}/${total}</strong></span>`;
  }).join(' · ');
  if (stats) stats.innerHTML = `<strong>${ownedIds.length}</strong> / ${COLLECTION_CARDS.length} cartes découvertes · <strong>${duplicates}</strong> doublon(s)<br><small>${rarityOwned}</small>`;
  grid.innerHTML = COLLECTION_CARDS.map((card, i) => counts[card.id] ? cardHtml({...card, number: i + 1}, { count: counts[card.id] }) : cardHtml({...card, number: i + 1}, { locked: true })).join('');
  updateBoosterBadge();
}

function renderProgression() {
  const state = loadState();
  awardBadges(state);
  saveState(state);
  const board = document.getElementById('progressionBoard');
  const wall = document.getElementById('badgeWall');
  if (!board || !wall) return;
  const counts = collectionCounts(state);
  const progressTickets = tickets.filter(t => t.id <= 11);
  const progressIds = progressTickets.map(t => t.id);
  const completed = (state.completed || []).filter(id => progressIds.includes(id)).length;
  const unlocked = (state.unlocked || []).filter(id => progressIds.includes(id)).length;
  const solved = progressTickets.reduce((sum, t) => sum + ((state.answers[t.id] || []).length), 0);
  const totalRiddles = progressTickets.reduce((sum, t) => sum + (t.riddles || []).length, 0);
  const ownedCards = Object.keys(counts).length;
  const totalCards = COLLECTION_CARDS.length;
  const duplicates = Math.max(0, (state.collection || []).length - ownedCards);
  const boostersOpened = (state.openedBoosters || []).length;
  board.innerHTML = `
    <div class="progress-grid">
      <article><span>Portes ouvertes</span><strong>${unlocked}/11</strong></article>
      <article><span>Portes terminées</span><strong>${completed}/11</strong></article>
      <article><span>Énigmes résolues</span><strong>${solved}/${totalRiddles}</strong></article>
      <article><span>Cartes découvertes</span><strong>${ownedCards}/${totalCards}</strong></article>
      <article><span>Doublons</span><strong>${duplicates}</strong></article>
      <article><span>Boosters ouverts</span><strong>${boostersOpened}</strong></article>
    </div>`;
  wall.innerHTML = BADGE_DEFINITIONS.map(b => {
    const earned = (state.badges || []).includes(b.id);
    const claimed = (state.claimedBadgeRewards || []).includes(b.id);
    const reward = earned && !claimed ? `<button class="badge-claim-btn" onclick="claimBadgeReward('${b.id}')">Récupérer la récompense du badge</button>` : earned ? `<small class="badge-claimed">Récompense récupérée</small>` : '';
    return `<article class="progress-badge ${earned ? 'earned' : 'locked'}"><div>${earned ? b.icon : '🔒'}</div><h3>${b.title}</h3><p>${earned ? b.text : b.objective}</p>${reward}</article>`;
  }).join('');
}

function renderJournal() {
  const state = loadState();
  const el = document.getElementById('journalList');
  if (!el) return;
  const journal = (state.journal || []).filter(item => ['riddle','door'].includes(item.type));
  el.innerHTML = journal.length ? journal.map(item => `<article class="journal-item journal-${item.type || 'info'}"><span>${formatDateTime(item.ts)}</span><h3>${item.title}</h3><p>${item.text}</p></article>`).join('') : '<p>Aucune épreuve enregistrée pour le moment. Les énigmes résolues et portes terminées apparaîtront ici.</p>';
}

window.exportProgress = function() {
  const state = loadState();
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bal-des-secrets-progression-${todayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

window.importProgress = function(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      const merged = { ...defaultState(), ...imported };
      saveState(merged);
      alert('Progression importée.');
      renderProgression();
      renderCollection();
      renderBoosters();
      renderMemories();
    } catch {
      alert('Impossible d’importer ce fichier.');
    }
  };
  reader.readAsText(file);
};

function renderChronicles() {
  const el = document.getElementById('chroniclesList');
  if (!el) return;
  el.innerHTML = `
    <article class="chronicle"><h3>Notre commencement</h3><p>Certains souvenirs commencent doucement, puis prennent plus de place qu’on ne l’imaginait.</p></article>
    <article class="chronicle"><h3>Les tickets d’or</h3><p>Tu n’avais pas seulement une enveloppe entre les mains. Tu avais une collection de portes à ouvrir, chacune à son moment.</p></article>
    <article class="chronicle"><h3>Les mots réconfortants</h3><p>Parfois, les réponses ne se trouvent pas dans une énigme, mais dans un endroit préparé pour te faire du bien.</p></article>`;
}

function clearRoomTheme() {
  document.body.className = document.body.className.split(' ').filter(c => !c.startsWith('theme-')).join(' ');
  stopAmbience();
}

function applyRoomTheme(ticket) {
  document.body.className = document.body.className.split(' ').filter(c => !c.startsWith('theme-')).join(' ');
  if (ticket && ticket.theme) document.body.classList.add(`theme-${ticket.theme}`);
}

let ambienceCtx = null;
let currentAmbience = null;

window.toggleAmbience = async function(theme) {
  const btn = document.getElementById('ambienceBtn');
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      if (btn) btn.textContent = 'Son non compatible';
      return;
    }
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') await ctx.resume();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.75);
    gain.connect(ctx.destination);

    const freqs = theme === 'aube' ? [392, 523, 659] : theme === 'minuit' ? [220, 277, 330] : theme === 'rose' ? [330, 392, 494] : [262, 330, 392];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start(ctx.currentTime + i * 0.08);
      osc.stop(ctx.currentTime + 0.72 + i * 0.04);
    });
    currentAmbience = theme;
    if (btn) btn.textContent = 'Note d’ambiance jouée';
    setTimeout(() => { if (btn) btn.textContent = 'Jouer une note d’ambiance'; }, 1200);
    setTimeout(() => ctx.close(), 1200);
  } catch (e) {
    if (btn) btn.textContent = 'Son bloqué par le navigateur';
  }
};
function stopAmbience() {
  currentAmbience = null;
}

function resetTicket(ticketId) {
  const state = loadState();
  state.answers[ticketId] = [];
  if (state.hints) state.hints[ticketId] = {};
  state.completed = state.completed.filter(id => id !== ticketId);
  state.unlocked = state.unlocked.filter(id => id !== ticketId);
  saveState(state);
}

function unlockForTest(ticketId) {
  const state = loadState();
  if (!state.unlocked.includes(ticketId)) state.unlocked.push(ticketId);
  saveState(state);
}

window.resetBalSecrets = function() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
};

window.resetRefugeDore = function() {
  resetTicket(1);
  location.reload();
};


window.adminAddMiniBooster = function() {
  const state = loadState();
  state.miniBoosters = Number(state.miniBoosters || 0) + 1;
  saveState(state);
  updateBoosterBadge();
  renderBoosters();
};

window.adminAddBooster = function() {
  const state = loadState();
  state.boosters = Number(state.boosters || 0) + 1;
  saveState(state);
  updateBoosterBadge();
  renderBoosters();
};

window.adminAddBoosters = function(count) {
  const state = loadState();
  state.boosters = Number(state.boosters || 0) + Number(count || 1);
  saveState(state);
  updateBoosterBadge();
  renderBoosters();
};

window.adminRepairBoosters = function() {
  const state = loadState();
  let solvedNonFinal = 0;
  tickets.forEach(t => {
    const solved = state.answers[t.id] || [];
    solved.forEach(index => { if (index < (t.riddles || []).length - 1) solvedNonFinal += 1; });
  });
  const completed = (state.completed || []).length;
  const opened = (state.openedBoosters || []).length;
  const shouldHaveAtLeast = Math.max(0, solvedNonFinal + completed - opened);
  const current = Number(state.miniBoosters || 0) + Number(state.boosters || 0);
  if (current < shouldHaveAtLeast) state.miniBoosters = Number(state.miniBoosters || 0) + (shouldHaveAtLeast - current);
  saveState(state);
  updateBoosterBadge();
  renderBoosters();
};


window.adminCompleteDoor = function(ticketId) {
  const state = loadState();
  const ticket = tickets.find(t => t.id === ticketId);
  if (!ticket) return;
  if (!state.unlocked.includes(ticketId)) state.unlocked.push(ticketId);
  state.answers[ticketId] = (ticket.riddles || []).map((_, i) => i);
  if (!state.completed.includes(ticketId)) state.completed.push(ticketId);
  awardBadges(state);
  saveState(state);
  renderMemories(); renderProgression(); updateBoosterBadge();
};

window.adminResetDoor = function(ticketId) {
  resetTicket(ticketId);
  renderMemories(); renderProgression(); updateBoosterBadge();
};

window.adminToggleBadge = function(badgeId) {
  const state = loadState();
  state.badges = state.badges || [];
  if (state.badges.includes(badgeId)) state.badges = state.badges.filter(id => id !== badgeId);
  else state.badges.push(badgeId);
  saveState(state);
  renderProgression();
};

window.adminGiveCard = function() {
  const state = loadState();
  const card = weightedRandomCard();
  state.collection.push(card.id);
  awardBadges(state);
  saveState(state);
  renderCollection(); renderProgression();
};

window.adminResetCollection = function() {
  const state = loadState();
  state.collection = [];
  state.openedBoosters = [];
  saveState(state);
  renderCollection(); renderProgression();
};

function ensureAdminPanel() {
  if (document.getElementById('dynamicAdminPanel')) return;
  const panel = document.createElement('section');
  panel.id = 'dynamicAdminPanel';
  panel.className = 'admin-floating';
  panel.innerHTML = `
    <strong>Admin test</strong>
    <div class="admin-floating-grid">
      <button id="unlockAllDoorsBtn">Débloquer toutes les portes</button>
      <button id="lockAllDoorsBtn">Verrouiller toutes les portes</button>
      <button id="resetAllProgressBtn">Tout réinitialiser</button>
      <button id="addMiniBoosterBtn">+1 mini booster</button>
      <button id="addBoosterBtn">+1 grand booster</button>
      <button id="addFiveBoostersBtn">+5 boosters</button>
      <button id="repairBoostersBtn">Réparer boosters</button>
      <button onclick="adminGiveCard()">+1 carte aléatoire</button>
      <button onclick="adminResetCollection()">Reset collection</button>
      <button onclick="resetWelcomePopup()">✨ Revoir le message d’accueil</button>
    </div>
    <p class="admin-note">Portes : ouvrir / terminer / réinitialiser</p>
    <div class="admin-door-grid">
      ${tickets.map(t => `<div class="admin-door-tools"><strong>Porte ${t.id}</strong><button onclick="adminUnlockDoor(${t.id})">Ouvrir</button><button onclick="adminCompleteDoor(${t.id})">Terminer</button><button onclick="adminResetDoor(${t.id})">Reset</button></div>`).join('')}
    </div>
    <p class="admin-note">Badges : cliquer pour ajouter / retirer</p>
    <div class="admin-badge-grid">
      ${BADGE_DEFINITIONS.map(b => `<button onclick="adminToggleBadge('${b.id}')">${b.icon} ${b.title}</button>`).join('')}
    </div>`;
  document.body.appendChild(panel);
  document.getElementById('unlockAllDoorsBtn')?.addEventListener('click', () => {
    const state = loadState();
    state.unlocked = tickets.map(t => t.id);
    state.lastUnlockMonth = null;
    saveState(state);
    renderMemories();
    alert('Toutes les portes sont débloquées pour test.');
  });
  document.getElementById('lockAllDoorsBtn')?.addEventListener('click', () => {
    const state = loadState();
    state.unlocked = [];
    state.lastUnlockMonth = null;
    saveState(state);
    renderMemories();
    showView('code');
    alert('Toutes les portes sont verrouillées.');
  });
  document.getElementById('resetAllProgressBtn')?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
  document.getElementById('addMiniBoosterBtn')?.addEventListener('click', () => { adminAddMiniBooster(); alert('Un mini booster a été ajouté.'); });
  document.getElementById('addBoosterBtn')?.addEventListener('click', () => { adminAddBooster(); alert('Un grand booster a été ajouté.'); });
  document.getElementById('addFiveBoostersBtn')?.addEventListener('click', () => { adminAddBoosters(5); alert('Cinq boosters ont été ajoutés.'); });
  document.getElementById('repairBoostersBtn')?.addEventListener('click', () => { adminRepairBoosters(); alert('Boosters réparés selon les portes terminées.'); });
}
window.adminUnlockDoor = function(ticketId) {
  unlockForTest(ticketId);
  const ticket = tickets.find(t => t.id === ticketId);
  if (ticket) { renderRoom(ticket); showView('room'); }
};



function showSimpleToast(message) {
  let overlay = document.getElementById('simpleRewardOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'simpleRewardOverlay';
    overlay.className = 'booster-reward-overlay';
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `<div class="booster-reward-modal"><div class="reward-icon">✦</div><h3>Secret trouvé</h3><p>${message}</p><div class="reward-actions"><button class="primary" onclick="document.getElementById('simpleRewardOverlay').classList.remove('show')">Continuer</button></div></div>`;
  overlay.classList.remove('show');
  void overlay.offsetWidth;
  overlay.classList.add('show');
}

function renderCodeRecap() {
  const el = document.getElementById('codeRecap');
  if (!el) return;
  const state = loadState();
  const rows = tickets.filter(t => t.id <= 11).map(t => {
    const open = (state.unlocked || []).includes(t.id);
    return `<tr class="${open ? 'open' : 'locked'}"><td>${open ? '✓' : '🔒'}</td><td>${open ? t.title : 'Porte inconnue'}</td><td>${open ? t.code : '••••••••'}</td></tr>`;
  }).join('');
  el.innerHTML = `<h3>Récapitulatif des clés découvertes</h3><p>Les portes encore verrouillées restent masquées pour ne pas dévoiler les prochains secrets.</p><table class="code-table"><thead><tr><th></th><th>Porte</th><th>Code</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function scrollToPendingReveal() {
  if (!pendingRevealTicketId) return;
  const reveal = document.querySelector('#room .reveal-card, #room .secret-message-card');
  pendingRevealTicketId = null;
  if (reveal && document.getElementById('room')?.classList.contains('active')) {
    setTimeout(() => reveal.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
  }
}

window.scrollToTop = function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.claimBadgeReward = function(badgeId) {
  const state = loadState();
  if (!(state.badges || []).includes(badgeId)) return;
  state.claimedBadgeRewards = state.claimedBadgeRewards || [];
  if (state.claimedBadgeRewards.includes(badgeId)) return;
  state.claimedBadgeRewards.push(badgeId);
  state.boosters = Number(state.boosters || 0) + 1;
  const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
  logEvent(state, 'Récompense de badge récupérée', `${badge ? badge.title : 'Badge'} — grand booster ajouté.`, 'badge');
  saveState(state);
  renderProgression();
  updateBoosterBadge();
  showBoosterToast('Récompense du badge récupérée : tu as gagné un grand booster.', 'big');
};

function renderFinalRoom() {
  const el = document.getElementById('finalRoomContent');
  if (!el) return;
  const state = loadState();
  awardBadges(state);
  saveState(state);
  const allEarned = BADGE_DEFINITIONS.every(b => (state.badges || []).includes(b.id));
  const list = BADGE_DEFINITIONS.map(b => {
    const earned = (state.badges || []).includes(b.id);
    return `<li class="${earned ? 'done' : 'missing'}"><span>${earned ? '✓' : '🔒'}</span><strong>${b.title}</strong><small>${earned ? b.text : b.objective}</small></li>`;
  }).join('');
  el.innerHTML = allEarned ? `
    <div class="final-room-open"><div class="stamp">OUVERT</div><h3>La dernière salle est prête.</h3><p>Tu as complété tous les objectifs du Bal. Cette zone accueillera le message final, la lettre, la vidéo ou la surprise de fin.</p><p class="secret-signature">Le Dernier Masque peut maintenant tomber.</p></div>
    <ul class="final-badge-list">${list}</ul>` : `
    <div class="final-room-locked"><div class="final-lock">🎭</div><h3>La dernière salle est encore scellée.</h3><p>Pour l’ouvrir, il faut obtenir tous les badges du Bal.</p></div>
    <ul class="final-badge-list">${list}</ul>`;
}

function setupHiddenLogos() {
  if (document.querySelector('.secret-logo')) return;
  const spots = [
    { id: 'home', view: 'home', top: '22%', left: '7%' },
    { id: 'rules', view: 'rules', top: '14%', right: '8%' },
    { id: 'doors', view: 'doors', bottom: '18%', left: '5%' },
    { id: 'collection', view: 'collection', top: '18%', right: '5%' },
    { id: 'progression', view: 'progression', bottom: '14%', right: '8%' }
  ];
  spots.forEach(spot => {
    const btn = document.createElement('button');
    btn.className = 'secret-logo';
    btn.dataset.logoId = spot.id;
    btn.dataset.view = spot.view;
    btn.title = 'Logo caché';
    btn.textContent = '✦';
    Object.entries(spot).forEach(([k,v]) => { if (!['id','view'].includes(k)) btn.style[k] = v; });
    btn.addEventListener('click', () => collectSecretLogo(spot.id));
    document.body.appendChild(btn);
  });
  updateHiddenLogos();
}

function updateHiddenLogos() {
  const state = loadState();
  document.querySelectorAll('.secret-logo').forEach(btn => {
    const found = (state.secretLogos || []).includes(btn.dataset.logoId);
    const active = document.body.dataset.currentView === btn.dataset.view;
    btn.classList.toggle('found', found);
    btn.classList.toggle('visible-for-view', active && !found);
  });
}

function collectSecretLogo(id) {
  const state = loadState();
  state.secretLogos = state.secretLogos || [];
  if (!state.secretLogos.includes(id)) {
    state.secretLogos.push(id);
    const before = [...(state.badges || [])];
    const badges = awardBadges(state);
    logEvent(state, 'Logo caché trouvé', `${state.secretLogos.length}/5 logos retrouvés.`, 'riddle');
    saveState(state);
    updateHiddenLogos();
    renderProgression();
    showSimpleToast(`Logo caché trouvé : ${state.secretLogos.length}/5.<br>${badges.length ? 'Un nouveau badge est disponible dans Progression.' : ''}`);
  }
}

function setupAdmin() {
  const params = new URLSearchParams(window.location.search);
  const enabled = params.get('admin') === '1';
  if (!enabled) return;
  document.body.classList.add('admin-enabled');
  ensureAdminPanel();

  document.getElementById('resetRefugeBtn')?.addEventListener('click', () => {
    resetTicket(1);
    alert('Le Refuge Doré a été réinitialisé.');
    renderMemories();
    showView('code');
  });

  document.getElementById('resetAllBtn')?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    alert('Toute la progression a été réinitialisée.');
    location.reload();
  });

  document.getElementById('unlockRefugeBtn')?.addEventListener('click', () => {
    unlockForTest(1);
    alert('Le Refuge Doré est débloqué pour test.');
    renderRoom(tickets[0]);
    showView('room');
  });

  document.getElementById('resetMonthBtn')?.addEventListener('click', () => {
    const state = loadState();
    state.lastUnlockMonth = null;
    saveState(state);
    alert('Tu peux tester un nouveau code ce mois-ci.');
  });
}

setupAdmin();


/* V10 — Décor esthétique sans confettis permanents */
function setupMasqueradeDecor() {
  if (!document.querySelector('.masquerade-watermark')) {
    const mask = document.createElement('div');
    mask.className = 'masquerade-watermark';
    mask.setAttribute('aria-hidden', 'true');
    document.body.appendChild(mask);
  }
}

function triggerLocalGoldBurst(ticketId, index) {
  const step = document.getElementById(`room-step-${ticketId}-${index}`);
  if (!step) return;
  const burst = document.createElement('div');
  burst.className = 'local-gold-burst';
  for (let i = 0; i < 24; i++) {
    const piece = document.createElement('span');
    piece.style.setProperty('--x', `${8 + Math.random() * 84}%`);
    piece.style.setProperty('--delay', `${Math.random() * 130}ms`);
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 70}px`);
    burst.appendChild(piece);
  }
  step.appendChild(burst);
  setTimeout(() => burst.remove(), 1100);
}

function triggerGoldBurst() {
  const burst = document.createElement('div');
  burst.className = 'gold-burst';
  burst.setAttribute('aria-hidden', 'true');

  for (let i = 0; i < 34; i++) {
    const piece = document.createElement('span');
    piece.style.setProperty('--x', `${Math.random() * 100}%`);
    piece.style.setProperty('--delay', `${Math.random() * 120}ms`);
    piece.style.setProperty('--rot', `${Math.random() * 360}deg`);
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 90}px`);
    burst.appendChild(piece);
  }

  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 1100);
}

document.body.dataset.currentView = document.querySelector('.view.active')?.id || 'home';
setupMasqueradeDecor();
setupHiddenLogos();
updateBoosterBadge();

function createAmbientParticles(){
  if(window.innerWidth <= 768) return;
  const layer = document.createElement('div');
  layer.className = 'gold-particles';
  layer.setAttribute('aria-hidden','true');

  for(let i=0;i<16;i++){
    const p = document.createElement('span');
    p.style.setProperty('--left', `${Math.random()*100}%`);
    p.style.setProperty('--delay', `${Math.random()*-18}s`);
    p.style.setProperty('--duration', `${14 + Math.random()*10}s`);
    p.style.setProperty('--drift', `${(Math.random()-.5)*80}px`);
    layer.appendChild(p);
  }
  document.body.prepend(layer);
}

createAmbientParticles();

function resetWelcomePopup() {
  // clés utilisées selon les versions du projet
  [
    'welcomeSeen',
    'introSeen',
    'hasSeenIntro',
    'arrivalPopupSeen',
    'onboardingSeen'
  ].forEach(k => localStorage.removeItem(k));

  // si le message d'accueil dépend d'un état vide, on ne touche pas à la progression
  sessionStorage.clear();

  alert("Le message d'accueil sera réaffiché au prochain chargement s'il utilise l'une de ces clés.");
  location.reload();
}
