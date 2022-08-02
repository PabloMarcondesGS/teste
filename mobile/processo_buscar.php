<?php
include_once('../class/SegurancaApi.php');
include_once('../class/Geral.php');
include_once('../class/Pessoa.php');
include_once('../class/Processo.php');
include_once('../class/Hibernate.php');

$Geral = new Geral();
$Hibernate = new Hibernate();

$data = json_decode(file_get_contents('php://input'));

$chave_mobile = $Geral->verificaDados1($data->chave_mobile);
$app_code = $Geral->verificaDados1($data->app_code);
$pessoa_request = $data->pessoa;
$id_processo_request = $data->id_processo;

$Pessoa = new Pessoa();
$Pessoa->id = $Geral->verificaDados1($pessoa_request->id);
$Pessoa->senha = $Geral->verificaDados1($pessoa_request->senha);
$Pessoa->cpf = $Geral->verificaDados1($pessoa_request->cpf);

$json_processo = array();

$json_array = array();
$json_array = validar_usuario($chave_mobile,$app_code,$Pessoa);

if($json_array['sucess'] == true){
    
    $json_array['mensagem'] = "";
    $json_array['sucess'] = true;
    $json_array['processo'] = "";
    
    if($data->action == "buscarProcesso"){
        
        $sql = "SELECT 
                 processo.*,
                 processo.data_cadastro AS data_cadastro_processo,
                 pessoas.nome AS nome_pessoa,
            	 processo_tipo.nome AS nome_processo_tipo,
            	 processo_subtipo.nome AS nome_processo_subtipo,
            	 processo_status.nome AS nome_processo_status
            	 FROM processo
            	 INNER JOIN pessoas ON processo.cliente_id = pessoas.id
            	 INNER JOIN processo_tipo ON processo.processo_tipo_id = processo_tipo.id
            	 INNER JOIN processo_subtipo ON processo.processo_subtipo_id = processo_subtipo.id
            	 INNER JOIN processo_status ON processo.processo_status_id = processo_status.id
            	 WHERE processo.id = '".$id_processo_request."' LIMIT 1;";
        
        $result = $Hibernate->exe($sql);
        
        $json_processo = null;
        $json_processo = array();
        
        if($row = mysqli_fetch_array($result)){
            
            $json_processo['id'] = $row["id"];
            $json_processo['cliente_id'] = $row["cliente_id"];
            $json_processo['operador_id'] = $row["operador_id"];
            $json_processo['processo_tipo_id'] = $row["processo_tipo_id"];
            $json_processo['processo_subtipo_id'] = $row["processo_subtipo_id"];
            $json_processo['processo_status_id'] = $row["processo_status_id"];
            $json_processo['protocolo'] = $row["protocolo"];
            
            $json_processo['data_cadastro'] = $Geral->convertDataBdDataFormTIME(utf8_encode($row["data_cadastro_processo"]));
            
            $json_processo['nome_pessoa'] = utf8_encode($row["nome_pessoa"]);
            $json_processo['nome_processo_tipo'] = utf8_encode($row["nome_processo_tipo"]);
            $json_processo['nome_processo_subtipo'] = utf8_encode($row["nome_processo_subtipo"]);
            $json_processo['nome_processo_status'] = utf8_encode($row["nome_processo_status"]);
            
            $json_array['processo'] = $json_processo;
        }
        
        echo json_encode($json_array['processo']);
        
    }
    
}



?>