<?Php
include_once('Bd.php');
include_once('Geral.php');

class Hibernate
{

	var $mostrar_alert = 0;

	function exe($sql)
	{

		$Bd = new Bd;
		$Bd->connBd();

		if ($this->mostrar_alert == 1) {
			$Geral = new Geral;
			$Geral->mensagem($sql);
		}

		return $Bd->runQuery($sql);
	}


	function cadastrar($obj)
	{

		$Bd = new Bd;
		$Bd->connBd();

		$array_obj = get_object_vars($obj);

		$tabela = $obj->nome_tabela();

		foreach ($array_obj as $key => $value) {

			if ($value !== "") {
				$apas = "";
				if ($value == "NULL") {
					$apas = "";
				} else if (is_numeric($value)) {
					$apas = "";
				} else {
					$apas = "'";
				}

				$campos  .= $key . ",";
				$valores .= "$apas" . $value . "$apas,";
			}
		}

		$campos  = substr($campos, 0, strlen($campos) - 1);
		$valores = substr($valores, 0, strlen($valores) - 1);

		$sql = "INSERT INTO $tabela ($campos) VALUES ($valores);";

		if ($this->mostrar_alert == 1) {
			$Geral = new Geral;
			$Geral->mensagem($sql);
		}

		$Bd->runQuery($sql);
		return $Bd->insert_id();
	}

	function editar($obj)
	{

		$Bd = new Bd;
		$Bd->connBd();

		$array_obj = get_object_vars($obj);

		$tabela = $obj->nome_tabela();
		$id_campo = $obj->id_tabela();

		foreach ($array_obj as $key => $value) {

			if ($value !== "NO_UPDATE") {
				$apas = "";
				if ($value == "NULL") {
					$apas = "";
				} else if (is_numeric($value)) {
					$apas = "";
				} else {
					$apas = "'";
				}

				if ($key != $id_campo) {
					$linha .= "$key = $apas" . $value . "$apas ,";
				}
			}
		}



		$linha = substr($linha, 0, strlen($linha) - 1);

		$sql = "UPDATE $tabela SET $linha WHERE $id_campo = " . $obj->id;

		if ($this->mostrar_alert == 1) {
			$Geral = new Geral;
			$Geral->mensagem($sql);
		}

		$Bd->runQuery($sql);
		return $Bd->insert_id();
	}

	function listar_paginacao($obj, $inicio, $limite, $ordenacao_campo = "", $ordenacao_sentido = "ASC")
	{

		$Bd = new Bd;
		$Bd->connBd();

		$tabela = $obj->nome_tabela();
		$id = $obj->id_tabela();

		if ($ordenacao_campo != "") {
			$linha = " ORDER BY $ordenacao_campo $ordenacao_sentido ";
		} else {
			$linha = "";
		}

		$sql = "SELECT * FROM $tabela $linha LIMIT $inicio,$limite ;";

		if ($this->mostrar_alert == 1) {
			$Geral = new Geral;
			$Geral->mensagem($sql);
		}

		return $Bd->runQuery($sql);
	}

	function listar($obj, $ordenacao_campo = "", $ordenacao_sentido = "ASC")
	{

		$Bd = new Bd;
		$Bd->connBd();

		$tabela = $obj->nome_tabela();
		$id = $obj->id_tabela();

		if ($ordenacao_campo != "") {
			$linha = " ORDER BY $ordenacao_campo $ordenacao_sentido ;";
		}

		$sql = "SELECT * FROM $tabela $linha";

		if ($this->mostrar_alert == 1) {
			$Geral = new Geral;
			$Geral->mensagem($sql);
		}

		return $Bd->runQuery($sql);
	}

	function excluir_por_campo($obj, $campo, $valor, $limite = 0)
	{

		$Bd = new Bd;
		$Bd->connBd();

		$tabela = $obj->nome_tabela();

		$sql = "DELETE FROM $tabela WHERE  $campo = $valor ";

		if ($limite != 0) {
			$sql .= "LIMIT $limite";
		}

		$sql .= ";";

		if ($this->mostrar_alert == 1) {
			$Geral = new Geral;
			$Geral->mensagem($sql);
		}

		return $Bd->runQuery($sql);
	}


	function buscar_por_campo($obj, $campo, $valor, $limite = 0, $like = false)
	{

		$Bd = new Bd;
		$Bd->connBd();

		$tabela = $obj->nome_tabela();

		$apas = "";
		if (is_numeric($valor)) {
			$apas = "";
		} else {
			$apas = "'";
		}

		if ($like == true && is_numeric($valor)) {
			$apas = "'";
		}

		if ($like == true) {
			$porcentagem = "%";
			$IGUAL = "LIKE";
		} else {
			$IGUAL = "=";
		}

		$sql = "SELECT * FROM $tabela WHERE  $campo $IGUAL $apas" . $porcentagem . $valor . $porcentagem . "$apas";

		if ($limite != 0) {
			$sql .= " LIMIT $limite";
		}

		$sql .= ";";

		if ($this->mostrar_alert == 1) {
			$Geral = new Geral;
			$Geral->mensagem($sql);
		}

		return $Bd->runQuery($sql);
	}

	function retornar_qtd($obj)
	{
		$Bd = new Bd;
		$Bd->connBd();

		$tabela = $obj->nome_tabela();


		$sql = "SELECT COUNT(*) as qtd FROM $tabela ";

		if ($this->mostrar_alert == 1) {
			$Geral = new Geral;
			$Geral->mensagem($sql);
		}

		return $Bd->runQuery($sql);
	}

	function verifica_se_existe($obj, $campo, $valor)
	{

		$Bd = new Bd;
		$Bd->connBd();

		$tabela = $obj->nome_tabela();
		$id_campo = $obj->id_tabela();

		$apas = "";
		if (is_numeric($valor)) {
			$apas = "";
		} else {
			$apas = "'";
		}

		$sql = "SELECT * FROM $tabela WHERE  $campo = $apas" . $valor . "$apas ";

		if ($obj->id != "") {
			$sql .= " AND $id_campo <> " . $obj->id;
		}

		$sql .= ";";

		$result = $Bd->runQuery($sql);

		if ($this->mostrar_alert == 1) {
			$Geral = new Geral;
			$Geral->mensagem($sql);
		}

		if ($sql = $Bd->fetch_array($result)) {
			return true;
		} else {
			return false;
		}
	}

	function buscar_campo_por_campo($obj, $campo, $valor, $campo_retorno)
	{

		$Bd = new Bd;
		$Bd->connBd();

		$tabela = $obj->nome_tabela();
		$id_campo = $obj->id_tabela();

		$apas = "";
		if (is_numeric($valor)) {
			$apas = "";
		} else {
			$apas = "'";
		}

		$sql = "SELECT * FROM $tabela WHERE  $campo = $apas" . $valor . "$apas ";

		if ($obj->id != "") {
			$sql .= " AND $id_campo <> " . $obj->id;
		}

		$sql .= " LIMIT 1";

		$sql .= ";";


		$result = $Bd->runQuery($sql);

		if ($this->mostrar_alert == 1) {
			$Geral = new Geral;
			$Geral->mensagem($sql);
		}

		if ($sql = $Bd->fetch_array($result)) {
			return $sql[$campo_retorno];
		} else {
			return false;
		}
	}
}
