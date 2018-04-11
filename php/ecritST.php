<?php

$OUTPUT_DIR = "";

$fileHdl = null;
//**************
//***** data.json
//tester si POST[siege] est bien un nombre
echo "chiffre ? :".ctype_digit($_POST["siege"])."<br>";

$fileName1 = "../_vtt/st_".$_POST["siege"].".vtt";
$fData1 = $_POST["ST"];
$valide = $fData1 ;
echo "Fichier : ".$fileName1."<br>";
echo "ST : ".$fData1."<br>";

echo "variable longueur  : ".strlen($fData1)."<br>";
if (file_exists($fileName1)){ echo "le fichier existe <br>";}
if (ctype_digit($_POST["siege"]) && strlen($fData1) < 100000 && file_exists($fileName1) ){ 
	echo "on peut ecrire";
	if ($valide) {
		$fileHdl = fopen($fileName1, "w");
		$valide = ($fileHdl);
		echo "valide ouverture : ".$valide."<br>";
	}
	if ($valide) {
		$valide = ( fwrite($fileHdl, $fData1) != false );
		echo "écriture OK ".$valide."<br>";
	}
	if ($fileHdl) {
		fclose($fileHdl);
	}
}else {
	echo "j'ai pas écrit ! <br>";
}

echo $valide."<br>";
echo "<script language='javascript'>window.close()</script>";


?>