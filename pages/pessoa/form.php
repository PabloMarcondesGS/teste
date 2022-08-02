<?Php
session_start();
include_once('../../class/Geral.php');
include_once('../../class/Pessoa.php');
include_once('../../class/PessoaTipo.php');
include_once('../../class/Hibernate.php');

include_once('../../class/Login_admin.php');
$acaoLogin_admin = new Login_admin;
$acaoLogin_admin->protegePagina();

$Geral = new Geral;
$Pessoa = new Pessoa();
$PessoaTipo = new PessoaTipo();
$Hibernate = new Hibernate();


$Pessoa->id = $Geral->verificaDados($_REQUEST["id_"]);

if ($Pessoa->id != "") {

	$result = $Hibernate->buscar_por_campo($Pessoa, $Pessoa->id_tabela(), $Pessoa->id);
	if ($array = mysqli_fetch_array($result)) {

		$Pessoa->id = $array["id"];
		$Pessoa->pessoas_tipo_id = $array["pessoas_tipo_id"];
		$Pessoa->nome = $array["nome"];
		$Pessoa->email = $array["email"];
		$Pessoa->cpf = $array["cpf"];
		$Pessoa->telefone = $array["telefone"];
		$Pessoa->data_cadastro = $array["data_cadastro"];
	}
} else {

	$Pessoa->pessoas_tipo_id = $_SESSION['pes_pessoas_tipo_id'];
	$Pessoa->nome = $_SESSION['pes_nome'];
	$Pessoa->email = $_SESSION['pes_email'];
	$Pessoa->cpf = $_SESSION['pes_cpf'];
	$Pessoa->telefone = $_SESSION['pes_telefone'];
	$Pessoa->data_cadastro = $_SESSION['pes_data_cadastro'];
}

$alterar_senha = $_SESSION['pes_alterar_senha'];

?>

<script>
	var offset = 0;
	var limit = 30;
</script>

