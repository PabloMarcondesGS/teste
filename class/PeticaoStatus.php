<?php
include_once("EntidadeBasica.php");
error_reporting(E_ALL ^ E_NOTICE);

class PeticaoStatus extends EntidadeBasica{
	
    public $nome;
    
    public function nome_tabela(){
		return "peticao_status";
	}	
	
	public function id_tabela(){
		return "id";
	}

}

?>