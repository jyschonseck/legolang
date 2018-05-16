// JavaScript Document
var resultatTest = false;
var resultatProbleme = false;


function probleme() {
  resultatProbleme = true;
  }
window.onerror = probleme;

var monPopup = window.open("", "poptest", "width=1, height=1, left=5000, top=5000", true);
monPopup.blur();
monPopup.close();
resultatTest = (resultatProbleme === false ? true : false);
window.onerror = null;

//script trouvé sur http://www.journaldunet.com/developpeur/tutoriel/dht/041115-javascript-detecter-bloqueur-popup.shtml
