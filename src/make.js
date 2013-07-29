var XWiki = require('xwiki-tools');
var Fs = require('fs');
var rjs = require('requirejs');
var StyleSheetExtension = rjs('classes/StyleSheetExtension.js');

//---------------------- Create XWiki Package ----------------------//

var pack = new XWiki.Package();
pack.setName("XWiki - Contrib - Repl");
pack.setDescription("Live coding in XWiki");

// This is needed to register with the extension manager repository
pack.setExtensionId("org.xwiki.contrib:xwiki-contrib-repl");


//---------------------- Add a Document ----------------------//

(function() {
  var DIR = 'src/XWiki.XWikiRepl/';

  var doc = new XWiki.model.XWikiDoc(["XWiki", "XWikiRepl"]);

  doc.setTitle("REPL in XWiki");

  // You can also use contentFromFile() to host the content externally.
  doc.setContent(XWiki.Tools.contentFromFile(DIR+'content.xwiki2'));

  Fs.readdirSync(DIR+'attach').forEach(function(name) {
    doc.addAttachment(DIR+'attach/' + name);
  });

  var obj = new XWiki.model.classes.JavaScriptExtension();
  obj.setCode(XWiki.Tools.contentFromFile(DIR+'jsx/code.js'));
  obj.setParse(true);
  obj.setUse('always');
  obj.setCache('forbid');
  doc.addXObject(obj);

  obj = new StyleSheetExtension();
  obj.setCode(XWiki.Tools.contentFromFile(DIR+'ssx/code.css'));
  obj.setParse(true);
  obj.setUse('always');
  obj.setCache('forbid');
  doc.addXObject(obj);

  // Add the document into the package.
  pack.addDocument(doc);
})();


(function() {
  var DIR = 'src/XWiki.XWikiReplCode/';
  var doc = new XWiki.model.XWikiDoc(["XWiki", "XWikiReplCode"]);
  doc.setContent(XWiki.Tools.contentFromFile(DIR+'content2.groovy'));
  pack.addDocument(doc);
})();

//---------------------- Build the package ----------------------//

// Post to a wiki?
// must post to a /preview/ page, for example:
// syntax  ./do --post Admin:admin@192.168.1.1:8080/xwiki/bin/preview//
var i;
if ((i = process.argv.indexOf('--post')) > -1) {
    pack.postToWiki(process.argv[i+1]);

} else if ((i = process.argv.indexOf('--mvn')) > -1) {
    // ./do --mvn
    // Generate output which can be consumed by Maven to build a .xar
    pack.genMvn('mvnout');

} else {
    // default:
    // Generate an xar file.
    pack.genXar('XWikiToolsExample.xar');
}
