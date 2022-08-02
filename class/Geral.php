<?php
session_start();
class Geral
{

	function paginacaoList($requestPagina, $tabela, $paginaCaminho, $script = "", $scriptQtd = "", $queryAdd = "", $variaveis = "")
	{

		include_once('Hibernate.php');

		$Hibernate = new Hibernate();

		$divisao = 10;
		if ($requestPagina) {

			$pagina = $this->verificaDados($requestPagina);

			$fim = intval($pagina * $divisao);

			$inicio = $fim - $divisao;

			if ($inicio < 0) {
				$inicio = 0;
			}
		} else {

			$inicio = 0;
			$fim = $divisao;
		}

		if ($script == "") {

			$sql_busca = "SELECT * FROM $tabela $queryAdd ORDER BY $tabela.id DESC LIMIT $divisao OFFSET $inicio ;";

			$sql_busca_qtd = "SELECT COUNT(*) as qtd FROM $tabela $queryAdd ;";
		} else {

			$sql_busca = $script . " ORDER BY $tabela.id DESC; ";

			$sql_busca_qtd = $scriptQtd;
		}

		$limite1 = $Hibernate->exe($sql_busca_qtd);
		if ($my_selectA = mysqli_fetch_array($limite1)) {

			$qtd = $my_selectA['qtd'];
			$paginas = $qtd / $divisao;

			if (strstr($paginas, ".") == null) {
			} else {
				$paginas = $paginas + 1;
			}

			$paginas = intval($paginas);
			$in = 1;

			$p_antes = $_REQUEST['pagina'] - 5;
			if ($p_antes <= 0) {
				$p_antes = 0;
			}
			$p_depois = $_REQUEST['pagina'] + 5;
			if ($p_depois >= $paginas) {
				$p_depois = $paginas;
			}
?>

			<div style="margin-left: 10px;">
				Páginas:
				<?Php
				while ($in <= $paginas) {

					if ($in >= $p_antes && $in <= $p_depois) {
				?>

						<a class="paginacaoLink" href="?page=<?Php echo base64_encode($paginaCaminho); ?>&pagina=<?Php echo $in; ?>&total=<?Php echo $qtd; ?><?Php echo $variaveis; ?>">
							<?Php echo $in; ?>
						</a>

				<?Php
					}

					$in++;
				}
				?>
			</div>
		<?Php
		}

		return $sql_busca;
	}

	function base64_to_file($base64_string, $output_file)
	{

		$ifp = fopen($output_file, 'wb');

		fwrite($ifp, base64_decode($base64_string));

		fclose($ifp);

		return $output_file;
	}

	function alert($valor)
	{
		?><script>
			alert("<?php echo $valor; ?>")
		</script><?php
						}

						function console_log($valor)
						{
							?><script>
			console.log("<?php echo $valor; ?>")
		</script><?php
						}

						function exibir_mensagem()
						{
							if ($_SESSION['mensagem'] != "") { ?>
			<div <?php if ($_REQUEST['errou'] == false) { ?> class="bg-success" <?php } else { ?> class="bg-danger" <?php } ?> style="padding: 10px">
				<?php echo $_SESSION['mensagem']; ?>
			</div>
<?php }
						}

						function apagar_mensagem()
						{
							$this->destroir_sessao();
						}

						function resize($width, $height)
						{
							list($w, $h) = getimagesize($_FILES['image']['tmp_name']);

							$ratio = max($width / $w, $height / $h);
							$h = ceil($height / $ratio);
							$x = ($w - $width / $ratio) / 2;
							$w = ceil($width / $ratio);

							$path = 'arquivos/' . $width . 'x' . $height . '_' . $_FILES['image']['name'];

							$imgString = file_get_contents($_FILES['image']['tmp_name']);

							$image = imagecreatefromstring($imgString);
							$tmp = imagecreatetruecolor($width, $height);
							imagecopyresampled($tmp, $image, 0, 0, $x, 0, $width, $height, $w, $h);

							switch ($_FILES['image']['type']) {
								case 'image/jpeg':
									imagejpeg($tmp, $path, 100);
									break;
								case 'image/png':
									imagepng($tmp, $path, 0);
									break;
								case 'image/gif':
									imagegif($tmp, $path);
									break;
								default:
									exit;
									break;
							}
							return $path;

							imagedestroy($image);
							imagedestroy($tmp);
						}

						function somar_dias_uteis($str_data, $int_qtd_dias_somar = 7)
						{
							$str_data = substr($str_data, 0, 10);

							if (preg_match("@/@", $str_data) == 1) {
								$str_data = implode("-", array_reverse(explode("/", $str_data)));
							}

							$array_data = explode('-', $str_data);
							$count_days = 0;
							$int_qtd_dias_uteis = 0;

							while ($int_qtd_dias_uteis < $int_qtd_dias_somar) {
								$count_days++;
								if (($dias_da_semana = gmdate('w', strtotime('+' . $count_days . 'day', mktime(0, 0, 0, $array_data[1], $array_data[2], $array_data[0])))) != '0' && $dias_da_semana != '6') {
									$int_qtd_dias_uteis++;
								}
							}

							return gmdate('d/m/Y', strtotime('+' . $count_days . 'day', strtotime($str_data)));
						}

