<?Php
session_start();
include_once('../../class/Geral.php');
include_once('../../class/Peticao.php');
include_once('../../class/PeticaoStatus.php');
include_once('../../class/Hibernate.php');

include_once('../../class/Login_admin.php');
$acaoLogin_admin = new Login_admin;
$acaoLogin_admin->protegePagina();

$Geral = new Geral;
$Peticao = new Peticao();
$PeticaoStatus = new PeticaoStatus();
$Hibernate = new Hibernate();

$Peticao->processo_id = $Geral->verificaDados($_REQUEST["processo_id"]);

if ($Peticao->processo_id != "") {

	$result = $Hibernate->exe("SELECT * FROM peticao WHERE processo_id = '" . $Peticao->processo_id . "';");
	if ($array = mysqli_fetch_array($result)) {

		$Peticao->id = $array["id"];
		$Peticao->peticao_status_id = $array["peticao_status_id"];
		$Peticao->texto = $array["texto"];
		$Peticao->peticao_modelo_id = $array["peticao_modelo_id"];
	} else {

		$Peticao->peticao_status_id = $_SESSION['pet_peticao_status_id'];
		$Peticao->texto = $_SESSION['pet_texto'];
	}

	if ($Peticao->texto == "") {
		$resultPM = $Hibernate->exe("SELECT peticao_modelo.* FROM peticao_modelo
										INNER JOIN processo_subtipo ON processo_subtipo.id = peticao_modelo.processo_subtipo_id
										INNER JOIN processo ON processo.processo_subtipo_id = processo_subtipo.id AND processo.id = '" . $Peticao->processo_id . "'
											GROUP BY peticao_modelo.id;");

		if ($arrayPM = mysqli_fetch_array($resultPM)) {

			$Peticao->peticao_modelo_id = $arrayPM['id'];
			$Peticao->texto = $arrayPM['texto'];
		}
	}
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
					<?Php if ($Peticao->id != "") { ?>
						Administra&ccedil;&atilde;o
					<?Php } else { ?>
						Cadastro
					<?Php } ?>

					da Petição
					<?php
					if ($Peticao->id != "") {
						echo " (" . str_pad($Peticao->id, 10, "0", STR_PAD_LEFT) . ")";
					}
					?>

					no Processo (<?Php echo str_pad($Peticao->processo_id, 10, "0", STR_PAD_LEFT); ?>) |

					<a href="?page=<?Php echo base64_encode('../../pages/processo/form.php'); ?>&id_=<?Php echo $Peticao->processo_id; ?>" class="LINK">Voltar</a>

					<?Php if ($Peticao->id != "") { ?>

						| <a href="../../pages/peticao/pdf.php?processo_id=<?Php echo $Peticao->processo_id; ?>" class="LINK">Exportar PDF</a>

					<?Php } ?>

				</h2>

				<?php echo $Geral->exibir_mensagem(); ?>
			</div>
		</div>
	</div>

	<div class="box-body">
		<div class="row">
			<div class="col-lg-12">

				<form role="form" name="form1" id="form1" action="?page=<?Php echo base64_encode('../../pages/peticao/exe.php'); ?>" method="post">

					<input name="processo_id" type="hidden" id="processo_id" value="<?Php echo $Peticao->processo_id; ?>">

					<input name="peticao_modelo_id" type="hidden" id="peticao_modelo_id" value="<?Php echo $Peticao->peticao_modelo_id; ?>">

					<div class="box-body">

						<div class="form-group">
							<div class="row">
								<div class="col-lg-12">
									<label for="peticao_status_id">Status da Petição</label>
									<select name="peticao_status_id" id="peticao_status_id" class="form-control" required>
										<option value="">Selecione o Status da Petição</option>
										<?Php
										$resultPS = $Hibernate->listar($PeticaoStatus);

										while ($arrayPS = mysqli_fetch_array($resultPS)) {
											$PeticaoStatus = new PeticaoStatus();
											$PeticaoStatus->id = $arrayPS["id"];
											$PeticaoStatus->nome = $arrayPS["nome"];

										?><option <?Php if ($Peticao->peticao_status_id == $PeticaoStatus->id) {
																echo ' selected ';
															} ?> value="<?Php echo $PeticaoStatus->id; ?>"><?Php echo $PeticaoStatus->nome; ?></option><?Php

																																																												} ?>
									</select>
								</div>
							</div>
						</div>

						<div class="form-group">
							<div class="row">

								<div class="col-lg-12">
									<label for="texto">Texto</label>
									<textarea name="texto" id="texto" class="form-control" rows="15" required /><?Php echo $Peticao->texto; ?></textarea>
								</div>

							</div>
						</div>



					</div>

					<div>

						<?Php if ($Peticao->id != "") { ?>
							<input name="id_" type="hidden" id="id_" value="<?Php echo $Peticao->id; ?>">
							<input name="action" id="action" type="hidden" value="alterar" />
							<button type="submit" class="btn btn-primary form-control">Salvar</button>
						<?Php } else { ?>
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
	(function() {
		new FroalaEditor("#texto")
	})()
</script>

<?php $Geral->apagar_mensagem(); ?>