<?php
include_once("EntidadeBasica.php");
error_reporting(E_ALL ^ E_NOTICE);

class Pessoa extends EntidadeBasica{
	
    public $pessoas_tipo_id;
    public $nome;
    public $email;	
    public $senha;	
    public $cpf;
    public $telefone;
    public $data_cadastro;
    public $status;
    
    public function nome_tabela(){
		return "pessoas";
	}	
	
	public function id_tabela(){
		return "id";
	}

}
