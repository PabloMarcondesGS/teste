<?Php
session_start();
include_once('../../class/Geral.php'); 
include_once('../../class/PeticaoModelo.php'); 
include_once('../../class/ProcessoSubtipo.php'); 
include_once('../../class/Hibernate.php'); 

include_once('../../class/Login_admin.php');
$acaoLogin_admin = new Login_admin;
$acaoLogin_admin->protegePagina();

$PeticaoModelo = new PeticaoModelo();
$ProcessoSubtipo = new ProcessoSubtipo();
$Hibernate = new Hibernate();
$Geral = new Geral();
                  
?>

         <div class="box">
            <div class="box-header">
              <h3 class="box-title">
              	<h2>Busca de modelo de petição | <a href="?page=<?Php echo base64_encode('../../pages/peticao_modelo/form.php'); ?>" class="LINK" >Novo</a></h2>
				    <?php echo $Geral->exibir_mensagem(); ?>
              </h3>
              
            </div>
            <!-- /.box-header -->
            <div class="box-body table-responsive">
              <table id="listagem" class="table table-bordered table-striped">
              	
                <thead>
                <tr>
                  <th>Subtipo</th>
                  <th>Alterar</th>
                  <th>Excluir</th>
                </tr>
                </thead>
				
                <tbody>
                
                <?php 
                                        
                $result = $Hibernate->listar($PeticaoModelo,"id","DESC");
                $i = 0;
                while($array = mysqli_fetch_array($result)){
                	$i++;
                  $PeticaoModelo = new PeticaoModelo;
                  $PeticaoModelo->id = $array["id"];
                  $PeticaoModelo->processo_subtipo_id = $array["processo_subtipo_id"];
                  
                ?>
               
                  <tr>
                    <td>
                      <?php                   
                      $result_ps = $Hibernate->buscar_por_campo($ProcessoSubtipo,$ProcessoSubtipo->id_tabela(),$PeticaoModelo->processo_subtipo_id);
                      if($array_ps = mysqli_fetch_array($result_ps)){
                        echo $array_ps['nome'];
                      }                  
                      ?>
                  </td>
                  
                  <td>
                    <form method="post" id="form1<?Php echo $i; ?>" name="form1<?Php echo $i; ?>" action="?page=<?Php echo base64_encode('../../pages/peticao_modelo/form.php'); ?>" >
                      <input name="id_" type="hidden" id="id_" value="<?Php echo $PeticaoModelo->id; ?>" />
                      <input name="action" id="action" type="hidden" value="alterar" />
                      <input type="submit" class="btn btn-primary" value="  Administra&ccedil;&atilde;o  " />
                    </form>
                  </td>

                  <td>
                    <?php if($_SESSION['operador_pessoas_tipo_id'] == 4){ ?>
                        
                        <form name="form2<?Php echo $i; ?>" id="form2<?Php echo $i; ?>" action="?page=<?Php echo base64_encode('../../pages/peticao_modelo/exe.php'); ?>" method="post" class="formulario_del" >
                            <input name="id_" type="hidden" id="id_" value="<?Php echo $PeticaoModelo->id; ?>" />
                            <input name="action" id="action" type="hidden" value="excluir" />
                            <input type="submit" class="btn btn-danger" value="  Excluir  " />
                        </form>
                        
                    <?php } ?>
                  </td>

            </tr>
				
				      <?php } ?>
            </tbody>
                
            <tfoot>
		        <tr>
                     <th>Subtipo</th>
                    <th>Alterar</th>
                    <th>Excluir</th>
                </tr>
		    </tfoot>
                
              </table>
            </div>
            <!-- /.box-body -->
          </div>
      
      
<?php $Geral->apagar_mensagem(); ?>

<?php 

  unset($_SESSION['mod_pet_processo_subtipo_id']);
  unset($_SESSION['mod_pet_texto']);

?>