						function valorPorExtenso($valor = 0)
						{
							$singular = array(
								"centavo",
								"real",
								"mil",
								"milh&atilde;o",
								"bilh&atilde;o",
								"trilh&atilde;o",
								"quatrilh&atilde;o"
							);
							$plural = array(
								"centavos",
								"reais",
								"mil",
								"milh&otilde;es",
								"bilh&otilde;es",
								"trilh&otilde;es",
								"quatrilh&otilde;es"
							);

							$c = array(
								"",
								"cem",
								"duzentos",
								"trezentos",
								"quatrocentos",
								"quinhentos",
								"seiscentos",
								"setecentos",
								"oitocentos",
								"novecentos"
							);
							$d = array(
								"",
								"dez",
								"vinte",
								"trinta",
								"quarenta",
								"cinquenta",
								"sessenta",
								"setenta",
								"oitenta",
								"noventa"
							);
							$d10 = array(
								"dez",
								"onze",
								"doze",
								"treze",
								"quatorze",
								"quinze",
								"dezesseis",
								"dezesete",
								"dezoito",
								"dezenove"
							);
							$u = array(
								"",
								"um",
								"dois",
								"tr&ecirc;s",
								"quatro",
								"cinco",
								"seis",
								"sete",
								"oito",
								"nove"
							);

							$z = 0;

							$valor = number_format($valor, 2, ".", ".");
							$inteiro = explode(".", $valor);
							for ($i = 0; $i < count($inteiro); $i++)
								for ($ii = strlen($inteiro[$i]); $ii < 3; $ii++)
									$inteiro[$i] = "0" . $inteiro[$i];

							// $fim identifica onde que deve se dar junÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o de centenas por "e" ou por "," ;)
							$fim = count($inteiro) - ($inteiro[count($inteiro) - 1] > 0 ? 1 : 2);
							for ($i = 0; $i < count($inteiro); $i++) {
								$valor = $inteiro[$i];
								$rc = (($valor > 100) && ($valor < 200)) ? "cento" : $c[$valor[0]];
								$rd = ($valor[1] < 2) ? "" : $d[$valor[1]];
								$ru = ($valor > 0) ? (($valor[1] == 1) ? $d10[$valor[2]] : $u[$valor[2]]) : "";

								$r = $rc . (($rc && ($rd || $ru)) ? " e " : "") . $rd . (($rd && $ru) ? " e " : "") . $ru;
								$t = count($inteiro) - 1 - $i;
								$r .= $r ? " " . ($valor > 1 ? $plural[$t] : $singular[$t]) : "";
								if ($valor == "000")
									$z++;
								elseif ($z > 0) $z--;
								if (($t == 1) && ($z > 0) && ($inteiro[0] > 0))
									$r .= (($z > 1) ? " de " : "") . $plural[$t];
								if ($r)
									$rt = $rt . ((($i > 0) && ($i <= $fim) && ($inteiro[0] > 0) && ($z < 1)) ? (($i < $fim) ? ", " : " e ") : " ") . $r;
							}

							return ($rt ? $rt : "zero");
						}

						function xml_simple_clipping($urlrss, $tamanho, $urlhost)
						{

							$array = array();

							if (!($fp = fopen($urlrss, "r"))) {
								//	      echo "<div>Erro ao tentar ler o RSS do site $urlhost</div>\r\n";
								//	      echo "<h5>Fonte: <a href='http://$urlhost' target='_blank'>$urlhost</a></h5>\r\n";
								return;
							}

							while ($data = fread($fp, 4096)) {
								$xml_parse .= $data;
							}

							$oXML = simplexml_load_string($xml_parse);

							$br = "<br />";
							//	   echo "<b> InformaÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Âµes do site de RSS</b>". $br;

							//	   echo $oXML->channel[0]->title . $br; 
							//	   echo $oXML->channel[0]->description . $br; 
							//	   echo $oXML->channel[0]->link . $br; 
							//	   echo $oXML->channel[0]->lastBuildDate . $br; 

							//		echo 'string';

							//	   echo $br.$br."<b><u>NotÃƒÆ’Ã‚Â­cias do RSS</b></u>". $br.$br;

							for ($i = 0; $i < $tamanho; $i++) {
								$oNews = $oXML->channel[0]->item[$i];

								if ($oNews->title[0] != '') {
									$nTitulo = $oNews->title[0];
									$nDescription = $oNews->description[0];
									$nLink = $oNews->link[0];
									$nPubDate = $oNews->pubDate[0];
									$nAutor = $oNews->author[0];

									$array[$i]['titulo'] = htmlspecialchars($nTitulo);
									$array[$i]['link'] = htmlspecialchars($nLink);

									//	         echo "<div>Ãƒâ€šÃ‚Â»  ".$nPubDate." ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬ï¿½ <a href='$nLink' target='_blank'>".htmlspecialchars($nTitulo)."</a></div>\r\n";
								} else {
									break;
								}
							}

							//	   echo "<h5>Fonte: <a href='http://$urlhost' target='_blank'>$urlhost</a></h5>\r\n";

							return $array;
						}

