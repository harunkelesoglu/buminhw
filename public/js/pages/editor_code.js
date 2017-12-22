/* ------------------------------------------------------------------------------
*
*  # Ace code editor
*
*  Specific JS code additions for editor_code.html page
*
*  Version: 1.0
*  Latest update: Aug 1, 2015
*
* ---------------------------------------------------------------------------- */

$(function() {








    // JSON editor
    var json_editor = ace.edit("json_editor");
        json_editor.setTheme("ace/theme/monokai");
        json_editor.getSession().setMode("ace/mode/json");
        json_editor.setShowPrintMargin(false);



});
