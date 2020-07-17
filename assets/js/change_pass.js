$("input[type=password]").keyup(function () {
  var ucase = new RegExp("[A-Z]+");
  var lcase = new RegExp("[a-z]+");
  var num = new RegExp("[0-9]+");

  if ($("#password1").val().length == 0) {
    $("#8char").removeClass("fa-check");
    $("#8char").addClass("fa-remove");
    $("#8char").css("color", "#FF0004");
  }

  if ($("#password1").val().length >= 8) {
    $("#8char").removeClass("fa-remove");
    $("#8char").addClass("fa-check");
    $("#8char").css("color", "#00A41E");
  } else {
    $("#8char").removeClass("fa-check");
    $("#8char").addClass("fa-remove");
    $("#8char").css("color", "#FF0004");
  }

  if (ucase.test($("#password1").val())) {
    $("#ucase").removeClass("fa-remove");
    $("#ucase").addClass("fa-check");
    $("#ucase").css("color", "#00A41E");
  } else {
    $("#ucase").removeClass("fa-check");
    $("#ucase").addClass("fa-remove");
    $("#ucase").css("color", "#FF0004");
  }

  if (lcase.test($("#password1").val())) {
    $("#lcase").removeClass("fa-remove");
    $("#lcase").addClass("fa-check");
    $("#lcase").css("color", "#00A41E");
  } else {
    $("#lcase").removeClass("fa-check");
    $("#lcase").addClass("fa-remove");
    $("#lcase").css("color", "#FF0004");
  }

  if (num.test($("#password1").val())) {
    $("#num").removeClass("fa-remove");
    $("#num").addClass("fa-check");
    $("#num").css("color", "#00A41E");
  } else {
    $("#num").removeClass("fa-check");
    $("#num").addClass("fa-remove");
    $("#num").css("color", "#FF0004");
  }

  if ($("#password1").val() == $("#password2").val()) {
    $("#pwmatch").removeClass("fa-remove");
    $("#pwmatch").addClass("fa-check");
    $("#pwmatch").css("color", "#00A41E");
  } else {
    $("#pwmatch").removeClass("fa-check");
    $("#pwmatch").addClass("fa-remove");
    $("#pwmatch").css("color", "#FF0004");
  }
});
