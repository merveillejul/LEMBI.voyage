/**
 * script.js — LEMBI
 * Gestion : mode sombre, météo, formulaire, durée séjour, menu mobile, newsletter
 */

// ─── Mode sombre / clair ───────────────────────────────────────────────────

function toggleMode() {
  const body = document.body;
  const boutons = document.querySelectorAll('.toggle-mode-btn');

  if (body.classList.contains('dark-mode')) {
    /* Passage en mode clair */
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    localStorage.setItem('mode', 'light');
    boutons.forEach(btn => btn.textContent = 'Mode sombre');
  } else {
    /* Passage en mode sombre */
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    localStorage.setItem('mode', 'dark');
    boutons.forEach(btn => btn.textContent = 'Mode clair');
  }
}

/* Applique le mode sauvegardé au chargement de la page */
function appliquerModeSauvegarde() {
  const mode = localStorage.getItem('mode');
  const boutons = document.querySelectorAll('.toggle-mode-btn');

  if (mode === 'dark') {
    document.body.classList.add('dark-mode');
    boutons.forEach(btn => btn.textContent = 'Mode clair');
  } else {
    document.body.classList.add('light-mode');
    boutons.forEach(btn => btn.textContent = 'Mode sombre');
  }
}

// ─── Météo via OpenWeatherMap ──────────────────────────────────────────────
/* IMPORTANT : remplace YOUR_API_KEY par ta vraie clé sur openweathermap.org
   Inscription gratuite sur : https://openweathermap.org/api           */

const API_KEY = 'YOUR_API_KEY';

function getMeteo(inputId, resultId) {
  /* Récupère les éléments selon les IDs passés en paramètre
     Cela règle le bug des IDs dupliqués sur la page galerie */
  const input  = document.getElementById(inputId);
  const result = document.getElementById(resultId);

  if (!input || !result) return;

  const ville = input.value.trim();

  if (!ville) {
    result.textContent = 'Veuillez entrer une ville.';
    return;
  }

  result.textContent = 'Chargement...';

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ville)}&units=metric&lang=fr&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (data.cod !== 200) {
        result.textContent = 'Ville introuvable, réessayez.';
        return;
      }
      const temp = Math.round(data.main.temp);
      const desc = data.weather[0].description;
      const icon = data.weather[0].icon;
      result.innerHTML = `<img src="https://openweathermap.org/img/wn/${icon}.png" alt="${desc}" style="vertical-align:middle"> ${temp}°C — ${desc}`;
    })
    .catch(() => {
      result.textContent = 'Erreur de connexion, réessayez.';
    });
}

// ─── Astuce de voyage aléatoire ────────────────────────────────────────────

function afficherAstuce() {
  const astuces = [
    "Réservez vos billets 2 à 3 mois à l'avance pour les meilleurs tarifs.",
    "Emportez toujours une copie numérique de vos documents de voyage.",
    "Pensez à boire beaucoup d'eau en avion pour éviter la déshydratation.",
    "Apprenez quelques mots de la langue locale, ça change tout !",
    "Sauvegardez vos photos sur le cloud régulièrement pendant le voyage.",
    "Souscrivez toujours une assurance voyage avant de partir.",
    "Prévenez votre banque avant de partir à l'étranger."
  ];

  const zone = document.getElementById('astuce');
  if (!zone) return;

  const index = Math.floor(Math.random() * astuces.length);
  zone.textContent = astuces[index];
  zone.style.padding = '12px 20px';
  zone.style.marginTop = '10px';
  zone.style.background = '#e8f4fd';
  zone.style.borderLeft = '4px solid #00a8e8';
  zone.style.borderRadius = '6px';
  zone.style.color = '#182C64';
  zone.style.fontWeight = '600';
}

// ─── Calcul automatique de la durée du séjour ─────────────────────────────

