<?Php
session_start();
include_once('../../class/Geral.php');
include_once('../../class/Pessoa.php');
include_once('../../class/PessoaTipo.php');
include_once('../../class/Hibernate.php');

include_once('../../class/Login_admin.php');
$acaoLogin_admin = new Login_admin;
$acaoLogin_admin->protegePagina();

$Pessoa = new Pessoa();
$PessoaTipo = new PessoaTipo();
$Hibernate = new Hibernate();
$Geral = new Geral;

$value = $_REQUEST['value'];
$option = $_REQUEST['option'];

$queryFind = '';
if ($value != "" && $option != "") {
  $queryFind = "WHERE $option LIKE '%$value%' ";
}

?>

<div class="box">
  <div class="box-header">
    <h3 class="box-title">
      <h2>Busca de Pessoa | <a href="?page=<?Php echo base64_encode('../../pages/pessoa/form.php'); ?>" class="LINK">Novo</a></h2>
      <?php echo $Geral->exibir_mensagem(); ?>
    </h3>

  </div>

  <div class="box-body">
    <form role="form" name="form_find" id="form_find" action="?page=<?Php echo base64_encode('../../pages/pessoa/list.php'); ?>" method="post">

      <div class="form-group">
        <div class="row">
          <div class="col-lg-5">
            <input placeholder="Valor em branco" name="value" id="value" value="<?Php echo $value; ?>" type="text" class="form-control" maxlength="255" required />
          </div>
          <div class="col-lg-3">
            <select name="option" id="option" class="form-control">
              <option value="nome" <?Php if ($option == 'nome') {
                                      echo "SELECTED";
                                    } ?>>Nome</option>
              <option value="cpf" <?Php if ($option == 'cpf') {
                                    echo "SELECTED";
                                  } ?>>CPF</option>

              <option value="email" <?Php if ($option == 'email') {
                                      echo "SELECTED";
                                    } ?>>Email</option>

              <option value="telefone" <?Php if ($option == 'telefone') {
                                          echo "SELECTED";
                                        } ?>>Telefone</option>
            </select>
          </div>

          <div class="col-lg-2">
            <button type="submit" class="btn btn-primary form-control">Buscar</button>
          </div>

          <div class="col-lg-2">
            <button type="button" class="btn btn-primary form-control" onclick="window.location='?page=<?Php echo base64_encode('../../pages/pessoa/list.php'); ?>'">Todos</button>
          </div>
        </div>
      </div>

    </form>
  </div>

  <?Php

  $sql_busca = $Geral->paginacaoList($_REQUEST['pagina'], "pessoas", "../../pages/pessoa/list.php", "", "", $queryFind)

  ?>
  <!-- /.box-header -->
  <div class="box-body table-responsive">
    <table id="listagem" class="table table-bordered table-striped">

      <thead>
        <tr>
          <th>Id</th>
          <th>Nome</th>
          <th>Cpf</th>
          <th>Tipo</th>
          <th>Email</th>
          <th>Telefone</th>
          <th>Data de cadastro</th>
          <th>Msg</th>
          <th>Administra&ccedil;&atilde;o</th>
          <th>Desativar</th>
        </tr>
      </thead>

      <tbody>

        <?php

        $result = $Hibernate->exe($sql_busca);
        $i = 0;
        while ($array = mysqli_fetch_array($result)) {
          $i++;
          $Pessoa = new Pessoa;

          $Pessoa->id = $array["id"];
          $Pessoa->pessoas_tipo_id = $array["pessoas_tipo_id"];
          $Pessoa->nome = $array["nome"];
          $Pessoa->email = $array["email"];
          $Pessoa->cpf = $array["cpf"];
          $Pessoa->telefone = $array["telefone"];
          $Pessoa->data_cadastro = $array["data_cadastro"];
          $Pessoa->status = $array["status"];

        ?>

          <tr>
            <td><?Php echo $Pessoa->id; ?></td>

            <td><?Php echo $Pessoa->nome; ?></td>

            <td><?Php echo $Pessoa->cpf; ?></td>

            <td>
              <?php

              $result_tipo = $Hibernate->buscar_por_campo($PessoaTipo, $PessoaTipo->id_tabela(), $Pessoa->pessoas_tipo_id);
              if ($array_tipo = mysqli_fetch_array($result_tipo)) {
                echo $array_tipo['nome'];
              }

              ?>
            </td>

            <td><?Php echo $Pessoa->email; ?></td>

            <td><?Php echo $Pessoa->telefone; ?></td>

            <td><?Php echo $Geral->convertDataBdDataFormTIME($Pessoa->data_cadastro); ?></td>

            <td>
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
            </td>

            <td>
              <form method="post" id="form1<?Php echo $i; ?>" name="form1<?Php echo $i; ?>" action="?page=<?Php echo base64_encode('../../pages/pessoa/form.php'); ?>">
                <input name="id_" type="hidden" id="id_" value="<?Php echo $Pessoa->id; ?>" />
                <input name="action" id="action" type="hidden" value="alterar" />
                <input type="submit" class="btn btn-primary" value="  Administra&ccedil;&atilde;o  " />
              </form>
            </td>

            <td class="center">
              <?Php if ($_SESSION['operador_id'] != $Pessoa->id) { ?>
                <?php if ($_SESSION['operador_pessoas_tipo_id'] == 4) { ?>
                  <?Php if ($Pessoa->status == 2) { ?>
                    <form name="form2<?Php echo $i; ?>" id="form2<?Php echo $i; ?>" action="?page=<?Php echo base64_encode('../../pages/pessoa/exe.php'); ?>" method="post" class="formulario_ativar">
                      <input name="id_" type="hidden" id="id_" value="<?Php echo $Pessoa->id; ?>" />
                      <input name="action" id="action" type="hidden" value="ativar" />
                      <input type="submit" class="btn btn-info" value="  Ativar  " style="width: 100%;" />
                    </form>
                  <?php } else { ?>
                    <form name="form2<?Php echo $i; ?>" id="form2<?Php echo $i; ?>" action="?page=<?Php echo base64_encode('../../pages/pessoa/exe.php'); ?>" method="post" class="formulario_desativar">
                      <input name="id_" type="hidden" id="id_" value="<?Php echo $Pessoa->id; ?>" />
                      <input name="action" id="action" type="hidden" value="desativar" />
                      <input type="submit" class="btn btn-danger" value="  Desativar  " style="width: 100%;" />
                    </form>
                  <?php } ?>
                <?php } ?>
              <?Php } ?>
            </td>
          </tr>

        <?php } ?>
      </tbody>

      <tfoot>
        <tr>
          <th>Id</th>
          <th>Nome</th>
          <th>Cpf</th>
          <th>Tipo</th>
          <th>Email</th>
          <th>Telefone</th>
          <th>Data de cadastro</th>
          <th>Msg</th>
          <th>Administra&ccedil;&atilde;o</th>
          <th>Desativar</th>
        </tr>
      </tfoot>

    </table>
  </div>
  <!-- /.box-body -->
</div>


<?php $Geral->apagar_mensagem(); ?>

<?php

unset($_SESSION['pes_pessoas_tipo_id']);
unset($_SESSION['pes_nome']);
unset($_SESSION['pes_email']);
unset($_SESSION['pes_senha']);
unset($_SESSION['pes_cpf']);
unset($_SESSION['pes_telefone']);
unset($_SESSION['pes_data_cadastro']);

unset($_SESSION['pes_alterar_senha']);

?>