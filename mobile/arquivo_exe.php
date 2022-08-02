<?php
include_once('../class/SegurancaApi.php');
include_once('../class/Geral.php');
include_once('../class/Pessoa.php');
include_once('../class/Arquivo.php');
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

$json_array = array();
$json_array = validar_usuario($chave_mobile,$app_code,$Pessoa);

if($json_array['sucess'] == true){
    
$json_array['mensagem'] = "";
$json_array['sucess'] = true;
    
    if($data->action == "saveArquivoFoto"){
        
        $arquivo_id_request = $data->arquivo_id;
        $foto_nova_request = $data->foto_nova;

        if($arquivo_id_request == "" || $arquivo_id_request == 0) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n Foto nao encontrada!";
        }

        if(strlen(trim($foto_nova_request)) == 0) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n FOTO em branco!";
        }

        if($json_array['sucess'] == true){
            
            $Hibernate->exe("UPDATE `arquivo` 
                                SET `arquivo_ref` = '".$foto_nova_request."' 
                                WHERE `id` = '".$arquivo_id_request."' LIMIT 1;"); 
            $json_array['sucess'] = true;
            $json_array['mensagem'] = "Cadastro realizado com sucesso!";
        }

        echo json_encode($json_array);

    }else if($data->action == "saveArquivos"){
    
        $arquivos_request = $data->arquivos;
        
        foreach($arquivos_request as $value){
            
            $Arquivo = new Arquivo();
            $Arquivo->id = $value->id;
            $Arquivo->arquivo_tipo_id = $Geral->verificaDados1($value->arquivo_tipo_id);
            $Arquivo->processo_id = $Geral->verificaDados1($value->processo_id);
            $Arquivo->arquivo_ref = $value->arquivo_ref;
            $Arquivo->data_cadastro = $Geral->verificaDados1($value->data_cadastro);
            
            if($Arquivo->arquivo_tipo_id == "" || $Arquivo->arquivo_tipo_id == 0) {
                $json_array['sucess'] = false;
                $json_array['mensagem'] .= "\n".$value->arquivo_tipo_nome.": TIPO DO ARQUIVO nao encontrado!";
            }
            
            if($Arquivo->processo_id == "" || $Arquivo->processo_id == 0) {
                $json_array['sucess'] = false;
                $json_array['mensagem'] .= "\n".$value->arquivo_tipo_nome.": PROCESSO nao encontrado!";
            }
            
            if(strlen(trim($Arquivo->arquivo_ref)) == 0) {
                $json_array['sucess'] = false;
                $json_array['mensagem'] .= "\n".$value->arquivo_tipo_nome.": FOTO em branco!";
            }
            
        }
        
        if($json_array['sucess'] == true){
            
            foreach($arquivos_request as $value){
                
                $Arquivo = new Arquivo();
                $Arquivo->id = $value->id;
                $Arquivo->arquivo_tipo_id = $Geral->verificaDados1($value->arquivo_tipo_id);
                $Arquivo->processo_id = $Geral->verificaDados1($value->processo_id);
                $Arquivo->arquivo_ref = $value->arquivo_ref;
                
                if($Arquivo->id == ""){
                    
                    $Arquivo->data_cadastro = date('Y-m-d H:i:s');
                    $Hibernate->cadastrar($Arquivo);
                    
                }
                
            }
            
            $json_array['sucess'] = true;
            $json_array['mensagem'] = "Cadastro realizado com sucesso!";
            
        }
        
        echo json_encode($json_array);
    
    }else  if($data->action == "buscarArquivos"){
        
        $id_processo_request = $Geral->verificaDados1($data->id_processo);
        
        $sql = "SELECT arquivo.*,
                       arquivo_tipo.nome AS arquivo_tipo_nome 
                    FROM arquivo 
                    INNER JOIN arquivo_tipo ON arquivo_tipo.id = arquivo.arquivo_tipo_id
                    WHERE arquivo.processo_id = '".$id_processo_request."' ORDER BY arquivo.id ASC;";
        
        $result = $Hibernate->exe($sql);
        
        $json_arquivos = null;
        $json_arquivos = array();
        
        while($row = mysqli_fetch_array($result)){
            
            $array_list = null;
            $array_list = array();
            $array_list['id_arquivo'] = $row["id"];
            $array_list['arquivo_ref'] = $row["arquivo_ref"];
            $array_list['arquivo_tipo_nome'] = utf8_encode($row["arquivo_tipo_nome"]);
            
            array_push($json_arquivos,$array_list);
            
            
        }
        
        echo json_encode($json_arquivos);
        
    }else  if($data->action == "baixarArquivo"){
         
        $fileLocation = "../arquivos/".$data->nome_arquivo;
        
        if(file_exists($fileLocation)){
            
            $file = "/var/www/vhosts/bspadvogados.com/httpdocs/app/arquivos/".$data->nome_arquivo;
            
            $json_array['file_size'] = filesize($file);
            $json_array['file_content'] = base64_encode(file_get_contents($file));

            $json_array['sucess'] = true;
            $json_array['mensagem'] = "Arquivo encontrado!";
            
        }else{
            $json_array['arquivo'] = "";
            $json_array['sucess'] = false;
            $json_array['mensagem'] = "Arquivo nao encontrado!";
        }
        
        echo json_encode($json_array);
    }
    
}



?>