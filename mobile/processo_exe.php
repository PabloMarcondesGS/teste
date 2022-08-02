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
$processo_request = $data->processo;

$Pessoa = new Pessoa();
$Pessoa->id = $Geral->verificaDados1($pessoa_request->id);
$Pessoa->senha = $Geral->verificaDados1($pessoa_request->senha);
$Pessoa->cpf = $Geral->verificaDados1($pessoa_request->cpf);

$json_processos = array();

$json_array = array();
$json_array = validar_usuario($chave_mobile,$app_code,$Pessoa);

if($json_array['sucess'] == true){
    
$json_array['mensagem'] = "";
$json_array['sucess'] = true;
        
    if($data->action == "buscarProcesso"){

        $valor = $Geral->verificaDados1($data->valor);
        
        if(strlen($valor) >= 5){
            $filtro = " AND processo.protocolo LIKE '%$valor%' ";
        }
        
        $sql = "SELECT processo.id,
                 processo.protocolo,
            	 pessoas.nome AS nome_pessoa,
            	 processo_tipo.nome AS nome_processo_tipo,
            	 processo_subtipo.nome AS nome_processo_subtipo,
            	 processo_status.nome AS nome_processo_status
            	 FROM processo
            	 INNER JOIN pessoas ON processo.cliente_id = pessoas.id
            	 INNER JOIN processo_tipo ON processo.processo_tipo_id = processo_tipo.id
            	 INNER JOIN processo_subtipo ON processo.processo_subtipo_id = processo_subtipo.id
            	 INNER JOIN processo_status ON processo.processo_status_id = processo_status.id
            	 WHERE processo.cliente_id = '".$Pessoa->id."' $filtro ORDER BY processo.id DESC;";
        
        $result = $Hibernate->exe($sql);
        
        while($row = mysqli_fetch_array($result)){
            
            $array_list = null;
            $array_list = array();
            $array_list['id_processo'] = $row["id"];
            $array_list['protocolo'] = utf8_encode($row["protocolo"]);
            $array_list['nome_pessoa'] = utf8_encode($row["nome_pessoa"]);
            $array_list['nome_processo_tipo'] = utf8_encode($row["nome_processo_tipo"]);
            $array_list['nome_processo_subtipo'] = utf8_encode($row["nome_processo_subtipo"]);
            $array_list['nome_processo_status'] = utf8_encode($row["nome_processo_status"]);
            
            array_push($json_processos,$array_list);
            
            
        }
    
        echo json_encode($json_processos);
    
    }else if($data->action == "saveProcesso"){
        
        $Processo = new Processo();
        $Processo->cliente_id = $Geral->verificaDados1($processo_request->cliente_id);
        $Processo->operador_id = $Geral->verificaDados1($processo_request->operador_id);
        $Processo->processo_tipo_id = $Geral->verificaDados1($processo_request->processo_tipo_id);
        $Processo->processo_subtipo_id = $Geral->verificaDados1($processo_request->processo_subtipo_id);
        
        $Processo->protocolo = 0;
        $Processo->processo_status_id = 1;
        
        if($Processo->cliente_id == "" || $Processo->cliente_id == 0) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n CLIENTE nao encontrado!";
        }
        
        if($Processo->processo_tipo_id == "" || $Processo->processo_tipo_id == 0) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n TIPO DE PROCESSO nao encontrado!";
        }
        
        if($Processo->processo_subtipo_id == "" || $Processo->processo_subtipo_id == 0) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n SUBTIPO DE PROCESSO nao encontrado!";
        }        
        
        if($Processo->operador_id == "" || $Processo->operador_id == 0) {
            $Processo->operador_id = 'NULL';
        }
       
        
        if($json_array['sucess'] == true){
            
            if($Processo->id == null) {
                
                $Processo->data_cadastro = date('Y-m-d H:i:s');
                $Processo->id = $Hibernate->cadastrar($Processo);
                
                $Processo->protocolo = str_pad($Processo->id,10,"0",STR_PAD_LEFT);
                $Hibernate->exe("UPDATE processo SET protocolo = '".$Processo->protocolo."' WHERE (id = '".$Processo->id."') LIMIT 1;");

                $json_array['sucess'] = true;
                $json_array['mensagem'] = "Seu cadastro foi realizado com sucesso!";
                $json_array['processo_id'] = $Processo->id;
                
            }
            
        }
        
        echo json_encode($json_array);
    }
    
}



?>