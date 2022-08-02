<?php
include_once("EntidadeBasica.php");
error_reporting(E_ALL ^ E_NOTICE);

class ProcessoStatus extends EntidadeBasica{
	
    public $nome;
        
    public function nome_tabela(){
		return "processo_status";
	}	
	
	public function id_tabela(){
		return "id";
	}

}

?>