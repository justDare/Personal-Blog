$(document).ready(function () {
  var formInputs = $('input[type="email"],input[type="password"],input[type="text"], input[type="submit"]');
  $('input[type="text"]').parent().children('.form-label label').addClass('formTop');
  $(formInputs).focus(function () {
    $(this).parent().children('.form-label label').addClass('formTop');
    $('div#formWrapper').addClass('darken-bg');
    $('div.logo').addClass('logo-active');
  });
  formInputs.focusout(function () {
    if ($.trim($(this).val()).length == 0) {
      $(this).parent().children('.form-label label').removeClass('formTop');
    }
    //$('div#formWrapper').removeClass('darken-bg');
    //$('div.logo').removeClass('logo-active');
  });
  $('form-label').click(function () {
    $(this).parent().children('input').focus();
  });
});
