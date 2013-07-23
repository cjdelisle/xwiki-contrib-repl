{{groovy}}
import javax.script.ScriptEngineFactory;
import org.xwiki.script.ScriptContextManager;
import java.io.StringWriter;

if(!request.getMethod().equalsIgnoreCase("POST")) {
  println "This is XWiki REPL endpoint. POST to it to get things evaluated.";
  return;
}

def language = request.getParameter("language");
if(language == null) {
  return "No language specified";
}

def expression = request.getInputStream().getText();
if(expression == null) {
  return "No expression to evaluate";
}

def session = request.getSession();

def engine = session.getAttribute("ENGINE");
def sContext = session.getAttribute("ENGINE_CONTEXT");
if(engine == null) {
  def engineFactory = services.component.getInstance(ScriptEngineFactory.class, language);
  if(engineFactory == null) {
    return "No factory for language " + language;
  }
  engine = engineFactory.getScriptEngine();
  def sContextManager = services.component.getInstance(ScriptContextManager.class);
  sContext = sContextManager.getScriptContext();

  println "Putting engine " + engine + "into session";

  session.setAttribute("ENGINE", engine);
  session.setAttribute("ENGINE_CONTEXT", sContext);
}

println "Using engine " + engine + ", context " + sContext;

def sw = new StringWriter();
def ow = sContext.getWriter();
def out = null;
try {
  sContext.setWriter(sw);
  out = engine.eval(expression, sContext); 
} finally {
  sContext.setWriter(ow);
}

if (out != null) {
  sw.append('\n');
  sw.append(out.toString());
}

println sw.toString();
{{/groovy}}
