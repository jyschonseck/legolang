var proto_qtrous = {
    donnees: {},
    // reponses: [],
    // ae: null,
    // score: 0,
    affich: function(i) {
        "use strict";
        var questionEnCours = document.querySelector("#ctnQuestion_" + i);

        var question = document.createElement("p"); //question
        //****extrait vidéo -question
        if (this.donnees.extraitQuestion.fin > 0) {
            var btnExtrait = document.createElement("button");
            btnExtrait.id = "btnVidExtrait_q_" + i + "_vo";;
            btnExtrait.className = " btnExtraitVidVo";
            btnExtrait.onclick = lireExtraitVid;
            question.appendChild(btnExtrait);
        }
        questionEnCours.appendChild(question);

        //****texte à trous :
        var txtQuestion = document.createElement("div");
        //*** on mets les trous
        var texteQuestion = this.donnees.txtQuestion.split("*");
        //  on boucle : les impaires sont les trous !
        var texte = "";
        for (var j = 0; j < texteQuestion.length; j++) {
            if ((j % 2) === 0) {
                texte += texteQuestion[j];
            } else {
                texte += "<input type='text' id=tiTrou_" + i + "_" + texteQuestion[j] + " onchange='QTrousChangeHdr(this);' value='" + tblReponses[pCourante].reps[i][texteQuestion[j]] + "'>";
                texte += "<span id='txtTrouRep_" + i + "_" + texteQuestion[j] + "' class='txtTrouRep feedback'></span>";
            }
        }
        //** puis les feedback
        var re = /\$(\w*)\$/g;
        var texteF = texte.replace(re, "<span id='txtFb_$1' class='txtFb'></span>");
        txtQuestion.innerHTML = texteF;
        questionEnCours.appendChild(txtQuestion);
        // charge les reponses
        // console.log("tiTrou_" + i + "_" + texteQuestion[j]);
        // document.getElementById("tiTrou_" + i + "_" + texteQuestion[j] ).value = tblReponses[pCourante].reps[i][texteQuestion[j]];

        //ajout place holder du clavier
        var placeHolderClavier = document.createElement("div");
        placeHolderClavier.id = "ctnClavier_" + i;
        placeHolderClavier.className = "ctnClavierClass";
        questionEnCours.appendChild(placeHolderClavier);

        var txtCorrection = document.createElement("div");
        txtCorrection.className = "feedback txtCorrection";
        txtCorrection.innerHTML = this.donnees.txtCorrection;
        questionEnCours.appendChild(txtCorrection);

        var ctnFBl2 = document.createElement("div");
        ctnFBl2.className = "ctnFlexH";
        /**** extrait vidéo ****/
        if (this.donnees.extraitCorrection.fin > 0) {
            var btnExtrait_c1 = document.createElement("button");
            btnExtrait_c1.id = "btnVidExtrait_c_" + i + "_vo";
            btnExtrait_c1.className = "feedback btnExtraitVidVo";
            btnExtrait_c1.onclick = lireExtraitVid;
            ctnFBl2.appendChild(btnExtrait_c1);

            if (!this.donnees.extraitCorrection.affichST) { //test pour masquer deuxieme bouton si pas de ST
                var btnExtrait_c2 = document.createElement("button");
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
        if (tblExo.scenario.evalType === "AE") {
            creationAE(i);
        }
    },
    corr: function(i) {
        $("#ctnQuestion_" + i + " .feedback").show("fast");

        var qScore = 0;
        for (var t in this.donnees.trous) { //boucle sur les trous
            var trouEnCours = document.getElementById("tiTrou_" + i + "_" + t);
            document.getElementById("txtTrouRep_"+i+"_" + t).innerHTML = this.donnees.trous[t][0].saisie; //on met la réponse 0 en correction
            if (trouEnCours) {
                trouEnCours.disabled = true;
                trouEnCours.classList.add("saisieFausse"); // au départ on mets faux
                for (var j = 0; j < this.donnees.trous[t].length; j++) {
                    if (tblReponses[pCourante].reps[i][t] === this.donnees.trous[t][j].saisie) { // on a une corr
                        if (this.donnees.trous[t][j].correct) { //test de la corre si bon
                            trouEnCours.classList.remove("saisieFausse");
                            trouEnCours.classList.add("saisieBonne");
                            document.getElementById("txtTrouRep_"+i+"_" + t).style.display = "none";

                        } else { // la réponse connue est fausse
                            document.getElementById("txtTrouRep_"+i+"_" + t).style.display = "inline";
                        }
                        //****score % trou (t)
                        if (this.donnees.scoreActif && tblExo.scenario.evalType === "S") {
                            var scoreI = parseInt(this.donnees.trous[t][j].score);
                            qScore += scoreI;
                        }
                        //*** fb particulier
                        if (this.donnees.trous[t][j].fb) {
                            $("#txtFb_" + t).html(this.donnees.trous[t][j].fb);//("<br>" + this.donnees.trous[t][j].fb + "<br>");
                        }
                        break; // passe au trou suivant
                    } else { //saisie inconnue dans exo.pages.corrections
                        document.getElementById("txtTrouRep_"+i+"_" + t).style.display = "inline";
                    }
                }
                //****score totalScore
                if (this.donnees.scoreActif && tblExo.scenario.evalType === "S") {
                  document.getElementById("qScore_" + i).innerHTML = qScore;
                  tblReponses[pCourante].score[i] = qScore;
                  majScore();
                }
            }
        }
    }
}

function qTrousEdition() {
    $("input[type='text']").attr('disabled', false);
    //$("input[type='checkbox']").removeClass("QCMCocheInactif");
    $("input[type='text']").removeClass("saisieFausse");
    $("input[type='text']").removeClass("saisieBonne");
}

//****** fonction a garder là ?
function QTrousChangeHdr(obj) {
    var objInd = obj.id.split("_");
    tblReponses[pCourante].reps[objInd[1]][objInd[2]] = obj.value;
    verifAccesCorr();
}
