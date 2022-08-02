<?Php
header("Content-Type: text/html; charset=utf-8");
session_start();
include_once('../../class/Geral.php');
include_once('../../class/Hibernate.php');
include_once('../../class/PeticaoModelo.php');
include_once('../../class/Peticao.php');
include_once('../../class/Constantes.php');

include_once('../../class/Login_admin.php');
$acaoLogin_admin = new Login_admin;
$acaoLogin_admin->protegePagina();

$Geral = new Geral;
$Hibernate = new Hibernate;
$PeticaoModelo = new PeticaoModelo();
$Peticao = new Peticao();
$Constantes = new Constantes();

$action = $Geral->verificaDados($_REQUEST["action"]);

$errou = false;
$mensagem = "";

$PeticaoModelo->id = $Geral->verificaDados($_REQUEST["id_"]);

if ($action == "excluir") {

	$resultExc1 = $Hibernate->buscar_por_campo($Peticao, "peticao_modelo_id", $PeticaoModelo->id);

	if ($arrayExc1 = mysqli_fetch_array($resultExc1)) {

		$mensagem .= "- Este MODELO possui PETIÇÕES associados a ele, impossibilitando a exclusão.<br>";
		$errou = true;
	} else {

		$Hibernate->excluir_por_campo($PeticaoModelo, $PeticaoModelo->id_tabela(), $PeticaoModelo->id, 1);
		$mensagem = $Constantes->getSUCESS();
	}

	$_SESSION['mensagem'] = $mensagem;
	$Geral->voltarPagina('index.php?page=' . base64_encode('../../pages/peticao_modelo/list.php') . '&errou=' . $errou);
} else {

	$PeticaoModelo->processo_subtipo_id = $Geral->verificaDados($_REQUEST["processo_subtipo_id"]);
	$_SESSION['mod_pet_processo_subtipo_id'] = $PeticaoModelo->processo_subtipo_id;

	$PeticaoModelo->texto = $Geral->verificaDados($_REQUEST["texto"]);
	$_SESSION['mod_pet_texto'] = $PeticaoModelo->texto;

	if ($PeticaoModelo->processo_subtipo_id == "" || $PeticaoModelo->processo_subtipo_id == 0) {
		$mensagem .= "- Campo SUBTIPO em branco.<br>";
		$errou = true;
	}

	if ($PeticaoModelo->texto == "") {
		$mensagem .= "- Campo TEXTO em branco.<br>";
		$errou = true;
	}

	if ($errou == false) {

		if ($action == "cadastrar") {

			$PeticaoModelo->id = $Hibernate->cadastrar($PeticaoModelo);
			$mensagem = $Constantes->getSUCESS();
		} else if ($action == "alterar") {

			$Hibernate->editar($PeticaoModelo);
			$mensagem = $Constantes->getSUCESS();
		}
	}

	$_SESSION['mensagem'] = $mensagem;
	$Geral->voltarPagina('index.php?page=' . base64_encode('../../pages/peticao_modelo/form.php') . '&id_=' . $PeticaoModelo->id . '&errou=' . $errou);
}
