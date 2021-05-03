
$(function () {

  // call showDatabase() on starting of the app to see what's in the database
  //setInterval(showDatabase, 1000);
  showDatabase();

  // loads all entries from the database and creates list items in the html document
  function showDatabase() {
    $.get('/--state', function (state) {
      // const html = JSON.stringify(state, null, '<br>  ');
      // html = html.replaceAll("},{", "},<br>{");

      let channels = Object.keys(state);
      for (let i = 0; i < channels.length; i++) {
        // console.log(channels[i]);
        let $channel = $('<div class="channel"></div>')
          .html('<div class="channel-name">' + channels[i] + '</div>')
          .appendTo('.state');

        let entries = state[channels[i]];
        for (let j = 0; j < entries.length; j++) {
          let entry = prettyPrintJson.toHtml(entries[j], { indent: 2 });
          // console.log(entry);
          $('<div class="entry"></div>')
            .html(entry)
            .appendTo($channel);
        }

        // console.log($channel);
      }

      // console.log(html);
      // html = html.replaceAll("<span class=json-key", "<br><span class=json-key")
      // $('.state').html(html);
    });
  }

  $('#button-clear').click(function (ev) {
    $.get('/--clear');
    showDatabase();
  });

});
