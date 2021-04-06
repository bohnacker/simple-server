
$(function() {

  // call showDatabase() on starting of the app to see what's in the database
  //setInterval(showDatabase, 1000);
  showDatabase();

  // loads all entries from the database and creates list items in the html document
  function showDatabase() {
    $.get('/--state', function(state) {
      // const html = JSON.stringify(state, null, '<br>  ');
      // html = html.replaceAll("},{", "},<br>{");
      const html = prettyPrintJson.toHtml(state, {indent:2});
      $('.state').html(html);
    });
  }

  $('#button-clear').click(function (ev) {
    $.get('/--clear');
    showDatabase();
  });

});
