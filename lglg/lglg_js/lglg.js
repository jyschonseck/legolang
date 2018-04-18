// JavaScript Document
//**********************//
//**variable globales***//
var tblExo = {}; // le tableau contenant TOUTES les données de l'exo (ouverture directe du fichier .json)
var tblReponses = []; //le tableau contenant les réponses (a charger depuis scorm et/ou LS ?)
var posRedim = 50; // ratio en pourcentage entre colonne gauche et droite
var qCourante = 0; //
var pCourante = 0; // page de question à afficher
var champSaisie = {}; // le champ de saisie utilisé par fonction clavier
var lancement = true;
var modeAuteur = false;
var scorm = false; //valeur à true si on a du scorm : utilisé dans enregistrementReponses
var affichClavier = false; // variable pour affichage du clavier
var affichST = false; // mettre à true lors de affichExo si on affiche les ST pour extrait)

//**constante***********//
// si je déclare const si je lance plusieur fois lglg j'ai une erreur 'déja déclaré'
var IF_VALID = "Valider";
var AEValeurMax = 2; // Valeur max  pour l'AE (le 0 =pas repondu)


//***** pour debug ******//
var tempsDebut = new Date();

//**********************//
//** fonctions**********//



function afficheExo() {
  'use strict';
	console.log("afficheExo");
  if (tblExo.interface.couleur1) {
    useCustomColor(tblExo.interface.couleur1);
  }

  //*******************
  //** initialisation du tableau reponse :;
  tblReponsesReset();

  /* si on a lglgScorm dans sessionStorage on le charge et on l'efface...
  Sinon on regarde si on a du moduleId dans localStorage*/
  if (sessionStorage.scorm) {
    scorm = true; // pour enregistrement
    sessionStorage.removeItem("scorm");
    //on charge suspend_data dans tblReponse:
    if (SCOGetValue("cmi.suspend_data")) {
      tblReponses = jQuery.parseJSON(SCOGetValue("cmi.suspend_data"));
    }
  } else {
		// console.log("tblExo.moduleId = " + tblExo.moduleId + ", " + localStorage.getItem(tblExo.moduleId));
    if (tblExo.moduleId && localStorage.getItem(tblExo.moduleId)) {
      tblReponses = jQuery.parseJSON(localStorage.getItem(tblExo.moduleId));
				// console.log("on a des réponses en localStorage : \n" + JSON.stringify(tblReponses));
    }
  }

  //****element de base
  $("#txtTitre").html(tblExo.titre);
  $("#txtSousTitre").html(tblExo.sousTitre);

  //*** media
  if (tblExo.videoType === "0" || !tblExo.videoType) { // si on
    $("#ctnMedia").load("lglg/lglg_medias/html5.html");
  } else if (tblExo.videoType === "1") { //
    $("#ctnMedia").load("lglg/lglg_medias/html5.html");
  } else if (tblExo.videoType === "2") {
    $("#ctnMedia").load("lglg/lglg_medias/youtube.html");
  }

  //*** outils
  var ctnOutils = document.querySelector("#ctnOutils");
  for (var i = 0; i < 4; i++) {
    // si on a une fonction pour l'outil
    if (tblExo.btnOutil.liste[i].fonction !== "--") {
      // code HTML du bouton
      var btCode = '<a href="#" id="outil-' + tblExo.btnOutil.liste[i].fonction + '" title="' + tblExo.btnOutil.liste[i].etiquette + '"><img src="lglg/lglg_interface/images/outils/' + tblExo.btnOutil.liste[i].fonction + '.svg" alt="' + tblExo.btnOutil.liste[i].etiquette + '">'; //" width="100" height="100"
      if (tblExo.btnOutil.format != 1) { //on ajoute le titre sous le bouton
        btCode += '<span>' + tblExo.btnOutil.liste[i].etiquette + '</span>';
      }
      btCode += '</a>';
      // ajoute le bouton au conteneur d'outils
      $(btCode).appendTo(ctnOutils);
      // fonction du bouton au clic
      $('#outil-' + tblExo.btnOutil.liste[i].fonction).click(function(e) {
        e.preventDefault();
        window[this.id.substring(6)]();
      });
    }
    if (tblExo.btnOutil.liste[i].fonction === "sousTitrage1") {
      affichST = true;
    }
  }

  //****autoEvaluation
  if (tblExo.scenario.msgAE) {
    $("#ctnAEAffich").load("lglg/lglg_outils/AEAffich.html");
  }

  //*** col droite
  if (tblExo.pages.length > 1) {
    $("#ctnNavigation").load("lglg/lglg_interface/navigQ.html");
  }

  //*** onglets

  //*** popupConsigne
  if (tblExo.consigne) {
    $("#ctnConsigne").html(tblExo.consigne);
  }

  $("#ctnOutils").addClass("outilsInactif"); //class pour etre invisible quand on change les couleur du svg (sinon ça clignote ...
  $("#ctnOutils").hide(); // on hide en plus de la transparence pour l'organisation de la page...

  //**** affichage de la page de question courante ;
  affichPage();
}