						function var_name($var)
						{
							foreach ($GLOBALS as $var_name => $value) {
								if ($value === $var) {
									return $var_name;
								}
							}

							return false;
						}

						public function verificar_modulo()
						{
							if ($_REQUEST['modulo'] != "") {
								$_SESSION['modulo'] = $_REQUEST['modulo'];
							} else {
								if ($_SESSION['modulo'] == "") {
									$this->voltarPagina("index.php");
								}
							}
						}

						public function iso_to_utf($valor)
						{
							$valor = iconv('ISO-8859-1', 'UTF-8', $valor);

							return $valor;
						}

						public function verificar_medidas_pac($altura, $largura, $comprimento, $peso)
						{

							$array_frete = $this->calcular_frete1("53020140", "53040000", "41106", $peso, 1, $comprimento, $altura, $largura, 1, 's', '0', 's');

							$Valor = (string) $array_frete->Valor;
							$PrazoEntrega = (string) $array_frete->PrazoEntrega;
							$MsgErro = (string) $array_frete->MsgErro;
							$Erro = (string) $array_frete->Erro;

							if ($Erro != 0) {
								return $MsgErro;
							} else {
								return false;
							}
						}

						public function calcular_frete1($cepOrigem, $cepDestino, $servico, $peso, $formato, $comprimento, $altura, $largura, $diametro, $maoPropria, $valor, $avisoRec)
						{

							try {

								$url = "http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=&sDsSenha=&sCepOrigem={$cepOrigem}&sCepDestino={$cepDestino}&nVlPeso={$peso}&nCdFormato={$formato}&nVlComprimento={$comprimento}&nVlAltura={$altura}&nVlLargura={$largura}&sCdMaoPropria={$maoPropria}&nVlValorDeclarado={$valor}&sCdAvisoRecebimento={$avisoRec}&nCdServico={$servico}&nVlDiametro={$diametro}&StrRetorno=xml";

								if (!$xml = simplexml_load_file($url)) {
									return 'xxxxx';
								} else {

									$xml = new SimpleXMLElement(trim(utf8_encode(file_get_contents($url))));

									foreach ($xml->cServico as $row) {

										$output = $row;
									}
								}
							} catch (Exception $e) {
								echo $e;
							}

							return $output;
						}

						function jquery2iso($in)
						{
							$CONV = array();
							$CONV['c4']['85'] = 'a';
							$CONV['c4']['84'] = 'A';
							$CONV['c4']['87'] = 'c';
							$CONV['c4']['86'] = 'C';
							$CONV['c4']['99'] = 'e';
							$CONV['c4']['98'] = 'E';
							$CONV['c5']['82'] = 'l';
							$CONV['c5']['81'] = 'L';
							$CONV['c4']['84'] = 'n';
							$CONV['c4']['83'] = 'N';
							$CONV['c3']['b3'] = 'ÃƒÆ’Ã‚Â³';
							$CONV['c3']['93'] = 'ÃƒÆ’Ã¢â‚¬Å“';
							$CONV['c5']['9b'] = 's';
							$CONV['c5']['9a'] = 'S';
							$CONV['c5']['ba'] = 'z';
							$CONV['c5']['b9'] = 'Z';
							$CONV['c5']['bc'] = 'z';
							$CONV['c5']['bb'] = 'Z';

							$i = 0;
							$out = '';
							while ($i < strlen($in)) {
								if (array_key_exists(bin2hex($in[$i]), $CONV)) {
									$out .= $CONV[bin2hex($in[$i])][bin2hex($in[$i + 1])];
									$i += 2;
								} else {
									$out .= $in[$i];
									$i += 1;
								}
							}

							return $out;
						}

						function json($erro, $mensagem, $exe_metodo = 0, $metodo = "")
						{
							$json = array(
								'erro' => $erro,
								'mensagem' => $mensagem,
								'exe_metodo' => $exe_metodo,
								'metodo' => $metodo
							);

							return json_encode($json);
						}

