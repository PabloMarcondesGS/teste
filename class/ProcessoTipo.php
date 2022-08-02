<?php
include_once("EntidadeBasica.php");
error_reporting(E_ALL ^ E_NOTICE);

class ProcessoTipo extends EntidadeBasica{
	
    public $nome;
    public $descricao;
        
    public function nome_tabela(){
		return "processo_tipo";
	}	
	
	public function id_tabela(){
		return "id";
	}

}

?>