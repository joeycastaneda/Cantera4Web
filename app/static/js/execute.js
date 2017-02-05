
$(function() {
    $('button#execButton').on("click", function() {
        var editor = ace.edit("editor1");
        var text = editor.getValue();
        $.getJSON('/execute', {
         code: text
     }, function(data) {
         $('textarea#output').val(data.output);
        });
        return false;
     });   
});

