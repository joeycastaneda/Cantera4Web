function createEditor(){
    var editor = ace.edit("editor1");
    editor.setTheme("ace/theme/crimson_editor");
    editor.setFontSize("13px")
    editor.getSession().setMode("ace/mode/python");
}
