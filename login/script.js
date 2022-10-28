(function() {
  var $ = function(selector) {
    return document.querySelector(selector);
  }
  var field1 = $('.field1');
  var field2 = $('.field2');
  var action = $('.action');

  var endpoint = '';

  if(!action) {
    return false;
  }

  action.addEventListener('click', function() {
    var field1Value = field1.value; // валуй из первого поля
    var field2Value = field2.value; // валуй из второго поля

    //https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch
    //window.fetch(endpoint)

  })
} ());