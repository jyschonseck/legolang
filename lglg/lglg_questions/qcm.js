function creationQCM(i) {
  "use strict";
  var questionEnCours = document.getElementById("ctnQuestion_" + i);


  var question = document.createElement("p"); //question
  //****extrait vidéo -question
  if (tblExo.pages[pCourante].questions[i].extraitQuestion.fin > 0) {
    var btnExtrait = document.createElement("span");
    btnExtrait.id = "btnVidExtrait_q_" + i + "_vo";;
    btnExtrait.className = " btnExtraitVidVo";
    btnExtrait.onclick = lireExtraitVid;
    question.appendChild(btnExtrait);
  }

  // la ques
  var txtQuestion = document.createElement("span");
  txtQuestion.className = "txtQuestion";
  txtQuestion.innerHTML = tblExo.pages[pCourante].questions[i]["txtQuestion"];
  question.appendChild(txtQuestion);
  questionEnCours.appendChild(question);


  //propositions
  for (var j = 0; j < tblExo.pages[pCourante].questions[i].propositions.length; j++) {
    var propComplete = document.createElement("div");
    var prop = document.createElement("label");
    var coche = document.createElement("input");
    var corrLocale = document.createElement("span");
    propComplete.className = "QCMprop";
    propComplete.onclick = QCMClckHdlr;
    propComplete.id = "prop_" + i + "_" + j;
    coche.id = "cb_" + i + "_" + j;
    if (tblReponses[pCourante].reps[i].substr(j, 1) === "1") {
      coche.checked = true;
    }
    coche.type = "checkbox";
    propComplete.appendChild(coche);
    //var texte = document.createElement("span");
    prop.id = "txt_" + i + "_" + j;
    prop.innerHTML = tblExo.pages[pCourante].questions[i].propositions[j].texte;
    prop.htmlFor = "cb_" + i + "_" + j;
    //prop.appendChild(texte);
    propComplete.appendChild(prop);
    //***score
    var txtScore = document.createElement("div");
    txtScore.id = "score_" + i + "_" + j;
    txtScore.className = "feedback score";
    txtScore.style = "display:none";
    txtScore.innerHTML = "";
    propComplete.appendChild(txtScore);
    questionEnCours.appendChild(propComplete);
  }

  // retroAction générale
  var txtCorrection = document.createElement("div");
  txtCorrection.className = "feedback txtCorrection";
  txtCorrection.innerHTML = tblExo.pages[pCourante].questions[i].txtCorrection;
  questionEnCours.appendChild(txtCorrection);

  var ctnFBl2 = document.createElement("div");
  ctnFBl2.className = "ctnFlexH";
  /**** extrait vidéo ****/
  if (tblExo.pages[pCourante].questions[i].extraitCorrection.fin > 0) {
    var btnExtrait_c1 = document.createElement("div");
    btnExtrait_c1.id = "btnVidExtrait_c_" + i + "_vo";
    btnExtrait_c1.className = "feedback btnExtraitVidVo";
    btnExtrait_c1.onclick = lireExtraitVid;
    ctnFBl2.appendChild(btnExtrait_c1);

    if (!tblExo.pages[pCourante].questions[i].extraitCorrection.affichST) {
      var btnExtrait_c2 = document.createElement("div");
      btnExtrait_c2.id = "btnVidExtrait_c_" + i + "_st";
      btnExtrait_c2.className = "feedback btnExtraitVidSt";
      btnExtrait_c2.onclick = lireExtraitVid;
      ctnFBl2.appendChild(btnExtrait_c2);
    }
  }

  /******* note pour question *****/
  var ctnScoreQ = document.createElement("span");
  ctnScoreQ.className = "feedback qScore";
  ctnScoreQ.id = "qScore_" + i;

  ctnFBl2.appendChild(ctnScoreQ);
  questionEnCours.appendChild(ctnFBl2);

  /****** autoEval*****/
  var autoEvaluation = document.createElement("div");
  autoEvaluation.className = "feedback autoEval";
  autoEvaluation.id = "ctnAutoEvaluation_" + i;
  questionEnCours.appendChild(autoEvaluation);
  //$("#ctnAutoEvaluation_" + i).load("outils/autoeval.html");
  if (tblExo.scenario.msgAE) {
    creationAE(i);
  }
}



function QCMClckHdlr(e) {
  var q = e.currentTarget.id.split("_")[1];
  tblReponses[pCourante].reps[q] = "";
  for (var i = 0; i < tblExo.pages[pCourante].questions[q].propositions.length; i++) {
    if (document.getElementById("cb_" + q + "_" + i).checked) {
      tblReponses[pCourante].reps[q] += "1";
    } else {
      tblReponses[pCourante].reps[q] += "0";
    }
  }
  //***pour le moment les QCM ne rentre pas dans le prérequis pour acceder à loa correction....
  //	verifAccesCorr();
}

// function QCMgetFocusHdlr(e){
//	//fo effacer les claviers affichés...
//	//$(".ctnClavierClass").css("display" ,"none");
//	enregistreRep();
//	champSaisie = e.currentTarget;
//	var i = e.target.parentElement.id.split("_")[1];
//	if (affichClavier) {
//		afficherClavier(i);
//	}
// }
