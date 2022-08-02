<?php
session_start();
include_once('Bd.php');
include_once('Geral.php');

class Login_admin {

	function validaUsuario($email, $senha) {
		
		$Bd = new Bd;
		$Bd->connBd();
		
		$sql = "SELECT * FROM pessoas WHERE email = '".$email."' AND senha = '".$senha."' AND (pessoas_tipo_id = 3 OR pessoas_tipo_id = 4) LIMIT 1";
		$query = $Bd->runQuery($sql);
		$resultado = mysqli_fetch_array($query);
		
		if (empty ($resultado)) {
			return false;
		} else {
	   
			$_SESSION['operador_id'] = $resultado['id'];
			$_SESSION['operador_pessoas_tipo_id'] = $resultado['pessoas_tipo_id'];
		    $_SESSION['operador_nome'] = $resultado['nome'];
			$_SESSION['operador_email'] = $resultado['email'];
		    $_SESSION['operador_senha'] = $resultado['senha'];
			$_SESSION['operador_cpf'] = $resultado['cpf'];
		    $_SESSION['operador_telefone'] = $resultado['telefone'];
			$_SESSION['operador_data_cadastro'] = $resultado['data_cadastro'];
			
			return true;
	
		}
	}
	
	function protegePagina() {
	   
		if (!isset ($_SESSION['operador_email']) OR !isset ($_SESSION['operador_senha'])) {
			
			$this->expulsaVisitante();
	
		}else if (!isset ($_SESSION['operador_email']) OR !isset ($_SESSION['operador_senha'])) {
	
				if (!$this->validaUsuario($_SESSION['operador_email'], $_SESSION['operador_senha'])) {
	
					$this->expulsaVisitante();
	
				}
	   }
	   
// 	   $this->autorizar_operador_na_pagina();
	
	}
	
	function expulsaVisitante() {
		
		$Geral = new Geral();
		
		unset($_SESSION['operador_id']);
		unset($_SESSION['operador_pessoas_tipo_id']);
		unset($_SESSION['operador_nome']);
		unset($_SESSION['operador_email']);
		unset($_SESSION['operador_senha']);
		unset($_SESSION['operador_cpf']);
		unset($_SESSION['operador_telefone']);
		unset($_SESSION['operador_data_cadastro']);
		
		session_destroy();
		$Geral->voltarPagina("../../pages/index/login.php");
		
	}
	
