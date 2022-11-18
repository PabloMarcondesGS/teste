<?php
session_start();
include_once('../../class/Geral.php'); 
include_once('../../class/Login_admin.php'); 

$Geral = new Geral;
$acaoLogin_admin = new Login_admin;

$email = $Geral->verificaDados1($_REQUEST['email']); 
$senha = $Geral->verificaDados1($_REQUEST['senha']); 

$senha_MD5 = md5($senha);

$validar=$acaoLogin_admin->validaUsuario($email, $senha_MD5);

if ($validar == true) { 
	
    $Geral->voltarPagina("index.php?page=".base64_encode('../../pages/index/home.php'));
    header("Location: index.php?page=".base64_encode('../../pages/index/home.php'));

}else{ 
	$acaoLogin_admin->expulsaVisitante(); 
	
} 
?>