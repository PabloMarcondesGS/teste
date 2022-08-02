<?php
include_once('../class/SegurancaApi.php');
include_once('../class/Geral.php');
include_once('../class/Pessoa.php');
include_once('../class/Hibernate.php');

$Geral = new Geral();
$Hibernate = new Hibernate();

$data = json_decode(file_get_contents('php://input'));

$chave_mobile = $Geral->verificaDados1($data->chave_mobile);
$app_code = $Geral->verificaDados1($data->app_code);
$pessoa_request = $data->pessoa;
$processo_subtipo_id = $Geral->verificaDados1($data->processo_subtipo_id);

$Pessoa = new Pessoa();
$Pessoa->id = $Geral->verificaDados1($pessoa_request->id);
$Pessoa->senha = $Geral->verificaDados1($pessoa_request->senha);
$Pessoa->cpf = $Geral->verificaDados1($pessoa_request->cpf);

$json_arquivo_tipo = array();

$json_array = array();
$json_array = validar_usuario($chave_mobile,$app_code,$Pessoa);

if($json_array['sucess'] == true){
    
    $json_array['mensagem'] = "";
    $json_array['sucess'] = true;
    
    if($data->action == "buscarArquivoTipo"){
        
        $sql = "SELECT 
                    arquivo_tipo.*,
                    arquivo_tipo_processo_subtipo.descricao AS descricao
            	 FROM arquivo_tipo
            	 INNER JOIN arquivo_tipo_processo_subtipo ON arquivo_tipo_processo_subtipo.arquivo_tipo_id = arquivo_tipo.id                
            	 WHERE arquivo_tipo_processo_subtipo.processo_subtipo_id = '".$processo_subtipo_id."' ORDER BY arquivo_tipo.id DESC;";
        
        $result = $Hibernate->exe($sql);
        
        while($row = mysqli_fetch_array($result)){
            
            $array_list = null;
            $array_list = array();
            
            $array_list['id'] = $row["id"];
            $array_list['nome'] = utf8_encode($row["nome"]);
            $array_list['descricao'] = utf8_encode($row["descricao"]);
            array_push($json_arquivo_tipo,$array_list);
            
        }
        
        echo json_encode($json_arquivo_tipo);
        
    }else if($data->action == "buscarArquivoTipoBaixar"){
       
        
        $sql = "SELECT 
                       arquivo_tipo.nome AS nome,
                       arquivo_tipo.nome_arquivo AS nome_arquivo
                    FROM arquivo_tipo
                    INNER JOIN arquivo_tipo_processo_subtipo ON arquivo_tipo_processo_subtipo.arquivo_tipo_id = arquivo_tipo.id
                    WHERE arquivo_tipo_processo_subtipo.baixar = '1' AND arquivo_tipo_processo_subtipo.processo_subtipo_id = '".$processo_subtipo_id."' ORDER BY arquivo_tipo.id DESC";
        
        $result = $Hibernate->exe($sql);
        
        while($row = mysqli_fetch_array($result)){
            
            $array_list = null;
            $array_list = array();
            
            $array_list['nome'] = utf8_encode($row["nome"]);
            $array_list['nome_arquivo'] = utf8_encode($row["nome_arquivo"]);
            array_push($json_arquivo_tipo,$array_list);
            
        }
        
        echo json_encode($json_arquivo_tipo);
    }
    
}



?>