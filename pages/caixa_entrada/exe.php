<?Php
header("Content-Type: text/html; charset=utf-8");
session_start();
include_once('../../class/Geral.php');
include_once('../../class/Hibernate.php');
include_once('../../class/CaixaEntrada.php');
include_once('../../class/Constantes.php');
include_once('../../class/Pessoa.php');

include_once('../../class/Login_admin.php');
$acaoLogin_admin = new Login_admin;
$acaoLogin_admin->protegePagina();

$Geral = new Geral;
$Hibernate = new Hibernate;
$Constantes = new Constantes();
$Cliente = new Pessoa();
$CaixaEntrada = new CaixaEntrada();

$action = $Geral->verificaDados($_REQUEST["action"]);

$errou = false;
$mensagem = "";

if ($action == "enviarMesangem") {

	$CaixaEntrada->pessoas_id = $Geral->verificaDados($_REQUEST["cliente_id"]);
	$CaixaEntrada->mensagem = $Geral->verificaDados($_REQUEST["mensagem_envio"]);

	if ($CaixaEntrada->pessoas_id == "" || $CaixaEntrada->pessoas_id == 0) {
		$mensagem .= "\n- CLIENTE n&atilde;o encontrado!";
		$errou = true;
	}

	if ($CaixaEntrada->mensagem == "") {
		$mensagem .= "\n- MENSAGEM em branco!";
		$errou = true;
	}

	if ($errou == false) {

		$CaixaEntrada->data = date('Y-m-d H:i:s');
		$CaixaEntrada->tipo = 1;

		$Hibernate->cadastrar($CaixaEntrada);

		$mensagem = "";
	}

	$array_json = array();
	$array_json['mensagem'] = $mensagem;
	$array_json['errou'] = $errou;

	echo json_encode($array_json);
} else if ($action == "getMessage") {

	$lido = $Geral->verificaDados($_REQUEST['lido']);

	$Cliente->id = $Geral->verificaDados($_REQUEST["cliente_id"]);

	$limit = $Geral->verificaDados($_REQUEST['limit']);
	$offset = $Geral->verificaDados($_REQUEST['offset']);

	$result_cliente = $Hibernate->buscar_por_campo($Cliente, $Cliente->id_tabela(), $Cliente->id);
	if ($array_cliente = mysqli_fetch_array($result_cliente)) {
		$Cliente->nome = $array_cliente['nome'];
	}

	$result = $Hibernate->exe("SELECT * FROM caixa_entrada WHERE pessoas_id = '" . $Cliente->id . "' ORDER BY id DESC LIMIT $limit OFFSET $offset ;");

	$data = array();

	while ($sql = mysqli_fetch_array($result)) {

		$CaixaEntrada = new CaixaEntrada();
		$CaixaEntrada->id = $sql['id'];
		$CaixaEntrada->pessoas_id = $sql['pessoas_id'];
		$CaixaEntrada->mensagem = $sql['mensagem'];
		$CaixaEntrada->data = $sql['data'];
		$CaixaEntrada->tipo = $sql['tipo'];

		array_push($data, $CaixaEntrada);
	}

	$dataReverse = array_reverse($data);

	foreach ($dataReverse as $key => $CaixaEntrada) {

?>
		<div class="mensagem
		<?php if ($CaixaEntrada->tipo == 0) {
			echo " left";
		} else {
			echo " right";
		} ?>
		">
			<?Php
			echo "<b>" . $Geral->convertDataBdDataFormTIME($CaixaEntrada->data) . "<br>";

			if ($CaixaEntrada->tipo == 0) {
				echo $Cliente->nome;
			} else {
				echo "Advogado";
			}

			echo "</b><br>" . $CaixaEntrada->mensagem . "<br>";

			?>

		</div>

<?Php
		if ($CaixaEntrada->tipo == 0 && $lido == 1) {
			$Hibernate->exe("UPDATE caixa_entrada SET lida_destinatario = '1' WHERE (id = '" . $CaixaEntrada->id . "' AND tipo = '0');");
		}
	}
}
?>