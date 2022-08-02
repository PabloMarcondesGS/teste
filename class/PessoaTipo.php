<?php
include_once("EntidadeBasica.php");
error_reporting(E_ALL ^ E_NOTICE);

class PessoaTipo extends EntidadeBasica{
	
    public $nome;
    
	public function nome_tabela(){
		return "pessoas_tipo";
	}	
	
	public function id_tabela(){
		return "id";
	}

}

?>