<?php
include_once('../class/SegurancaApi.php');
include_once('../class/Geral.php');
include_once('../class/Pessoa.php');
include_once('../class/ProcessoSubtipo.php');
include_once('../class/Hibernate.php');

$Geral = new Geral();
$Hibernate = new Hibernate();
$ProcessoSubtipo = new ProcessoSubtipo();

$data = json_decode(file_get_contents('php://input'));

$chave_mobile = $Geral->verificaDados1($data->chave_mobile);
$app_code = $Geral->verificaDados1($data->app_code);
$pessoa_request = $data->pessoa;

$Pessoa = new Pessoa();
$Pessoa->id = $Geral->verificaDados1($pessoa_request->id);
$Pessoa->senha = $Geral->verificaDados1($pessoa_request->senha);
$Pessoa->cpf = $Geral->verificaDados1($pessoa_request->cpf);

$json_processos_subtipo = array();

$json_array = array();
$json_array = validar_usuario($chave_mobile,$app_code,$Pessoa);

if($json_array['sucess'] == true){
        
    if($data->action == "buscarProcessoSubtipo"){

        $result = $Hibernate->listar($ProcessoSubtipo);
        
        while($row = mysqli_fetch_array($result)){
            
            $array_list = null;
            $array_list = array();
            $array_list['id_processo_subtipo'] = $row["id"];
            $array_list['nome'] = utf8_encode($row["nome"]);
            
            array_push($json_processos_subtipo,$array_list);
            
        }
    }
    
}

echo json_encode($json_processos_subtipo);

?>