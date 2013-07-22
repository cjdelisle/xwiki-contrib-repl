require.config({
  paths: {
    ClojureRepl: ("$doc.getAttachmentURL('clojure-repl.js')").replace(/\.js$/, ''),
  }
});

require(['ClojureRepl', 'jquery'], function(undef, $) {
  var console = $('<div></div>');
  $('#xwikicontent').append(console);
  console.console({
    promptLabel: 'Demo> ',
    commandValidate: function(line){
      if (line === "") {
        return false;
      } else {
        return true;
      }
    },
    commandHandle: function(line, report) {
      $.ajax({
        method: 'POST',
        url: "/xwiki/bin/view/XWiki/XWikiRepl?xpage=plain&outputSyntax=plain",
        data: { content: line },
        success: function(res) {
          report([{msg:"=> "+res, className:"jquery-console-message-value"}]);
        }
      });
    },
    autofocus:true,
    animateScroll:true,
    promptHistory:true,
    /*charInsertTrigger: function(keycode,line){
      // Let you type until you press a-z
      // Never allow zero.
      return !line.match(/[a-z]+/) && keycode != '0'.charCodeAt(0);
    }*/
  });
});
