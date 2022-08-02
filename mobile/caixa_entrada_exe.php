<?php
include_once('../class/SegurancaApi.php');
include_once('../class/Geral.php');
include_once('../class/Pessoa.php');
include_once('../class/CaixaEntrada.php');
include_once('../class/Hibernate.php');

$Geral = new Geral();
$Hibernate = new Hibernate();

$data = json_decode(file_get_contents('php://input'));

$chave_mobile = $Geral->verificaDados1($data->chave_mobile);
$app_code = $Geral->verificaDados1($data->app_code);
$pessoa_request = $data->pessoa;

$Pessoa = new Pessoa();
$Pessoa->id = $Geral->verificaDados1($pessoa_request->id);
$Pessoa->senha = $Geral->verificaDados1($pessoa_request->senha);
$Pessoa->cpf = $Geral->verificaDados1($pessoa_request->cpf);

$json_mensagens = array();

$json_array = array();
$json_array = validar_usuario($chave_mobile,$app_code,$Pessoa);

if($json_array['sucess'] == true){
    
    $json_array['mensagem'] = "";
    $json_array['sucess'] = true;
        
    if($data->action == "watchQtdMensagens"){

        $qtd_mensagens = 0;
        $resultQtdM = $Hibernate->exe("SELECT COUNT(*) as qtd_mensagens FROM caixa_entrada WHERE lida_destinatario = '0' AND tipo = '1' AND pessoas_id = '".$Pessoa->id."' ;");
        if($sqlQtdM = mysqli_fetch_array($resultQtdM)){
            $qtd_mensagens = $sqlQtdM['qtd_mensagens'];			            
        }

        echo json_encode($qtd_mensagens);

    }else if($data->action == "watchMensagens"){

        $result = $Hibernate->exe("SELECT * FROM caixa_entrada WHERE pessoas_id = '".$Pessoa->id."' ;");
        
        while($row = mysqli_fetch_array($result)){
            
            $array_mensagem = null;
            $array_mensagem = array();
            $array_mensagem['id'] = $row["id"];
            $array_mensagem['pessoas_id'] = $row["pessoas_id"];
            $array_mensagem['mensagem'] = utf8_encode($row["mensagem"]);
            $array_mensagem['data'] = $row["data"];
            $array_mensagem['tipo'] = $row["tipo"];

            array_push($json_mensagens,$array_mensagem);

            if($array_mensagem['tipo'] == 1){
                $Hibernate->exe("UPDATE caixa_entrada SET lida_destinatario = '1' WHERE (id = '".$array_mensagem['id']."' AND tipo = '1');");
            }
            
        }
    
        echo json_encode($json_mensagens);
    
    }else if($data->action == "saveMensagem"){
        
        $CaixaEntrada = new CaixaEntrada();
        $CaixaEntrada->pessoas_id = $Pessoa->id;
        $CaixaEntrada->mensagem = $Geral->verificaDados1($data->mensagem); 
        $CaixaEntrada->data = date('Y-m-d H:i:s');
        $CaixaEntrada->tipo = 0;
        
        if($CaixaEntrada->mensagem == "") {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- MENSAGEM em branco";
        }

        if($json_array['sucess'] == true){
         
            $Hibernate->cadastrar($CaixaEntrada);

            $json_array['sucess'] = true;
        	$json_array['mensagem'] = "Sua mensagem foi enviada com sucesso!";
        
        } 

        echo json_encode($json_array);

    }
    
}



?>