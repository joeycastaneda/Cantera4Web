$(document).ready(function() {
    // initialize tabs
    $('#tabs').tabs();

    // array containing all the editors we will create
    var editors = [];
    var tabTitle = $( "#tab_title" );

    $( function() {
    // Modal dialog init: custom buttons and a "close" callback resetting the form inside
    var dialog = $( "#dialog" ).dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        Add: function() {
        if(numTabs() < 10)
        {
             var selected = $('#exampleSelect').val();
          var tabsElement = $('#tabs');
          var tabsUlElement = tabsElement.find('ul');

        // the panel id is a timestamp plus a random number from 0 to 10000
        //var tabUniqueId = Math.floor(Math.random()*10000);
        var tabUniqueId;
        if(selected != "No file chosen"){
            tabUniqueId = selected;
        }
        else{
            tabUniqueId = tabTitle.val();
        }

        // the panel id is a timestamp plus a random number from 0 to 10000
        //var tabUniqueId = Math.floor(Math.random()*10000);

        // create a navigation bar item for the new panel
        var newTabNavElement = $('<li style="background-color:rgba(255,212,12,0.62);" + id="panel_nav_' + tabUniqueId + '"><a href="#panel_' + tabUniqueId + '">' + tabUniqueId + '</a></li>');

        // add the new nav item to the DOM
        tabsUlElement.append(newTabNavElement);

        // create a new panel DOM
        var newTabPanelElement = $('<div style="background-color: transparent;" id="panel_' + tabUniqueId + '" data-tab-id="' + tabUniqueId + '"> ' + ': <br/></div>');

        tabsElement.append(newTabPanelElement);

        // refresh the tabs widget
        tabsElement.tabs('refresh');

        var tabIndex = $('#tabs ul li').index($('#panel_nav_' + tabUniqueId));

        // activate the new panel
        tabsElement.tabs('option', 'active', tabIndex);

        // create the editor dom
        var newEditorElement = $('<div style="background-color: BLACK" id="editor_' + tabUniqueId + '"></div>');

        newTabPanelElement.append(newEditorElement);

        // initialize the editor in the tab
        var editor = ace.edit('editor_' + tabUniqueId);
        editor.setTheme("ace/theme/tomorrow_night_bright");
        editor.getSession().setMode("ace/mode/python");

        if(selected != "No file chosen"){
            $.getJSON('/getExamples', {} ,function(data){
                $(data.list).each(function(key, value){
                    if(value === selected)
                    {
                        editor.setValue(data.code[key], -1);
                    }
                });
            });
        }

        // set the size of the panel
        newTabPanelElement.width('98%');
        newTabPanelElement.height('450');

        // set the size of the editor
        newEditorElement.width('99%');
        newEditorElement.height('400');

        // resize the editor
        editor.resize();
        var cleanID = tabUniqueId;
        if(cleanID.indexOf(".") != -1)
        {
           cleanID = cleanID.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
        }
        editors.push({id: cleanID, instance: editor});

        // add an editor/panel close button to the panel dom
        var closeButton = $('<button class="close">close</button>');

        var execButton = $('<button class="execButton" id="execButton">Execute</button>');
        var deleteButton = $('<button class="deleteButton" id="deleteButton" >Delete</button>');
        var importButton = $('<button class="importButton" id="importButton" >Import</button>');
        var fileImport = $('<input style="color: #ffd40c;" type=file id="fileImport">');
        var header = $('<h2 style="color: #ffd40c;">Output</h2>');
        var output = $('<p class="p_editor"> <textarea id=' + '"output' + tabUniqueId + '" placeholder="Output appears here" rows="15" ></textarea> </p>');
        var outputButton = $('<button style="color: #ffd40c;" class="outputButton" id="outputButton"> <a style="color: #ffd40c;" href="/output" download="output.txt">Get Output</a> </button>');
        var img1 = $('<div class="imgdiv" id="plot_img1_' + tabUniqueId + '"> </div>');
        var img2 = $('<div class="imgdiv" id="plot_img2_' + tabUniqueId + '"> </div>');
        var plot = $('<button class="plotButton" id="plotButton" style="color: #ffd40c;" > <a style="color: #ffd40c;" id="plotlink" href="/getplot" download="userplt.png">Get Plot</a> </button>');
        newTabPanelElement.append(execButton);
        newTabPanelElement.append(deleteButton);
        newTabPanelElement.append(importButton);
        newTabPanelElement.prepend(closeButton);
        newTabPanelElement.append(fileImport);
        newTabPanelElement.append(header);
        newTabPanelElement.append(output);
        newTabPanelElement.append(outputButton);
        newTabPanelElement.append(img1);
        newTabPanelElement.append(img2);
        newTabPanelElement.append(plot);
        togglePlotBtn(0);
        }
        $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
        $form[ 0 ].reset();
      }
    });

var $form = $( "form", dialog ).submit(function() {
        if(numTabs() < 10)
        {
             var selected = $('#exampleSelect').val();
          var tabsElement = $('#tabs');
          var tabsUlElement = tabsElement.find('ul');

        // the panel id is a timestamp plus a random number from 0 to 10000
        //var tabUniqueId = Math.floor(Math.random()*10000);
        var tabUniqueId;
        if(selected != "No file chosen"){
            tabUniqueId = selected;
        }
        else{
            tabUniqueId = tabTitle.val();
        }

        // the panel id is a timestamp plus a random number from 0 to 10000
        //var tabUniqueId = Math.floor(Math.random()*10000);

        // create a navigation bar item for the new panel
        var newTabNavElement = $('<li style="background-color:rgba(255,212,12,0.62);" + id="panel_nav_' + tabUniqueId + '"><a href="#panel_' + tabUniqueId + '">' + tabUniqueId + '</a></li>');

        // add the new nav item to the DOM
        tabsUlElement.append(newTabNavElement);

        // create a new panel DOM
        var newTabPanelElement = $('<div style="background-color: transparent;" id="panel_' + tabUniqueId + '" data-tab-id="' + tabUniqueId + '"> ' + ': <br/></div>');

        tabsElement.append(newTabPanelElement);

        // refresh the tabs widget
        tabsElement.tabs('refresh');

        var tabIndex = $('#tabs ul li').index($('#panel_nav_' + tabUniqueId));

        // activate the new panel
        tabsElement.tabs('option', 'active', tabIndex);

        // create the editor dom
        var newEditorElement = $('<div style="background-color: BLACK" id="editor_' + tabUniqueId + '"></div>');

        newTabPanelElement.append(newEditorElement);

        // initialize the editor in the tab
        var editor = ace.edit('editor_' + tabUniqueId);
        editor.setTheme("ace/theme/tomorrow_night_bright");
        editor.getSession().setMode("ace/mode/python");

        if(selected != "No file chosen"){
            $.getJSON('/getExamples', {} ,function(data){
                $(data.list).each(function(key, value){
                    if(value === selected)
                    {
                        editor.setValue(data.code[key], -1);
                    }
                });
            });
        }

        // set the size of the panel
        newTabPanelElement.width('98%');
        newTabPanelElement.height('450');

        // set the size of the editor
        newEditorElement.width('99%');
        newEditorElement.height('400');

        // resize the editor
        editor.resize();
        var cleanID = tabUniqueId;
        if(cleanID.indexOf(".") != -1)
        {
           cleanID = cleanID.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
        }
        editors.push({id: cleanID, instance: editor});

        // add an editor/panel close button to the panel dom
        var closeButton = $('<button class="close">close</button>');

        var execButton = $('<button class="execButton" id="execButton">Execute</button>');
        var deleteButton = $('<button class="deleteButton" id="deleteButton" >Delete</button>');
        var importButton = $('<button class="importButton" id="importButton" >Import</button>');
        var fileImport = $('<input style="color: #ffd40c;" type=file id="fileImport">');
        var header = $('<h2 style="color: #ffd40c;">Output</h2>');
        var output = $('<p class="p_editor"> <textarea id=' + '"output' + tabUniqueId + '" placeholder="Output appears here" rows="15" ></textarea> </p>');
        var outputButton = $('<button style="color: #ffd40c;" class="outputButton" id="outputButton"> <a style="color: #ffd40c;" href="/output" download="output.txt">Get Output</a> </button>');
        var img1 = $('<div class="imgdiv" id="plot_img1_' + tabUniqueId + '"> </div>');
        var img2 = $('<div class="imgdiv" id="plot_img2_' + tabUniqueId + '"> </div>');
        var plot = $('<button class="plotButton" id="plotButton" style="color: #ffd40c;" > <a style="color: #ffd40c;" id="plotlink" href="/getplot" download="userplt.png">Get Plot</a> </button>');
        newTabPanelElement.append(execButton);
        newTabPanelElement.append(deleteButton);
        newTabPanelElement.append(importButton);
        newTabPanelElement.prepend(closeButton);
        newTabPanelElement.append(fileImport);
        newTabPanelElement.append(header);
        newTabPanelElement.append(output);
        newTabPanelElement.append(outputButton);
        newTabPanelElement.append(img1);
        newTabPanelElement.append(img2);
        newTabPanelElement.append(plot);
        togglePlotBtn(0);

        event.preventDefault();
         dialog.dialog( "close" );
         }

    });

$( "#add_tab" )
    .button()
    .on( "click", function() {
    dialog.dialog( "open" );
});
});

    $('#tabs').on('click', '.close', function () {


        var tabUniqueId = $(this).parent().attr('data-tab-id');
        if(tabUniqueId.indexOf(".") != -1)
        {
            tabUniqueId = tabUniqueId.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
        }

        var resultArray = $.grep(editors, function (n, i) {
            if(n.id === tabUniqueId)
            {
                return true;
            }
        });

        var editor = resultArray[0].instance;

        // destroy the editor instance
        editor.destroy();

        // remove the panel and panel nav dom
        $('#tabs').find('#panel_nav_' + tabUniqueId).remove();
        $('#tabs').find('#panel_' + tabUniqueId).remove();

    });


    function togglePlotBtn(option) {
        var btn = document.getElementById('plotButton');
        var link = document.getElementById('plotButton');
        if (option === 0) {
            if (btn.style.display != 'none') {
                btn.style.display = 'none';
                link.style.display = 'none';
            }
        }

        else {
            btn.style.display = '';
            link.style.display = '';
        }
    }

    $('#tabs').on('click', '.execButton', function () {
        var tabUniqueId = $(this).parent().attr('data-tab-id');

        var cleanID = tabUniqueId;
        if(cleanID.indexOf(".") != -1)
        {
            cleanID = cleanID.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
        }

        var textArea = $('textarea#output' + cleanID);
        textArea.val("Retrieving Output...");

        var resultArray = $.grep(editors, function (n, i) {
            return n.id === cleanID;
        });
        var editor = resultArray[0].instance;
        var text = editor.getValue();

        var newID = tabUniqueId;
        if(newID.indexOf(".") != -1)
        {
            newID = newID.replace( /(:|\.|\[|\]|,)/g, "\\\\$1" );
        }
        var execButton = $($("[id='panel_" + tabUniqueId +"' ]").children("#execButton")[0]);
        execButton.toggleClass("execButton execButtonDisabled");
        execButton.prop('disabled', true);

        $.getJSON('/execute', {
            code: text,
            lang: "Python"
        }, function (data) {

            var string = 'textarea#output' + tabUniqueId;
            if(string.indexOf(".") != -1)
            {
                string = string.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
            }  
            out = $(string);
            out.val(data.output);
            s1 = 'plot_img1_' +  tabUniqueId;
            s2 = 'plot_img2_' +  tabUniqueId;
            var plot_imgDiv1 = document.getElementById(s1);
            var plot_imgDiv2 = document.getElementById(s2);
            while (plot_imgDiv1.firstChild) {
                plot_imgDiv1.removeChild(plot_imgDiv1.firstChild);
            }
            while (plot_imgDiv2.firstChild) {
                plot_imgDiv2.removeChild(plot_imgDiv2.firstChild);
            }
            if (data.plot === "T1") {
                $.get('/tmp/userplt.png')
                    .done(function () {
                        var d = new Date();
                        togglePlotBtn(1);
                        var imgContent = document.createElement("IMG");
                        imgContent.setAttribute("src", '/tmp/userplt.png?ver=' + d.getTime());
                        plot_imgDiv1.appendChild(imgContent);

                    });

            }
            else if (data.plot === "T12") {
                $.get('/tmp/userplt.png')
                    .done(function () {
                        var d = new Date();
                        togglePlotBtn(1);
                        var imgContent = document.createElement("IMG");
                        imgContent.setAttribute("src", '/tmp/userplt.png?ver=' + d.getTime());
                        plot_imgDiv1.appendChild(imgContent);

                    });
                $.get('/tmp/userplt2.png')
                    .done(function () {
                        var d = new Date();
                        togglePlotBtn(1);
                        var imgContent = document.createElement("IMG");
                        imgContent.setAttribute("src", '/tmp/userplt2.png?ver=' + d.getTime());
                        plot_imgDiv2.appendChild(imgContent);

                    });
            }
            else if (data.plot === "F") {
                togglePlotBtn(0);
            }
            execButton.prop('disabled', false);
            execButton.toggleClass("execButton execButtonDisabled");
        });

        return false;
    });

    $(function () {
        $("#output").change(function () {
            var output = $('#output').val();
            $.getJSON('/makeoutput', {
                output: output
            }, function (data) {
            });
            return false;
        });
    });

    $('#tabs').on('click', '.deleteButton', function () {
         var tabUniqueId = $(this).parent().attr('data-tab-id');
        $.getJSON('/deleteFile', {
            filename: tabUniqueId
        },
        function (data) {
          //  var tabUniqueId = $(this).parent().attr('data-tab-id');
            if(tabUniqueId.indexOf(".") != -1)
            {
                tabUniqueId = tabUniqueId.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
            }

            var resultArray = $.grep(editors, function (n, i) {
                if(n.id === tabUniqueId)
                {
                    return true;
                }
            });

            var editor = resultArray[0].instance;
            // destroy the editor instance
            editor.destroy();

            // remove the panel and panel nav dom
            $('#tabs').find('#panel_nav_' + tabUniqueId).remove();
            $('#tabs').find('#panel_' + tabUniqueId).remove();
                updateFileSelect();
        });
            return false;
    });


    $('#tabs').on('click', '.importButton', function () {
        var tabUniqueId = $(this).parent().attr('data-tab-id');
        var parent = document.getElementById("panel_" + tabUniqueId);
        var x = parent.querySelector("#fileImport");

        var cleanID = tabUniqueId;
        if(cleanID.indexOf(".") != -1)
        {
            cleanID = cleanID.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
        }

        var resultArray = $.grep(editors, function (n, i) {
            return n.id === cleanID;
        });

        var editor = resultArray[0].instance;
        var filename = x.files[0].name;
        var file = x.files[0];
        var ext = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
        if (ext === 'py' || ext === 'txt' || ext === "cpp" || ext === "c") {
            var reader = new FileReader();
            reader.onload = function (event) {
                var contents = event.target.result;
                editor.setValue(contents, -1);
            };
            reader.readAsText(file);
        }
        return false;
    });

    updateExampleSelect();

});

function numTabs(){
    var count = 0;
    $('.ui-tabs-tab').each(function() {
        count++;
    });
    return count;
}

function updateExampleSelect(){
    var selector = $('#exampleSelect');
    selector.empty();
    selector.append($('<option/>', {value: "No file chosen", text: "No file chosen"}));
    $.getJSON('/getExamples', {} ,function(data){
        $(data.list).each(function(key, value){
            if(value != "")
            {
                selector.append($('<option/>', {value: value, text: value}));
            }
        });
    });
}