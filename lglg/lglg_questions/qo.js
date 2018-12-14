// lecture de : https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Utiliser_les_objets

var proto_qo = {
    donnees: {},
    // reponses:"",
    // ae:null,
    affich: function(i) {
        var questionEnCours = document.querySelector("#ctnQuestion_" + i);
        questionEnCours.onclick = QOClckHdlr;

        var question = document.createElement("p"); //question
        //****extrait vidéo -question
        if (this.donnees.extraitQuestion.fin > 0) {
            var btnExtrait = document.createElement("button");
            btnExtrait.id = "btnVidExtrait_q_" + i + "_vo";;
            btnExtrait.className = " btnExtraitVidVo";
            btnExtrait.onclick = lireExtraitVid;
            question.appendChild(btnExtrait);
        }
        var txtQuestion = document.createElement("span");
        txtQuestion.className = "txtQuestion";
        txtQuestion.innerHTML = this.donnees.txtQuestion;
        question.appendChild(txtQuestion);
        questionEnCours.appendChild(question);

        var reponse = document.createElement("textarea"); //reponse
        reponse.className = "QOReponse"; //this.reponses;
        reponse.value = tblReponses[pCourante].reps[i];
        //reponse.oninput = QOchangeHdlr;
        // reponse.onfocus = QOgetFocusHdlr;
        // reponse.onblur = effacerClavier;
        //reponse.onmouseout = enregistreRep;
        reponse.onchange = QOchangeHdlr;
        questionEnCours.appendChild(reponse);

        //ajout place holder du clavier
        var placeHolderClavier = document.createElement("button");
        placeHolderClavier.id = "ctnClavier_" + i;
        placeHolderClavier.className = "ctnClavierClass";
        questionEnCours.appendChild(placeHolderClavier);

        var txtCorrection = document.createElement("div");
        txtCorrection.className = "feedback txtCorrection";
        txtCorrection.innerHTML = this.donnees.txtCorrection;
        questionEnCours.appendChild(txtCorrection);

        /**** extrait vidéo ****/
        if (this.donnees.extraitCorrection.fin > 0) {
            var btnExtrait_c1 = document.createElement("button");
            btnExtrait_c1.id = "btnVidExtrait_c_" + i + "_vo";
            btnExtrait_c1.className = "feedback btnExtraitVidVo";
            btnExtrait_c1.onclick = lireExtraitVid;
            questionEnCours.appendChild(btnExtrait_c1);

console.log("avant affich ST " + this.donnees.extraitCorrection.masqueST);
            if (tblExo.scenario.usageGst === "1" && !this.donnees.extraitCorrection.masqueST) { //test pour masquer deuxieme bouton si pas de ST
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
        if (tblExo.scenario.evalType === "AE") {
            creationAE(i);
        }
    },
    corr: function(i) {
        $("#ctnQuestion_" + i + " .feedback").show("fast");
    }
}

//****** fonction a garder là ?

function QOchangeHdlr(e) {
    var q = e.currentTarget.parentElement.id.split("_")[1];
    tblReponses[pCourante].reps[q] = e.currentTarget.value;
    //  tblQuestions[pCourante][q].reponses = e.currentTarget.value;
    verifAccesCorr();
    enregistreRep();
}

// function QOgetFocusHdlr(e) {
//     champSaisie = e.currentTarget;
//     var i = e.target.parentElement.id.split("_")[1];
//     if (affichClavier) {
//         afficherClavier(i);
//     }
// }
function QOClckHdlr(e) {
    champSaisie = e.currentTarget.getElementsByTagName("textarea")[0];
    var i = e.currentTarget.id.split("_")[1];
    if (affichClavier) {
        afficherClavier(i);
    }
}
