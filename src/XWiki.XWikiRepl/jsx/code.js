#set ($REPL_CODE = $xwiki.parseGroovyFromPage('XWiki.XWikiReplCode'))
#if ($REPL_CODE.userHasProgrammingRights($services))

require.config({
  paths: {
    console: "$doc.getAttachmentURL('jqconsole')",
    jquery_migrate: "$doc.getAttachmentURL('jquery.migrate')",
    simplemodal: "$doc.getAttachmentURL('simplemodal')"
  }
});

require(["$doc.getAttachmentURL('main')"], function(main) {
  var s = $REPL_CODE.languages($services);
  main.run(s);
})

#end
