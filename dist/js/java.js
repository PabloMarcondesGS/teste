let textMessage = "";

function enviarMesangem(cliente_id) {
  var objDiv = document.getElementById("div-dialogo");

  jQuery
    .ajax({
      method: "POST",
      url: "../../pages/caixa_entrada/exe.php",
      dataType: "json",
      data: {
        action: "enviarMesangem",
        cliente_id: cliente_id,
        mensagem_envio: jQuery("#mensagem_envio").val(),
      },
    })
    .done(function (dados) {
      if (dados.errou == true) {
        alert(dados.mensagem);
      } else {
        jQuery("#mensagem_envio").val("");

        jQuery
          .ajax({
            method: "POST",
            url: "../../pages/caixa_entrada/exe.php",
            data: {
              action: "getMessage",
              cliente_id: cliente_id,
              lido: 1,
              limit: 1,
              offset: 0,
            },
          })
          .done(function (html) {
            textMessage = textMessage + html;

            jQuery("#div-dialogo").html(textMessage);

            objDiv.scrollTop = objDiv.scrollHeight;
          });
      }
    });
}

function checkPressEnter(cliente_id) {
  var key = window.event.keyCode;

  if (key === 13) {
    enviarMesangem(cliente_id);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getMessage(cliente_id, limit, offset) {
  var objDiv = document.getElementById("div-dialogo");

  var lido = document.getElementById("lido");

  await sleep(1000);

  var result = await jQuery
    .ajax({
      method: "POST",
      url: "../../pages/caixa_entrada/exe.php",
      data: {
        action: "getMessage",
        cliente_id: cliente_id,
        lido: lido.value,
        limit: limit,
        offset: offset,
      },
    })
    .done(function (html) {
      let first = true;

      if (textMessage != "") {
        first = false;
      }
      textMessage = html + textMessage;

      jQuery("#div-dialogo").html(textMessage);

      if (first == true) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
    });

  return result;
}

$(document).ready(function () {
  $(".formulario_del").click(function () {
    if (!confirm("Deseja realmente excluir permanentemente este registro?")) {
      return false;
    }
  });
  $(".formulario_desativar").click(function () {
    if (!confirm("Deseja realmente desativar este registro?")) {
      return false;
    }
  });
  $(".formulario_ativar").click(function () {
    if (!confirm("Deseja realmente ativar este registro?")) {
      return false;
    }
  });
});
