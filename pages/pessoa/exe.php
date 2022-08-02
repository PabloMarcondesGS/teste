<?Php
header("Content-Type: text/html; charset=utf-8");
session_start();
include_once('../../class/Geral.php');
include_once('../../class/Hibernate.php');
include_once('../../class/Pessoa.php');
include_once('../../class/Constantes.php');

include_once('../../class/Processo.php');

include_once('../../class/Login_admin.php');
$acaoLogin_admin = new Login_admin;
$acaoLogin_admin->protegePagina();

$Geral = new Geral;
$Hibernate = new Hibernate;
$Pessoa = new Pessoa();
$Constantes = new Constantes();

$Processo = new Processo();

$action = $Geral->verificaDados($_REQUEST["action"]);

$errou = false;
$mensagem = "";

$Pessoa->id = $Geral->verificaDados($_REQUEST["id_"]);

if ($action == "ativar") {

	$Hibernate->exe("UPDATE pessoas SET status = '1' WHERE id = " . $Pessoa->id . " LIMIT 1;");

	$_SESSION['mensagem'] = "Usuário ativado com sucesso!";
	$Geral->voltarPagina('index.php?page=' . base64_encode('../../pages/pessoa/list.php'));
} else if ($action == "desativar") {

	$Hibernate->exe("UPDATE pessoas SET status = '2' WHERE id = " . $Pessoa->id . " LIMIT 1;");

	$_SESSION['mensagem'] = "Usuário desativado com sucesso!";
	$Geral->voltarPagina('index.php?page=' . base64_encode('../../pages/pessoa/list.php'));
} else if ($action == "excluir") {

	$resultExc1 = $Hibernate->buscar_por_campo($Processo, "cliente_id", $Pessoa->id);

	if ($arrayExc1 = mysqli_fetch_array($resultExc1)) {

		$mensagem .= "- Este PESSOA possui PROCESSOS associados a ele, impossibilitando a exclus&atilde;o.<br>";
		$errou = true;
	} else {

		$resultExc2 = $Hibernate->buscar_por_campo($Processo, "operador_id", $Pessoa->id);

		if ($arrayExc2 = mysqli_fetch_array($resultExc2)) {

			$mensagem .= "- Este PESSOA possui PROCESSOS associados a ele, impossibilitando a exclus&atilde;o.<br>";
			$errou = true;
		} else {

			$Hibernate->excluir_por_campo($Pessoa, $Pessoa->id_tabela(), $Pessoa->id, 1);
			$mensagem = $Constantes->getSUCESS();
		}
	}

	$_SESSION['mensagem'] = $mensagem;
	$Geral->voltarPagina('index.php?page=' . base64_encode('../../pages/pessoa/list.php') . '&errou=' . $errou);
} else {

	$Pessoa->pessoas_tipo_id = $Geral->verificaDados($_REQUEST["pessoas_tipo_id"]);
	$_SESSION['pes_pessoas_tipo_id'] = $Pessoa->pessoas_tipo_id;

	$Pessoa->nome = $Geral->verificaDados($_REQUEST["nome"]);
	$_SESSION['pes_nome'] = $Pessoa->nome;

	$Pessoa->email = $Geral->verificaDados($_REQUEST["email"]);
	$_SESSION['pes_email'] = $Pessoa->email;

	$Pessoa->senha = $Geral->verificaDados($_REQUEST["senha"]);
	$_SESSION['pes_senha'] = $Pessoa->senha;

	$Pessoa->cpf = $Geral->verificaDados($_REQUEST["cpf"]);
	$_SESSION['pes_cpf'] = $Pessoa->cpf;

	$Pessoa->telefone = $Geral->verificaDados($_REQUEST["telefone"]);
	$_SESSION['pes_telefone'] = $Pessoa->telefone;


	$alterar_senha = $Geral->verificaDados($_REQUEST["alterar_senha"]);
	$_SESSION['pes_alterar_senha'] = $alterar_senha;


	if ($Pessoa->pessoas_tipo_id == "" || $Pessoa->pessoas_tipo_id == 0) {
		$mensagem .= "- Campo TIPO DE USU&Aacute;RIO em branco.<br>";
		$errou = true;
	}

	if ($Pessoa->nome == "") {
		$mensagem .= "- Campo NOME em branco.<br>";
		$errou = true;
	} else if (strlen($Pessoa->nome) > 255) {
		$mensagem .= "- Campo NOME deve conter no m&aacute;ximo 255 caracteres.<br>";
		$errou = true;
	}

	if ($Pessoa->email == "") {
		$mensagem .= "- Campo EMAIL em branco.<br>";
		$errou = true;
	} else if (filter_var($Pessoa->email, FILTER_VALIDATE_EMAIL) == false) {
		$mensagem .= "- Campo EMAIL incorreto.<br>";
		$errou = true;
	} else if (strlen($Pessoa->email) > 255) {
		$mensagem .= "- Campo EMAIL deve conter no m&aacute;ximo 255 caracteres.<br>";
		$errou = true;
	} else if ($Hibernate->verifica_se_existe($Pessoa, 'email', $Pessoa->email) == true) {
		$errou = true;
		$mensagem .= "- EMAIL já existente no sistema: " . $Pessoa->email . "<br>";
	}

	if ($Pessoa->cpf == "") {
		$errou = true;
		$mensagem .= "- Digite seu CPF<br>";
	} else if (strlen($Pessoa->cpf) != 11) {
		$errou = true;
		$mensagem .= "- CPF deve conter 11 digitos<br>";
	} else if (is_numeric($Pessoa->cpf) == false) {
		$errou = true;
		$mensagem .= "- CPF deve conter apenas numeros<br>";
	}
	if ($Hibernate->verifica_se_existe($Pessoa, 'cpf', $Pessoa->cpf) == true) {
		$errou = true;
		$mensagem .= "- CPF ja existente no sistema: " . $Pessoa->cpf . "<br>";
	}

	if ($Pessoa->telefone == "") {
		$errou = true;
		$mensagem .= "- Digite seu CELULAR<br>";
	} else if (strlen($Pessoa->telefone) != 11) {
		$errou = true;
		$mensagem .= "- CELULAR deve conter 11 caracteres (apenas numeros, com DDD e o 9 digito, ex: 81987005500)<br>";
	} else if (is_numeric($Pessoa->telefone) == false) {
		$errou = true;
		$mensagem .= "- CELULAR deve conter apenas numeros<br>";
	}

	if (
		($Pessoa->id != "" && $alterar_senha == 1 && $Pessoa->senha == "") ||
		($Pessoa->id == "" && $Pessoa->senha == "")
	) {

		$mensagem .= "- Campo SENHA em branco.<br>";
		$errou = true;
	} else if (
		($Pessoa->id != "" && $alterar_senha == 1 && strlen($Pessoa->senha) < 4) ||
		($Pessoa->id == "" && strlen($Pessoa->senha) < 4)
	) {

		$mensagem .= "- Sua SENHA deve conter mais de 3 caracteres<br>";
		$errou = true;
	}

	if ($errou == false) {

		if ($action == "cadastrar") {

			$Pessoa->data_cadastro = date('Y-m-d H:i:s');

			$Pessoa->senha = md5($Pessoa->senha);

			$Pessoa->status = 1;

			$Pessoa->id = $Hibernate->cadastrar($Pessoa);
			$mensagem = $Constantes->getSUCESS();
		} else if ($action == "alterar") {

			$Pessoa->data_cadastro = "NO_UPDATE";

			if ($alterar_senha != 1) {
				$Pessoa->senha = "NO_UPDATE";
			} else {
				$Pessoa->senha = md5($Pessoa->senha);
			}

			$Pessoa->status = "NO_UPDATE";

			$Hibernate->editar($Pessoa);
			$mensagem = $Constantes->getSUCESS();
		}
	}

	$_SESSION['mensagem'] = $mensagem;
	$Geral->voltarPagina('index.php?page=' . base64_encode('../../pages/pessoa/form.php') . '&id_=' . $Pessoa->id . '&errou=' . $errou);
}