function mettreAJourDuree() {
  const departInput = document.getElementById('depart');
  const retourInput = document.getElementById('retour');
  const zoneDuree   = document.getElementById('duree');

  if (!departInput || !retourInput || !zoneDuree) return;

  const depart = new Date(departInput.value);
  const retour = new Date(retourInput.value);

  if (departInput.value && retourInput.value) {
    if (retour > depart) {
      /* Calcule le nombre de jours entre les deux dates */
      const nbJours = Math.ceil((retour - depart) / (1000 * 60 * 60 * 24));
      zoneDuree.textContent = `Durée du séjour : ${nbJours} jour(s)`;
      zoneDuree.style.color = 'green';
    } else {
      zoneDuree.textContent = 'La date de retour doit être après la date de départ.';
      zoneDuree.style.color = 'red';
    }
  } else {
    zoneDuree.textContent = '';
  }
}

// ─── Validation du formulaire de contact ──────────────────────────────────

function verifierFormulaire(event) {
  const nom    = document.querySelector('input[name="name"]');
  const prenom = document.querySelector('input[name="prenom"]');
  const email  = document.querySelector('input[name="email"]');
  const depart = document.getElementById('depart');
  const retour = document.getElementById('retour');

  /* Regex : lettres uniquement (accents inclus), tirets et apostrophes */
  const regexNom = /^[A-Za-zÀ-ÿ\s\-']+$/;
  const erreurs  = [];

  /* Vérifie les champs obligatoires */
  if (!nom.value.trim() || !prenom.value.trim() || !email.value.trim()) {
    erreurs.push('Veuillez remplir tous les champs obligatoires (nom, prénom, email).');
  }

  /* Vérifie le format du nom */
  if (nom.value.trim() && !regexNom.test(nom.value.trim())) {
    erreurs.push('Le nom ne doit contenir que des lettres.');
  }

  /* Vérifie le format du prénom */
  if (prenom.value.trim() && !regexNom.test(prenom.value.trim())) {
    erreurs.push('Le prénom ne doit contenir que des lettres.');
  }

  /* Vérifie la cohérence des dates si renseignées */
  if (depart && retour && depart.value && retour.value) {
    if (new Date(retour.value) <= new Date(depart.value)) {
      erreurs.push('La date de retour doit être postérieure à la date de départ.');
    }
  }

  /* Bloque la soumission si erreurs */
  if (erreurs.length > 0) {
    event.preventDefault();
    alert(erreurs.join('\n'));
  }
}

// ─── Menu hamburger mobile ─────────────────────────────────────────────────

function initMenuMobile() {
  const bouton = document.querySelector('.menu-navi');
  const nav    = document.querySelector('#topmen');

  if (!bouton || !nav) return;

  bouton.addEventListener('click', () => {
    /* Bascule la classe open sur le menu */
    nav.classList.toggle('open');
    /* Change l'icône selon l'état */
    bouton.textContent = nav.classList.contains('open') ? '✕' : '☰';
  });
}

// ─── Newsletter ────────────────────────────────────────────────────────────

function initNewsletter() {
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const msg   = form.querySelector('.newsletter-msg');

      if (input && msg) {
        msg.textContent = 'Merci, vous êtes bien inscrit(e) !';
        msg.style.color = 'green';
        msg.style.display = 'block';
        input.value = '';
        setTimeout(() => { msg.style.display = 'none'; }, 4000);
      }
    });
  });
}

// ─── Init au chargement ────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {

  /* Mode sombre */
  appliquerModeSauvegarde();

  /* Menu mobile */
  initMenuMobile();

  /* Newsletter */
  initNewsletter();

  /* Durée séjour */
  const departInput = document.getElementById('depart');
  const retourInput = document.getElementById('retour');
  if (departInput) departInput.addEventListener('change', mettreAJourDuree);
  if (retourInput) retourInput.addEventListener('change', mettreAJourDuree);

  /* Validation formulaire contact */
  const formulaire = document.querySelector('form[action="reponse.html"]');
  if (formulaire) formulaire.addEventListener('submit', verifierFormulaire);

});