						function spreadsheet($server, $database, $user, $password, $query, $filename)
						{

							$connection = mysqli_pconnect($server, $user, $password) or trigger_error(mysqli_error(), E_USER_ERROR);

							mysqli_select_db($database);
							$recordset = mysqli_query($query, $connection) or die(mysqli_error());

							$columns = mysqli_num_fields($recordset);
							$rows = mysqli_num_rows($recordset);

							$row_recordset = mysqli_fetch_array($recordset, mysqli_NUM);

							header('Content-type: application/x-msdownload');
							header('Content-Disposition: attachment; filename=' . $filename . '.xls');
							header('Pragma: no-cache');
							header('Expires: 0');

							for ($i = 0; $i < $columns; $i++) {
								$spreadsheet .= strtoupper(mysqli_field_name($recordset, $i)) . "\t";
							}

							$spreadsheet .= "\n";

							for ($i = 0; $i < $rows; $i++) {
								$spreadsheet .= "\n";
								for ($n = 0; $n < $columns; $n++) {
									$spreadsheet .= $row_recordset[$n] . "\t";
								}
								$row_recordset = mysqli_fetch_array($recordset, mysqli_NUM);
							}

							print "$header\n$spreadsheet";
						}

						public static function exportar($html)
						{
							header("Content-type: application/vnd.ms-excel");
							header("Content-type: application/force-download");
							header("Content-Disposition: attachment; filename=file.xls");
							header("Pragma: no-cache");
							echo $html;
							exit();
						}

						public function destroir_sessao()
						{

							unset($_SESSION['mensagem']);
						}

						public function convert_protocolo_up($protocolo)
						{

							$final = substr($protocolo, 6);
							$tamanho = strlen($final . "");

							$zeros = 7 - $tamanho;
							$i = 1;
							while ($i <= $zeros) {
								$zeros1 .= "0";
								$i++;
							}

							$final = $zeros1 . $final;

							$protocolo = substr($protocolo, 0, 4) . substr($protocolo, 4, 2) . $final;

							return $protocolo;
						}

						public function convert_protocolo_down($protocolo)
						{

							$protocolo = substr($protocolo, 0, 4) . "." . substr($protocolo, 4, 2) . "/" . substr($protocolo, 6);

							return $protocolo;
						}

						public function array_msort($array, $cols)
						{
							foreach ($cols as $col => $order) {
								$colarr[$col] = array();
								foreach ($array as $k => $row) {
									$colarr[$col]['_' . $k] = strtolower($row[$col]);
								}
							}
							$eval = 'array_multisort(';
							foreach ($cols as $col => $order) {
								$eval .= '$colarr[\'' . $col . '\'],' . $order . ',';
							}
							$eval = substr($eval, 0, -1) . ');';
							eval($eval);
							$ret = array();
							foreach ($colarr as $col => $arr) {
								foreach ($arr as $k => $v) {
									$k = substr($k, 1);
									if (!isset($ret[$k]))
										$ret[$k] = $array[$k];
									$ret[$k][$col] = $array[$k][$col];
								}
							}
							return $ret;
						}

						public function testaExtensao($arquivo)
						{
							$extensao = pathinfo($arquivo, PATHINFO_EXTENSION);

							if (strtoupper($extensao) == strtoupper("JPG")) // IMAGENS: JPG, JPEG, CDR, AI, GIF, PNG, BMP, PSD
								return true;
							elseif (strtoupper($extensao) == strtoupper("JPEG")) return true;
							elseif (strtoupper($extensao) == strtoupper("GIF")) return true;
							elseif (strtoupper($extensao) == strtoupper("PNG")) return true;
							elseif (strtoupper($extensao) == strtoupper("BMP")) return true;
							else
								return false;
						}

						public function porcentagem($total, $valor)
						{

							$total = $this->formartarNumero($total);
							$valor = $this->formartarNumero($valor);

							$x = ($valor * 100) / $total;
							$x = round($x, 2);

							return $x;
						}

						public function formartarNumero($valor)
						{

							$valor = str_replace(",", ".", $valor);

							$sufixo = strstr($valor, ".");
							$sufixo = str_replace(".", "", $sufixo);

							if (strlen($sufixo) == 0) {
								$valor = $valor . '.00';
							} else
			if (strlen($sufixo) == 1) {
								$valor = $valor . '0';
							}

							$valor = number_format($valor, 2, ".", "");

							return $valor;
						}

						public function convertCnpjBdCnpjForm($cnpj)
						{

							$cnpj = str_pad($cnpj, 14, '0', STR_PAD_LEFT);

							$cnpj1 = substr($cnpj, 0, 2) . "." . substr($cnpj, 2, 3) . "." . substr($cnpj, 5, 3) . "/" . substr($cnpj, 8, 4) . "-" . substr($cnpj, 12, 2);

							$cnpj = $cnpj1;
							return $cnpj;
						}

						public function convertCnpjFormCnpjBd($cnpj)
						{

							$cnpj = str_replace(".", "", $cnpj);
							$cnpj = str_replace(".", "", $cnpj);
							$cnpj = str_replace("/", "", $cnpj);
							$cnpj = str_replace("-", "", $cnpj);

							return $cnpj;
						}

