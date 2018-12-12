// JavaScript Document
//autoEval version curseur


function creationAE(q){
  console.log("function creationAE" + q);
		var ctnAE = document.getElementById("ctnAutoEvaluation_" + q)

    var elt0 = document.createElement("span");
		elt0.innerHTML = tblExo.scenario.msgAE;
		ctnAE.appendChild(elt0);

		var elt1 = document.createElement("div");
		elt1.id = "ctnAE_"+q;
    elt1.className = "ctnAE";

		var elt10 = document.createElement("button");
		elt10.className = "clicable";
		elt10.id = "AEMoins_" + q;
		elt10.onclick = inputHdlr;
		elt1.appendChild(elt10);

		var elt11 =  document.createElement("div");
		elt11.id = "AEProgress_" + q;
		elt1.appendChild(elt11);

		var elt12 = document.createElement("button");
		elt12.className = "clicable";
		elt12.id = "AEPlus_" + q;
		elt12.onclick = inputHdlr;
		elt1.appendChild(elt12);

		ctnAE.appendChild(elt1);

		$("#AEMoins_" + q).load("lglg/lglg_interface/images/minus_alt.svg");
		$("#AEPlus_" + q).load("lglg/lglg_interface/images/plus_alt.svg");
		$("#AEProgress_" + q).addClass("progressBar");
		$( "#AEProgress_" + q ).progressbar({
		  value: tblReponses[pCourante].AE[q],
		  max : AEValeurMax
		});
		if (tblReponses[pCourante].AE[q] < 0){
			//$("#AEProgress_" + q).progressbar({value : false});
			$("#ctnAE_" + q).css("opacity" , 0.3);
		}
}

function inputHdlr(e){
	var q =  e.currentTarget.id.split("_")[1];
	var val = 0;
	if (tblReponses[pCourante].AE[q]){
		val = tblReponses[pCourante].AE[q];
	}
	if (e.currentTarget.id.indexOf("Plus") > 0 ){
		if (val < AEValeurMax ) {
			 val += 1;}
	}else {
		if (val >0 ) { val -= 1;}
	}
	//tblReponses[pCourante].reps[q].AE = val;
	tblReponses[pCourante].AE[q] = val;
	$("#AEProgress_" + q).progressbar("value" , val);
	$("#ctnAE_" + q).css("opacity" , 1);
	majAE();
	enregistreRep();
}
