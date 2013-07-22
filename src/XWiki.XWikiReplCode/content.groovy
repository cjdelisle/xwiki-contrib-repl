import javax.script.ScriptEngineFactory;
import org.xwiki.script.ScriptContextManager;
import java.io.StringWriter;

public String run(String content, Object services)
{
  def engineFactory = services.component.getInstance(ScriptEngineFactory.class, 'groovy');
  def engine = engineFactory.getScriptEngine();
  def sContextManager = services.component.getInstance(ScriptContextManager.class);
  def sContext = sContextManager.getScriptContext();

  def sw = new StringWriter();
  def ow = sContext.getWriter();
  def out = null;
  try {
    sContext.setWriter(sw);
    out = engine.eval(content, sContext); 
  } finally {
    sContext.setWriter(ow);
  }

  if (out != null) {
    sw.append('\n');
    sw.append(out.toString());
  }
  return sw.toString();
}
