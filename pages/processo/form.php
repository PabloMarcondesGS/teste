<?Php
session_start();
include_once('../../class/Geral.php');
include_once('../../class/Processo.php');
include_once('../../class/Pessoa.php');
include_once('../../class/ProcessoTipo.php');
include_once('../../class/ProcessoSubtipo.php');
include_once('../../class/ProcessoStatus.php');
include_once('../../class/Hibernate.php');
include_once('../../class/Arquivo.php');
include_once('../../class/CaixaEntrada.php');

include_once('../../class/Login_admin.php');
$acaoLogin_admin = new Login_admin;
$acaoLogin_admin->protegePagina();

$Cliente = new Pessoa();
$Operador = new Pessoa();
$Processo = new Processo();
$ProcessoTipo = new ProcessoTipo();
$ProcessoSubtipo = new ProcessoSubtipo();
$Hibernate = new Hibernate();
$Geral = new Geral();
$ProcessoStatus = new ProcessoStatus();
$Arquivo = new Arquivo();
$CaixaEntrada = new CaixaEntrada();

$Processo->id = $Geral->verificaDados($_REQUEST["id_"]);

if ($Processo->id != "") {

	$result = $Hibernate->buscar_por_campo($Processo, $Processo->id_tabela(), $Processo->id);
	if ($array = mysqli_fetch_array($result)) {

		$Processo->cliente_id = $array["cliente_id"];
		$Processo->operador_id = $array["operador_id"];
		$Processo->processo_tipo_id = $array["processo_tipo_id"];
		$Processo->processo_subtipo_id = $array["processo_subtipo_id"];
		$Processo->processo_status_id = $array["processo_status_id"];
		$Processo->data_cadastro = $array["data_cadastro"];

		$qtdAQ = 0;
		$resultAQ = $Hibernate->exe("SELECT COUNT(*) as qtd FROM arquivo WHERE processo_id = '" . $Processo->id . "';");
		if ($sqlAQ = mysqli_fetch_array($resultAQ)) {
			$qtdAQ = $sqlAQ['qtd'];
		}

		$qtdPet = 0;
		$resultPet = $Hibernate->exe("SELECT COUNT(*) as qtdPet FROM peticao WHERE processo_id = '" . $Processo->id . "';");
		if ($sqlPet = mysqli_fetch_array($resultPet)) {
			$qtdPet = $sqlPet['qtdPet'];
		}
	}
} else {

	$Processo->cliente_id = $_SESSION['pro_cliente_id'];
	$Processo->operador_id = $_SESSION['pro_operador_id'];
	$Processo->processo_tipo_id = $_SESSION['pro_processo_tipo_id'];
	$Processo->processo_subtipo_id = $_SESSION['pro_processo_subtipo_id'];
	$Processo->processo_status_id = $_SESSION['pro_processo_status_id'];
}

?>

