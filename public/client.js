$(function() {

  // call loadSurveys() on starting of the app to see what's in the database
  loadSurveys();


  // attach an event handler for pressing the submit button
  $('form').submit(function(event) {
    event.preventDefault();
    
    // get values from the input fields
    var name = $('input#name').val();
    var answer = $('input#answer').val();
    var color = $('input#color').val();

    // prepare values for sending it to the server. '.param' creates a serialized string representation from an object.
    var submitURL = '/surveys?' + $.param({name:name, answer:answer, color:color});
 
    // send the data to the server. 
    $.post(submitURL, function() {
      // this function will be called on success

      // clear form fields
      $('input#name').val('');
      $('input#answer').val('');
      $('input#color').val('');
      $('input').focus();

      // update list of entries
      loadSurveys();
    });
  });


  // loads all entries from the database and creates list items in the html document
  function loadSurveys() {
    $.get('/surveys', function(surveys) {
      
      // clear list when the data is loaded from the server
      $('ul#surveys li').remove();

      // create a list item for each entry in the json object
      surveys.forEach(function(survey) {
        $('<li></li>').text(survey.name + " " + survey.answer + " " + survey.color).appendTo('ul#surveys');
      });
    });
  }

});
