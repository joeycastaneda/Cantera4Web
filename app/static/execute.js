
$(function() {
    $('button#execButton').on("click", function() {
     $.getJSON('/execute', {
         code: $('textarea#pyform').val()
     }, function(data) {
         $('textarea#output').val(data.output);
        });
        return false;
     });   
});