	function permite_apenas($permissao){
		if($_SESSION['operador_permissao']!=$permissao){
			$this->expulsaVisitante();
		}
	}
	
// 	function autorizar_operador_na_pagina(){
	    
// 	    $pages_caminho_todos = array(
// 	        "/projetos/BMEngenharia/pages/index/index.php",
// 	        "/projetos/BMEngenharia/pages/index/sair.php",
// 	        "/projetos/BMEngenharia/pages/pedido/pdf.php",
// 	        "/projetos/BMEngenharia/pages/centro_de_custo/exe.php",
// 	        "/projetos/BMEngenharia/pages/fornecedor/exe.php",
// 	        "/projetos/BMEngenharia/pages/pedido/exe.php",
// 	        "/projetos/BMEngenharia/pages/pessoa/exe.php",
// 	        "/projetos/BMEngenharia/pages/produto/exe.php",
// 	        "/projetos/BMEngenharia/pages/pedido/relatorio_excel.php",
// 	        "/bmengenharia/bmengenharia/pages/index/index.php",
// 	        "/bmengenharia/bmengenharia/pages/index/sair.php",
// 	        "/bmengenharia/bmengenharia/pages/pedido/pdf.php",
// 	        "/bmengenharia/bmengenharia/pages/centro_de_custo/exe.php",
// 	        "/bmengenharia/bmengenharia/pages/fornecedor/exe.php",
// 	        "/bmengenharia/bmengenharia/pages/pedido/exe.php",
// 	        "/bmengenharia/bmengenharia/pages/pessoa/exe.php",
// 	        "/bmengenharia/bmengenharia/pages/produto/exe.php",
// 	        "/bmengenharia/bmengenharia/pages/pedido/relatorio_excel.php"
	        
// 	    );
	    
// 	    $pages_variavel_adm = array(
// 	        "../../pages/centro_de_custo/list.php",
// 	        "../../pages/centro_de_custo/form.php",
// 	        "../../pages/centro_de_custo/exe.php",
	        
// 	        "../../pages/fornecedor/list.php",
// 	        "../../pages/fornecedor/form.php",
// 	        "../../pages/fornecedor/exe.php",
	        
// 	        "../../pages/pedido/enviar_aviso.php",
// 	        "../../pages/pedido/exe.php",
// 	        "../../pages/pedido/form.php",
// 	        "../../pages/pedido/list_eng.php",
// 	        "../../pages/pedido/list.php",
// 	        "../../pages/pedido/pdf.php",
// 	        "../../pages/pedido/relatorio.php",
	        
// 	        "../../pages/pessoa/exe.php",
// 	        "../../pages/pessoa/form.php",
// 	        "../../pages/pessoa/list.php",
	        
// 	        "../../pages/produto/exe.php",
// 	        "../../pages/produto/form.php",
// 	        "../../pages/produto/list.php"
	        
// 	    );
	    
// 	    $pages_variavel_des = array(
// 	        "../../pages/centro_de_custo/list.php",
// 	        "../../pages/centro_de_custo/form.php",
// 	        "../../pages/centro_de_custo/exe.php",
	        
// 	        "../../pages/fornecedor/list.php",
// 	        "../../pages/fornecedor/form.php",
// 	        "../../pages/fornecedor/exe.php",
	        
// 	        "../../pages/pedido/enviar_aviso.php",
// 	        "../../pages/pedido/exe.php",
// 	        "../../pages/pedido/form.php",
// 	        "../../pages/pedido/list_eng.php",
// 	        "../../pages/pedido/list.php",
// 	        "../../pages/pedido/pdf.php",
// 	        "../../pages/pedido/relatorio.php",
	        
// 	        "../../pages/pessoa/exe.php",
// 	        "../../pages/pessoa/form.php",
// 	        "../../pages/pessoa/list.php",
	        
// 	        "../../pages/produto/exe.php",
// 	        "../../pages/produto/form.php",
// 	        "../../pages/produto/list.php"
	        
// 	    );
	    
// 	    $pages_variavel_op = array(
	        
// 	        "../../pages/pedido/enviar_aviso.php",
// 	        "../../pages/pedido/exe.php",
// 	        "../../pages/pedido/form.php",
// 	        "../../pages/pedido/list.php",
// 	        "../../pages/pedido/pdf.php",
// 	        "../../pages/pedido/relatorio.php",
	        
// 	        "../../pages/produto/exe.php",
// 	        "../../pages/produto/form.php",
// 	        "../../pages/produto/list.php"
// 	    );
	    
// 	    $pages_variavel_eng = array(
	        
// 	        "../../pages/pedido/enviar_aviso.php",
// 	        "../../pages/pedido/exe.php",
// 	        "../../pages/pedido/form.php",
// 	        "../../pages/pedido/list.php",
// 	        "../../pages/pedido/pdf.php",
// 	        "../../pages/pedido/relatorio.php",
	        
// 	        "../../pages/produto/exe.php",
// 	        "../../pages/produto/form.php",
// 	        "../../pages/produto/list.php",
	        
// 	        "../../pages/pedido/list_eng.php"
// 	    );
	    
// 	    $caminho_site = $_SERVER['PHP_SELF'];
	    
// 	    $page_atual = base64_decode($_SESSION['page_atual']);
	    
// 	    $operador_permissao = $_SESSION['operador_permissao'];
	    
	    
// 	    if(($operador_permissao == 1 || $operador_permissao == 2 || $operador_permissao == 3 || $operador_permissao == 4) && in_array($caminho_site, $pages_caminho_todos) == false){
    	 
// // 	        $this->aviso_expusao($operador_permissao, $caminho_site,"pagina");
	        
// 	        $this->expulsaVisitante();
	        
// 	    }else{
	       
// 	        if($page_atual != ""){
	            
//     	        if($operador_permissao == 1 && in_array($page_atual, $pages_variavel_adm) == false){
    	            
// //     	            $this->aviso_expusao($operador_permissao, $page_atual,"variavel");
    	            
//     	            $this->expulsaVisitante();
    	        
//     	        }else if($operador_permissao == 2 && in_array($page_atual, $pages_variavel_des) == false){
    	           
// //     	            $this->aviso_expusao($operador_permissao, $page_atual,"variavel");
    	            
//     	            $this->expulsaVisitante();
    	        
//     	        }else if($operador_permissao == 3 && in_array($page_atual, $pages_variavel_op) == false){
    	           
// //     	            $this->aviso_expusao($operador_permissao, $page_atual,"variavel");
    	            
//     	            $this->expulsaVisitante();
    	        
//     	        }else if($operador_permissao == 4 && in_array($page_atual, $pages_variavel_eng) == false){
    	        
// //     	            $this->aviso_expusao($operador_permissao, $page_atual,"variavel");
    	            
//     	            $this->expulsaVisitante();
                    
//     	        }
	        
// 	        }
// 	    }
    	    
//     	unset($_SESSION['page_atual']);
//     	unset($page_atual);
	    
// 	}
    
	function aviso_expusao($operador_permissao,$pagina,$tipo){
	    ?>
	    <h1 style="background-color: red;">Expulsar pessoa do tipo <?php echo $operador_permissao; ?> na pagina <?php echo $pagina; ?> tipo <?php echo $tipo; ?></h1>
	    
	    <script>
			alert('Expulsar pessoa do tipo <?php echo $operador_permissao; ?> na pagina <?php echo $pagina; ?> tipo <?php echo $tipo; ?>');
	    </script>
	    
	    <?php 
	}
	
}

?>
