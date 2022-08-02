<?Php
header("Content-Type: text/html; charset=utf-8");
session_start();
include_once('../../class/Geral.php'); 
include_once('../../class/Hibernate.php'); 
include_once('../../class/Peticao.php'); 
include_once('../../class/Constantes.php');

include_once('../../class/Login_admin.php');
$acaoLogin_admin = new Login_admin;
$acaoLogin_admin->protegePagina();

$Geral= new Geral;
$Hibernate = new Hibernate;
$Peticao = new Peticao();
$Constantes = new Constantes();

$action = $Geral->verificaDados($_REQUEST["action"]);

$errou = false;
$mensagem = "";

$Peticao->id = $Geral->verificaDados($_REQUEST["id_"]);

if($action == "cadastrar" || $action == "alterar"){
	
	$Peticao->processo_id = $Geral->verificaDados($_REQUEST["processo_id"]);
	$_SESSION['pet_processo_id'] = $Peticao->processo_id;

    $Peticao->peticao_modelo_id = $Geral->verificaDados($_REQUEST["peticao_modelo_id"]);
	$_SESSION['pet_peticao_modelo_id'] = $Peticao->peticao_modelo_id;

    $Peticao->peticao_status_id = $Geral->verificaDados($_REQUEST["peticao_status_id"]);
	$_SESSION['pet_peticao_status_id'] = $Peticao->peticao_status_id;

    $Peticao->texto = $Geral->verificaDados($_REQUEST["texto"]);
	$_SESSION['pet_texto'] = $Peticao->texto;

    if($Peticao->processo_id == "" || $Peticao->processo_id == 0){
	    $mensagem .= "- Campo PROCESSO em branco.<br>";
	    $errou = true;
    }
    
    if($Peticao->peticao_modelo_id == "" || $Peticao->peticao_modelo_id == 0){
	    $Peticao->peticao_modelo_id = 'NULL';
    }
    
    if($Peticao->peticao_status_id == "" || $Peticao->peticao_status_id == 0){
	    $mensagem .= "- Campo STATUS em branco.<br>";
	    $errou = true;
	}
	
	if ($errou==false) {
		
		if($action == "cadastrar"){
            
            $Peticao->data_cadastro = date('Y-m-d H:i:s');

		    $Peticao->id = $Hibernate->cadastrar($Peticao);
			$mensagem = $Constantes->getSUCESS();
							
		}else if($action == "alterar"){

            $Peticao->data_cadastro = "NO_UPDATE";
            
		    $Hibernate->editar($Peticao);
			$mensagem = $Constantes->getSUCESS();
				
		}
		
		
	}
	
	$_SESSION['mensagem'] = $mensagem;
	$Geral->voltarPagina('index.php?page='.base64_encode('../../pages/peticao/form.php').'&processo_id='.$Peticao->processo_id.'&id_='.$Peticao->id.'&errou='.$errou);	
}
?>