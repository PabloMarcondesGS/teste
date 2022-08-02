<?php
include_once('../class/SegurancaApi.php');
include_once('../class/Geral.php');
include_once('../class/Pessoa.php');

$Geral = new Geral();
$Pessoa = new Pessoa();

$data = json_decode(file_get_contents('php://input'));

$chave_mobile = $Geral->verificaDados1($data->chave_mobile);
$app_code = $Geral->verificaDados1($data->app_code);
$Pessoa->cpf = $Geral->verificaDados1($data->cpf);
$Pessoa->senha = $Geral->verificaDados1($data->senha); 

$json_array = array();
$json_array = validar_usuario($chave_mobile,$app_code,$Pessoa);

echo json_encode($json_array);
?>