function createEditor(){
    var editor = ace.edit("editor1");
    editor.setTheme("ace/theme/github");
    editor.setFontSize("13px")
    editor.getSession().setMode("ace/mode/python");
    editor.setValue("print \"Hello World!\"", 1);
}
