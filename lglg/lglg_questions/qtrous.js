// lecture de : https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Utiliser_les_objets
// appeler ça dans affichPage

var proto_qtrous = {
  donnees: {},
  // reponses: [],
  // ae: null,
  // score: 0,
  affich: function(i) {
    // console.log("affich question " + this.donnees.txtQuestion + " - " + i);
    var questionEnCours = document.querySelector("#ctnQuestion_" + i);

    var question = document.createElement("p"); //question
    //****extrait vidéo -question
    if (this.donnees.extraitQuestion.fin > 0) {
      var btnExtrait = document.createElement("span");
      btnExtrait.id = "btnVidExtrait_q_" + i + "_vo";;
      btnExtrait.className = " btnExtraitVidVo";
      btnExtrait.onclick = lireExtraitVid;
      question.appendChild(btnExtrait);
    }

    //****texte à trous :
    var txtQuestion = document.createElement("div");
    //*** on mets les trous
    var texteQuestion = this.donnees.txtQuestion.split("*");
    //  on boucle : les impaires sont les trous !
    var texte = "";
    for (var i = 0; i < texteQuestion.length; i++) {
      if ((i % 2) === 0) {
        texte += texteQuestion[i];
      } else {
        texte += "<input type='text' id='tiTrou_" + texteQuestion[i] + "' onchange='enregistreRep();'>";
        texte += "<span id='txtCorr_" + texteQuestion[i] + "' class='txtCorr'></span>";
      }
    }
    //** puis les feedback
    var re = /\$(\w*)\$/g;
    var texteF = texte.replace(re, "<div id='txtFb_$1' class='txtFb'></div>");
    txtQuestion.innerHTML = texteF;
    questionEnCours.appendChild(txtQuestion);


    //ajout place holder du clavier
    var placeHolderClavier = document.createElement("div");
    placeHolderClavier.id = "ctnClavier_" + i;
    placeHolderClavier.className = "ctnClavierClass";
    questionEnCours.appendChild(placeHolderClavier);

    var txtCorrection = document.createElement("div");
    txtCorrection.className = "feedback txtCorrection";
    txtCorrection.innerHTML = this.donnees.txtCorrection;
    questionEnCours.appendChild(txtCorrection);

    /**** extrait vidéo ****/
    if (this.donnees.extraitCorrection.fin > 0) {
      var btnExtrait_c1 = document.createElement("div");
      btnExtrait_c1.id = "btnVidExtrait_c_" + i + "_vo";
      btnExtrait_c1.className = "feedback btnExtraitVidVo";
      btnExtrait_c1.onclick = lireExtraitVid;
      questionEnCours.appendChild(btnExtrait_c1);

      if (!this.donnees.extraitCorrection.affichST) { //test pour masquer deuxieme bouton si pas de ST
        var btnExtrait_c2 = document.createElement("div");
        btnExtrait_c2.id = "btnVidExtrait_c_" + i + "_st";
        btnExtrait_c2.className = "feedback btnExtraitVidSt";
        btnExtrait_c2.onclick = lireExtraitVid;
        questionEnCours.appendChild(btnExtrait_c2);
      }
    }

    /****** autoEval*****/
    var autoEvaluation = document.createElement("div");
    autoEvaluation.className = "feedback autoEval";
    autoEvaluation.id = "ctnAutoEvaluation_" + i;
    questionEnCours.appendChild(autoEvaluation);
    //$("#ctnAutoEvaluation_" + i).load("outils/autoeval.html");
    if (tblExo.scenario.msgAE) {
      creationAE(i);
    }
  },
  corr: function(i) {
    console.log("corr de qtrou," + pCourante + " - " + i);
    $("#ctnQuestion_" + i + " .feedback").show("fast");
    // TODO: adapter ce qui suis qui vient de sam
    for (var t in this.donnees.trous) { //boucle sur les trous
      console.log("boucle sur trou : " + t + "\n" + JSON.stringify(this.donnees));
      var trouEnCours = document.getElementById("tiTrou_" + t);
      document.getElementById("txtCorr_" + t).innerHTML = this.donnees.trous[t][0].saisie; //on met la réponse 0 en correction
      if (trouEnCours) {
        trouEnCours.disabled = true;
        trouEnCours.classList.add("saisieFausse"); // au départ on mets faux
        for (var j = 0; j < this.donnees.trous[t].length; j++) {
          if (tblReponses[pCourante].reps[i] === this.donnees.trous[t][j].saisie) { // on a une corr
            //  if (this.donnees.trous[t][j].score > 0) { //test de la corre si bon
            if (this.donnees.trous[t][j].correct) {
              trouEnCours.classList.remove("saisieFausse");
              trouEnCours.classList.add("saisieBonne");
              document.getElementById("txtCorr_" + t).style.display = "none";

            } else { // la réponse connue est fausse
              document.getElementById("txtCorr_" + t).style.display = "inline";
            }
            // incremente le score si l'event est un click (j'arrive pas à passer un parametre sur le onclick du bouton)
            if (e) {
              reponses.score += parseInt(this.donnees.trous[t][j].score);
            }
            if (this.donnees.trous[t][j].fb) {
              $("#txtFb_" + t).html(this.donnees.trous[t][j].fb);
            }
            break; // passe au trou suivant
          } else { //saisie inconnue dans exo.pages.corrections
            document.getElementById("txtCorr_" + t).style.display = "inline";
          }
        }
      }
    }

  }
}

//****** fonction a garder là ?

// function QOchangeHdlr(e){// TODO fonctionnement avec les trous ?
// 	var q = e.currentTarget.parentElement.id.split("_")[1];
// 	tblReponses[pCourante].reps[q] = e.currentTarget.value;
//
// 	verifAccesCorr();
// }
//
//  function QOgetFocusHdlr(e){ // TODO fonctionnement avec les trous ?
// 	//fo effacer les claviers affichés...
// 	//$(".ctnClavierClass").css("display" ,"none");
// 	enregistreRep();
// 	champSaisie = e.currentTarget;
// 	var i = e.target.parentElement.id.split("_")[1];
// 	if (affichClavier) {
// 		afficherClavier(i);
// 	}
//  }
