function toggle_menu(){
	
	if(JJ('#menu_visivel').val() == 1){
		JJ('#menu_total').hide('slow');
		JJ('#page-wrapper').animate({ "margin-left": "0px" }, "slow" );
		JJ('#menu_visivel').val(0);
	}else{
		JJ('#menu_total').show('slow');
		JJ('#page-wrapper').animate({ "margin-left": "260px" }, "slow" );
		JJ('#menu_visivel').val(1);
	}
	 
}

function trocar_evento_status(TIPO){
	if(TIPO==1){
//		JJ('#id_evento_status').children('option[value="2"]').removeAttr('disabled');
//		JJ('#id_evento_status').children('option[value="3"]').removeAttr('disabled');
//		JJ('#id_evento_status').children('option[value="4"]').attr('disabled','true');
//		JJ('#id_evento_status').children('option[value="5"]').attr('disabled','true');
//		JJ('#id_evento_status').children('option[value="6"]').attr('disabled','true');
//		JJ('#id_evento_status').children('option[value="7"]').attr('disabled','true');
	}else if(TIPO==2){
//		JJ('#id_evento_status').children('option[value="2"]').attr('disabled','true');
//		JJ('#id_evento_status').children('option[value="3"]').attr('disabled','true');
//		JJ('#id_evento_status').children('option[value="4"]').removeAttr('disabled');
//		JJ('#id_evento_status').children('option[value="5"]').removeAttr('disabled');
//		JJ('#id_evento_status').children('option[value="6"]').removeAttr('disabled');
//		JJ('#id_evento_status').children('option[value="7"]').removeAttr('disabled');
	}else{
//		JJ('#id_evento_status').children('option[value="2"]').attr('disabled','true');
//		JJ('#id_evento_status').children('option[value="3"]').attr('disabled','true');
//		JJ('#id_evento_status').children('option[value="4"]').attr('disabled','true');
//		JJ('#id_evento_status').children('option[value="5"]').attr('disabled','true');
//		JJ('#id_evento_status').children('option[value="6"]').attr('disabled','true');
//		JJ('#id_evento_status').children('option[value="7"]').attr('disabled','true');
	}
	
}

function redireciona_page(CAMINHO) {
	window.location=CAMINHO;
}

function redireciona_page1(CAMINHO) {
	window.open(CAMINHO);
}

function enviar_formulario_confirm(FORMULARIO){
	
	var confimou = confirm('Deseja realmente realizar esta operacao?');

	if(confimou==true){
		enviar_formulario(FORMULARIO);
	}
	
	return false;
		
	
}

function enviar_formulario(FORMULARIO) {

	JJ.ajax({
		type : "POST",
		url : JJ('#' + FORMULARIO.id).attr("action"),
		data : JJ('#' + FORMULARIO.id).serialize(),
		beforeSend : function() {
		},
		success : function(txt) {
			variaveis_json = eval("(" + txt + ")");

			if (variaveis_json.mensagem != "") {
				
				bootbox.dialog({
					title : "Uma mensagem pra você",
					message : variaveis_json.mensagem
				});
				
			}

			if (variaveis_json.exe_metodo == 1) {
				var metodo = variaveis_json.metodo;
				eval(metodo);
			}

		},
		error : function(txt) {
			alert(txt);
		}
	});

	return false;
}

function mostar_div(PESSOA_TIPO) {

	if (PESSOA_TIPO == 1) {
		JJ(".div_cpf").hide();
		JJ(".div_cnpj").hide();
	} else if (PESSOA_TIPO == 2) {
		JJ(".div_cpf").hide();
		JJ(".div_cnpj").show();
	} else {
		JJ(".div_cpf").hide();
		JJ(".div_cnpj").hide();
	}

}

function Mascara(o, f) {
	v_obj = o
	v_fun = f
	setTimeout("execmascara()", 1)
}

function execmascara() {
	v_obj.value = v_fun(v_obj.value)
}

function leech(v) {
	v = v.replace(/o/gi, "0")
	v = v.replace(/i/gi, "1")
	v = v.replace(/z/gi, "2")
	v = v.replace(/e/gi, "3")
	v = v.replace(/a/gi, "4")
	v = v.replace(/s/gi, "5")
	v = v.replace(/t/gi, "7")
	return v
}

function Hora(v) {
	v = v.replace(/\D/g, "")
	v = v.replace(/(\d{2})(\d)/, "$1:$2")
	v = v.replace(/(\d{2})(\d)/, "$1:$2")
	return v
}

function Data(v) {
	v = v.replace(/\D/g, "")
	v = v.replace(/(\d{2})(\d)/, "$1/$2")
	v = v.replace(/(\d{2})(\d)/, "$1/$2")
	return v
}

function Din(v) {
	v = v.replace(/\D/g, "") //Remove tudo o que n�o � d�gito
	v = v.replace(/^([0-9]{3}\.?){3}-[0-9]{2}$/, "$1.$2");
	//v=v.replace(/(\d{3})(\d)/g,"$1,$2")
	v = v.replace(/(\d)(\d{2})$/, "$1.$2") //Coloca ponto antes dos 2 �ltimos digitos
	return v
}

function Integer(v) {
	return v.replace(/\D/g, "")
}

function Cpf(v) {
	v = v.replace(/\D/g, "")
	v = v.replace(/(\d{3})(\d)/, "$1.$2")
	v = v.replace(/(\d{3})(\d)/, "$1.$2")

	v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2")
	return v
}

function Cnpj(v) {
	v = v.replace(/\D/g, "")
	v = v.replace(/^(\d{2})(\d)/, "$1.$2")
	v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
	v = v.replace(/\.(\d{3})(\d)/, ".$1/$2")
	v = v.replace(/(\d{4})(\d)/, "$1-$2")
	return v
}

function pulacampo(idobj, idproximo) {
	var str = new String(document.getElementById(idobj).value);
	var mx = new Number(document.getElementById(idobj).maxLength);

	if (str.length == mx) {
		document.getElementById(idproximo).focus();
	}

}

function getEndereco() {
	if(JJ.trim(JJ("#cep").val()) != ""){
		JJ.getScript("http://cep.republicavirtual.com.br/web_cep.php?formato=javascript&cep="+JJ("#cep").val(), function(){
					if(resultadoCEP["resultado"] && resultadoCEP["bairro"] != ""){
						JJ("#rua").val(unescape(resultadoCEP["logradouro"]));
						JJ("#bairro").val(unescape(resultadoCEP["bairro"]));
						JJ("#cidade").val(unescape(resultadoCEP["cidade"]));
						JJ("#uf").val(unescape(resultadoCEP["uf"]));
						JJ("#numero").focus();
					}else{
							alert("Endereco nao encontrado");
							return false;
					}
			});                             
	}
    else
    {
        alert('Antes, preencha o campo CEP!');
	}
	
}