						public function convertCpfBdCpfForm($cpf)
						{

							$cpf = str_pad($cpf, 11, '0', STR_PAD_LEFT);

							$cpf1 = substr($cpf, 0, 3) . "." . substr($cpf, 3, 3) . "." . substr($cpf, 6, 3) . "-" . substr($cpf, 9);

							$cpf = $cpf1;
							return $cpf;
						}

						public function convertCpfFormCpfBd($cpf)
						{

							$cpf = str_replace(".", "", $cpf);
							$cpf = str_replace("-", "", $cpf);

							return $cpf;
						}

						public function convertDataBdDataForm($data)
						{
							if (strlen($data) == 10) {
								$data = explode("-", $data);
								$data = $data[2] . "/" . $data[1] . "/" . $data[0];
							}
							return $data;
						}

						public function convertDataFormDataBd($data)
						{
							if (strlen($data) == 10) {
								$data = explode("/", $data);
								$data = $data[2] . "-" . $data[1] . "-" . $data[0];
							}

							return $data;
						}

						public function convertDataBdDataFormTIME($data)
						{
							return $this->convertDataBdDataForm(substr($data, 0, 10)) . substr($data, 10);
						}

						public function gerarandonstring($caracteres)
						{

							$string = "abcdefghijklmnopqrstuvxyz123456789";

							$senha = "";
							for ($indice = 0; $indice < $caracteres; $indice++) {

								$rand = rand(0, 12);
								$senha .= substr($string, $rand, 1);
							}
							return $senha;
						}


						public function tratar_arquivo_upload($string)
						{
							// pegando a extensao do arquivo
							$partes 	= explode(".", $string);
							$extensao 	= $partes[count($partes) - 1];
							// somente o nome do arquivo
							$nome	= preg_replace('/\.[^.]*$/', '', $string);
							// removendo simbolos, acentos etc
							$a = 'Ã€Ã�Ã‚ÃƒÃ„Ã…Ã†Ã‡ÃˆÃ‰ÃŠÃ‹ÃŒÃ�ÃŽÃ�Ã�Ã‘Ã’Ã“Ã”Ã•Ã–Ã˜Ã™ÃšÃ›ÃœÃ�ÃžÃŸÃ Ã¡Ã¢Ã£Ã¤Ã¥Ã¦Ã§Ã¨Ã©ÃªÃ«Ã¬Ã­Ã®Ã¯Ã°Ã±Ã²Ã³Ã´ÃµÃ¶Ã¸Ã¹ÃºÃ»Ã¼Ã½Ã½Ã¾Ã¿Å”Å•?';
							$b = 'aaaaaaaceeeeiiiidnoooooouuuuybsaaaaaaaceeeeiiiidnoooooouuuuyybyRr-';
							$nome = strtr($nome, utf8_decode($a), $b);
							$nome = str_replace(".", "-", $nome);
							$nome = preg_replace("/[^0-9a-zA-Z\.]+/", '-', $nome);
							return utf8_decode(strtolower($nome . "." . $extensao));
						}

						public function uploadiarArquivo($arquivo, $destino, $numero, $nomeclatura, $extencoes_permitidas, $tamanho_maximo)
						{

							$arrayArq = array();
							$arrayArq['caminho'] = "";
							$arrayArq['mensagem'] = "";
							$arrayArq['errou'] = false;
							$arrayArq['erro_code'] = 0;

							if (isset($arquivo)) {

								if ($arquivo['name'] != "") {

									$name = $this->tratar_arquivo_upload(utf8_decode($arquivo['name']));
									$size = $arquivo['size'];
									$type = $arquivo['type'];
									$tmp_name = $arquivo['tmp_name'];

									$caminho = $destino . $name;

									if (strstr($extencoes_permitidas, $type)) {
										if ($size > 0 && strlen($name) > 1) {
											if ($size <= $tamanho_maximo) {

												while (file_exists($caminho) == true) {

													$string = $this->gerarandonstring(8);
													$name = $string . $name;
													$caminho = $destino . $name;
												}

												if (move_uploaded_file($tmp_name, $caminho)) {

													$arrayArq['caminho'] = $name;
													$arrayArq['mensagem'] = "";
													$arrayArq['errou'] = false;
													$arrayArq['erro_code'] = 0;
												} else {

													$arrayArq['caminho'] = "";
													$arrayArq['mensagem'] = "- (Arquivo " . $numero . ". " . $arquivo['name'] . ") Erro no upload do(a) " . $nomeclatura . ".<br>";
													$arrayArq['errou'] = true;
													$arrayArq['erro_code'] = 2;
												}
											} else {

												$arrayArq['caminho'] = "";
												$arrayArq['mensagem'] = "- (Arquivo " . $numero . ". " . $arquivo['name'] . ") " . $nomeclatura . " tem mais de " . ($tamanho_maximo / 1000000) . "MB.<br>";
												$arrayArq['errou'] = true;
												$arrayArq['erro_code'] = 2;
											}
										} else {

											$arrayArq['caminho'] = "";
											$arrayArq['mensagem'] = "- (Arquivo " . $numero . ". " . $arquivo['name'] . ") Tamanho do(a) " . $nomeclatura . " inexistente.<br>";
											$arrayArq['errou'] = true;
											$arrayArq['erro_code'] = 2;
										}
									} else {

										$arrayArq['caminho'] = "";
										$arrayArq['mensagem'] = "- (Arquivo " . $numero . ". " . $arquivo['name'] . ") Extensao incorreta do(a) " . $nomeclatura . ".<br>";
										$arrayArq['errou'] = true;
										$arrayArq['erro_code'] = 2;
									}
								} else {

									$arrayArq['caminho'] = "";
									$arrayArq['mensagem'] = "- (Arquivo " . $numero . ". " . $arquivo['name'] . ") " . $nomeclatura . " em branco.<br>";
									$arrayArq['errou'] = true;
									$arrayArq['erro_code'] = 1;
								}
							} else {

								$arrayArq['caminho'] = "";
								$arrayArq['mensagem'] = "- (Arquivo " . $numero . ". " . $arquivo['name'] . ") " . $nomeclatura . " nao existe.<br>";
								$arrayArq['errou'] = true;
								$arrayArq['erro_code'] = 1;
							}

							return $arrayArq;
						}

