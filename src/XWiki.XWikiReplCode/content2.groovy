/* -*- mode: Java */
import groovy.json.JsonOutput
import javax.script.ScriptEngineFactory;
import javax.script.ScriptEngineManager;
import org.xwiki.script.ScriptContextManager;
import java.io.StringWriter;
import org.xwiki.rendering.macro.Macro;
import org.xwiki.context.Execution;

Map getEngines(Object services) {
  def gMacro = services.component.getInstance(Macro.class, "groovy");
  def manager = gMacro.scriptEngineManager;
  def out = new HashMap();
  for (Object engine : manager.getEngineFactories()) {
    for (Object name : engine.getNames()) {
      out.put(name, engine);
      break;
    }
  }
  return out;
}

public String languages(Object services) {
  def out = [];
  out.addAll(getEngines(services).keySet())
  return JsonOutput.toJson(out);
}

public boolean userHasProgrammingRights(Object services) {
  def exec = services.component.getInstance(Execution.class);
  def ctx = exec.getContext().getProperty("xwikicontext");
  return ctx.getWiki().getRightService().hasProgrammingRights(null, ctx);
}

public String run(String expression, String language, Object session, Object services) {

  if (!userHasProgrammingRights(services)) {
    return "You don't have permission to run script";
  }

  def engineKey = "REPL_ENGINE_" + language;
  def contextKey = "REPL_ENGINE_CONTEXT_" + language;

  def engine = session.getAttribute(engineKey);
  def sContext = session.getAttribute(contextKey);
  if(engine == null) {
    def engineFactory = getEngines(services).get(language);
    if(engineFactory == null) {
      return language + " scripting is not supported";
    }
    engine = engineFactory.getScriptEngine();
    def sContextManager = services.component.getInstance(ScriptContextManager.class);
    sContext = sContextManager.getScriptContext();

    session.setAttribute(engineKey, engine);
    session.setAttribute(contextKey, sContext);
  }

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

  return sw.toString();

}
