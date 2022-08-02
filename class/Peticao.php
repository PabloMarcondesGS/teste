<?php
include_once("EntidadeBasica.php");
error_reporting(E_ALL ^ E_NOTICE);

class Peticao extends EntidadeBasica{
	
    public $processo_id;
    public $peticao_modelo_id;
    public $peticao_status_id;
    public $texto;
    public $data_cadastro;
    
    public function nome_tabela(){
		return "peticao";
	}	
	
	public function id_tabela(){
		return "id";
	}

}

?>