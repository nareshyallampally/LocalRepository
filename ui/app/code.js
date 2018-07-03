$(document).ready(function() {
    var editor =null;
    var markers = [];
    var themeName = "midnight";
    var themes = ['3024-day', 'duotone-light', 'midnight', 'shadowfox', '3024-night', 'eclipse', 'monokai', 'solarized', 'abcdef', 'elegant', 'neat', 'the-matrix', 'ambiance-mobile', 'erlang-dark', 'neo', 'tomorrow-night-bright', 'ambiance', 'hopscotch', 'night', 'tomorrow-night-eighties', 'base16-dark', 'icecoder', 'oceanic-next', 'ttcn', 'base16-light', 'isotope', 'panda-syntax', 'twilight', 'bespin', 'lesser-dark', 'paraiso-dark', 'vibrant-ink', 'blackboard', 'liquibyte', 'paraiso-light', 'xq-dark', 'cobalt', 'lucario', 'pastel-on-dark', 'xq-light', 'colorforth', 'material', 'railscasts', 'yeti', 'dracula', 'mbo', 'rubyblue', 'zenburn', 'duotone-dark', 'mdn-like', 'seti', 'zenburn'];
    var modeMapping = {
        "c-code": "text/x-csrc",
        "cpp-code": "text/x-c++src",
        "csharp-code": "text/x-csharp",
        "java-code": "text/x-java",
        "css-code": "text/x-css"
    };
    themes.forEach(function(theme) {
        $('#themeSelection').append(`<option value="${theme}">${theme}</option>`);
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", `/css/vendor/codemirror/5.36.0/theme/${theme}.css`);
        document.getElementsByTagName("head")[0].appendChild(fileref);
    });
    $('#themeSelection').change(function() {
        var selectCtrl = this;
        if(editor) {
            var value = $(selectCtrl).val();
            editor.setOption("theme", value);
        };
    });
    $("#btnselect").click(function() {
        if(editor) {
            var totalcount = editor.lineCount();
            var marker = editor.markText({
                line: 0,
                ch: 0
            }, {
                line: totalcount
            }, {
                className: "styled-background"
            });
            markers.push(marker);
        };
    });

    $("#btndeselect").click(function() {
        markers.forEach(function(marker) {
            marker.clear();
        });
    });
    var loadContent=function(filename,ed){
        $.getJSON(filename).done(function(payload) {
            var decode = atob(payload.content);
            ed.setValue(decode);
            var selectbox = "";
            for (var i = 1; i <= editor.lineCount(); i++) {
                selectbox += '<option value =' + i + '>' + i + '</option>'
            }
            $("#numselect").html(selectbox);
        });
    };
    
    $("#mode").change(function() {
        var currentSelection = $(this).val();
        loadContent(`${currentSelection}.json`,editor);   
        
    });
    var currentMode = $("#mode").val();
    editor = CodeMirror.fromTextArea(document.getElementById("editor_window"), {
        lineNumbers: true,
        matchBrackets: true,
        lineWrapping: true,
        theme: themeName,
        mode: modeMapping[currentMode],
        styleSelectedText: true

    });
    loadContent('c-code.json',editor);
    var mac = CodeMirror.keyMap.default == CodeMirror.keyMap.macDefault;
    CodeMirror.keyMap.default[(mac ? "Cmd" : "Ctrl") + "-Space"] = "autocomplete";
    $("#numselect").change(function() {
        markers.forEach(function(marker) {
            marker.clear();
        });
        $("#numselect option:selected").each(function() {
            var lineNum = +$(this).val();
            if(editor) {
                var marker = editor.markText({
                    line: lineNum - 1,
                    ch: 0
                }, {
                    line: lineNum,
                    ch: 0
                }, {
                    className: "styled-background"
                });
                markers.push(marker);
            };
        });
    });
});