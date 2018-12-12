<?php
//echo "scormise_v4.php  "; // ne pas faire d'echo car zip.lib va les intégrer dans l'archive  !!!
$OUTPUT_DIR = "";

$fileHdl = null;
//**************
//***** data.json
$fileName1 = "../scorm_source/module/data.json";
$fData1 = stripslashes($_POST["data"]);
$valide = $fData1 ;

//if ($_POST['code'] == 'retuby45' ){
	if ($valide) {
		$fileHdl = fopen($fileName1, "w");
		$valide = ($fileHdl);
	}
	if ($valide) {
		$valide = ( fwrite($fileHdl, $fData1) != false );
	}
	if ($fileHdl) {
		fclose($fileHdl);
	}
//}

//********************
//*** st
$fileHdl=false;
$fileName2 = "../scorm_source/module/st.vtt";
$fData2 = stripslashes($_POST["ST"]);
$valide = $fData2 ;

//if ($_POST['code'] == 'retuby45' ){
	if ($valide) {
		$fileHdl = fopen($fileName2, "w");
		$valide = ($fileHdl);
	}
	if ($valide) {
		$valide = ( fwrite($fileHdl, $fData2) != false );
	}
	if ($fileHdl) {
		fclose($fileHdl);
	}
//}

//**************
// scormise


 //******création du zip
require("zip.lib.php") ; //indiquez le chemin d'accés à la librairie

$zip = new zipfile() ; //on crée un fichier zip

 $filename = array('index.html' , 'imsmanifest.xml' ,'adlcp_rootv1p2.xsd'  , 'ims_xml.xsd','imscp_rootv1p1p2.xsd',
'imsmd_rootv1p2p1.xsd','SCORMGenericLogic.js', 'module/data.json' , 'module/st.vtt',  'module/fiche.pdf' , 'module/.htaccess' ,
'lglg/lglg.html' , 'lglg/styles.css', 'lglg/lglg_js/lglg.js','lglg/lglg_js/pdfmake.min.js','lglg/lglg_js/vfs_fonts.js',
'lglg/lglg_interface/navigQ.html' , 'lglg/lglg_interface/images/outils/clavier.svg' , 'lglg/lglg_interface/images/outils/doc.svg' , 'lglg/lglg_interface/images/outils/impression.svg' , 'lglg/lglg_interface/images/outils/sousTitrage1.svg' , 'lglg/lglg_interface/images/outils/sousTitrage2.svg',
'lglg/lglg_interface/images/extrait.svg' ,'lglg/lglg_interface/images/extrait-.svg' , 'lglg/lglg_interface/images/minus_alt.svg' ,'lglg/lglg_interface/images/plus_alt.svg' , 'lglg/lglg_interface/logo/UL-NOIR-WEB-h120.png', 'lglg/lglg_interface/logo/logo_uoh.png',
'lglg/lglg_medias/html5.html' , 'lglg/lglg_medias/youtube.html',
'lglg/lglg_outils/AEAffich.html' ,'lglg/lglg_outils/scoreAffich.html' ,  'lglg/lglg_outils/autoEval.js' , 'lglg/lglg_outils/clavier.html' , 'lglg/lglg_outils/outils.js' ,
'lglg/lglg_questions/qo.js' ,  'lglg/lglg_questions/qtrous.js' ,  'lglg/lglg_questions/qcm.js'
 );

$a = 0 ;
while(count($filename)>$a)
{
	//echo "-".$filename[$a]."-<br>";
	$fp = fopen('../scorm_source/'.$filename[$a],'r') ; //on ouvre le fichier en lecture seule
	$contenu = fread($fp, filesize('../scorm_source/'.$filename[$a])) ; //on enregistre le contenu
	fclose($fp) ;
	$zip->addfile($contenu, $filename[$a]) ; //on ajoute le fichier
	$a++; //on incrémente $a
}

//ce qui suit force le doneload
header('Content-Type: application/x-zip') ; //on détermine les en-tête
header('Content-Disposition: inline; filename='.$_POST["nom"].'.zip') ;
echo $zip -> file();
?>