<div class="box">
	<div class="box-header">
		<div class="row">
			<div class="col-lg-12">
				<h2>
					<?Php if ($Pessoa->id != "") { ?>
						Administra&ccedil;&atilde;o do
					<?Php } else { ?>
						Cadastro do
					<?Php } ?>
					Pessoa <?php if ($Pessoa->nome != "") {
										echo "| " . $Pessoa->nome;
									} ?> | <a href="?page=<?Php echo base64_encode('../../pages/pessoa/list.php'); ?>" class="LINK">Voltar</a>
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

							<div class="col-lg-2">
								<a class="btn btn-app btn-arquivos" onclick="									
									<?Php if ($Pessoa->id != '') { ?>
										jQuery('#lido').val('0'),
										jQuery('#div-caixa-entrada').hide('slow'),
									<?Php } ?>
									jQuery('#div-informacoes').toggle('slow')
								">
									<i class="fa fa-cogs m-bottom"></i> Informa&ccedil;&otilde;es
								</a>
							</div>

							<?Php if ($Pessoa->id != "" && $Pessoa->pessoas_tipo_id == 1) { ?>
								<div class="col-lg-2">
									<a class="btn btn-app btn-arquivos" onclick="
								jQuery('#lido').val('1'),
								getMessage(<?Php echo $Pessoa->id; ?>,limit,offset)
								jQuery('#div-caixa-entrada').toggle('slow'),
								jQuery('#div-informacoes').hide('slow')
								">
										<?Php
										$qtd_mensagens = 0;
										$resultQtdM = $Hibernate->exe("SELECT COUNT(*) as qtd_mensagens FROM caixa_entrada WHERE lida_destinatario = '0' AND tipo = '0' AND pessoas_id = '" . $Pessoa->id . "' ;");
										if ($sqlQtdM = mysqli_fetch_array($resultQtdM)) {
											$qtd_mensagens = $sqlQtdM['qtd_mensagens'];

											if ($qtd_mensagens > 0) {
										?>
												<span class="badge bg-teal"><?Php echo $qtd_mensagens; ?></span>
										<?Php
											}
										}
										?>
										<i class="fa fa-envelope m-bottom"></i> Mensagens
									</a>
								</div>
							<?Php } ?>
						</div>

					</div>

				</div>

				<div id="div-informacoes" style="display: none;">
					<form role="form" name="form1" id="form1" action="?page=<?Php echo base64_encode('../../pages/pessoa/exe.php'); ?>" method="post">

						<div class="box-body">

							<div class="form-group">
								<label for="pessoas_tipo_id">Tipo de Pessoa</label>
								<select name="pessoas_tipo_id" id="pessoas_tipo_id" class="form-control" required>
									<option value="">Selecione o Tipo de Pessoa</option>
									<?Php
									$resultTU = $Hibernate->listar($PessoaTipo);
									while ($arrayTU = mysqli_fetch_array($resultTU)) {
										$PessoaTipo = new PessoaTipo();
										$PessoaTipo->id = $arrayTU["id"];
										$PessoaTipo->nome = $arrayTU["nome"];

									?><option <?Php if ($Pessoa->pessoas_tipo_id == $PessoaTipo->id) {
															echo ' selected ';
														} ?> value="<?Php echo $PessoaTipo->id; ?>"><?Php echo $PessoaTipo->nome; ?></option><?Php

																																																								} ?>
								</select>
							</div>

							<div class="form-group">
								<div class="row">

									<div class="col-lg-4">
										<label for="nome">Nome</label>
										<input placeholder="Nome em branco" name="nome" id="nome" value="<?Php echo $Pessoa->nome; ?>" type="text" class="form-control" maxlength="255" required />
									</div>

									<div class="col-lg-4">
										<label for="email">Email</label>
										<input placeholder="email@empresa.com... em branco" name="email" id="email" value="<?Php echo $Pessoa->email; ?>" type="email" class="form-control" maxlength="255" required />
									</div>

									<div class="col-lg-4">
										<label for="email">Cpf</label>
										<input placeholder="Cpf em branco" name="cpf" id="cpf" value="<?Php echo $Pessoa->cpf; ?>" type="text" class="form-control" maxlength="11" pattern="\d{11}" required />
									</div>
								</div>
							</div>

							<div class="form-group">
								<div class="row">
									<div class="col-lg-6">
										<label for="login">Telefone</label>
										<input placeholder="Telefone em branco" name="telefone" id="telefone" value="<?Php echo $Pessoa->telefone; ?>" type="text" class="form-control" maxlength="11" pattern="\d{11}" required />
									</div>

									<div class="col-lg-6">
										<label for="senha">Senha</label>
										<input placeholder="Senha em branco" name="senha" style="background-color: #FFFEB2;" id="senha" value="" type="password" class="form-control" maxlength="15" <?php if ($Pessoa->id == "") { ?> <?php } ?> />

										<?php if ($Pessoa->id != "") { ?>
											Editar senha: <input type="checkbox" name="alterar_senha" value="1" <?Php if ($alterar_senha == "1") { ?> checked="checked" <?Php } ?>>
										<?php } ?>

									</div>
								</div>
							</div>

							&Uacute;ltimo acesso: <?php echo $Geral->convertDataBdDataFormTIME($Pessoa->data_cadastro); ?>

						</div>

						<div>

							<?Php if ($Pessoa->id != "") { ?>
								<input name="id_" type="hidden" id="id_" value="<?Php echo $Pessoa->id; ?>">
								<input name="action" id="action" type="hidden" value="alterar" />
								<button type="submit" class="btn btn-primary form-control">Salvar</button>
							<?Php } else { ?>
								<input name="action" id="action" type="hidden" value="cadastrar" />
								<button type="submit" class="btn btn-primary form-control">Cadastrar</button>
							<?Php } ?>

						</div>


					</form>
				</div>

				<script>

				</script>

				<?Php if ($Pessoa->id != "") { ?>

					<div id="div-caixa-entrada">
						<input type="hidden" id="lido" value="0">

						<div id="div-dialogo"></div>

						<div id="div-dialogo-caixa">
							<textarea rows="4" style="width: 100%;" id="mensagem_envio" name="mensagem_envio" onkeypress="checkPressEnter(<?Php echo $Pessoa->id; ?>);"></textarea>
							<button class="btn btn-primary botao-send form-control" onclick="enviarMesangem(<?Php echo $Pessoa->id; ?>)">Enviar Mensagem</button>
						</div>

					</div>


				<?Php } ?>

			</div>
		</div>
	</div>

	<script>
		jQuery('#div-informacoes').show('fast')
	</script>

	<?Php if ($Pessoa->id != "") { ?>

		<script>
			var divDialogo = document.getElementById("div-dialogo");

			var callOldMessages = false;

			var scrollPosition = 0;
			var scrollOldHeight = 0;

			divDialogo.addEventListener("scroll", async () => {

				if (divDialogo.scrollTop < 100 && callOldMessages == false) {
					callOldMessages = true;

					offsetFind = offset + limit;

					scrollOldPosition = divDialogo.scrollTop;
					scrollOldHeight = divDialogo.scrollHeight;
					var res = await getMessage(<?Php echo $Pessoa->id; ?>, limit, offsetFind).then((res) => {
						if (res != '') {
							offset = offsetFind;

							var diffHeight = divDialogo.scrollHeight - scrollOldHeight;

							divDialogo.scrollTop = scrollOldPosition + diffHeight;

						}
						callOldMessages = false;
					})
				}

			});

			jQuery('#div-caixa-entrada').hide();
		</script>

	<?Php } ?>

	<?php $Geral->apagar_mensagem(); ?>