						public function infomativo($mensagem)
						{

							echo '<div>
								<table width="100%" border="0" bgcolor=#F5F5F5  height="60">' .
								'<td width="100%" align=left     height="100%">';
							echo '<font face=verdana size=2 color=#000099>AtenÃƒÆ’Ã‚Â§ÃƒÆ’Ã‚Â£o: </font><font face=verdana size=2 color=#333300>' . $mensagem . '<font>';

							echo '</td></table></div>';
						}

						public function mostrarAviso($s_aviso, $s_erro, $id)
						{
							if ($s_aviso == true) {

								echo '<p class="msgerro" align="left">';

								echo $s_erro;

								echo '</p>';
							} elseif (($s_aviso == false) and ($id == "")) {

								echo '<p class="msgok" align="center" style="height: 30px;">O cadastro foi realizado com sucesso!</p>';
							} elseif (($s_aviso == false) and ($id != "")) {

								echo '<p class="msgok" align="center" style="height: 30px;">Os dados foram alterados com sucesso!</p>';
							}
						}

						public function retira_acentos($texto)
						{
							$array1 = array(
								"ÃƒÆ’Ã‚Â¡",
								"ÃƒÆ’Ã‚Â ",
								"ÃƒÆ’Ã‚Â¢",
								"ÃƒÆ’Ã‚Â£",
								"ÃƒÆ’Ã‚Â¤",
								"ÃƒÆ’Ã‚Â©",
								"ÃƒÆ’Ã‚Â¨",
								"ÃƒÆ’Ã‚Âª",
								"ÃƒÆ’Ã‚Â«",
								"ÃƒÆ’Ã‚Â­",
								"ÃƒÆ’Ã‚Â¬",
								"ÃƒÆ’Ã‚Â®",
								"ÃƒÆ’Ã‚Â¯",
								"ÃƒÆ’Ã‚Â³",
								"ÃƒÆ’Ã‚Â²",
								"ÃƒÆ’Ã‚Â´",
								"ÃƒÆ’Ã‚Âµ",
								"ÃƒÆ’Ã‚Â¶",
								"ÃƒÆ’Ã‚Âº",
								"ÃƒÆ’Ã‚Â¹",
								"ÃƒÆ’Ã‚Â»",
								"ÃƒÆ’Ã‚Â¼",
								"ÃƒÆ’Ã‚Â§",
								"ÃƒÆ’Ã¯Â¿Â½",
								"ÃƒÆ’Ã¢â€šÂ¬",
								"ÃƒÆ’Ã¢â‚¬Å¡",
								"ÃƒÆ’Ã†â€™",
								"ÃƒÆ’Ã¢â‚¬Å¾",
								"ÃƒÆ’Ã¢â‚¬Â°",
								"ÃƒÆ’Ã‹â€ ",
								"ÃƒÆ’Ã…Â ",
								"ÃƒÆ’Ã¢â‚¬Â¹",
								"ÃƒÆ’Ã¯Â¿Â½",
								"ÃƒÆ’Ã…â€™",
								"ÃƒÆ’Ã…Â½",
								"ÃƒÆ’Ã¯Â¿Â½",
								"ÃƒÆ’Ã¢â‚¬Å“",
								"ÃƒÆ’Ã¢â‚¬â„¢",
								"ÃƒÆ’Ã¢â‚¬ï¿½",
								"ÃƒÆ’Ã¢â‚¬Â¢",
								"ÃƒÆ’Ã¢â‚¬â€œ",
								"ÃƒÆ’Ã…Â¡",
								"ÃƒÆ’Ã¢â€žÂ¢",
								"ÃƒÆ’Ã¢â‚¬Âº",
								"ÃƒÆ’Ã…â€œ",
								"ÃƒÆ’Ã¢â‚¬Â¡"
							);
							$array2 = array(
								"a",
								"a",
								"a",
								"a",
								"a",
								"e",
								"e",
								"e",
								"e",
								"i",
								"i",
								"i",
								"i",
								"o",
								"o",
								"o",
								"o",
								"o",
								"u",
								"u",
								"u",
								"u",
								"c",
								"A",
								"A",
								"A",
								"A",
								"A",
								"E",
								"E",
								"E",
								"E",
								"I",
								"I",
								"I",
								"I",
								"O",
								"O",
								"O",
								"O",
								"O",
								"U",
								"U",
								"U",
								"U",
								"C"
							);
							return str_replace($array1, $array2, $texto);
						}

