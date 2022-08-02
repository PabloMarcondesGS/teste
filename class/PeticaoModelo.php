<?php
include_once("EntidadeBasica.php");
error_reporting(E_ALL ^ E_NOTICE);

class PeticaoModelo extends EntidadeBasica{
	
    public $processo_subtipo_id;
    public $texto;
    
    public function nome_tabela(){
		return "peticao_modelo";
	}	
	
	public function id_tabela(){
		return "id";
	}

}

?>