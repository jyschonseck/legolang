<!--
// FS SCORM - adaptateur fscommand pour ADL SCORM 1.2 et les interactions d'apprentissage de Flash MX 2004
// version 1.0    08/19/03
// Modifié par Andrew Chemey, Macromedia
// Basé sur la version 1.2.4 de l'adaptateur FS SCORM :
// 		Fragments Copyright 2002 Pathlore Software Corporation Tous droits réservés
// 		Fragments Copyright 2002 Macromedia Inc. Tous droits réservés.
// 		Fragments Copyright 2003 Click2learn, Inc. Tous droits réservés.
// 		Développé par Tom King, Macromedia,
// 		             Leonard Greenberg, Pathlore,
// 		             et Claude Ostyn, Click2learn, Inc.
// 		Une partie du code a été rédigée par Jeff Burton et Andrew Chemey, Macromedia (09/01/02)
// -----------------------------------------------------------------
// Modifiez ces valeurs prédéfinies selon vos besoins et vos préférences.
var g_bShowApiErrors = false ; 	// Définissez la valeur sur true pour afficher les messages d'erreur
var g_bInitializeOnLoad = true ;// Définissez la valeur sur false pour désactiver l'initialisation des fonctions LMS lors du chargement de la page HTML
// Traduisez ces chaînes si g_bShowApiErrors est défini sur true
// et si vous êtes amené à localiser l'application
var g_strAPINotFound = "Management system interface not found.";
var g_strAPITooDeep = "Cannot find API - too deeply nested.";
var g_strAPIInitFailed = "Found API but LMSInitialize failed.";
var g_strAPISetError = "Trying to set value but API not available.";
var g_strFSAPIError = 'LMS API adapter returned error code: "%1"\nWhen FScommand called API.%2\nwith "%3"';
var g_strDisableErrorMsgs = "Select cancel to disable future warnings.";
// Définissez g_bSetCompletedAutomatically sur true si vous souhaitez que l'état indique
// l'exécution automatique lors de l'appel de la fonction LMSFinish. En principe,
// cet indicateur conserve la valeur false si l'animation Flash
// indique elle-même l'état en envoyant une FSCommand pour définir la valeur sur "completed" (terminé),
// "passed" (réussi) ou "failed" (échec), les deux dernières valeurs impliquant l'état "completed" (terminé).
var g_bSetCompletedAutomatically = false;
// Cette valeur est en principe attribuée par la fonction LMS, mais dans le cas contraire
// voici la valeur par défaut permettant de déterminer l'état passed/failed (réussi/échec).
// Indiquez une valeur nulle si l'actionscript Flash détermine l'état
// passed/fail (réussi/échec) selon sa propre méthode ou indiquez une valeur comprise entre 0 et 1
// inclus (possibilité d'indiquer un nombre à virgule flottante, par exemple 0,75).
var g_SCO_MasteryScore = null; // valeurs possibles : 0,0 ; 1,0 ou nulle
//==================================================================
// AVERTISSEMENT !!!
// Ne modifiez pas la section ci-après, à moins de savoir exactement
// ce que vous faites !
// En principe, il n'est pas nécessaire de modifier ces deux valeurs : elles servent de référence pour la définition des paramètres
// du modèle Flash.
var g_nSCO_ScoreMin = 0; 		// doit être un nombre
var g_nSCO_ScoreMax = 100; 		// doit être un nombre > nSCO_Score_Min
// D'après la spécification SCORM, la note de réussite fournie par le système LMS,
// le cas échéant, remplace le SCO et interprète si la note
// doit être interprétée lorsque l'état de réussite/d'échec est déterminé.
// Le modèle essaie d'obtenir la note de réussite et le cas
// échéant de définir l'état de réussite/d'échec en conséquence
// lorsque le SCO envoie une note. Le système LMS ne peut pas
// déterminer l'état tant que le SCO ne s'est pas arrêté.
// La valeur par défaut de cet indicateur est true. Définissez-le sur false si vous ne
// souhaitez pas prévoir comment le LMS va définir l'état de réussite/échec en fonction
// de la note de réussite (le LMS sera gagnant au final de toute façon).
var g_bInterpretMasteryScore = false;
// Ce script implémente de nombreux aspects du
// comportement logique standard d'un SCO.
/////////// FONCTIONS D'INITIALISATION ET DE CATCHER DE L'INTERFACE API ////////
var g_nFindAPITries = 0;
var g_objAPI = null;
var g_bInitDone = false;
var g_bFinishDone = false;
var	g_bSCOBrowse = false;
var g_dtmInitialized = new Date(); // seront ajustées après l'initialisation
var g_bMasteryScoreInitialized = false;
function AlertUserOfAPIError(strText) {
	if (g_bShowApiErrors) {
		var s = strText + "\n\n" + g_strDisableErrorMsgs;
		if (!confirm(s)){
			g_bShowApiErrors = false
		}
	}
}
function ExpandString(s){
	var re = new RegExp("%","g")
	for (i = arguments.length-1; i > 0; i--){
		s2 = "%" + i;
		if (s.indexOf(s2) > -1){
			re.compile(s2,"g")
			s = s.replace(re, arguments[i]);
		}
	}
	return s
}
function FindAPI(win) {
	while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
		g_nFindAPITries ++;
		if (g_nFindAPITries > 500) {
			AlertUserOfAPIError(g_strAPITooDeep);
			return null;
		}
		win = win.parent;
	}
	return win.API;
}
function APIOK() {
	return ((typeof(g_objAPI)!= "undefined") && (g_objAPI != null))
}
function SCOInitialize() {
	//alert("on a déclenché SCOInitialize.");
	var err = true;
	if (!g_bInitDone) {
		if ((window.parent) && (window.parent != window)){
			g_objAPI = FindAPI(window.parent)
		}
		if ((g_objAPI == null) && (window.opener != null))	{
			g_objAPI = FindAPI(window.opener)
		}
		if (!APIOK()) {
			AlertUserOfAPIError(g_strAPINotFound);
			err = false
		} else {
			err = g_objAPI.LMSInitialize("");
			if (err == "true") {
				g_bSCOBrowse = (g_objAPI.LMSGetValue("cmi.core.lesson_mode") == "browse");						
				if (!g_bSCOBrowse) {
					if (g_objAPI.LMSGetValue("cmi.core.lesson_status") == "not attempted") {
						err = g_objAPI.LMSSetValue("cmi.core.lesson_status","incomplete")
					}
				}
			} else {
				AlertUserOfAPIError(g_strAPIInitFailed)
			}
		}
		if (typeof(SCOInitData) != "undefined") {
			// La fonction SCOInitData peut être définie dans un autre script du SCO
			SCOInitData()
		}
		g_dtmInitialized = new Date();
	}
	g_bInitDone = true;
	return (err + "") // Imposer le type chaîne
}
function SCOFinish() {
	//alert("on a déclenché SCOFinish.");
	if ((APIOK()) && (g_bFinishDone == false)) {
		SCOReportSessionTime()
		if (g_bSetCompletedAutomatically){
			SCOSetStatusCompleted();
		}
		if (typeof(SCOSaveData) != "undefined") {
			// La fonction SCOSaveData peut être définie dans un autre script du SCO
			SCOSaveData();
		}
		g_bFinishDone = (g_objAPI.LMSFinish("") == "true");
	}
	return (g_bFinishDone + "" ) // Imposer le type chaîne
}
// Appelez ces fonctions au lieu d'essayer d'appeler directement l'adaptateur API
function SCOGetValue(nam)		{return ((APIOK())?g_objAPI.LMSGetValue(nam.toString()):"")}
function SCOCommit()			{return ((APIOK())?g_objAPI.LMSCommit(""):"false")}
function SCOGetLastError()		{return ((APIOK())?g_objAPI.LMSGetLastError():"-1")}
function SCOGetErrorString(n)	{return ((APIOK())?g_objAPI.LMSGetErrorString(n):"No API")}
function SCOGetDiagnostic(p)	{return ((APIOK())?g_objAPI.LMSGetDiagnostic(p):"No API")}
//LMSSetValue est implémenté avec des données plus complexes
//Logique de gestion ci-dessous
var g_bMinScoreAcquired = false;
var g_bMaxScoreAcquired = false;
// La logique spéciale commence ici
function SCOSetValue(nam,val){
	var err = "";
	if (!APIOK()){
			AlertUserOfAPIError(g_strAPISetError + "\n" + nam + "\n" + val);
			err = "false"
	} else if (nam == "cmi.core.score.raw") err = privReportRawScore(val)
	if (err == ""){
			err = g_objAPI.LMSSetValue(nam,val.toString() + "");
			if (err != "true") return err
	}
	if (nam == "cmi.core.score.min"){
		g_bMinScoreAcquired = true;
		g_nSCO_ScoreMin = val
	}
	else if (nam == "cmi.core.score.max"){
		g_bMaxScoreAcquired = true;
		g_nSCO_ScoreMax = val
	}
	return err
}
function privReportRawScore(nRaw) { // appelée uniquement par SCOSetValue
	if (isNaN(nRaw)) return "false";
	if (!g_bMinScoreAcquired){
		if (g_objAPI.LMSSetValue("cmi.core.score.min",g_nSCO_ScoreMin+"")!= "true") return "false"
	}
	if (!g_bMaxScoreAcquired){
		if (g_objAPI.LMSSetValue("cmi.core.score.max",g_nSCO_ScoreMax+"")!= "true") return "false"
	}
	if (g_objAPI.LMSSetValue("cmi.core.score.raw", nRaw)!= "true") return "false";
	g_bMinScoreAcquired = false;
	g_bMaxScoreAcquired = false;
	if (!g_bMasteryScoreInitialized){
		var nMasteryScore = parseInt(SCOGetValue("cmi.student_data.mastery_score"),10);
		if (!isNaN(nMasteryScore)) g_SCO_MasteryScore = nMasteryScore
	}
  	if ((g_bInterpretMasteryScore)&&(!isNaN(g_SCO_MasteryScore))){
    	var stat = (nRaw >= g_SCO_MasteryScore? "passed" : "failed");
    	if (SCOSetValue("cmi.core.lesson_status",stat) != "true") return "false";
  	}
  	return "true"
}
function MillisecondsToCMIDuration(n) {
//Convertir les délais exprimés en millisecondes au format 0000:00:00.00
	var hms = "";
	var dtm = new Date();	dtm.setTime(n);
	var h = "000" + Math.floor(n / 3600000);
	var m = "0" + dtm.getMinutes();
	var s = "0" + dtm.getSeconds();
	var cs = "0" + Math.round(dtm.getMilliseconds() / 10);
	hms = h.substr(h.length-4)+":"+m.substr(m.length-2)+":";
	hms += s.substr(s.length-2)+"."+cs.substr(cs.length-2);
	return hms
}
// SCOReportSessionTime est automatiquement appelée par ce script,
// mais vous pouvez le faire à tout moment depuis le SCO
function SCOReportSessionTime() {
	var dtm = new Date();
	var n = dtm.getTime() - g_dtmInitialized.getTime();
	return SCOSetValue("cmi.core.session_time",MillisecondsToCMIDuration(n))
}
// Le créateur d'un SCO étant le seul à connaître la signification de l'état completed (terminé), un autre
// script du SCO peut appeler cette fonction pour définir l'état completed (terminé).
// La fonction vérifie que le SCO n'est pas en mode de navigation et
// évite d'indiquer l'état "passed" (réussi) ou "failed" (échec), puisqu'ils impliquent l'état "completed" (terminé).
function SCOSetStatusCompleted(){
	var stat = SCOGetValue("cmi.core.lesson_status");
	if (SCOGetValue("cmi.core.lesson_mode") != "browse"){
		if ((stat!="completed") && (stat != "passed") && (stat != "failed")){
			return SCOSetValue("cmi.core.lesson_status","completed")
		}
	} else return "false"
}
// Logique de gestion objective
function SCOSetObjectiveData(id, elem, v) {
	var result = "false";
	var i = SCOGetObjectiveIndex(id);
	if (isNaN(i)) {
		i = parseInt(SCOGetValue("cmi.objectives._count"));
		if (isNaN(i)) i = 0;
		if (SCOSetValue("cmi.objectives." + i + ".id", id) == "true"){
			result = SCOSetValue("cmi.objectives." + i + "." + elem, v)
		}
	} else {
		result = SCOSetValue("cmi.objectives." + i + "." + elem, v);
		if (result != "true") {
			// Ce système LMS accepte peut-être uniquement les entrées de journalisation
			i = parseInt(SCOGetValue("cmi.objectives._count"));
			if (!isNaN(i)) {
				if (SCOSetValue("cmi.objectives." + i + ".id", id) == "true"){
					result = SCOSetValue("cmi.objectives." + i + "." + elem, v)
				}
			}
		}
	}
	return result
}
function SCOGetObjectiveData(id, elem) {
	var i = SCOGetObjectiveIndex(id);
	if (!isNaN(i)) {
		return SCOGetValue("cmi.objectives." + i + "."+elem)
	}
	return ""
}
function SCOGetObjectiveIndex(id){
	var i = -1;
	var nCount = parseInt(SCOGetValue("cmi.objectives._count"));
	if (!isNaN(nCount)) {
		for (i = nCount-1; i >= 0; i--){ //retourner en arrière si le LMS procède à de la journalisation
			if (SCOGetValue("cmi.objectives." + i + ".id") == id) {
				return i
			}
		}
	}
	return NaN
}
// Fonctions permettant de convertir des jetons ou des abréviations compatibles AICC en jetons SCORM
function AICCTokenToSCORMToken(strList,strTest){
	var a = strList.split(",");
	var c = strTest.substr(0,1).toLowerCase();
	for (i=0;i<a.length;i++){
			if (c == a[i].substr(0,1)) return a[i]
	}
	return strTest
}
function normalizeStatus(status){
	return AICCTokenToSCORMToken("completed,incomplete,not attempted,failed,passed", status)
}
function normalizeInteractionType(theType){
	return AICCTokenToSCORMToken("true-false,choice,fill-in,matching,performance,sequencing,likert,numeric", theType)
}
function normalizeInteractionResult(result){
	return AICCTokenToSCORMToken("correct,wrong,unanticipated,neutral", result)
}
// Détecter Internet Explorer
var g_bIsInternetExplorer = navigator.appName.indexOf("Microsoft") != -1;
// Traiter les messages fscommand depuis une animation Flash, en mappant si nécessaire
// les commandes de modèle Flash AICC sur SCORM
function module_DoFSCommand(command, args){
	var moduleObj = g_bIsInternetExplorer ? module : document.module;
	// instruction ineffective si aucun API SCORM n'est disponible
	var myArgs = new String(args);
	var cmd = new String(command);
	var v = "";
	var err = "true";
	var arg1, arg2, n, s, i;
	var sep = myArgs.indexOf(",");
	if (sep > -1){
		arg1 = myArgs.substr(0, sep); // Nom de l'élément de donnée à acquérir depuis l'API
		arg2 = myArgs.substr(sep+1) 	// Nom de la variable d'animation Flash à définir
	} else {
		arg1 = myArgs
	}
	if (!APIOK()) return;
	if (cmd.substring(0,3) == "LMS"){
		// Traiter les FScommands "LMSxxx" (compatibles avec le modèle HTML fsSCORM)
		if ( cmd == "LMSInitialize" ){
			err = (APIOK() + "")
			// La fonction LMSInitialize effective est automatiquement appelée par le modèle
		}	else if ( cmd == "LMSSetValue" ){
			err = SCOSetValue(arg1,arg2)
		} else if ( cmd == "LMSFinish" ){
			err = SCOFinish()
			// Traitée automatiquement par le modèle, mais l'animation
			// peut l'appeler avant.
		}	else if ( cmd == "LMSCommit" ){
			err = SCOCommit()
		}	else if ( cmd == "LMSFlush" ){
			// instruction ineffective
			// LMSFlush n'est pas définie dans SCORM ; si vous l'appelez, une erreur de test se produit
		}	else if ((arg2) && (arg2.length > 0)){
			if ( cmd == "LMSGetValue") {
				moduleObj.SetVariable(arg2, SCOGetValue(arg1));
			}	else if ( cmd == "LMSGetLastError") {
				moduleObj.SetVariable(arg2, SCOGetLastError(arg1));
			}	else if ( cmd == "LMSGetErrorString") {
				moduleObj.SetVariable(arg2, SCOGetLastError(arg1));
			}	else if ( cmd == "LMSGetDiagnostic") {
				moduleObj.SetVariable(arg2, SCOGetDiagnostic(arg1));
			}	else {
				// pour une extension LMSGetxxxx inconnue
				v = eval('g_objAPI.' + cmd + '(\"' + arg1 + '\")');
				moduleObj.SetVariable(arg2,v);
			}
		} else if (cmd.substring(0,3) == "LMSGet") {
			err = "-2: No Flash variable specified"
		}
		// fin du traitement des commandes "LMSxxx"
	} else if ((cmd.substring(0,6) == "MM_cmi")||(cmd.substring(0,6) == "CMISet")) {
		// Traiter des FScommands de composants d'apprentissage Macromedia.
		// Ces commandes utilisent des conventions de modèle de données HACP AICC.
		// Vous devrez mapper les données vers SCORM le cas échéant.
		var F_intData = myArgs.split(";");
		if (cmd == "MM_cmiSendInteractionInfo") {
			n = SCOGetValue("cmi.interactions._count");
			s = "cmi.interactions." + n + ".";
			// Repérez les erreurs majeures pour éviter l'échec au test de conformité SCORM
			// Si aucun ID d'interaction n'est spécifié, il est impossible de l'enregistrer
			v = F_intData[2]
			if ((v == null) || (v == "")) err = 201; // Sans ID, il ne sert à rien d'enregistrer
			if (err =="true"){
				err = SCOSetValue(s + "id", v)
			}
			if (err =="true"){
				var re = new RegExp("[{}]","g")
				for (i=1; (i<9) && (err=="true"); i++){
					v = F_intData[i];
					if ((v == null) || (v == "")) continue
					if (i == 1){
						err = SCOSetValue(s + "time", v)
					} else if (i == 3){
						err = SCOSetValue(s + "objectives.0.id", v)
					} else if (i == 4){
						err = SCOSetValue(s + "type", normalizeInteractionType(v))
					} else if (i == 5){
						// strip out "{" and "}" from response
						v = v.replace(re, "");
						err = SCOSetValue(s + "correct_responses.0.pattern", v)
					} else if (i == 6){
						// strip out "{" and "}" from response
						v = v.replace(re, "");
						err = SCOSetValue(s + "student_response", v)
					} else if (i == 7){
						err = SCOSetValue(s + "result", normalizeInteractionResult(v))
					} else if (i == 8){
						err = SCOSetValue(s + "weighting", v)
					} else if (i == 9){
						err = SCOSetValue(s + "latency", v)
					}
				}
			}
		} else if (cmd == "MM_cmiSendObjectiveInfo"){
			err = SCOSetObjectiveData(F_intData[1], ".score.raw", F_intData[2])
			if (err=="true"){
				SCOSetObjectiveData(F_intData[1], ".status", normalizeStatus(F_intData[3]))
			}
		} else if ((cmd=="CMISetScore") ||(cmd=="MM_cmiSendScore")){
			err = SCOSetValue("cmi.core.score.raw", F_intData[0]);
		} else if ((cmd=="CMISetStatus") || (cmd=="MM_cmiSetLessonStatus")){
			err = SCOSetValue("cmi.core.lesson_status", normalizeStatus(F_intData[0]))
		} else if (cmd=="CMISetTime"){
			err = SCOSetValue("cmi.core.session_time", F_intData[0])
		} else if (cmd=="CMISetCompleted"){
			err = SCOSetStatusCompleted()
		} else if (cmd=="CMISetStarted"){
			err = SCOSetValue("cmi.core.lesson_status", "incomplete")
		} else if (cmd=="CMISetPassed"){
			err = SCOSetValue("cmi.core.lesson_status", "passed")
		} else if (cmd=="CMISetFailed"){
			err = SCOSetValue("cmi.core.lesson_status", "failed")
		} else if (cmd=="CMISetData"){
			err = SCOSetValue("cmi.suspend_data", F_intData[0])
		} else if (cmd=="CMISetLocation"){
			err = SCOSetValue("cmi.core.lesson_location", F_intData[0])
		} else if (cmd=="CMISetTimedOut"){
			err = SCOSetValue("cmi.core.exit", "time-out")
		} // D'autres FScommands de composant d'apprentissage sont des instructions ineffectives dans ce contexte
	} else {
		if (cmd=="CMIFinish" || cmd=="CMIExitAU"){
			err = SCOFinish()
		} else if (cmd=="CMIInitialize" || cmd=="MM_StartSession"){
			err = SCOInitialize()
		} else {
			// Commande inconnue ; invoque peut-être une extension API
			// Si les commandes possèdent un 2ème argument, indiquez une valeur.
			// Il peut également s'agir d'une cmd
			if (eval('g_objAPI.' + cmd)) {
				v = eval('g_objAPI.' + cmd + '(\"' + arg1 + '\")');
				if ((arg2) && (arg2.length > 0)){
					moduleObj.SetVariable(arg2,v)
				} else {
					err = v
				}
			} else {
				err = "false"
			}
		}
	}
	// Fin de traduction et de traitement de la commande
	// traiter les erreurs détectées, les renvois d'erreur LMS par exemple
	if ((g_bShowApiErrors) && (err != "true")) {
		AlertUserOfAPIError(ExpandString(g_strFSAPIError, err, cmd, args))
	}
	return err
}
