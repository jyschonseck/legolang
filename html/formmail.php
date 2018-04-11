<?php
$TO = "dune@univ-lille3.fr";

$h  = "From: " . $TO;

$message = "";

while (list($key, $val) = each($_POST)) {
  $message .= "$key : $val\n";
}

mail($TO, $subject, $message, $h);

Header("Location: https://legolang.univ-lille3.fr/");

?>