						public function tratar_tempo_limite($tempo_limite)
						{

							$tempo_limite = str_replace("-", "", $tempo_limite);
							$tempo_limite = str_replace("days", "dias", $tempo_limite);
							$tempo_limite = str_replace("month", "mÃƒÆ’Ã‚Âªs", $tempo_limite);
							$tempo_limite = str_replace("year", "anos", $tempo_limite);
							$tempo_limite = trim($tempo_limite);

							return $tempo_limite;
						}

						function retornar_datas($data_de, $data_ate)
						{
							$array_datas = array();

							$data_de_timestamp = $this->datatimestamp($data_de);
							$data_ate_timestamp = $this->datatimestamp($data_ate);
							$data_atual_timestamp = "";

							while ($data_de_timestamp < $data_ate_timestamp) {

								array_push($array_datas, $this->timestampdata($data_de_timestamp));

								$data_de_timestamp = $data_de_timestamp + 86400;
							}

							return $array_datas;
						}

						function timestampdata($timestamp)
						{

							$data = date("d/m/Y", $timestamp);
							return $data;
						}

						function datatimestamp($data)
						{

							$dataexplode = explode("/", $data);
							$dataok = mktime(0, 0, 0, $dataexplode[1], $dataexplode[0], $dataexplode[2]);
							return $dataok;
						}

						public function verificaDados($data)
						{
							$data = trim($data);
							$data = addslashes($data);
							//		$data = urldecode($data);   
							//		$data = utf8_decode($data); 
							return $data;
						}

						public function verificaDados1($data)
						{
							$data = trim($data);
							$data = addslashes($data);
							return $data;
						}

						public function verificaDadosAjax($data)
						{
							$data = strip_tags($data);
							$data = trim($data);
							$data = get_magic_quotes_gpc() == 0 ? addslashes($data) : $data;
							$data = preg_replace("@(--|\#|\*|;)@s", "", $data);
							$data = urldecode($data); // especÃƒÆ’Ã‚Â­fico no caso do Ajax
							$data = utf8_decode($data); // especÃƒÆ’Ã‚Â­fico no caso do Ajax
							return $data;
						}

						public function maiusculo(&$string)
						{
							$string = strtoupper($string);
							$string = str_replace("ÃƒÆ’Ã‚Â¡", "ÃƒÆ’Ã¯Â¿Â½", $string);
							$string = str_replace("ÃƒÆ’Ã‚Â©", "ÃƒÆ’Ã¢â‚¬Â°", $string);
							$string = str_replace("ÃƒÆ’Ã‚Â­", "ÃƒÆ’Ã¯Â¿Â½", $string);
							$string = str_replace("ÃƒÆ’Ã‚Â³", "ÃƒÆ’Ã¢â‚¬Å“", $string);
							$string = str_replace("ÃƒÆ’Ã‚Âº", "ÃƒÆ’Ã…Â¡", $string);
							$string = str_replace("ÃƒÆ’Ã‚Â¢", "ÃƒÆ’Ã¢â‚¬Å¡", $string);
							$string = str_replace("ÃƒÆ’Ã‚Âª", "ÃƒÆ’Ã…Â ", $string);
							$string = str_replace("ÃƒÆ’Ã‚Â´", "ÃƒÆ’Ã¢â‚¬ï¿½", $string);
							$string = str_replace("ÃƒÆ’Ã‚Â®", "ÃƒÆ’Ã…Â½", $string);
							$string = str_replace("ÃƒÆ’Ã‚Â»", "ÃƒÆ’Ã¢â‚¬Âº", $string);
							$string = str_replace("ÃƒÆ’Ã‚Â£", "ÃƒÆ’Ã†â€™", $string);
							$string = str_replace("ÃƒÆ’Ã‚Âµ", "ÃƒÆ’Ã¢â‚¬Â¢", $string);
							$string = str_replace("ÃƒÆ’Ã‚Â§", "ÃƒÆ’Ã¢â‚¬Â¡", $string);
							$string = str_replace("ÃƒÆ’Ã‚Â ", "ÃƒÆ’Ã¢â€šÂ¬", $string);
							$string = str_replace("ÃƒÆ’Ã‚Â¨", "ÃƒÆ’Ã‹â€ ", $string);
							$string = str_replace("ÃƒÆ’Ã‚Â±", "ÃƒÆ’Ã¢â‚¬Ëœ", $string);
							return $string;
						}

