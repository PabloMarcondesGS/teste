<?Php
session_start();
include_once('../../class/Geral.php');
include_once('../../class/Processo.php');
include_once('../../class/Pessoa.php');
include_once('../../class/ProcessoTipo.php');
include_once('../../class/ProcessoSubtipo.php');
include_once('../../class/ProcessoStatus.php');
include_once('../../class/Hibernate.php');

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

$value = $_REQUEST['value'];
$option = $_REQUEST['option'];

$queryFind = '';
if ($value != "" && $option != "") {
  if ($option == "cliente") {
    $queryFind = " INNER JOIN pessoas ON processo.cliente_id = pessoas.id WHERE pessoas.nome LIKE '%$value%' ";
  } else if ($option == "status") {
    $queryFind = " INNER JOIN processo_status ON processo.processo_status_id = processo_status.id WHERE processo_status.nome LIKE '%$value%' ";
  } else {
    $queryFind = "WHERE $option LIKE '%$value%' ";
  }
}

?>

<div class="box">
  <div class="box-header">
    <h3 class="box-title">
      <h2>Busca de Processo | <a href="?page=<?Php echo base64_encode('../../pages/processo/form.php'); ?>" class="LINK">Novo</a></h2>
      <?php echo $Geral->exibir_mensagem(); ?>
    </h3>

    <?Php

    $sql_busca = $Geral->paginacaoList($_REQUEST['pagina'], "processo", "../../pages/processo/list.php", "", "", $queryFind)

    ?>

  </div>

  <div class="box-body">
    <form role="form" name="form_find" id="form_find" action="?page=<?Php echo base64_encode('../../pages/processo/list.php'); ?>" method="post">

      <div class="form-group">
        <div class="row">
          <div class="col-lg-5">
            <input placeholder="Valor em branco" name="value" id="value" value="<?Php echo $value; ?>" type="text" class="form-control" maxlength="255" required />
          </div>
          <div class="col-lg-3">
            <select name="option" id="option" class="form-control">
              <option value="protocolo" <?Php if ($option == 'protocolo') {
                                          echo "SELECTED";
                                        } ?>>Protocolo</option>

              <option value="cliente" <?Php if ($option == 'cliente') {
                                        echo "SELECTED";
                                      } ?>>Cliente</option>

              <option value="status" <?Php if ($option == 'status') {
                                        echo "SELECTED";
                                      } ?>>Status</option>

            </select>
          </div>

          <div class="col-lg-2">
            <button type="submit" class="btn btn-primary form-control">Buscar</button>
          </div>

          <div class="col-lg-2">
            <button type="button" class="btn btn-primary form-control" onclick="window.location='?page=<?Php echo base64_encode('../../pages/processo/list.php'); ?>'">Todos</button>
          </div>
        </div>
      </div>

    </form>
  </div>

  <!-- /.box-header -->
  <div class="box-body table-responsive">
    <table id="listagem" class="table table-bordered table-striped">

      <thead>
        <tr>
          <th>Protocolo</th>
          <th>Cliente</th>
          <th>Operador</th>
          <th>Tipo</th>
          <th>Subtipo</th>
          <th>Status</th>
          <th>Data de cadastro</th>
          <th>Administra&ccedil;&atilde;o</th>
        </tr>
      </thead>

      <tbody>

        <?php

        $result = $Hibernate->exe($sql_busca);
        $i = 0;
        while ($array = mysqli_fetch_array($result)) {
          $i++;
          $Processo = new Processo;
          $Processo->id = $array["id"];
          $Processo->cliente_id = $array["cliente_id"];
          $Processo->operador_id = $array["operador_id"];
          $Processo->processo_tipo_id = $array["processo_tipo_id"];
          $Processo->processo_subtipo_id = $array["processo_subtipo_id"];
          $Processo->processo_status_id = $array["processo_status_id"];
          $Processo->data_cadastro = $array["data_cadastro"];
          $Processo->protocolo = $array["protocolo"];

        ?>

          <tr>
            <td>
              <?Php

              echo $Processo->protocolo;

              ?>
            </td>

            <td>
              <?php
              $result_cliente = $Hibernate->buscar_por_campo($Cliente, $Cliente->id_tabela(), $Processo->cliente_id);
              if ($array_cliente = mysqli_fetch_array($result_cliente)) {
                echo $array_cliente['nome'];
              }
              ?>
            </td>

            <td>
              <?php
              $result_operador = $Hibernate->buscar_por_campo($Operador, $Operador->id_tabela(), $Processo->operador_id);
              if ($array_operador = mysqli_fetch_array($result_operador)) {
                echo $array_operador['nome'];
              } else {
                echo 'Nenhum';
              }
              ?>
            </td>

            <td>
              <?php
              $result_tipo = $Hibernate->buscar_por_campo($ProcessoTipo, $ProcessoTipo->id_tabela(), $Processo->processo_tipo_id);
              if ($array_tipo = mysqli_fetch_array($result_tipo)) {
                echo $array_tipo['nome'];
              }
              ?>
            </td>

            <td>
              <?php
              $result_subtipo = $Hibernate->buscar_por_campo($ProcessoSubtipo, $ProcessoSubtipo->id_tabela(), $Processo->processo_subtipo_id);
              if ($array_subtipo = mysqli_fetch_array($result_subtipo)) {
                echo utf8_encode($array_subtipo['nome']);
              }
              ?>
            </td>

            <td>
              <?php
              $result_status = $Hibernate->buscar_por_campo($ProcessoStatus, $ProcessoStatus->id_tabela(), $Processo->processo_status_id);
              if ($array_status = mysqli_fetch_array($result_status)) {
                echo $array_status['nome'];
              }
              ?>
            </td>

            <td><?Php echo $Geral->convertDataBdDataFormTIME($Processo->data_cadastro); ?></td>

            <td>
              <form method="post" id="form1<?Php echo $i; ?>" name="form1<?Php echo $i; ?>" action="?page=<?Php echo base64_encode('../../pages/processo/form.php'); ?>">
                <input name="id_" type="hidden" id="id_" value="<?Php echo $Processo->id; ?>" />
                <input name="action" id="action" type="hidden" value="alterar" />
                <input type="submit" class="btn btn-primary" value="  Administra&ccedil;&atilde;o  " />
              </form>
            </td>

          </tr>

        <?php } ?>
      </tbody>

      <tfoot>
        <tr>
          <th>Protocolo</th>
          <th>Cliente</th>
          <th>Operador</th>
          <th>Tipo</th>
          <th>Subtipo</th>
          <th>Status</th>
          <th>Data de cadastro</th>
          <th>Administra&ccedil;&atilde;o</th>
        </tr>
      </tfoot>

    </table>
  </div>
  <!-- /.box-body -->
</div>


<?php $Geral->apagar_mensagem(); ?>

<?php

unset($_SESSION['pro_cliente_id']);
unset($_SESSION['pro_operador_id']);
unset($_SESSION['pro_processo_tipo_id']);
unset($_SESSION['pro_processo_subtipo_id']);
unset($_SESSION['pro_processo_status_id']);

unset($_SESSION['pet_processo_id']);
unset($_SESSION['pet_peticao_modelo_id']);
unset($_SESSION['pet_peticao_status_id']);
unset($_SESSION['pet_texto']);

?>