/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'peter-bar',
    /* nessun WhatsApp confermato dalla scheda Google: il cellulare della scheda */
    whatsapp: { number: '', message: '', ids: [] },
    /* pannello Google (30/9/2026): lun–ven 6:30–19, sab 8–17, dom chiuso */
    hours: {
      0: [], 1: [['06:30', '19:00']], 2: [['06:30', '19:00']], 3: [['06:30', '19:00']],
      4: [['06:30', '19:00']], 5: [['06:30', '19:00']], 6: [['08:00', '17:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1060,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Peter Bar: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.lavagna": "The board",
      "n.orari": "Hours",
      "n.vetrina": "The counter",
      "n.dicono": "Reviews",
      "n.dove": "Where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.sopra": "Bar · Via Larga 31, between Missori and the Duomo",
      "h.titolo": "Coffee with cream is the rule.",
      "h.testo": "From 6:30 in the morning: breakfast at the counter, the sandwiches and piadine on the board, first and second courses that change every day, the aperitivo.",
      "h.chi": "Vittoria Arnold, in a review on Google (in Italian: «The bar of the old days. In style and in the way they treat customers.»)",
      "h.google": "on Google, 315 reviews",
      "p.titolo": "The rule",
      "p.desc": "Under the group head of the machine the portafilter pours and the coffee rises in the cup; a spoon of whipped cream arrives, tilts, and the cream drops and settles on the coffee; the spoon goes to rest on the saucer and last the pink stamp «Caffè & Panna da Peter Bar» is printed. Three ways: coffee with cream, the marocchino in its little glass, the macchiato.",
      "p.d0": "Coffee with cream: the pour, then a spoon of whipped cream. Here it is the rule.",
      "p.d1": "The marocchino in its little glass: cocoa, coffee, milk foam and more cocoa.",
      "p.d2": "The macchiato, with its spot of foam: «macchiatissimo! Sempre!» (always very macchiato!), they used to write.",
      "p.modi": "Which coffee",
      "p.b0": "With cream",
      "p.b1": "Marocchino",
      "p.b2": "Macchiato",
      "p.nota": "The pink stamp is theirs: «Caffè & Panna da Peter Bar», on the photos they used to post.",
      "l.etichetta": "The board",
      "l.titolo": "Everything on the board",
      "l.sotto": "The bar's black board, copied out: coffee, drinks, aperitivi, and the piadine and sandwiches with their numbers. You will find the prices on the board, at the counter.",
      "l.caffetteria": "Coffee bar",
      "l.bibite": "Drinks",
      "l.aperitivi": "Aperitivi",
      "l.abbonamenti": "Coffee cards",
      "l.c1": "Espresso and americano",
      "l.c2": "Decaf and barley coffee",
      "l.c3": "Ginseng coffee, in a large cup",
      "l.c4": "Marocchino",
      "l.c5": "Coffee with whipped cream",
      "l.c6": "Latte macchiato",
      "l.c7": "Tea and chamomile",
      "l.c8": "A glass of milk",
      "l.c9": "Iced and shaken coffee",
      "l.c10": "Cappuccino, soy too",
      "l.c11": "Hot chocolate, with cream too",
      "l.c12": "Plain and filled brioches",
      "l.c13": "Mignon pastries and shortcrust biscuits",
      "l.c14": "Aragostelle and cream horns",
      "l.b1": "Soft drinks in cans and bottles",
      "l.b2": "Freshly squeezed juice",
      "l.b3": "Fruit juices",
      "l.b4": "Mixed fruit smoothie",
      "l.b5": "Draught beer, small or medium",
      "l.b6": "Bottled beer",
      "l.b7": "Mineral water",
      "l.a1": "10 coffees, with a brioche too",
      "l.a2": "10 cappuccinos, with a brioche too",
      "l.p1": "Spritz",
      "l.p2": "Cocktails",
      "l.p3": "Bitter and soda, alcohol-free aperitivi",
      "l.p4": "Prosecco",
      "l.p5": "A glass of wine, white or red",
      "l.p6": "Amaro and whisky",
      "l.piadine": "Piadine",
      "l.panini": "Sandwiches",
      "l.pi1": "Raw ham, tomato and mozzarella",
      "l.pi2": "Raw ham, robiola and rocket",
      "l.pi3": "Raw ham and mozzarella",
      "l.pi4": "Cooked ham, brie, courgettes and mushrooms",
      "l.pi5": "Cooked ham, tomato and mozzarella",
      "l.pi6": "Cooked ham and mozzarella",
      "l.pi7": "Speck, brie and mushrooms",
      "l.pi8": "Roast beef, rocket and grana",
      "l.pi9": "Salame, robiola and artichokes",
      "l.pi10": "Bresaola, rocket and grana",
      "l.pi11": "Turkey, mozzarella, tomato and lettuce",
      "l.pi12": "Praga ham, brie, tomato and rocket",
      "l.pi13": "Salame, brie and mushrooms",
      "l.pi14": "Spicy salame, sun-dried tomatoes and rocket",
      "l.pi15": "Mozzarella, tomato, tuna and rocket",
      "l.pi16": "Tomato, robiola, courgettes and rocket",
      "l.pa1": "Courgettes, aubergines, tomato, mozzarella and rocket",
      "l.pa2": "Raw ham, brie, tomato and rocket",
      "l.pa3": "Raw ham, mozzarella and sun-dried tomatoes",
      "l.pa4": "Raw ham and mozzarella",
      "l.pa5": "Cooked ham, fontina and mushrooms",
      "l.pa6": "Cooked ham, tomato, mozzarella and rocket",
      "l.pa7": "Cooked ham and mozzarella",
      "l.pa8": "Salame, robiola and artichokes",
      "l.pa9": "Spicy salame, scamorza and rocket",
      "l.pa10": "Speck, robiola and tomato",
      "l.pa11": "Speck, mushrooms and scamorza",
      "l.pa12": "Pancetta, scamorza and courgettes",
      "l.pa13": "Praga ham, fontina, sun-dried tomatoes and rocket",
      "l.pa14": "Turkey, robiola, courgettes and lettuce",
      "l.pa15": "Mortadella, brie and artichokes",
      "l.loro": "«Can't find the sandwich or the piadina you like? Make it yourself with the ingredients you prefer.»",
      "l.chi": "— from their flyer (in Italian)",
      "l.nota": "From the photo of the board that the bar posted on Google. We have left out the brands of the drinks and aperitivi.",
      "o.etichetta": "Hours",
      "o.titolo": "From 6:30, before the offices",
      "o.cap": "Opening hours",
      "o.chiuso": "closed",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.t1": "Breakfast",
      "o.p1": "At the counter from 6:30, on Saturday from 8: coffee, with cream too, cappuccino, soy too, plain and filled brioches, mignon pastries, shortcrust biscuits, aragostelle.",
      "o.t2": "Lunch",
      "o.p2": "The sandwiches and piadine on the board, made the way you like them too; focaccia, tramezzini, salads, and first and second courses that change every day: they will tell you today's at the counter.",
      "o.t3": "Aperitivo",
      "o.p3": "A spritz, a glass of wine, a draught beer before heading home. There are small tables outside, on the pavement of Via Larga.",
      "o.nota": "Hours from their Google listing (September 2026).",
      "v.etichetta": "The counter",
      "v.titolo": "In the counter display",
      "v.sotto": "The cream wood with the red lines and the granite, the pink «Bar» neon on the window, and what goes across the counter.",
      "a.banco": "The counter in cream lacquered wood with red lines, the granite top and the display case with croissants.",
      "k.banco": "The counter, today.",
      "a.insegna": "The front at Via Larga 31: the pink «Bar» neon in the window, below it the burgundy «Peter Bar» sign and the awning.",
      "k.insegna": "The neon and the sign, at Via Larga 31.",
      "a.panna": "The cup on the granite with a spoonful of whipped cream on the coffee, the teaspoon on the saucer and the pink stamp «Caffè & Panna da Peter Bar».",
      "k.panna": "Coffee with cream, with their stamp.",
      "a.macchina": "The coffee machine: the chrome group heads, the steam wand, the grate and two cups.",
      "k.macchina": "The machine.",
      "a.cappuccino": "A cappuccino with a milk-foam leaf, on the granite.",
      "k.cappuccino": "The cappuccino.",
      "a.curcuma": "A yellow turmeric bun with roast beef, grilled courgettes and tomato, held in a hand.",
      "k.curcuma": "The turmeric sandwich with roast beef.",
      "a.panino": "A long sandwich with raw ham, mozzarella and tomato, in its paper.",
      "k.panino": "Raw ham, mozzarella and tomato.",
      "a.piadina": "A folded wholemeal piadina with raw ham, rocket and sauce.",
      "k.piadina": "The Super Piadina.",
      "a.aragostelle": "Aragostelle, golden and layered.",
      "k.aragostelle": "Aragostelle.",
      "a.frutta": "Baskets of fruit on the counter: pineapples, kiwis, bananas, oranges, in front of the yellow shelves with red lines.",
      "k.frutta": "The fruit, for juices and smoothies.",
      "v.nota": "The counter, the sign and the sandwiches are photos by customers on Google; the others come from the bar's Facebook Page.",
      "d.etichetta": "Reviews",
      "d.titolo": "People who drop by every day",
      "d.google": "on Google, 315 reviews",
      "d.g4a": "Google, 4 years ago",
      "d.g3a": "Google, 3 years ago",
      "d.g1m": "Google, 1 month ago",
      "d.nota": "From the reviews on Google, in Italian, as they were written. The line at the top also comes from a review on Google.",
      "d.tutte": "All the reviews on Google",
      "w.etichetta": "Where",
      "w.titolo": "Between Missori and the Duomo",
      "w.mappa": "Map: Peter Bar, Via Larga 31, Milan",
      "w.dove": "Where",
      "w.dovev": "Via Larga 31, 20122 Milan, between Missori and the Duomo",
      "w.metro": "By metro",
      "w.metrov": "M3 Missori, about 200 metres away; M4 Sforza-Policlinico, about 300; M1 and M3 Duomo, about 450",
      "w.tram": "By tram",
      "w.tramv": "12, 19 and 24, Via Larga stop; 15 and 16 at Missori",
      "w.bus": "By bus",
      "w.busv": "60 and 61, Via Larga stop",
      "w.tel": "Phone",
      "q.etichetta": "Questions",
      "q.titolo": "Before you drop by",
      "q.1": "What time do you open?",
      "q.1r": "At 6:30 from Monday to Friday, until 7 pm; on Saturday from 8 am to 5 pm. Closed on Sunday.",
      "q.2": "Can I make up my own sandwich?",
      "q.2r": "Yes: besides the numbered sandwiches and piadine on the board, you can make them up with the ingredients you prefer. Ask at the counter.",
      "q.3": "What is there for lunch?",
      "q.3r": "The sandwiches and piadine on the board, focaccia, tramezzini, salads, and first and second courses that change every day: they will tell you today's at the counter.",
      "q.4": "Do you do aperitivo?",
      "q.4r": "Yes: on the board there are spritz, cocktails, prosecco, draught beer and white or red wine by the glass.",
      "q.5": "Are there coffee cards?",
      "q.5r": "Yes, on the board: 10 coffees or 10 cappuccinos, with a brioche too.",
      "q.6": "Can I sit down?",
      "q.6r": "There are small tables outside, on the pavement of Via Larga; inside, the bar is long and narrow, with the counter.",
      "f2.orario": "Monday–Friday 6:30 am–7 pm · Saturday 8 am–5 pm",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · hours, rating and reviews from their Google listing (September 2026); the board from the photo the bar posted on Google; their words and the photos of the machine, the coffee with cream, the cappuccino, the piadina, the aragostelle and the fruit from their Facebook Page; the counter, the sign and the sandwiches from customers' photos on Google. We drew the cup ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ PETER BAR — Via Larga 31 ══════════
     la FIRMA — «la regola»: sotto il gruppo della macchina la colata, il caffè che sale; il cucchiaio di panna arriva, si inclina,
     la panna cade e si posa; il cucchiaino va sul piattino, per ultimo il timbro rosa. Lo stato è M (con panna, marocchino, macchiato),
     T (0…1) e V (0 al suo posto; fino a 1 la tazzina esce a destra; da −1 a 0 entra da sinistra la prossima). Senza JS e alla fine:
     con panna, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): la tazzina vuota. Reduced-motion: tutto subito. rAF a tempo,
     guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[640,400],"via":700,"fasi":{"colata":{"t":0.04,"d":0.36},"stop":{"t":0.38,"d":0.06},"arriva":{"t":0.44,"d":0.1},"versa":{"t":0.54,"d":0.08},"cade":{"t":0.6,"d":0.12},"schiaccia":{"t":0.72,"d":0.08},"posa":{"t":0.7,"d":0.14},"timbro":{"t":0.84,"d":0.16}},"beccucci":[[309,136],[331,136]],"punte":[317,323],"pose":{"fuori":[1420,150,0],"sopra":[338,160,0],"versa":[338,160,-42],"riposo":[272,304,13]},"partenza":[328,168],"modi":[{"nome":"Caffè con panna","livello":{"cx":320,"y0":234,"y1":217,"rx0":40,"rx1":50,"k":0.25862068965517243},"corpo":null,"cacao":false,"ancora":[316,222],"timbro":[512,250,-14]},{"nome":"Marocchino","livello":{"cx":320,"y0":274,"y1":240,"rx0":31.4,"rx1":34.4,"k":0.25},"corpo":{"ya":200,"yb":290,"hw0":38,"hw1":30,"fondo":276},"cacao":true,"ancora":[320,240],"timbro":[512,250,-14]},{"nome":"Macchiato","livello":{"cx":320,"y0":234,"y1":217,"rx0":40,"rx1":50,"k":0.25862068965517243},"corpo":null,"cacao":false,"ancora":[322,219],"timbro":[512,250,-14]}],"tempi":{"inizio":300,"panna":4800,"servi":420,"arriva":480,"pannaV":4000}};
  /* la regola a (M, T, V) — una sola fonte: la usano _ptr_firma.mjs (l'HTML allo stato finale), main.js (via ptr_main.cjs) e la
     prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     Sotto il gruppo della macchina: la colata dal portafiltro, il caffè che sale; il cucchiaio arriva col suo carico, si inclina e
     lo lascia cadere; il carico si posa (e si schiaccia un poco); il cucchiaino va a riposare sul piattino; per ultimo il timbro. */
  function creaPanna(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w.t + w.d - 1e-9 ? 1 : c01((t - w.t) / w.d); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var ellisse = function (cx, cy, rx, ry) {
      return 'M' + r1(cx - rx) + ' ' + r1(cy) + ' A' + r1(rx) + ' ' + r1(ry) + ' 0 1 0 ' + r1(cx + rx) + ' ' + r1(cy) +
        ' A' + r1(rx) + ' ' + r1(ry) + ' 0 1 0 ' + r1(cx - rx) + ' ' + r1(cy) + ' Z';
    };
    var servito = svg.querySelector('.servito');
    var P = D.modi.map(function (M, m) {
      var q = function (c) { return svg.querySelector('.' + c + '[data-m="' + m + '"]'); };
      return { colata: q('colata'), livello: q('livello'), corpo: M.corpo ? q('corpo') : null, cima: q('cima'), carico: q('carico'), cucchiaio: q('cucchiaio'),
        timbro: q('timbro'), cacao: M.cacao ? q('cacao') : null };
    });
    /* il livello del caffè (0…1 della colata): la superficie sale e si allarga verso il bordo */
    var liv = function (L, f) {
      return { y: L.y0 + (L.y1 - L.y0) * f, rx: L.rx0 + (L.rx1 - L.rx0) * f };
    };
    /* le pose del cucchiaio: [x, y, angolo] */
    var posa = function (a) { return 'translate(' + r1(a[0]) + ' ' + r1(a[1]) + ') rotate(' + r1(a[2]) + ')'; };
    var fra = function (a, b, e, su) { return [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e - (su || 0), a[2] + (b[2] - a[2]) * e]; };
    function disegna(m, t, v) {
      var M = D.modi[m], F = D.fasi, Q = D.pose, q = P[m], L = M.livello;
      /* la colata: i due fili scendono dai beccucci fino alla superficie, poi si staccano dall'alto e cadono */
      var pc = fase(t, F.colata), ps = fase(t, F.stop);
      var lv = liv(L, pc), fondo = lv.y;
      var giu = c01(pc / .12), su = dolce(ps);
      var filo = function (b, x1) {
        var y0 = b[1] + (fondo - b[1]) * su, y1 = b[1] + (fondo - b[1]) * giu;
        var x = function (y) { return b[0] + (x1 - b[0]) * (y - b[1]) / (fondo - b[1]); };
        return 'M' + r1(x(y0)) + ' ' + r1(y0) + ' L' + r1(x(y1)) + ' ' + r1(y1);
      };
      q.colata.setAttribute('d', filo(D.beccucci[0], D.punte[0]) + ' ' + filo(D.beccucci[1], D.punte[1]));
      q.colata.setAttribute('opacity', pc > 0 && ps < 1 ? '1' : '0');
      /* il caffè che sale */
      q.livello.setAttribute('d', ellisse(L.cx, lv.y, lv.rx, lv.rx * L.k));
      q.livello.setAttribute('opacity', pc > 0 ? '1' : '0');
      if (q.corpo) {
        var C = M.corpo, hw = function (y) { return C.hw0 + (C.hw1 - C.hw0) * (y - C.ya) / (C.yb - C.ya); };
        q.corpo.setAttribute('d', 'M' + r1(L.cx - hw(lv.y)) + ' ' + r1(lv.y) + ' L' + r1(L.cx + hw(lv.y)) + ' ' + r1(lv.y) + ' L' +
          r1(L.cx + hw(C.fondo)) + ' ' + C.fondo + ' L' + r1(L.cx - hw(C.fondo)) + ' ' + C.fondo + ' Z');
        q.corpo.setAttribute('opacity', pc > 0 ? '1' : '0');
      }
      /* il cucchiaio: arriva, si inclina, va a riposare sul piattino (con una piccola curva in su) */
      var pa = dolce(fase(t, F.arriva)), pv = dolce(fase(t, F.versa)), pp = fase(t, F.posa), ep = dolce(pp);
      var cu = pp > 0 ? fra(Q.versa, Q.riposo, ep, 26 * Math.sin(Math.PI * pp)) : pv > 0 ? fra(Q.sopra, Q.versa, pv) : fra(Q.fuori, Q.sopra, pa);
      q.cucchiaio.setAttribute('transform', posa(cu));
      /* il carico: nel cucchiaio finché non cade; poi cade (accelera), si allarga, si posa e si schiaccia un poco */
      var pk = fase(t, F.cade), pz = fase(t, F.schiaccia);
      q.carico.setAttribute('opacity', pk > 0 ? '0' : '1');
      var A = M.ancora, S = D.partenza, g = pk * pk;
      var x = S[0] + (A[0] - S[0]) * g, y = S[1] + (A[1] - S[1]) * g, s = .45 + .55 * dolce(pk);
      var sq = Math.sin(Math.PI * pz) * (1 - pz);
      q.cima.setAttribute('transform', 'translate(' + r1(x) + ' ' + r1(y) + ') scale(' + r3(s * (1 + .1 * sq)) + ' ' + r3(s * (1 - .2 * sq)) + ') translate(' + (-A[0]) + ' ' + (-A[1]) + ')');
      q.cima.setAttribute('opacity', pk > 0 ? '1' : '0');
      /* il timbro rosa: scende dall'alto, si imprime */
      var pt = fase(t, F.timbro), T = M.timbro;
      q.timbro.setAttribute('transform', 'translate(' + T[0] + ' ' + T[1] + ') rotate(' + T[2] + ') scale(' + r3(1.5 - .5 * dolce(pt)) + ')');
      q.timbro.setAttribute('opacity', String(r3(.92 * Math.min(1, pt / .35))));
      if (q.cacao) q.cacao.setAttribute('opacity', String(r3(pt)));
      /* col V la tazzina servita esce a destra; la prossima, vuota, entra da sinistra */
      servito.setAttribute('transform', 'translate(' + r1(D.via * v) + ' 0)');
    }
    var completo = !!servito && P.every(function (q, m) {
      return q.colata && q.livello && q.cima && q.carico && q.cucchiaio && q.timbro && (!D.modi[m].corpo || q.corpo) && (!D.modi[m].cacao || q.cacao);
    });
    return { disegna: disegna, pezzi: P, completo: completo };
  }


  /* la giornata: la linea di adesso sulla riga di oggi (scala dalle 6 alle 20) */
  function lineaOra() {
    var pista = document.querySelector('.giornata__riga.' + SITE.todayClass + ' .giornata__pista');
    var linea = document.querySelector('.giornata__ora');
    var d = new Date(), h = d.getHours() + d.getMinutes() / 60;
    if (!pista || h < 6 || h > 20) { if (linea && linea.parentNode) linea.parentNode.removeChild(linea); return; }
    if (!linea) { linea = document.createElement('span'); linea.className = 'giornata__ora'; linea.setAttribute('aria-hidden', 'true'); }
    linea.style.left = ((h - 6) / 14 * 100).toFixed(2) + '%';
    if (linea.parentNode !== pista) pista.appendChild(linea);
  }
  lineaOra();
  setInterval(lineaOra, 60000);
  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('panna-firma'), svgF = prendi('pannaSvg'), leggiF = prendi('pannaLeggi');
  var PANNA = svgF ? creaPanna(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.regola__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.regola__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    PANNA.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) PANNA.disegna(k, 1, 0); });
    PANNA.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta la tazzina vuota */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: la tazzina vuota */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.panna, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.panna });
  }
  /* il gesto: scegliere il caffè. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è, la tazzina
     servita esce a destra, entra da sinistra la prossima, vuota, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.pannaV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && PANNA && PANNA.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaPanna); } catch (e) {}
    window.__panna = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__panna.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta la tazzina vuota */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__panna.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
