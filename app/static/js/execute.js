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

$(function() {
    $('button#importButton').on("click", function() {
        var x = document.getElementById("fileImport");
        var editor = ace.edit("editor1");
        var blah = editor.setValue('sdf', 1);
    /*    if('files' in x){
            if(x.files.length > 0){
                var filename = x.files[0].name;
                var re = /(?:\.([^.]+))?$/;
                var ext = re.exec(filename)[1];
                if(ext === 'py' || ext === 'txt'){
                  ace.edit.("editor1").setValue(filename, 1);
                }
            }
      */

        return false;
     });
});

