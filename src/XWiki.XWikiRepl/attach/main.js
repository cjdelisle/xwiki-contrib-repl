define(['jquery'], function($) {

  return {run: function(langs) {

    var open = function(lang) {
      require(['jquery_migrate'], function() {
        require(['simplemodal', 'console'], function(Modal) {

          var startPrompt = function (jqconsole) {
            // Start the prompt with history enabled.
            jqconsole.Prompt(true, function (input) {
              $.ajax({
                method: 'POST',
                url: "/xwiki/bin/view/XWiki/XWikiRepl?xpage=plain&outputSyntax=plain",
                data: {
                  content: input,
                  lang: lang
                },
                success: function(res) {
                  jqconsole.Write(res + '\n', 'jqconsole-output');
                  startPrompt(jqconsole);
                }
              });
            });
          };

          var div = $('<div id="console"></div>');
          $.modal(div, {
            focus: false
          });
          startPrompt(div.jqconsole('', lang + '>'));
        });
      });
    };

    $(function() {
      var icon = '/xwiki/resources/icons/silk/application_osx_terminal.png';

      var div = $('<div id="console-button" ' +
                  'class="topmenuentry hasIcon dropdownmenuentry" ' +
                  'style="background-image: url(\''+icon+'\'); cursor:pointer" ' +
                  'title="Groovy Console"' +
                  'onmouseover="showsubmenu(this);"' +
                  'onmouseout="hidesubmenu(this);"' +
                  '></div>');

      var tmeExtensible = $('<span class="tme-extensible"><span class="tmetype">Console</span></span>');
      div.append(tmeExtensible);

      if (langs.length > 0) {
        var inner = $('<span class="submenu hidden"></span>');
        for (var i = 0; i < langs.length; i++) {
          (function(lang) {
            var x = $('<span class="submenuitem"></span>');
            var y = $('<a href="#" style="position:relative; left:-15px">'+lang+'</a>');
            $(y).on('click', function() {
              open(lang);
            });
            x.append(y);
            inner.append(x);
          })(langs[i]);
        }
        div.append(inner);
        $('#mainmenu .rightmenu').append(div);
      }
    });
  }};
});
