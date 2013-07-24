require.config({
  paths: {
    console: "$doc.getAttachmentURL('jqconsole')",
    jquery_migrate: "$doc.getAttachmentURL('jquery.migrate')"
  }
});

require(['jquery'], function($) {
  var open = function() {
    require(['jquery_migrate'], function() {
      require(['console'], function() {
        var div = $('<div id="console" style="width:800px;height:400px"></div>');
        $('#xwikicontent').append(div);
        var jqconsole = div.jqconsole('Hi\n', '>>>');
        var startPrompt = function () {
          // Start the prompt with history enabled.
          jqconsole.Prompt(true, function (input) {
            $.ajax({
              method: 'POST',
              url: "/xwiki/bin/view/XWiki/XWikiRepl?xpage=plain&outputSyntax=plain",
              data: { content: input },
              success: function(res) {
                jqconsole.Write(res + '\n', 'jqconsole-output');
                startPrompt();
              }
            });
          });
        };
        startPrompt();
      });
    });
  };

  $(function() {
    var icon = '/xwiki/resources/icons/silk/application_osx_terminal.png';
    var div = $('<div id="zzz" ' +
                'class="topmenuentry hasIcon" ' +
                'style="background-image: url(\''+icon+'\');" ' +
                'title="Groovy Console">' +
                '<a class="tme" href="#"></a>' +
                '</div>');
    $('#mainmenu .rightmenu').append(div);
    $(div).on('click', function() {
      open();
    });
  });
});
