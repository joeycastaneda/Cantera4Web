function togglePlotBtn(option) {
    var btn = document.getElementById('plotButton');
    var link = document.getElementById('plotButton');
    if(option === 0){
        if(btn.style.display != 'none'){
            btn.style.display = 'none';
            link.style.display = 'none';
        }
    }

    else{
        btn.style.display = '';
        link.style.display = '';
    }
}

$(function() {
    $('button#execButton').on("click", function() {
        var editor = ace.edit("editor1");
        var text = editor.getValue();
        var lang = $("#langSelect>option:selected").html()
        $.getJSON('/execute', {
         code: text,
         lang: lang
     }, function(data) {
         $('textarea#output').val(data.output);
         var plot_imgDiv = document.getElementById("plot_img");
                while(plot_imgDiv.firstChild){
                  plot_imgDiv.removeChild(plot_imgDiv.firstChild);
                }  
         if(data.plot === "T"){
             $.get('/tmp/userplt.png')
             .done(function() {  
                 var d = new Date();
                 togglePlotBtn(1);
                var imgContent = document.createElement("IMG");
                imgContent.setAttribute("src", '/tmp/userplt.png?ver=' + d.getTime());
                plot_imgDiv.appendChild(imgContent);

         });
         }
         else if(data.plot === "F"){
               togglePlotBtn(0);
         }
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
        var filename = x.files[0].name;
        var file = x.files[0];
        var ext = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
        if(ext === 'py' || ext === 'txt' || ext === "cpp" || ext === "c"){
            var reader = new FileReader();
            reader.onload = function(event){
                var contents = event.target.result;
                editor.setValue(contents, 1);
        };
        reader.readAsText(file);
        }
        return false;
     });
});

$(function() {
    $('select#langSelect').change(function(){
        var editor = ace.edit("editor1");
        var lang = $("#langSelect>option:selected").html()
        if(lang == "Python"){
            editor.getSession().setMode("ace/mode/python");
        }
        else{
            editor.getSession().setMode("ace/mode/c_cpp");
        }
    })
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

$(function() {
    $("#output").change(function() {
        console.log("saving output...");
        var output = $('#output').val();
       $.getJSON('/makeoutput', {
            output: output
            }, function(data) {
            });
        return false;
    });
 });
