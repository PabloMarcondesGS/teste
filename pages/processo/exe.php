<?Php

header("Content-Type: text/html; charset=utf-8");
session_start();
include_once('../../class/Geral.php');
include_once('../../class/Hibernate.php');
include_once('../../class/Processo.php');
include_once('../../class/Constantes.php');
include_once('../../class/Arquivo.php');
include_once('../../bower_components/fpdf/fpdf.php');

require_once('../../build/api/PHPMailer_5.2.4/class.phpmailer.php');

include_once('../../class/Login_admin.php');
$acaoLogin_admin = new Login_admin;
$acaoLogin_admin->protegePagina();

$Geral = new Geral;
$Hibernate = new Hibernate;
$Constantes = new Constantes();

$Processo = new Processo();

$action = $Geral->verificaDados($_REQUEST["action"]);

$errou = false;
$mensagem = "";

$Processo->id = $Geral->verificaDados($_REQUEST["id_"]);

if ($action == "alterar" || $action == "cadastrar") {

	$Processo->processo_status_id = $Geral->verificaDados($_REQUEST["processo_status_id"]);
	$_SESSION['pro_processo_status_id'] = $Processo->processo_status_id;

	$Processo->cliente_id = $Geral->verificaDados($_REQUEST["cliente_id"]);
	$_SESSION['pro_cliente_id'] = $Processo->cliente_id;

	$Processo->operador_id = $Geral->verificaDados($_REQUEST["operador_id"]);
	$_SESSION['pro_operador_id'] = $Processo->operador_id;

	$Processo->processo_tipo_id = $Geral->verificaDados($_REQUEST["processo_tipo_id"]);
	$_SESSION['pro_processo_tipo_id'] = $Processo->processo_tipo_id;

	$Processo->processo_subtipo_id = $Geral->verificaDados($_REQUEST["processo_subtipo_id"]);
	$_SESSION['pro_processo_subtipo_id'] = $Processo->processo_subtipo_id;

	if ($Processo->processo_status_id == "" || $Processo->processo_status_id == 0) {
		$mensagem .= "- STATUS n&atilde;o encontrado!<br>";
		$errou = true;
	}

	$enviar_anexos = $Geral->verificaDados($_REQUEST["enviar_anexos"]);

	if ($enviar_anexos == true) {

		if ($Processo->id != "") {

			$resultA = $Hibernate->exe("SELECT * FROM arquivo WHERE processo_id = '" . $Processo->id . "' ;");

			$array_arquivos = array();
			$array_arquivos_nome = array();

			while ($sqlA = mysqli_fetch_array($resultA)) {

				$Arquivo = new Arquivo();
				$Arquivo->id = $sqlA['id'];
				$Arquivo->arquivo_tipo_id = $sqlA['arquivo_tipo_id'];
				$Arquivo->processo_id = $sqlA['processo_id'];
				$Arquivo->arquivo_ref = $sqlA['arquivo_ref'];
				$Arquivo->data_cadastro = $sqlA['data_cadastro'];

				$nome_arquivo = "arquivo_" . $Processo->id . "_" . $Arquivo->id;
				$caminhoImagemPb = $Constantes->getCAMINHO_ANEXOS() . $nome_arquivo . ".jpg";

				$imagem = $Geral->base64_to_file($Arquivo->arquivo_ref, $caminhoImagemPb);

				$im = imagecreatefromjpeg($imagem);

				if ($im && imagefilter($im, IMG_FILTER_GRAYSCALE)) {
					if (imagejpeg($im, $caminhoImagemPb)) {

						$pdf = new FPDF();

						$pdf->AddPage('P');
						$pdf->SetDisplayMode('real', 'default');

						$pdf->Image($caminhoImagemPb, 10, 10, 180, 0, 'jpg', '');

						$pdf->Output($Constantes->getCAMINHO_PDF() . $nome_arquivo . ".pdf", 'F');

						array_push($array_arquivos, $Constantes->getCAMINHO_PDF() . $nome_arquivo . ".pdf");

						array_push($array_arquivos_nome, $nome_arquivo);
					}
				}
				imagedestroy($im);
			}

			$mail = new PHPMailer(true);

			$mail->IsSMTP();

			try {

				$mail->Host = 'smtp.recifeweb.com';
				$mail->SMTPAuth   = true;
				$mail->Port       = 25;
				$mail->Username = 'contato@recifeweb.com';
				$mail->Password = 'xBax73$2';

				$mail->SetFrom('contato@recifeweb.com', 'Recife Web');
				$mail->AddReplyTo('contato@recifeweb.com', 'Recife Web');
				$mail->Subject = 'Teste';

				$mail->AddAddress('contato@recifeweb.com', 'Recife Web');

				$mail->MsgHTML("teste");

				foreach ($array_arquivos as $key => $value) {

					$mail->AddAttachment($value);
				}

				$a = $mail->Send();

				if ($a == 1) {
?>
					<script>
						alert('Anexos enviados por email');
					</script>
<?Php

					foreach ($array_arquivos_nome as $key => $value) {

						unlink("../../arquivos_pdf/" . $value . ".pdf");
						unlink("../../arquivos_anexos/" . $value . ".jpg");
					}
				}
			} catch (phpmailerException $e) {

				echo $e->errorMessage();
				die();
			}
		}
	}

	if ($Processo->cliente_id == "" || $Processo->cliente_id == 0) {
		$mensagem .= "- CLIENTE n&atilde;o encontrado!<br>";
		$errou = true;
	}

	if ($Processo->processo_tipo_id == "" || $Processo->processo_tipo_id == 0) {
		$mensagem .= "- TIPO DE PROCESSO n&atilde;o encontrado!<br>";
		$errou = true;
	}

	if ($Processo->processo_subtipo_id == "" || $Processo->processo_subtipo_id == 0) {
		$mensagem .= "- SUBTIPO DE PROCESSO n&atilde;o encontrado!<br>";
		$errou = true;
	}

	if ($Processo->operador_id == "" || $Processo->operador_id == 0) {
		$Processo->operador_id = 'NULL';
	}

	if ($errou == false) {

		if ($action == "cadastrar") {

			$Processo->data_cadastro = date('Y-m-d H:i:s');

			$Processo->id = $Hibernate->cadastrar($Processo);

			$Processo->protocolo = str_pad($Processo->id, 10, "0", STR_PAD_LEFT);
			$Hibernate->exe("UPDATE processo SET protocolo = '" . $Processo->protocolo . "' WHERE (id = '" . $Processo->id . "') LIMIT 1;");

			$mensagem = $Constantes->getSUCESS();
		} else if ($action == "alterar") {

			$Processo->data_cadastro = "NO_UPDATE";

			$Hibernate->editar($Processo);

			$mensagem = $Constantes->getSUCESS();
		}
	}

	$_SESSION['mensagem'] = $mensagem;
	$Geral->voltarPagina('index.php?page=' . base64_encode('../../pages/processo/form.php') . '&id_=' . $Processo->id . '&errou=' . $errou);
}
?>