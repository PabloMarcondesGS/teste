<?Php
include_once('../../class/Geral.php');
include_once('../../class/Peticao.php');
include_once('../../class/Hibernate.php');

require_once '../../build/api/php-font-lib/src/FontLib/Autoloader.php';
require_once '../../build/api/php-svg-lib/src/autoload.php';
require_once '../../build/api/dompdf/src/Autoloader.php';

include_once('../../class/Login_admin.php');
$acaoLogin_admin = new Login_admin;
$acaoLogin_admin->protegePagina();

Dompdf\Autoloader::register();

use Dompdf\Dompdf;

$Geral = new Geral;
$Peticao = new Peticao();
$Hibernate = new Hibernate();

$dompdf = new Dompdf();

$Peticao->processo_id = $Geral->verificaDados($_REQUEST["processo_id"]);

$result = $Hibernate->exe("SELECT * FROM peticao WHERE processo_id = '" . $Peticao->processo_id . "';");
if ($array = mysqli_fetch_array($result)) {

    $Peticao->id = $array["id"];
    $Peticao->peticao_status_id = $array["peticao_status_id"];
    $Peticao->texto = $array["texto"];

    $dompdf->loadHtml($Peticao->texto);

    $dompdf->setPaper('A4');

    $dompdf->render();

    $dompdf->stream("peticao-" . $Peticao->processo_id . ".pdf", array(true));
} else {
    $Geral->voltarPagina("../../pages/processo/list.php");
}
