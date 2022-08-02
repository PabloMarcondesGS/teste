<?php
include_once('../class/Hibernate.php');
include_once('../class/Pessoa.php');

function validar_app($chave_mobile, $app_code)
{

    $json_array = array();
    $json_array['sucess'] = false;
    $json_array['mensagem'] = "Erro desconhecido!";
    $json_array['id'] = null;

    if ($app_code === "sp_app_fhdjshHSJKKAD21VVCCCC2JDSLAJL80378jdsodsAAAAAAAAAAajasodsah879yhjads8782ujhdsasua") {

        if ($chave_mobile === "fhdjshHSJKKAD21VVCCCC2JDSLAJL80378jdsodsAAAAAAAAAAajasodsah879yhjads8782ujhdsasua") {

            $json_array['sucess'] = true;
            $json_array['mensagem'] = "APP OK";
            $json_array['id'] = null;
        } else {

            $json_array['sucess'] = false;
            $json_array['mensagem'] = "ERRO: Chave Incorreta";
            $json_array['id'] = null;
        }
    } else {
        $json_array['sucess'] = false;
        $json_array['mensagem'] = "ERRO: App nao reconhecido";
        $json_array['id'] = null;
    }

    return $json_array;
}

function validar_usuario($chave_mobile, $app_code, $Pessoa)
{

    $Hibernate = new Hibernate();

    $json_array = array();
    $json_array['sucess'] = false;
    $json_array['mensagem'] = "Erro desconhecido!";
    $json_array['pessoa'] = null;

    if ($app_code === "sp_app_fhdjshHSJKKAD21VVCCCC2JDSLAJL80378jdsodsAAAAAAAAAAajasodsah879yhjads8782ujhdsasua") {

        if ($chave_mobile === "fhdjshHSJKKAD21VVCCCC2JDSLAJL80378jdsodsAAAAAAAAAAajasodsah879yhjads8782ujhdsasua") {

            $senha_md5 = md5($Pessoa->senha);

            $sql = "SELECT * FROM pessoas WHERE cpf = '" . $Pessoa->cpf . "' AND senha = '" . $senha_md5 . "' AND status = '1' LIMIT 1";
            $query = $Hibernate->exe($sql);
            $resultado = mysqli_fetch_array($query);

            if (empty($resultado)) {

                $json_array['sucess'] = false;
                $json_array['mensagem'] = "ERRO: dados incorretos";
                $json_array['pessoa'] = null;
            } else {

                $json_array['sucess'] = true;
                $json_array['mensagem'] = "Login OK: " . $resultado['cpf'];

                $Pessoa = new Pessoa();
                $Pessoa->id = $resultado['id'];
                $Pessoa->pessoas_tipo_id = $resultado['pessoas_tipo_id'];
                $Pessoa->nome = $resultado['nome'];
                $Pessoa->email = $resultado['email'];
                $Pessoa->senha = $resultado['senha'];
                $Pessoa->cpf = $resultado['cpf'];
                $Pessoa->telefone = $resultado['telefone'];
                $Pessoa->data_cadastro = $resultado['data_cadastro'];

                $json_array['pessoa'] = $Pessoa;
            }
        } else {

            $json_array['sucess'] = false;
            $json_array['mensagem'] = "ERRO: Chave Incorreta";
            $json_array['pessoa'] = null;
        }
    } else {
        $json_array['sucess'] = false;
        $json_array['mensagem'] = "ERRO: App nao reconhecido";
        $json_array['pessoa'] = null;
    }

    return $json_array;
}
