
$(function() {
    $('button#execButton').on("click", function() {
        var editor = ace.edit("editor1");
        var text = editor.getValue();
        $.getJSON('/execute', {
         code: text
     }, function(data) {
         $('textarea#output').val(data.output);
         var plot_imgDiv = document.getElementById("plot_img");
                while(plot_imgDiv.firstChild){
                  plot_imgDiv.removeChild(plot_imgDiv.firstChild);
                }  
         if(data.plot == "T"){
             $.get('/tmp/userplt.png')
             .done(function() {  
                 var d = new Date();
                var imgContent = document.createElement("IMG");
                imgContent.setAttribute("src", '/tmp/userplt.png?ver=' + d.getTime());
                plot_imgDiv.appendChild(imgContent);
         })
         }
        });

    return false;
    });

});

$(function() {
    $('button#saveButton').on("click", function() {
        var editor = ace.edit("editor1");
        var text = editor.getValue();
        $.getJSON('/save', {
         code: text
     }, function(data) {
        });
        return false;
     });
});

$(function() {
    $('button#restoreButton').on("click", function() {
        $.getJSON('/restore', {

     }, function(data) {
            var editor = ace.edit("editor1");
            var text = editor.setValue(data.script, 1);
        });
        return false;
     });
});

timeout_id = null;
$(function() {
    $(document).keypress(function() {
        if (timeout_id) {
            timeout_id = clearTimeout(timeout_id);
        }
        timeout_id=setTimeout(function(){
            console.log("autosaving...");
            var editor = ace.edit("editor1");
            var text = editor.getValue();
            $.getJSON('/save', {
            code: text
            }, function(data) {
            });
            return false;
            },750);
     });
});
