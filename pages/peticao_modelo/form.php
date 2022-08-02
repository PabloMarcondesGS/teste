<?Php
session_start();
include_once('../../class/Geral.php'); 
include_once('../../class/PeticaoModelo.php'); 
include_once('../../class/ProcessoSubtipo.php');
include_once('../../class/Hibernate.php'); 

include_once('../../class/Login_admin.php');
$acaoLogin_admin = new Login_admin;
$acaoLogin_admin->protegePagina();

$Geral= new Geral;
$PeticaoModelo = new PeticaoModelo();
$ProcessoSubtipo = new ProcessoSubtipo();
$Hibernate = new Hibernate();

$PeticaoModelo->id = $Geral->verificaDados($_REQUEST["id_"]);

$query = "";

if($PeticaoModelo->id != ""){
	
	$result=$Hibernate->buscar_por_campo($PeticaoModelo,$PeticaoModelo->id_tabela(),$PeticaoModelo->id);
	if($array = mysqli_fetch_array($result)){
		
		$PeticaoModelo->processo_subtipo_id = $array["processo_subtipo_id"];
		$PeticaoModelo->texto = $array["texto"];
	
		if($PeticaoModelo->processo_subtipo_id != ""){
			$query = " OR processo_subtipo.id = '".$PeticaoModelo->processo_subtipo_id."' ";
		}

	}
	
}else{
	
    $PeticaoModelo->processo_subtipo_id = $_SESSION['mod_pet_processo_subtipo_id'];
    $PeticaoModelo->texto = $_SESSION['mod_pet_texto'];
    
}

?>

<link rel="stylesheet" href="../../dist/css/font-awesome.min.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/froala_editor.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/froala_style.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/code_view.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/draggable.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/colors.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/emoticons.css">
<!-- <link rel="stylesheet" href="../../build/wysiwyg/css/plugins/image_manager.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/image.css"> -->
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/line_breaker.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/table.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/char_counter.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/video.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/fullscreen.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/file.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/quick_insert.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/help.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/third_party/spell_checker.css">
<link rel="stylesheet" href="../../build/wysiwyg/css/plugins/special_characters.css">
<link rel="stylesheet" href="../../dist/css/codemirror.min.css">

<div class="box">
	<div class="box-header">
		<div class="row">
			<div class="col-lg-12">
				<h2>
					<?Php if($PeticaoModelo->id != ""){ ?>
						Administra&ccedil;&atilde;o 
					<?Php }else{ ?>
						Cadastro
					<?Php } ?>
					de Modelo de Petição <?php if($PeticaoModelo->nome!=""){ echo "| ".$PeticaoModelo->nome; } ?> | <a href="?page=<?Php echo base64_encode('../../pages/peticao_modelo/list.php'); ?>" class="LINK">Voltar</a>
				</h2>
				
				<?php echo $Geral->exibir_mensagem(); ?>
			</div>
		</div>
	</div>
						
	<div class="box-body">
		<div class="row">
			<div class="col-lg-12">
			
			
				<form role="form" name="form1" id="form1" action="?page=<?Php echo base64_encode('../../pages/peticao_modelo/exe.php'); ?>" method="post" >
					
					<div class="box-body">
						
						<div class="form-group">
							<label for="processo_subtipo_id">Tipo de PeticaoModelo</label>
							<select name="processo_subtipo_id" id="processo_subtipo_id" class="form-control" required >
									<option value="">Selecione o Subtipo</option>
									<?Php 

									$resultST = $Hibernate->exe("SELECT processo_subtipo.* FROM processo_subtipo 
																	LEFT JOIN peticao_modelo ON 
																		peticao_modelo.processo_subtipo_id = processo_subtipo.id 
																			WHERE 
																				peticao_modelo.id IS NULL $query
																					GROUP BY processo_subtipo.id;");

									while($arrayST = mysqli_fetch_array($resultST)){
										$ProcessoSubtipo = new ProcessoSubtipo();
										$ProcessoSubtipo->id = $arrayST["id"];				
										$ProcessoSubtipo->nome = $arrayST["nome"];
										
										?><option <?Php if($PeticaoModelo->processo_subtipo_id == $ProcessoSubtipo->id){ echo ' selected '; } ?> value="<?Php echo $ProcessoSubtipo->id;?>"><?Php echo $ProcessoSubtipo->nome; ?></option><?Php 
						
									} ?>						
								</select>
							</div>
							
							<div class="form-group">
								<div class="row">
								
									<div class="col-lg-12">
										<label for="texto">Texto</label>
										<textarea name="texto" id="texto" class="form-control" rows="15" required /><?Php echo $PeticaoModelo->texto; ?></textarea>
									</div>
									
								</div>
							</div>
																					
						</div>
						
						<div>
							
							<?Php if($PeticaoModelo->id != ""){ ?>
									<input name="id_" type="hidden" id="id_" value="<?Php echo $PeticaoModelo->id; ?>" >
									<input name="action" id="action" type="hidden" value="alterar" />
									<button type="submit" class="btn btn-primary form-control">Salvar</button>
							<?Php }else{ ?>
									<input name="action" id="action" type="hidden" value="cadastrar" />
									<button type="submit" class="btn btn-primary form-control">Cadastrar</button>
							<?Php } ?>
							
						</div>
						
						
					</form>				
			
			</div>
		</div>
	</div>
</div>

	<script type="text/javascript" src="../../dist/js/codemirror.min.js"></script>
	<script type="text/javascript" src="../../dist/js/xml.min.js"></script>

	<script type="text/javascript" src="../../build/wysiwyg/js/froala_editor.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/align.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/char_counter.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/code_beautifier.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/code_view.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/colors.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/draggable.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/emoticons.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/entities.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/file.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/font_size.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/font_family.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/fullscreen.min.js"></script>
	<!-- <script type="text/javascript" src="../../build/wysiwyg/js/plugins/image.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/image_manager.min.js"></script> -->
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/line_breaker.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/inline_style.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/link.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/lists.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/paragraph_format.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/paragraph_style.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/quick_insert.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/quote.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/table.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/save.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/url.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/video.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/help.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/print.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/third_party/spell_checker.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/special_characters.min.js"></script>
	<script type="text/javascript" src="../../build/wysiwyg/js/plugins/word_paste.min.js"></script>

	<script>
	(function () {
		new FroalaEditor("#texto")
	})()
	</script>

<?php $Geral->apagar_mensagem(); ?>