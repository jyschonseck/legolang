// JavaScript Document
//autoEval version curseur


function creationAE(q){
		var ctnAE = document.getElementById("ctnAutoEvaluation_" + q)
		var elt = document.createElement("span");
		
		elt.innerHTML = tblExo.scenario.msgAE;
		ctnAE.appendChild(elt);
		
		var elt1 = document.createElement("div");
		elt1.id = "ctnAE_"+q
		
		elt = document.createElement("span");
		elt.className = "clicable";
		elt.id = "AEMoins_" + q;
		elt.onclick = inputHdlr; 
		elt1.appendChild(elt);
		
		elt =  document.createElement("div");
		elt.id = "AEProgress_" + q;
		elt1.appendChild(elt);

		elt = document.createElement("span");
		elt.className = "clicable";
		elt.id = "AEPlus_" + q;
		elt.onclick = inputHdlr; 
		elt1.appendChild(elt);

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

