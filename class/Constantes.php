<?php
class Constantes{

	const SUCESS = "Opera&ccedil;&atilde;o realizada com sucesso!";      
	const ERROR = "Erro ao realizar a opera&ccedil;&atilde;o:";      
	
	const CAMINHO_ANEXOS = "../../arquivos_anexos/";
	
	// const CAMINHO_PDF = "C:/xampp/htdocs/projetos/SPApp/arquivos_pdf/";      
	const CAMINHO_PDF = "/var/www/vhosts/bspadvogados.com/httpdocs/app/arquivos_pdf/";      
	const CAMINHO_PDF_ABSOLUTO = "http://bspadvogados.com/app/arquivos_pdf/";
	
	public static function getSUCESS(){
		return self::SUCESS;
	}
	
	public static function getERROR(){
		return self::ERROR;
	}

	public static function getCAMINHO_ANEXOS(){
		return self::CAMINHO_ANEXOS;
	}

	public static function getCAMINHO_PDF(){
		return self::CAMINHO_PDF;
	}

	public static function getCAMINHO_PDF_ABSOLUTO(){
		return self::CAMINHO_PDF_ABSOLUTO;
	}
	
}

?>