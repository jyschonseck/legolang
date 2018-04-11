// JavaScript Document

function creationQO(i){
	"use strict";
	var questionEnCours = document.querySelector("#ctnQuestion_" + i );
		
	var txtTitreQ = document.createElement("div");//titre question
	txtTitreQ.className = "txtTitreQ";
	txtTitreQ.innerHTML = tblExo.pages[pCourante].questions[i]["titreQ"];
	questionEnCours.appendChild(txtTitreQ);
	
	var question = document.createElement("p");//question
	//****extrait vidéo -question
	if (tblExo.pages[pCourante].questions[i].extraitQuestion.fin > 0) { 
		var btnExtrait = document.createElement("span");
		btnExtrait.id = "btnVidExtrait_q_" + i + "_vo";;
		btnExtrait.className = " btnExtraitVidVo";
		btnExtrait.onclick = lireExtraitVid;
		question.appendChild(btnExtrait);
	}
	var txtQuestion = document.createElement("span");
	txtQuestion.className = "txtQuestion";
	txtQuestion.innerHTML = tblExo.pages[pCourante].questions[i]["txtQuestion"];
	question.appendChild(txtQuestion);
	questionEnCours.appendChild(question);
	
	var reponse = document.createElement("textarea");//reponse
	reponse.className = "QOReponse";
	reponse.value = tblReponses[pCourante].reps[i];
	reponse.oninput = QOchangeHdlr;
	reponse.onfocus = QOgetFocusHdlr;
	reponse.onmouseout = enregistreRep;
	questionEnCours.appendChild(reponse);
	
	//ajout place holder du clavier
	var placeHolderClavier = document.createElement("div");
	placeHolderClavier.id = "ctnClavier_" + i;
	placeHolderClavier.className = "ctnClavierClass";
	questionEnCours.appendChild (placeHolderClavier);
	
	var txtCorrection = document.createElement("div");
	txtCorrection.className = "feedback txtCorrection";
	txtCorrection.innerHTML = tblExo.pages[pCourante].questions[i].txtCorrection;
	questionEnCours.appendChild(txtCorrection);
	
	
	/**** extrait vidéo ****/
	if (tblExo.pages[pCourante].questions[i].extraitCorrection.fin > 0) {
		var btnExtrait_c1 = document.createElement("div");
		btnExtrait_c1.id = "btnVidExtrait_c_" + i + "_vo";
		btnExtrait_c1.className = "feedback btnExtraitVidVo";
		btnExtrait_c1.onclick = lireExtraitVid;
		questionEnCours.appendChild(btnExtrait_c1);
		
		if (affichST){//test pour masquer deuxieme bouton si pas de ST
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
	if (tblExo.scenario.msgAE){
		creationAE(i);
	}
}


function QOchangeHdlr(e){
	var q = e.currentTarget.parentElement.id.split("_")[1];
	tblReponses[pCourante].reps[q] = e.currentTarget.value;
	
	verifAccesCorr();
}
 
 function QOgetFocusHdlr(e){
	//fo effacer les claviers affichés...
	//$(".ctnClavierClass").css("display" ,"none");
	enregistreRep();
	champSaisie = e.currentTarget;
	var i = e.target.parentElement.id.split("_")[1];
	if (affichClavier) {
		afficherClavier(i);
	}
		
		
 }