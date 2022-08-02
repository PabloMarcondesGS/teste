<?php
include_once("EntidadeBasica.php");
error_reporting(E_ALL ^ E_NOTICE);

class Processo extends EntidadeBasica{
	
    public $cliente_id;
    public $operador_id;
    public $processo_tipo_id;
    public $processo_subtipo_id;
    public $processo_status_id;
    public $data_cadastro;
    
    public function nome_tabela(){
		return "processo";
	}	
	
	public function id_tabela(){
		return "id";
	}

}

?>