function shadeColor(color, percent) {
  'use strict';
  var f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    //R = f >> 16,
		R = f >> 16,
    G = f >> 8 & 0x00FF,
    B = f & 0x0000FF;
  return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

// fonction qui crée une CSS customisée avec la couleur du back office
function useCustomColor(pColor) {
  'use strict';
  var newStyle = "#txtTitre, { color: " + pColor + " !important;} \n"; //.txtCorrection
  newStyle += "#ctnTitres, #ctnOnglets, textarea:focus, .ctnQuestion { border-color: " + pColor + " !important;} \n";
  newStyle += "#ctnOnglets > div.actif { background:" + shadeColor(pColor, 0.5) + " !important; border-color: " + shadeColor(pColor, 0.5) + " !important;}\n";
  newStyle += "#ctnOnglets > div.choisi { background: " + pColor + " !important; border-color: " + pColor + " !important;}\n";
  newStyle += ".navigActif:hover .st0 { fill: " + pColor + " !important;}";
  $('<style type="text/css"></style>')
    .html(newStyle)
    .appendTo("head");
}


function affichPage() {
	'use strict';
  /****vidage ctnQuestions****/
  while (ctnPageQ.firstChild) {
    ctnPageQ.removeChild(ctnPageQ.firstChild);
  }
  champSaisie = {}; //réinitialiser le dernier champ de qo cliqué

  //**ajput Titre page**/
  var titre = document.createElement("div");
  titre.className = "txtTitrePage";
  titre.innerHTML = tblExo.pages[pCourante].titre;
  ctnPageQ.appendChild(titre);
  //$("#txtTitrePage").html(tblExo.pages[ pCourante].titre);

  var ctnQ = document.createElement("div");
  ctnQ.id = "ctnQuestions";

  ctnPageQ.appendChild(ctnQ);

  for (var i = 0; i < tblExo.pages[pCourante].questions.length; i++) {
    var nouvQuestion = document.createElement("div");
    nouvQuestion.className = "ctnQuestion";
    nouvQuestion.id = "ctnQuestion_" + i;
    ctnQ.appendChild(nouvQuestion);
    //
    if (tblExo.pages[pCourante].questions[i].type === "qo") {
      creationQO(i);
    } else if (tblExo.pages[pCourante].questions[i].type === "qtrous") {
      creationQTROUS(i);
    } else if (tblExo.pages[pCourante].questions[i].type === "qcm") {
      creationQCM(i);
    }
  }
  ///***** gestion des onglets
  if (tblReponses[pCourante].valid && tblExo.scenario.verrCorr === "1") { //Déja validé ET verrouille -> on passe à 3
    $("#nav_3").addClass("actif");
    //$("#nav_3").addClass("choisi");
    $("#nav_2").removeClass("actif");
    $("#nav_2").removeClass("choisi");
    validation(); //pour afficher les fb correctement
  } else {
    $("#nav_2").addClass("actif"); // donc
    if (!$("#nav_1").hasClass("choisi")) {
      ongletsAffich(2); //on revient sur onglet2 (cas ou  on a pas encore validé
      edition(); // on déverouille le champ et on masque corre
      verifAccesCorr(); // voir si on active l'onglet 3 à correction
    }
  }
  verifAccesCorr
	();
}

function verifAccesCorr() {
  "use strict";
  var accesCor = true;
  var debug_tblReponses = tblReponses;
  for (var i = 0; i < tblExo.pages[pCourante].questions.length; i++) {
    if (tblExo.pages[pCourante].questions[i].type == "qo") {
      if (tblReponses[pCourante]["reps"][i].length < tblExo.scenario.qoAccesC) accesCor = false;
    } else if (tblExo.pages[pCourante].questions[i].type == "qtrous") {
      //for (var elt in tblReponses[pCourante].reps[i]){ //in tblReponses[pCourante][i]){
      for (var j = 0; j < tblReponses[pCourante].reps[i].length; j++) {
        if (tblReponses[pCourante].reps[i][j].length < tblExo.scenario.qoAccesC) {
          accesCor = false;
        }
      }
    }
  }
  if (accesCor) {
    $("#nav_3").addClass("actif");
  } else {
    $("#nav_3").removeClass("actif");
  }
  //enregistreRep(); // pas forcement ici (lent avec calcul de car ...)
}

function enregistreRep() {
  "use strict";
  //on enregistre sur
  //-getFocus et mouseOut des textarea pour qo et qtrous
  //-des tourner de pages
  // c'etait trop gourmand de le faire suite au verifAccessCorr qui declenche sur le onchange

  /******* calcul score.raw******/
  var pourScoreRaw = 0;
  var nbQ = 0;
  /******** option 1  calcul du nb de caractères saisis pour score.raw (plafonné à 100 cars par réponse)**/
  /*var nbCar = 0;
  for (var indP = 0 ; indP < tblReponses.length ; indP++){
  	for (var indQ = 0 ; indQ < tblReponses[indP].reps.length ; indQ++){
  		if (tblExo.pages[indP].questions[indQ].type === "qo"){
  			var nbCarRep = tblReponses[indP].reps[indQ].length;
  			if (nbCarRep > 100) { nbCarRep = 100;}
  			nbCar += nbCarRep;
  			nbQ +=1 ;
  		}
  	}
  }
  pourScoreRaw = parseInt(nbCar / nbQ);
  */

  if (tblExo.scenario.scormScoreRaw === "ae") {
    //*** moyenne des AE
    var sommeAE = 0;
    for (var indP = 0; indP < tblReponses.length; indP++) {
      for (var indQ = 0; indQ < tblReponses[indP].AE.length; indQ++) {
        if (tblReponses[indP].AE[indQ] > -1) {
          sommeAE += tblReponses[indP].AE[indQ];
        }
        nbQ += 1;
      }
    }
    pourScoreRaw = parseInt((sommeAE / nbQ) * 50);
  } else {
    /******* option 2 calcul du % de reponses saisies ****/
    var nbRepSaisies = 0;
    for (var indP2 = 0; indP2 < tblReponses.length; indP2++) {
      for (var indQ2 = 0; indQ2 < tblReponses[indP2].reps.length; indQ2++) {
        if (tblExo.pages[indP2].questions[indQ2].type === "qo") {
          if (tblReponses[indP2].reps[indQ2].length > tblExo.scenario.qoAccesC) {
            nbRepSaisies++;
          }
          nbQ += 1;
        }
      }
    }
    pourScoreRaw = parseInt((nbRepSaisies / nbQ) * 100);
  }
  //enregistrer reponses dans suspend_data (si scorm) ou localStorage
  if (scorm) {
    SCOSetValue("cmi.suspend_data", JSON.stringify(tblReponses));
    SCOCommit();
    SCOSetValue("cmi.core.score.raw", pourScoreRaw);
    SCOCommit();
    //**** enregistre dans les cmi.interaction pour avoir tableau des reponses
    var compteur = 0;
    for (var i = 0; i < tblReponses.length; i++) {
      for (var j = 0; j < tblReponses[i].reps.length; j++) {
        var pourId = "Page-" + (i + 1) + "_q-" + (j + 1);
        SCOSetValue("cmi.interactions." + compteur + ".id", pourId);
        SCOSetValue("cmi.interactions." + compteur + ".student_response", tblReponses[i].reps[j]);
        compteur++;
      }
    }

    //**************
  } else {
    if (tblExo.moduleId != null) {
      localStorage.setItem(tblExo.moduleId, JSON.stringify(tblReponses));
    }
  }
}

function validation() {
  "use strict";
  // dans scenario on pourrait bloquer le retour à "questionnaire ici ...

  //***
  tblReponses[pCourante].valid = true;
  $(".feedback").show("fast");
  //spécifique QO.
  $(".QOReponse").attr('disabled', 'disabled');
  // pour QCM
  QCMCorr();
}

function edition() {
  "use strict";
  $(".feedback").hide("slow");
  // QO :
  $(".QOReponse").attr('disabled', false);
  // QCM :
  $("input[type='checkbox']").attr('disabled', false);
  $("input[type='checkbox']").removeClass("QCMCocheInactif");
  $("input[type='checkbox']").removeClass("QCMCocheBon");
  $("input[type='checkbox']").removeClass("QCMCocheFaux");
  //****
  $("#nav_2").addClass("actif");
}

function lireExtraitVid(e) {
  'use strict';
  //sur le createElement/onclick on ne sait pas mettre de paramètre so j'utilise l'id pour passer si correction/question, ST ,
  var params = e.currentTarget.id.split("_");
  var extrait;
  if (params[1] === "c") {
    extrait = "extraitCorrection";
  } else {
    extrait = "extraitQuestion";
  }
  var deb = tblExo.pages[pCourante].questions[params[2]][extrait].debut;
  var fin = tblExo.pages[pCourante].questions[params[2]][extrait].fin;

  if ((params[3] === "vo") != (maVideoSousTitreActif())) {
    sousTitrage1();
  }

  maVideoSeek(deb);
  maVideoPlay();
  var timer = setInterval(function() {
    if (maVideoCurrentTime() > fin) {
      maVideoPause();
      clearInterval(timer);
    }
  }, 100);
}



///******changer le svg de couleur*******/
//(source : http://xn--dahlstrm-t4a.net/svg/html/get-embedded-svg-document-script.html )
function getSubDocument(embedding_element) {
  "use strict";
  if (embedding_element.contentDocument) {
    return embedding_element.contentDocument;
  } else {
    var subdoc = null;
  }
}

function svgChangeColor() {
  'use strict';
  //changement de couleur :
  if (tblExo.interface) {
    var elms = document.querySelectorAll(".svgInterface");
    var boutonApeindre = elms.length;
    var subdocTrouve = 0;
    for (var i = 0; i < elms.length; i++) {
      var subdoc = getSubDocument(elms[i]);
      if (subdoc) {
        var subElt = subdoc.getElementsByClassName("eltColor1");
        if (subElt.length > 0) {
          subdocTrouve += 1;
        }
        for (var j = 0; j < subElt.length; j++) {
          subElt[j].setAttribute("fill", tblExo.interface.couleur1);
        }
      }
    }
  }
}
///*****************************/

function redimCtnQuestions() {
  'use strict';
	// console.log("function redimCtnQuestions()");
  ///*******le redimensionnement en hauteur : objet : faire le scroll sur la partie question seulement ...

  if (document.getElementById("ctnQuestions")) { // éviter erreur quand on redim sur onglets!="previsualisation" dans l'auteur
	// console.log("on a bien un ctnQuestions " + window.innerWidth + " / " +
      var temp = parseInt($("#ctnQuestions").offset().top);
      var temp2 = $("#ctnNavigation").height();
      var temp3 = temp + temp2 + 10;
      var temp4 = window.innerHeight - temp3;
			console.log("TOP de navig = " + temp + "\nnavig hauteur = "+ temp2 + "\nsomme des perte "+ temp3 + "\nhauteur max = "+ temp4 );
      $("#ctnPageQ").css("max-height", temp4);
  }
}

//*****************************
function tblReponsesReset() {
  'use strict';
	console.log("tblReponsesReset" +  tblExo.pages.length);
  for (var pageId = 0; pageId < tblExo.pages.length; pageId++) {
    tblReponses[pageId] = {};
    tblReponses[pageId].valid = false;
    tblReponses[pageId].reps = [];
    tblReponses[pageId].AE = [];
    for (var questionId = 0; questionId < tblExo.pages[pageId].questions.length; questionId++) {
      tblReponses[pageId].AE[questionId] = -1;
      if (tblExo.pages[pageId].questions[questionId].type === "qo") {
        tblReponses[pageId].reps[questionId] = "";
      } else if (tblExo.pages[pageId].questions[questionId].type === "qtrous") {
        tblReponses[pageId].reps[questionId] = [];
        for (var i = 0; i < tblExo.pages[pageId].questions[questionId].txtQuestion.split(":SHORTANSWER:").length - 1; i++) {
          tblReponses[pageId].reps[questionId][i] = "";
        }
      } else if (tblExo.pages[pageId].questions[questionId].type === "qcm") {
        tblReponses[pageId].reps[questionId] = "";
      }
    }
  }
}

function nettoieChaine(entree) { //pour nettoyer nom des fichier à enregistrer (scorm surtout)
  "use strict";
  var regExp1 = /\W/g;
  var sortie;
  sortie = entree.replace(regExp1, "");
  return sortie.substr(0, 15);
}

//****** QCM :



function QCMCorr() {
  "use strict";
  //boucle sur la page pour trouver les QCM
  for (var i = 0; i < tblExo.pages[pCourante].questions.length; i++) {
    if (tblExo.pages[pCourante].questions[i].type === "qcm") {
      //verrrouile les coches
      var qCorr = true;
      for (var j = 0; j < tblExo.pages[pCourante].questions[i].propositions.length; j++) {
        //****coche
        var coche = document.getElementById("cb_" + i + "_" + j);
        if (coche.checked === tblExo.pages[pCourante].questions[i].propositions[j].reponseCorrecte) {
          coche.className = "QCMCocheBon";
        } else {
          coche.className = "QCMCocheFaux";
          qCorr = false;
        }
        // coche.disabled = true;
        // *** texte
        //		    if (tblExo.pages[pCourante].questions[i].propositions[j].reponseCorrecte){
        //			document.getElementById("txt_"+i+"_"+j).className += "QCMTxtBon";
        //		    }
      }
      if (qCorr) {
        document.getElementById("ctnQuestion_" + i).className += " QCMQBon";
      } else {
        document.getElementById("ctnQuestion_" + i).className += " QCMQFaux";
      }
    }
  }

  $("input[type='checkbox']").attr('disabled', 'disabled');
  $("input[type='checkbox']").addClass("QCMCocheInactif");
}
