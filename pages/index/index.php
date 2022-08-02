<?php
error_reporting(0);
header("Content-Type: text/html; charset=utf-8");
session_start();

include_once('../../class/Hibernate.php');
$Hibernate = new Hibernate();

include_once('../../class/Bd.php');
$Bd = new Bd();

include_once('../../class/Login_admin.php');
$acaoLogin_admin = new Login_admin;
$acaoLogin_admin->protegePagina();

$page = $_REQUEST['page'];

$_SESSION['page_atual'] = $_REQUEST['page'];

?>
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <title>
    SP Advogados - Gest&atilde;o
  </title>


  <!-- Tell the browser to be responsive to screen width -->
  <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">

  <link rel="stylesheet" href="../../bower_components/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="../../bower_components/font-awesome/css/font-awesome.min.css">
  <link rel="stylesheet" href="../../bower_components/Ionicons/css/ionicons.min.css">
  <link rel="stylesheet" href="../../dist/css/AdminLTE.min.css">
  <link rel="stylesheet" href="../../dist/css/skins/_all-skins.min.css">
  <link rel="stylesheet" href="../../bower_components/morris.js/morris.css">
  <link rel="stylesheet" href="../../bower_components/jvectormap/jquery-jvectormap.css">
  <link rel="stylesheet" href="../../bower_components/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css">
  <link rel="stylesheet" href="../../bower_components/bootstrap-daterangepicker/daterangepicker.css">
  <link rel="stylesheet" href="../../plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css">

  <link rel="stylesheet" href="../../bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css">
  <link rel="stylesheet" href="../../dist/css/AdminLTE.min.css">
  <link rel="stylesheet" href="../../dist/css/skins/_all-skins.min.css">


  <link rel="stylesheet" href="../../dist/css/jquery-ui.css">
  <link rel="stylesheet" href="../../dist/css/style.css">



  <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
  <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
  <!--[if lt IE 9]>
  <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
  <![endif]-->

  <!-- Google Font -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700,300italic,400italic,600italic">

  <style type="text/css">
    input:invalid {

      background-color: #FFEEEE;

    }

    select:invalid {

      background-color: #FFEEEE;

    }
  </style>

</head>

