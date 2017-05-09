$(document).ready(function() {

    // initialize tabs
    $('#tabs').tabs();

    // array containing all the editors we will create
    var editors = [];

    $( function() {
    var tabTitle = $( "#tab_title" );

    // Modal dialog init: custom buttons and a "close" callback resetting the form inside
    var dialog = $( "#dialog" ).dialog({
      autoOpen: false,
      modal: true,
      buttons: {
        Add: function() {
          addTab();
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      },
      close: function() {
        form[ 0 ].reset();
      }
    });

    var form = dialog.find( "form" ).on( "submit", function( event ) {
          addTab();
          dialog.dialog( "close" );
          event.preventDefault();
        });

    $( "#add_tab" )
        .button()
        .on( "click", function() {
        dialog.dialog( "open" );
    });
    });

    $(function() {

         $.getJSON('/getFilenames', {}, function(data) {

            $(data.list).each(function(index){
                if(data.list[index] != "")
                {
                    var  tabsElement = $('#tabs');
                    var tabsUlElement = tabsElement.find('ul');

                    // the panel id is a timestamp plus a random number from 0 to 10000
                    var tabUniqueId = Math.floor(Math.random()*10000);

                    // create a navigation bar item for the new panel
                    var newTabNavElement = $('<li style="background-color:rgba(156,156,156,0.99);" + id="panel_nav_' + tabUniqueId + '"><a href="#panel_' + tabUniqueId + '">' + tabUniqueId + '</a></li>');

                    // add the new nav item to the DOM
                    tabsUlElement.append(newTabNavElement);

                    // create a new panel DOM
                    var newTabPanelElement = $('<div style="background-color: transparent;" id="panel_' + tabUniqueId + '" data-tab-id="' + tabUniqueId + '"> ' + ': <br/></div>');

                    tabsElement.append(newTabPanelElement);

                    // refresh the tabs widget
                    tabsElement.tabs('refresh');

                    var tabIndex = $('#tabs ul li').index($('#panel_nav_' + tabUniqueId));

                    console.log('tabIndex: ' + tabIndex);

                    // activate the new panel
                    tabsElement.tabs('option', 'active', tabIndex);

                    // create the editor dom
                    var newEditorElement = $('<div style="background-color: BLACK" id="editor_' + tabUniqueId + '"></div>');

                    newTabPanelElement.append(newEditorElement);

                    // initialize the editor in the tab
                    var editor = ace.edit('editor_' + tabUniqueId);
                    editor.setTheme("ace/theme/clouds_midnight");
                    editor.getSession().setMode("ace/mode/python");
                    editor.setValue(data.code[index], -1);

                    // set the size of the panel
                    newTabPanelElement.width('98%');
                    newTabPanelElement.height('450');

                    // set the size of the editor
                    newEditorElement.width('99%');
                    newEditorElement.height('400');

                    // resize the editor
                    editor.resize();

                    editors.push({ id: tabUniqueId, instance: editor });

                    // add an editor/panel close button to the panel dom
                    var closeButton = $('<button class="close">close</button>');
                    var execButton = $('<button class="execButton" id="execButton">Execute</button>');
                    var restoreButton = $('<button class="restoreButton" id="restoreButton">Restore</button>');
                    var importButton = $('<button class="importButton" id="importButton" >Import</button>');
                    var fileImport = $('<input style="color: white;" type=file id="fileImport">');
                    var header = $('<h2 style="color: #ffffff;">Output</h2>');
                    var output = $('<p class="p_editor"> <textarea id="output" placeholder="Output appears here" rows="15" ></textarea> </p>');
                    var outputButton = $('<button style="color: white;" class="button" id="outputButton"> <a style="color: white;" href="/output" download="output.txt">Get Output</a> </button>');
                    var img = $('<div class="imgdiv" id="plot_img"> </div>');
                    var plot = $('<button class="button" id="plotButton" style="color: white;" > <a style="color: white;" id="plotlink" href="/getplot" download="userplt.png">Get Plot</a> </button>');
                    var newTab = $('<div id="dialog" title="Tab data"> <form> <fieldset class="ui-helper-reset"> <label for="tab_title">Title</label> <input type="text" name="tab_title" id="tab_title" value="Tab Title" class="ui-widget-content ui-corner-all"> </fieldset> </form> </div>');
                    newTabPanelElement.append(newTab);
                    newTabPanelElement.append(execButton);
                    newTabPanelElement.append(restoreButton);
                    newTabPanelElement.append(importButton);
                    newTabPanelElement.prepend(closeButton);
                    newTabPanelElement.append(fileImport);
                    newTabPanelElement.append(header);
                    newTabPanelElement.append(output);
                    newTabPanelElement.append(outputButton);
                    newTabPanelElement.append(img);
                    newTabPanelElement.append(plot);
                }
            });
        });

     });

    // initialize button listener
    $('#addTab').on('click', function () {


        var tabsElement = $('#tabs');
        var tabsUlElement = tabsElement.find('ul');

        // the panel id is a timestamp plus a random number from 0 to 10000
        var tabUniqueId = Math.floor(Math.random() * 10000);

        // create a navigation bar item for the new panel
        var newTabNavElement = $('<li style="background-color:rgba(156,156,156,0.99);" + id="panel_nav_' + tabUniqueId + '" tab-id="' + tabUniqueId + '"><a href="#panel_' + tabUniqueId + '">' + tabUniqueId + '</a></li>');

        // add the new nav item to the DOM
        tabsUlElement.append(newTabNavElement);

        // create a new panel DOM
        var newTabPanelElement = $('<div style="background-color: transparent;" id="panel_' + tabUniqueId + '" data-tab-id="' + tabUniqueId + '"> ' + ': <br/></div>');

        tabsElement.append(newTabPanelElement);

        // refresh the tabs widget
        tabsElement.tabs('refresh');

        var tabIndex = $('#tabs ul li').index($('#panel_nav_' + tabUniqueId));

        console.log('tabIndex: ' + tabIndex);

        // activate the new panel
        tabsElement.tabs('option', 'active', tabIndex);

        // create the editor dom
        var newEditorElement = $('<div style="background-color: BLACK" id="editor_' + tabUniqueId + '"></div>');

        newTabPanelElement.append(newEditorElement);

        // initialize the editor in the tab
        var editor = ace.edit('editor_' + tabUniqueId);
        editor.setTheme("ace/theme/clouds_midnight");
        editor.getSession().setMode("ace/mode/python");

        // set the size of the panel
        newTabPanelElement.width('98%');
        newTabPanelElement.height('450');

        // set the size of the editor
        newEditorElement.width('99%');
        newEditorElement.height('400');

        // resize the editor
        editor.resize();

        editors.push({id: tabUniqueId, instance: editor});

        // add an editor/panel close button to the panel dom
        var closeButton = $('<button class="close">close</button>');

        var execButton = $('<button class="execButton" id="execButton">Execute</button>');
        var restoreButton = $('<button class="restoreButton" id="restoreButton">Restore</button>');
        var importButton = $('<button class="importButton" id="importButton" >Import</button>');
        var fileImport = $('<input style="color: white;" type=file id="fileImport">');
        var header = $('<h2 style="color: #ffffff;">Output</h2>');
        var output = $('<p class="p_editor"> <textarea id="output" placeholder="Output appears here" rows="15" ></textarea> </p>');
        var outputButton = $('<button style="color: white;" class="button" id="outputButton"> <a style="color: white;" href="/output" download="output.txt">Get Output</a> </button>');
        var img = $('<div class="imgdiv" id="plot_img"> </div>');
        var plot = $('<button class="button" id="plotButton" style="color: white;" > <a style="color: white;" id="plotlink" href="/getplot" download="userplt.png">Get Plot</a> </button>');
        var newTab = $('<div id="dialog" title="Tab data"> <form> <fieldset class="ui-helper-reset"> <label for="tab_title">Title</label> <input type="text" name="tab_title" id="tab_title" value="Tab Title" class="ui-widget-content ui-corner-all"> </fieldset> </form> </div>');
        newTabPanelElement.append(newTab);
        newTabPanelElement.append(execButton);
        newTabPanelElement.append(restoreButton);
        newTabPanelElement.append(importButton);
        newTabPanelElement.prepend(closeButton);
        newTabPanelElement.append(fileImport);
        newTabPanelElement.append(header);
        newTabPanelElement.append(output);
        newTabPanelElement.append(outputButton);
        newTabPanelElement.append(img);
        newTabPanelElement.append(plot);
    });

    $('#tabs').on('click', '.close', function () {

        console.log('close a tab and destroy the ace editor instance');

        console.log($(this).parent());

        var tabUniqueId = $(this).parent().attr('data-tab-id');

        console.log(tabUniqueId);

        var resultArray = $.grep(editors, function (n, i) {
            return n.id === tabUniqueId;
        }, true);

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

        console.log(tabUniqueId);

        var resultArray = $.grep(editors, function (n, i) {
            return n.id === tabUniqueId;
        }, true);
        var editor = resultArray[0].instance;
        var text = editor.getValue();
        var lang = $("#langSelect>option:selected").html()
        $.getJSON('/execute', {
            code: text,
            lang: lang
        }, function (data) {
            $('textarea#output').val(data.output);
            var plot_imgDiv = document.getElementById("plot_img");
            while (plot_imgDiv.firstChild) {
                plot_imgDiv.removeChild(plot_imgDiv.firstChild);
            }
            if (data.plot === "T") {
                $.get('/tmp/userplt.png')
                    .done(function () {
                        var d = new Date();
                        togglePlotBtn(1);
                        var imgContent = document.createElement("IMG");
                        imgContent.setAttribute("src", '/tmp/userplt.png?ver=' + d.getTime());
                        plot_imgDiv.appendChild(imgContent);

                    });
            }
            else if (data.plot === "F") {
                togglePlotBtn(0);
            }
        });

        return false;
    });

    $(function () {
        $("#output").change(function () {
            console.log("saving output...");
            var output = $('#output').val();
            $.getJSON('/makeoutput', {
                output: output
            }, function (data) {
            });
            return false;
        });
    });

    $('#tabs').on('click', '.restoreButton', function () {
        $.getJSON('/restore', {}, function (data) {
            var tabUniqueId = $(this).parent().attr('data-tab-id');
            console.log(tabUniqueId);

            var resultArray = $.grep(editors, function (n, i) {
                return n.id === tabUniqueId;
            }, true);

            var editor = resultArray[0].instance;
            var text = editor.setValue(data.script, 1);
        });
        return false;
    });


    $('#tabs').on('click', '.importButton', function () {
        var x = document.getElementById("fileImport");
        var tabUniqueId = $(this).parent().attr('data-tab-id');

        console.log(tabUniqueId);

        var resultArray = $.grep(editors, function (n, i) {
            return n.id === tabUniqueId;
        }, true);

        var editor = resultArray[0].instance;
        var filename = x.files[0].name;
        var file = x.files[0];
        var ext = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
        if (ext === 'py' || ext === 'txt' || ext === "cpp" || ext === "c") {
            var reader = new FileReader();
            reader.onload = function (event) {
                var contents = event.target.result;
                editor.setValue(contents, 1);
            };
            reader.readAsText(file);
        }
        return false;
    });

    $(function () {
        $('select#langSelect').change(function () {
            var tabUniqueId = $(this).parent().attr('data-tab-id');

            console.log(tabUniqueId);

            var resultArray = $.grep(editors, function (n, i) {
                return n.id === tabUniqueId;
            }, true);

            var editor = resultArray[0].instance;
            var lang = $("#langSelect>option:selected").html()
            if (lang == "Python") {
                editor.getSession().setMode("ace/mode/python");
            }
            else {
                editor.getSession().setMode("ace/mode/c_cpp");
            }
        })
    });

    timeout_id = null;
   // $(function autosave() {
        $(document).keyup(function () {
            if (timeout_id) {
                timeout_id = clearTimeout(timeout_id);
            }
            timeout_id = setTimeout(function () {
                console.log("autosaving...");
                var tabUniqueId = $(this).parents().eq().attr('data-tab-id');
                var idRaw = $('.ui-state-active').attr('id');
                var id = idRaw.substr(idRaw.length - 4);
              //  console.log(id);

                var resultArray = $.grep(editors, function (n, i) {
                    return n.id === tabUniqueId;
                }, true);

                var editor = resultArray[0].instance;
                var text = editor.getValue();
                $.getJSON('/saveFile', {
                    filename: id,
                    code: text
                }, function (data) {
                });
                return false;
            }, 750);
        });
    //});

});