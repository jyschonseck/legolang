// JavaScript Document

function creationQTROUS(i){
	"use strict";
	var questionEnCours = document.querySelector("#ctnQuestion_" + i );
	
	var txtTitreQ = document.createElement("div");//titre question
	txtTitreQ.className = "txtTitreQ";
	txtTitreQ.innerHTML = tblExo.pages[pCourante].questions[i]["titreQ"];
	questionEnCours.appendChild(txtTitreQ);
	
	
	
	
	//fo splitter le texte et on boucle...
	var texteQuestion = tblExo.pages[pCourante].questions[i]["txtQuestion"].split(":SHORTANSWER:");
	var txtQuestion = document.createElement("div");
		
	//****extrait vidéo -question
	if (tblExo.pages[pCourante].questions[i].extraitQuestion.fin > 0) { 
		var btnExtrait = document.createElement("span");
		btnExtrait.id = "btnVidExtrait_q_" + i + "_vo";;
		btnExtrait.className = " btnExtraitVidVo";
		btnExtrait.onclick = lireExtraitVid;
		txtQuestion.appendChild(btnExtrait);
	}
	
	for (var j=0 ; j < texteQuestion.length-1; j++){
		var textPartie = document.createElement("span");
		textPartie.className = "txtQuestion";
		textPartie.innerHTML = texteQuestion[j];
		txtQuestion.appendChild(textPartie);
		
		var reponse = document.createElement('input');
		reponse.type = "text";
		reponse.id = "txtReponseTrous_" + i + "_" + j;
		if (tblReponses[pCourante].reps[i][j] ){ 
			reponse.value =tblReponses[pCourante].reps[i][j] ;
		}
		reponse.oninput = QTROUSchangeHdlr; 
		reponse.onfocus = QOgetFocusHdlr;//pour le clavier et enregister...
		reponse.onmouseout = enregistreRep;
		txtQuestion.appendChild(reponse);
	}
	var textPartieFin = document.createElement("span");
	textPartieFin.innerHTML = texteQuestion[j];
	textPartieFin.className = "txtQuestion";
	txtQuestion.appendChild(textPartieFin);
	questionEnCours.appendChild(txtQuestion);
	
	//ajout place holder du clavier
	var placeHolderClavier = document.createElement("div");
	placeHolderClavier.id = "ctnClavier_" + i;
	placeHolderClavier.className = "ctnClavierClass";
	questionEnCours.appendChild (placeHolderClavier);
	
	
	var txtCorrection = document.createElement("div");
	txtCorrection.className = "feedback txtCorrection";
	txtCorrection.innerHTML = tblExo.pages[pCourante].questions[i]["txtCorrection"];
	questionEnCours.appendChild(txtCorrection);
	
	if (tblExo.pages[pCourante].questions[i].extraitCorrection.fin > 0) {
		var btnExtrait = document.createElement("div");
		btnExtrait.id = "btnVidExtrait_c_" + i + "_vo";
		btnExtrait.className = "feedback btnExtraitVidVo";
		btnExtrait.onclick = lireExtraitVid;
		questionEnCours.appendChild(btnExtrait);
	
		//test pour masquer deuxieme bouton si pas de ST
		if (affichST){
			var btnExtrait2 = document.createElement("div");
			btnExtrait2.id = "btnVidExtrait_c_" + i + "_st";
			btnExtrait2.className = "feedback btnExtraitVidSt";
			btnExtrait2.onclick = lireExtraitVid;
			questionEnCours.appendChild(btnExtrait2);
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

function QTROUSchangeHdlr(e){
	var q = e.currentTarget.id.split("_")[1];
	var j = e.currentTarget.id.split("_")[2];
	tblReponses[pCourante].reps[q][j] = e.currentTarget.value;
	verifAccesCorr();
}