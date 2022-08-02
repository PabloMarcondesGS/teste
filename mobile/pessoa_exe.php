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

$json_array = array();
$json_array = validar_app($chave_mobile, $app_code);

if ($json_array['sucess'] == true) {

    $json_array['mensagem'] = "";
    $json_array['sucess'] = true;

    $pessoa_request = $data->pessoa;

    if ($data->action == "savePessoa") {
        $Pessoa = new Pessoa();

        $Pessoa->id = $Geral->verificaDados1($pessoa_request->id);
        $Pessoa->pessoas_tipo_id = 1;
        $Pessoa->nome = $Geral->verificaDados1($pessoa_request->nome);
        $Pessoa->email = "";
        $Pessoa->senha = $Geral->verificaDados1($pessoa_request->senha);
        $Pessoa->cpf = $Geral->verificaDados1($pessoa_request->cpf);
        $Pessoa->telefone = $Geral->verificaDados1($pessoa_request->telefone);


        if ($Pessoa->nome == "") {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- Digite seu NOME";
        } else if (strlen($Pessoa->nome) > 255) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- Campo NOME deve conter no maximo 255 caracteres.<br>";
        }

        if ($Pessoa->cpf == "") {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- Digite seu CPF";
        } else if (strlen($Pessoa->cpf) != 11) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- CPF deve conter 11 digitos (apenas numeros)";
        } else if (is_numeric($Pessoa->cpf) == false) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- CPF deve conter apenas numeros";
        }
        if ($Hibernate->verifica_se_existe($Pessoa, 'cpf', $Pessoa->cpf) == true) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- CPF ja existente no sistema: " . $Pessoa->cpf;
        }

        if ($Pessoa->telefone == "") {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- Digite seu CELULAR";
        } else if (strlen($Pessoa->telefone) != 11) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- CELULAR deve conter 11 caracteres (apenas numeros, com DDD e o 9 digito, ex: 81987005500)";
        } else if (is_numeric($Pessoa->telefone) == false) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- CELULAR deve conter apenas numeros";
        }

        if ($Pessoa->senha == "") {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- Digite sua SENHA";
        } else if (strlen($Pessoa->senha) < 4) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- Sua SENHA deve conter mais de 3 caracteres";
        }

        if ($json_array['sucess'] == true) {

            if ($Pessoa->id == null) {

                $Pessoa->data_cadastro = date('Y-m-d H:i:s');

                $Pessoa->senha = md5($Pessoa->senha);

                $Pessoa->status = 1;

                $Hibernate->cadastrar($Pessoa);

                $json_array['sucess'] = true;
                $json_array['mensagem'] = "Seu cadastro foi realizada com sucesso!";
            } else {

                $Pessoa->data_cadastro = 'NO_UPDATE';

                $Pessoa->senha = md5($Pessoa->senha);

                $Pessoa->status = "NO_UPDATE";

                $Hibernate->editar($Pessoa);

                $json_array['sucess'] = true;
                $json_array['mensagem'] = "Seus dados foram editados com sucesso!";
            }
        }
    } else if ($data->action == "lembrarSenha") {
        $Pessoa = new Pessoa();

        $Pessoa->cpf = $Geral->verificaDados1($pessoa_request->cpf);

        if ($Pessoa->cpf == "") {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- Digite seu CPF";
        } else if (strlen($Pessoa->cpf) != 11) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- Seu CPF deve conter 11 digitos";
        } else if (is_numeric($Pessoa->cpf) == false) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- Seu CPF deve conter apenas numeros";
        }

        if ($Hibernate->verifica_se_existe($Pessoa, 'cpf', $Pessoa->cpf) == true) {

            $result = $Hibernate->buscar_por_campo($Pessoa, 'cpf', $Pessoa->cpf);
            $sql = mysqli_fetch_array($result);

            $Pessoa->telefone = $sql['telefone'];
            $Pessoa->pessoas_tipo_id = $sql['pessoas_tipo_id'];


            if ($Pessoa->pessoas_tipo_id != 1) {
                $json_array['sucess'] = false;
                $json_array['mensagem'] .= "\n- Erro no TIPO DE USUARIO";
            } else {

                $nova_senha = rand(1000, 9999);
                $nova_senha_md5 = md5($nova_senha);
                $Hibernate->exe("UPDATE pessoas SET senha = '" . $nova_senha_md5 . "' WHERE  cpf = '" . $Pessoa->cpf . "' LIMIT 1;");

                $json_array['sucess'] = true;
                $json_array['mensagem'] = "Uma NOVA SENHA foi enviada para seu CELULAR por SMS (mensagem de texto)!";
            }
        } else {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- Erro CPF nao encontrado";
        }


        if ($json_array['sucess'] == true) {

            if ($Pessoa->id == null) {

                $json_array['sucess'] = true;
                $json_array['mensagem'] = "SMS enviado!";
            }
        }
    } else if ($data->action == "getPessoaForCpfFromTipo") {

        $Pessoa = new Pessoa();

        $Pessoa->cpf = $Geral->verificaDados1($data->cpf);
        $Pessoa->pessoas_tipo_id = $Geral->verificaDados1($data->tipo);

        if ($Pessoa->cpf == "") {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- CPF DO ADVOGADO em branco";
        } else if (strlen($Pessoa->cpf) != 11) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- CPF DO ADVOGADO deve conter 11 digitos";
        } else if (is_numeric($Pessoa->cpf) == false) {
            $json_array['sucess'] = false;
            $json_array['mensagem'] .= "\n- CPF DO ADVOGADO deve conter apenas numeros";
        } else {

            $result = $Hibernate->exe("SELECT * FROM 
                                             pessoas WHERE 
                                                    cpf = '" . $Pessoa->cpf . "' AND 
                                                    pessoas_tipo_id = '" . $Pessoa->pessoas_tipo_id . "' ;");

            if ($row = mysqli_fetch_array($result)) {

                $Pessoa->id = $row["id"];
            } else {
                $json_array['sucess'] = false;
                $json_array['mensagem'] .= "\n- Erro CPF DO ADVOGADO nao encontrado";
            }
        }

        if ($json_array['sucess'] == true) {

            if ($Pessoa->id != null) {

                $json_array['operador_id'] = $Pessoa->id;

                $json_array['sucess'] = true;
                $json_array['mensagem'] = "CPF DO ADVOGADO ENCONTRADO";
            }
        }
    }
}

echo json_encode($json_array);
