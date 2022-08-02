<?php
    include_once('../../class/Login_admin.php');
    $acaoLogin_admin = new Login_admin;
    $acaoLogin_admin->protegePagina();
    
    $acaoLogin_admin->expulsaVisitante();
?>