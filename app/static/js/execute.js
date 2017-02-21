
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
                var imgContent = document.createElement("IMG");
                imgContent.setAttribute("src", '/tmp/userplt.png');
                plot_imgDiv.appendChild(imgContent);
         })
         }
        });

    return false;
    });

});