<body class="hold-transition skin-blue sidebar-mini">

  <script src="../../bower_components/jquery/dist/jquery.min.js"></script>
  <script src="../../bower_components/jquery-ui/jquery-ui.min.js"></script>
  <script>
    $.widget.bridge('uibutton', $.ui.button);
  </script>
  <script src="../../bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
  <script src="../../bower_components/raphael/raphael.min.js"></script>
  <script src="../../bower_components/morris.js/morris.min.js"></script>
  <script src="../../bower_components/jquery-sparkline/dist/jquery.sparkline.min.js"></script>
  <script src="../../plugins/jvectormap/jquery-jvectormap-1.2.2.min.js"></script>
  <script src="../../plugins/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
  <script src="../../bower_components/jquery-knob/dist/jquery.knob.min.js"></script>
  <script src="../../bower_components/moment/min/moment.min.js"></script>
  <script src="../../bower_components/bootstrap-daterangepicker/daterangepicker.js"></script>
  <script src="../../bower_components/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"></script>
  <script src="../../plugins/bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js"></script>
  <script src="../../bower_components/jquery-slimscroll/jquery.slimscroll.min.js"></script>
  <script src="../../bower_components/fastclick/lib/fastclick.js"></script>
  <script src="../../dist/js/adminlte.min.js"></script>
  <script src="../../dist/js/demo.js"></script>

  <script src="../../bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
  <script src="../../bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>

  <script>
    $(function() {
      $('#listagem').DataTable({
        'paging': false,
        'lengthChange': false,
        'searching': false,
        'ordering': false,
        'info': false,
        'autoWidth': false,
        "aaSorting": [
          [0, "desc"]
        ]
      })
    })
  </script>

  <script src="../../dist/js/jquery-ui.js"></script>

  <script src="../../dist/js/java.js"></script>

  <script src="../../bower_components/chart.js/Chart.js"></script>
  <script src="../../dist/js/demo.js"></script>

  <div class="wrapper">

    <header class="main-header">
      <!-- Logo -->
      <a href="index.php" class="logo">
        <!-- mini logo for sidebar mini 50x50 pixels -->
        <span class="logo-mini">SP</span>
        <!-- logo for regular state and mobile devices -->
        <span class="logo-lg">SP Advogados</span>
      </a>
      <!-- Header Navbar: style can be found in header.less -->
      <nav class="navbar navbar-static-top">
        <!-- Sidebar toggle button-->
        <a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
          <span class="sr-only">Toggle navigation</span>
        </a>

        <div style="float: left;padding: 15px 15px;color:#FFFFFF;">
          <?php
          echo "<b>" . $_SESSION['operador_nome'] . "</b>";

          echo " (" . $Bd->host . " - " . $Bd->bDados . ") ";

          ?>
        </div>

        <div class="navbar-custom-menu">
          <ul class="nav navbar-nav">
            <!-- Messages: style can be found in dropdown.less-->
            <li class="dropdown messages-menu">
              <a href="sair.php">
                <i class="fa fa-times"></i>
                <span class="label label-danger">sair</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <!-- Left side column. contains the logo and sidebar -->
    <aside class="main-sidebar">
      <!-- sidebar: style can be found in sidebar.less -->
      <section class="sidebar">
        <!-- sidebar menu: : style can be found in sidebar.less -->
        <ul class="sidebar-menu" data-widget="tree">
          <li class="header">Menu de Navega&ccedil;&atilde;o</li>


          <?php
          if ($_SESSION['operador_pessoas_tipo_id'] == 3 || $_SESSION['operador_pessoas_tipo_id'] == 4) {
          ?>
            <li class="active treeview">
              <a href="#">
                <i class="fa fa-user-o"></i> <span>Pessoa</span>
                <span class="pull-right-container">
                  <i class="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul class="treeview-menu">
                <li class="active"><a href="?page=<?Php echo base64_encode("../../pages/pessoa/form.php"); ?>"><i class="fa fa-plus-square-o"></i>Novo</a></li>
                <li class="active">
                  <a href="?page=<?Php echo base64_encode("../../pages/pessoa/list.php"); ?>">
                    <i class="fa fa-search"></i>
                    Buscar
                    <?Php
                    $qtd_mensagens = 0;
                    $resultQtdM = $Hibernate->exe("SELECT COUNT(*) as qtd_mensagens FROM caixa_entrada WHERE lida_destinatario = '0' AND tipo = '0' ;");
                    if ($sqlQtdM = mysqli_fetch_array($resultQtdM)) {
                      $qtd_mensagens = $sqlQtdM['qtd_mensagens'];

                      if ($qtd_mensagens > 0) {
                    ?>
                        <span class="badge bg-teal"><?Php echo $qtd_mensagens; ?></span>
                    <?Php
                      }
                    }
                    ?>
                  </a>
                </li>
              </ul>
            </li>

            <li class="active treeview">
              <a href="#">
                <i class="fa fa-user-o"></i> <span>Processos</span>
                <span class="pull-right-container">
                  <i class="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul class="treeview-menu">
                <li class="active"><a href="?page=<?Php echo base64_encode("../../pages/processo/form.php"); ?>"><i class="fa fa-plus-square-o"></i>Novo</a></li>
                <li class="active"><a href="?page=<?Php echo base64_encode("../../pages/processo/list.php"); ?>"><i class="fa fa-search"></i>Buscar</a></li>
              </ul>
            </li>

            <li class="active treeview">
              <a href="#">
                <i class="fa fa-user-o"></i> <span>Modelo de Petição</span>
                <span class="pull-right-container">
                  <i class="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul class="treeview-menu">
                <li class="active"><a href="?page=<?Php echo base64_encode("../../pages/peticao_modelo/form.php"); ?>"><i class="fa fa-plus-square-o"></i>Novo</a></li>
                <li class="active"><a href="?page=<?Php echo base64_encode("../../pages/peticao_modelo/list.php"); ?>"><i class="fa fa-search"></i>Buscar</a></li>
              </ul>
            </li>

          <?php
          }
          ?>

        </ul>
      </section>
      <!-- /.sidebar -->
    </aside>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Main content -->
      <section class="content">

        <?Php

        $page = base64_decode($page);

        if ($page != "") {
          include_once($page);
        } else {
          include_once("../../pages/index/home.php");
        }

        ?>

      </section>
      <!-- right col -->
    </div>
    <!-- /.row (main row) -->

    <!-- /.content-wrapper -->
    <footer class="main-footer">
      <div class="pull-right hidden-xs">
        <b>Version</b> 2.4.13
      </div>
      <strong>Copyright &copy; 2014-2020 <a href="https://adminlte.io">AdminLTE</a>.</strong> All rights
      reserved.
    </footer>


    <div class="control-sidebar-bg"></div>
  </div>
  <!-- ./wrapper -->



</body>

</html>