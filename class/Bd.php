<?Php
error_reporting(0);

class Bd{
	
	var $host = 'localhost';
	var $bDados = "sp_advogados2";
	var $usr  = 'root';
	var $pw   = '';

    // var $host = 'robb0407.publiccloud.com.br:3306';
    // var $bDados = "bspadvogados_app";
    // var $usr  = 'bspad_app';
    // var $pw   = 'Yhvf44@3';
	
	var $sql; 
	var $conn; 
	var $resultado;

	function __construct() {
	}
	
	function connBd() {
		error_reporting(0);
		$this->conn = mysqli_connect($this->host,$this->usr,$this->pw);
		if(!$this->conn) {
		    echo mysqli_error();
			exit();
		// } elseif (!mysqli_select_db($this->bDados,$this->conn)) {
		} elseif (!mysqli_select_db($this->conn,$this->bDados)) {
		    echo mysqli_error();
			exit();
		}
	}
	
	function runQuery($sql) {
		$this->connBd($this->bDados);
		$this->sql = $sql;
		// if($this->resultado = mysqli_query($this->sql)) {
		if($this->resultado = mysqli_query($this->conn,$this->sql)) {
				return $this->resultado;
		} else {
		    // echo mysqli_error();
			echo mysqli_error($this->conn);
			exit();
		}
	}
	
	function closeConnBd() {
	    // return mysqli_close();
	    return mysqli_close($this->conn);
	}
	
	function fetch_array($query) {
	    // return mysqli_fetch_array($query);
	    return mysqli_fetch_array($query);
	}	
	
	function insert_id(){
	    // return mysqli_insert_id();	
	    return mysqli_insert_id($this->conn);	
	}
		
}
?>