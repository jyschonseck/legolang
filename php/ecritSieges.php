<?php

$OUTPUT_DIR = "";

$fileHdl = null;
//**************
//***** data.json
$fileName1 = "../_vtt/sieges.json";
$fData1 = $_POST["sieges"];
$valide = $fData1 ;
echo "variable OK : <br>".$valide."<br>";

echo "variable longueur  : ".strlen($fData1)."<br>";
if (strlen($fData1) < 20000){ // 
	if ($valide) {
		$fileHdl = fopen($fileName1, "w");
		$valide = ($fileHdl);
		echo $valide."<br>";
	}
	if ($valide) {
		$valide = ( fwrite($fileHdl, $fData1) != false );
		echo "ecriture OK ".$valide."<br>";
	}
	if ($fileHdl) {
		fclose($fileHdl);
	}
}


echo $valide."<br>";

echo "<script language='javascript'>window.close()</script>";
?>