						public function formatodata(&$datafor)
						{
							if ($datafor != "")
								$datafor = substr($datafor, 8, 2) . "/" . substr($datafor, 5, 2) . "/" . substr($datafor, 0, 4);
							else
								$datafor = "00/00/0000";

							return $datafor;
						}

						public function validaData($dat)
						{
							$data = explode("/", $dat);
							$d = $data[0];
							$m = $data[1];
							$y = $data[2];

							$res = checkdate($m, $d, $y);
							if ($res == 1) {
								return true;
							} else {
								return false;
							}
						}

						public function validaData1($dat)
						{
							$data = explode("-", $dat);

							$d = $data[2];
							$m = $data[1];
							$y = $data[0];

							$res = checkdate($m, $d, $y);
							if ($res == 1) {
								return true;
							} else {
								return false;
							}
						}

						public function validaHora($hora)
						{
							$hora = explode(":", $hora);
							$h = $hora[0];
							$m = $hora[1];
							$s = $hora[2];

							if ($h > 23 || $m > 59 || $s > 59) {
								return false;
							} else {
								return true;
							}
						}

						public function tranformar_mes($valor)
						{
							if ($valor == 1) {
								$valor = "Jan";
							} else
			if ($valor == 2) {
								$valor = "Fev";
							} else
				if ($valor == 3) {
								$valor = "Mar";
							} else
					if ($valor == 4) {
								$valor = "Abr";
							} else
						if ($valor == 5) {
								$valor = "Mai";
							} else
							if ($valor == 6) {
								$valor = "Jun";
							} else
								if ($valor == 7) {
								$valor = "Jul";
							} else
									if ($valor == 8) {
								$valor = "Ago";
							} else
										if ($valor == 9) {
								$valor = "Set";
							} else
											if ($valor == 10) {
								$valor = "Out";
							} else
												if ($valor == 11) {
								$valor = "Nov";
							} else
													if ($valor == 12) {
								$valor = "Dez";
							}
							return $valor;
						}

						public function checaCPF($cpf)
						{
							$cpf = preg_replace("[^0-9]", "", $cpf);
							if (strlen($cpf) != 11)
								return false;
							else {
								$dv = substr($cpf, -2);
								$compdv = 0;
								$nulos = array(
									"12345678909",
									"11111111111",
									"22222222222",
									"33333333333",
									"44444444444",
									"55555555555",
									"66666666666",
									"77777777777",
									"88888888888",
									"99999999999",
									"00000000000"
								);

								if (in_array($cpf, $nulos))
									return false;
								else {
									$acum = 0;
									for ($i = 0; $i < 9; $i++)
										$acum += $cpf[$i] * (10 - $i);
									$x = $acum % 11;
									$acum = ($x > 1) ? (11 - $x) : 0;
									$compdv = $acum * 10;

									$acum = 0;
									for ($i = 0; $i < 10; $i++)
										$acum += $cpf[$i] * (11 - $i);
									$x = $acum % 11;
									$acum = ($x > 1) ? (11 - $x) : 0;
									$compdv = $compdv + $acum;

									if ($compdv == $dv)
										return true;
									else
										return false;
								}
							}
						}

						public function verifica_email($email)
						{
							if (ereg('^[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+' . '@' . '[-!#$%&\'*+\\/0-9=?A-Z^_`a-z{|}~]+\.' . '[-!#$%&\'*+\\./0-9=?A-Z^_`a-z{|}~]+$', $email)) {
								return true;
							} else {
								return false;
							}
						}

						public function mensagem($mensagemValor)
						{

							echo $mensagemValor;
						}

						public function voltarPaginaLink($caminhoDaPagina)
						{

							echo '<center><a href=' . $caminhoDaPagina . '>VOLTAR</a></center>';
						}

						public function voltarPagina($caminhoDaPagina)
						{

							echo "<script language=\"JavaScript\">
																function redireciona() {
																	window.location=\"$caminhoDaPagina\";
																}
																
																redireciona();
																
																</script>";

							header("Location: " . $caminhoDaPagina);
							die;
						}
					}
?>