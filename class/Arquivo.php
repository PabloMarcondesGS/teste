<?php
include_once("EntidadeBasica.php");
error_reporting(E_ALL ^ E_NOTICE);

class Arquivo extends EntidadeBasica{
	
    public $id;
    public $arquivo_tipo_id;
    public $processo_id;
    public $arquivo_ref;
    public $data_cadastro;
    
    public function nome_tabela(){
		return "arquivo";
	}	
	
	public function id_tabela(){
		return "id";
	}

}

?>