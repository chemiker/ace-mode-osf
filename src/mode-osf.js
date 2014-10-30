define("ace/mode/osf_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var OSFHighlightRules = function() {
    this.$rules = {
         "start" : [
             {
                token : "meta",
                regex : "HEADER",
                merge : true,
                next : "header"
             },
             {
                token : "variable",
                regex : "(#t\\s)|(#q\\s)|(#c\\s)|(#g\\s)|(#l$)|(#t$)|(#q$)|(#c$)|(#g$)|(#l$)"
             },
             {
                token : "variable",
                regex : "(#topic\\s)|(#quote\\s)|(#chapter\\s)|(#glosarry\\s)|(#link\\s)|(#topic$)|(#quote$)|(#chapter$)|(#glosarry$)|(#link$)"
             },
             {
                token : "meta",
                regex : "#[a-zA-z0-9]+"
             },
             {
                token : "storage",
                regex : "<.+>"
             },
             {
                token : "string",
                regex : "\".+\""
             },
             {
                token : "constant.numeric",
                regex : "^(\\d+){2}:(\\d+){2}:(\\d+){2}.(\\d+)"
             },
             {
                token : "constant.numeric",
                regex : "^(\\d+){2}:(\\d+){2}:(\\d+){2}"
             },
             {
                token : "constant.numeric",
                regex : "^(\\d+){10}"
             }
         ],
         "header" : [
             {
                 token : "meta",
                 regex : ".*/HEADER",
                 next : "start"
             },
             {
                 token : "meta",
                 merge : true,
                 regex : ".*",
                 next : "header"
                 
             }
         ]
     };
};

oop.inherits(OSFHighlightRules, TextHighlightRules);

exports.OSFHighlightRules = OSFHighlightRules;

});

ace.define("ace/mode/matching_brace_outdent",["require","exports","module","ace/range"], function(require, exports, module) {
"use strict";

var Range = require("../range").Range;

var MatchingBraceOutdent = function() {};

(function() {

    this.checkOutdent = function(line, input) {
        if (! /^\s+$/.test(line))
            return false;

        return /^\s*\}/.test(input);
    };

    this.autoOutdent = function(doc, row) {
        var line = doc.getLine(row);
        var match = line.match(/^(\s*\})/);

        if (!match) return 0;

        var column = match[1].length;
        var openBracePos = doc.findMatchingBracket({row: row, column: column});

        if (!openBracePos || openBracePos.row == row) return 0;

        var indent = this.$getIndent(doc.getLine(openBracePos.row));
        doc.replace(new Range(row, 0, row, column-1), indent);
    };

    this.$getIndent = function(line) {
        return line.match(/^\s*/)[0];
    };

}).call(MatchingBraceOutdent.prototype);

exports.MatchingBraceOutdent = MatchingBraceOutdent;
});

define("ace/mode/osf",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/osf_highlight_rules","ace/mode/matching_brace_outdent"], function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var OSFHighlightRules = require("./osf_highlight_rules").OSFHighlightRules;
var MatchingBraceOutdent = require("./matching_brace_outdent").MatchingBraceOutdent;

var Mode = function() {
    this.HighlightRules = OSFHighlightRules;
    this.$outdent = new MatchingBraceOutdent();
};
oop.inherits(Mode, TextMode);

(function() {
    this.type = "text";
    this.getNextLineIndent = function(state, line, tab) {
        if (state == "intag")
            return tab;
        
        return "";
    };

    this.checkOutdent = function(state, line, input) {
        return this.$outdent.checkOutdent(line, input);
    };

    this.autoOutdent = function(state, doc, row) {
        this.$outdent.autoOutdent(doc, row);
    };
    
    this.$id = "ace/mode/osf";
}).call(Mode.prototype);

exports.Mode = Mode;

});
