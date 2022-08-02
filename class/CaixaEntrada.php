<?php
include_once("EntidadeBasica.php");
error_reporting(E_ALL ^ E_NOTICE);

class CaixaEntrada extends EntidadeBasica{
	
    public $id;
    public $pessoas_id;
    public $mensagem;
    public $data;
    public $tipo;
    
    public function nome_tabela(){
		return "caixa_entrada";
	}	
	
	public function id_tabela(){
		return "id";
	}

}

?>