<div class="box">
	<div class="box-header">
		<div class="row">
			<div class="col-lg-12">
				<h2>
					<?Php if ($Processo->id != "") { ?>
						Administra&ccedil;&atilde;o do
					<?Php } else { ?>
						Cadastro do
					<?Php } ?>
					Processo |

					<?php
					if ($Processo->id != "") {
						echo str_pad($Processo->id, 10, "0", STR_PAD_LEFT) . "  |";
					}
					?>

					<?Php
					if ($Processo->data_cadastro != "") {

						echo substr($Geral->convertDataBdDataFormTIME($Processo->data_cadastro), 0, 10);
					}
					?>

					<a href="?page=<?Php echo base64_encode('../../pages/processo/list.php'); ?>" class="LINK">Voltar</a>

				</h2>

				<?php echo $Geral->exibir_mensagem(); ?>
			</div>
		</div>
	</div>

	<div class="box-body">
		<div class="row">
			<div class="col-lg-12">

				<div class="box-body">

					<div class="form-group">
						<div class="row">

							<div class="col-3 col-sm-3 col-md-3 col-lg-2">
								<a class="btn btn-app btn-arquivos" onclick="
										jQuery('#div-informacoes').toggle('slow'),
										jQuery('#div-arquivos').hide('slow')
									">
									<i class="fa fa-cogs m-bottom"></i> Informa&ccedil;&otilde;es
								</a>
							</div>

							<?Php if ($Processo->id != "") { ?>

								<div class="col-3 col-sm-3 col-md-3 col-lg-2">
									<a class="btn btn-app btn-arquivos" href="?page=<?Php echo base64_encode('../../pages/peticao/form.php'); ?>&processo_id=<?Php echo $Processo->id; ?>">
										<i class="fa fa-file-word-o m-bottom"></i> Petição
									</a>
								</div>

								<?Php if ($qtdPet > 0) { ?>
									<div class="col-3 col-sm-3 col-md-3 col-lg-2">
										<a class="btn btn-app btn-arquivos" href="../../pages/peticao/pdf.php?processo_id=<?Php echo $Processo->id; ?>">
											<i class="fa fa-file-pdf-o m-bottom"></i> Petição PDF
										</a>
									</div>
								<?Php } ?>

								<?Php if ($qtdAQ > 0) { ?>
									<div class="col-3 col-sm-3 col-md-3 col-lg-2">
										<a class="btn btn-app btn-arquivos" onclick="
											jQuery('#div-arquivos').toggle('slow'),
											jQuery('#div-informacoes').hide('slow')
											">
											<?Php
											$qtd_arquivos = 0;
											$resultQtd = $Hibernate->exe("SELECT COUNT(*) as qtd_arquivos FROM arquivo WHERE processo_id = " . $Processo->id . " ;");
											if ($sqlQtd = mysqli_fetch_array($resultQtd)) {
												$qtd_arquivos = $sqlQtd['qtd_arquivos'];
											}
											?>
											<span class="badge bg-teal"><?Php echo $qtd_arquivos; ?></span>
											<i class="fa fa-inbox m-bottom"></i> Fotos DOCs
										</a>
									</div>
								<?Php } ?>
							<?Php } ?>
						</div>

					</div>

				</div>

				<div id="div-informacoes" style="display: none;">
					<form role="form" name="form1" id="form1" action="?page=<?Php echo base64_encode('../../pages/processo/exe.php'); ?>" method="post">

						<div class="form-group">
							<div class="row">
								<div class="col-lg-4">
									<label for="nome">Protocolo</label>
									<input placeholder="Protocolo em branco" name="protocolo" id="protocolo" value="<?php echo str_pad($Processo->id, 10, "0", STR_PAD_LEFT); ?>" type="text" class="form-control" maxlength="255" readonly />
								</div>

								<div class="col-lg-4">
									<label for="nome">Cliente</label>
									<select name="cliente_id" id="cliente_id" class="form-control">
										<option value="">Selecione o Cliente</option>
										<?Php
										$resultC = $Hibernate->exe("SELECT * FROM pessoas WHERE pessoas_tipo_id = 1 ;");
										while ($arrayC = mysqli_fetch_array($resultC)) {
											$Cliente = new Pessoa();
											$Cliente->id = $arrayC["id"];
											$Cliente->nome = utf8_encode($arrayC["nome"]);

										?><option <?Php if ($Processo->cliente_id == $Cliente->id) {
																echo ' selected ';
															} ?> value="<?Php echo $Cliente->id; ?>"><?Php echo $Cliente->nome; ?></option><?Php

																																																								} ?>
									</select>
								</div>

								<div class="col-lg-4">
									<label for="nome">Operador</label>
									<select name="operador_id" id="operador_id" class="form-control">
										<option value="">Nenhum</option>
										<?Php
										$resultO = $Hibernate->exe("SELECT * FROM pessoas WHERE pessoas_tipo_id = 2 ;");
										while ($arrayO = mysqli_fetch_array($resultO)) {
											$Operador = new Pessoa();
											$Operador->id = $arrayO["id"];
											$Operador->nome = utf8_encode($arrayO["nome"]);

										?><option <?Php if ($Processo->operador_id == $Operador->id) {
																echo ' selected ';
															} ?> value="<?Php echo $Operador->id; ?>"><?Php echo $Operador->nome; ?></option><?Php

																																																									} ?>
									</select>
								</div>
							</div>
						</div>

						<div class="form-group">
							<div class="row">
								<div class="col-lg-4">
									<label for="nome">Tipo</label>
									<select name="processo_tipo_id" id="processo_tipo_id" class="form-control">
										<option value="">Selecione o Tipo</option>
										<?Php
										$resultPT = $Hibernate->listar($ProcessoTipo);
										while ($arrayPT = mysqli_fetch_array($resultPT)) {
											$ProcessoTipo = new ProcessoTipo();
											$ProcessoTipo->id = $arrayPT["id"];
											$ProcessoTipo->nome = utf8_encode($arrayPT["nome"]);

										?><option <?Php if ($Processo->processo_tipo_id == $ProcessoTipo->id) {
																echo ' selected ';
															} ?> value="<?Php echo $ProcessoTipo->id; ?>"><?Php echo $ProcessoTipo->nome; ?></option><?Php

																																																														} ?>
									</select>
								</div>

								<div class="col-lg-4">
									<label for="nome">Subtipo</label>
									<select name="processo_subtipo_id" id="processo_subtipo_id" class="form-control">
										<option value="">Selecione o Subtipo</option>
										<?Php
										$resultPS = $Hibernate->listar($ProcessoSubtipo);
										while ($arrayPS = mysqli_fetch_array($resultPS)) {
											$ProcessoSubtipo = new ProcessoSubtipo();
											$ProcessoSubtipo->id = $arrayPS["id"];
											$ProcessoSubtipo->nome = utf8_encode($arrayPS["nome"]);

										?><option <?Php if ($Processo->processo_subtipo_id == $ProcessoSubtipo->id) {
																echo ' selected ';
															} ?> value="<?Php echo $ProcessoSubtipo->id; ?>"><?Php echo $ProcessoSubtipo->nome; ?></option><?Php

																																																																	} ?>
									</select>
								</div>

								<div class="col-lg-4">
									<label for="processo_status_id">Status</label>
									<select name="processo_status_id" id="processo_status_id" class="form-control">
										<option value="">Selecione o Status</option>
										<?Php
										$resultS = $Hibernate->listar($ProcessoStatus, "id", "ASC");
										while ($arrayS = mysqli_fetch_array($resultS)) {
											$ProcessoStatus = new ProcessoStatus();
											$ProcessoStatus->id = $arrayS["id"];
											$ProcessoStatus->nome = utf8_encode($arrayS["nome"]);

										?><option <?Php if ($Processo->processo_status_id == $ProcessoStatus->id) {
																echo ' selected ';
															} ?> value="<?Php echo $ProcessoStatus->id; ?>"><?Php echo $ProcessoStatus->nome; ?></option><?Php

																																																																} ?>
									</select>
								</div>
							</div>
						</div>

						<div class="form-group">
							<div class="row">
								<div class="col-lg-12">

									<?Php if ($Processo->id != "") { ?>
										<?Php if ($qtdAQ > 0) { ?>
											<label for="processo_status_id">Enviar email com anexos</label>
											<input style="width: 30px;height: 30px;" type="checkbox" name="enviar_anexos" id="enviar_anexos" value="1">
										<?Php } ?>
									<?Php } ?>

								</div>

								<div class="col-lg-12">
									<?Php if ($Processo->id != "") { ?>
										<input name="id_" type="hidden" id="id_" value="<?Php echo $Processo->id; ?>">
										<input name="action" id="action" type="hidden" value="alterar" />
										<button type="submit" class="btn btn-primary form-control">Salvar</button>
									<?Php } else { ?>
										<input name="action" id="action" type="hidden" value="cadastrar" />
										<button type="submit" class="btn btn-primary form-control">Cadastrar</button>
									<?Php } ?>
								</div>
							</div>
						</div>

					</form>
				</div>

				<?Php if ($Processo->id != "") { ?>

					<?Php if ($qtdAQ > 0) { ?>
						<div id="div-arquivos" style="display: none;">
							<?Php
							$result = $Hibernate->exe("SELECT * FROM arquivo WHERE processo_id = '" . $Processo->id . "' ;");

							while ($sql = mysqli_fetch_array($result)) {

								$Arquivo = new Arquivo();
								$Arquivo->id = $sql['id'];
								$Arquivo->arquivo_tipo_id = $sql['arquivo_tipo_id'];
								$Arquivo->processo_id = $sql['processo_id'];
								$Arquivo->arquivo_ref = $sql['arquivo_ref'];
								$Arquivo->data_cadastro = $sql['data_cadastro'];

							?>

								<div class="col-lg-3 div-arquivo-image">
									<img src="data:image/png;base64,<?Php echo $Arquivo->arquivo_ref; ?>" class="img-fluid img-thumbnail arquivo-image" alt="Foto processo <?Php echo $Arquivo->processo_id; ?>">
								</div>

							<?Php } ?>
						</div>
					<?Php } ?>

				<?Php } ?>

			</div>
		</div>

		<script>
			jQuery('#div-informacoes').show('fast')
		</script>

		<?php $Geral->apagar_mensagem(); ?>
	</div>