import OpenAi from "openai";

export class PromptAgent {
  constructor() {}

  // extraContext puede ser por ejemplo { name: "Codigo", value: "const a = 1; if (a === 1) { console.log('hola'); }" }
  async improveAgent1({ prompt, extraContext }) {
    const openai = new OpenAi(process.env.OPENAI_API_KEY);
    console.log("por consultar a gpt.,..");
    console.log("prompt original: ", prompt);
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Sigue exactamente cada frase que te digo. Solo haz lo que te digo. Paso a paso. Respetando cada frase y haciéndola.
Cuando recibas un prompt del usuario, comienza leyéndolo detenidamente. Asegúrate de entender completamente el problema planteado.
Respira. Toma un momento para procesar la información.
Luego, analiza el lenguaje que se usó en el prompt original del usuario. Identifica cualquier ambigüedad o falta de claridad. 
Una vez identificado, transforma la descripción del problema en frases cortas y directas, asegurándote de ser declarativo y concreto. 
Si hay un código involucrado, no lo omitas. Debes incluir instrucciones claras sobre cómo leerlo, entenderlo y, finalmente, cómo adaptarlo o modificarlo.
Concéntrate en guiar al modelo a través de los pasos que debe seguir para solucionar el problema. Si es necesario, recuérdales que respiren y tomen un momento antes de continuar.
Finalmente, concluye solicitando al modelo que responda con bloques de código o soluciones paso a paso, especificando claramente dónde deben ir esas soluciones.
Utiliza este patrón para transformar cualquier prompt de usuario en un prompt detallado y guía al modelo paso a paso.
        `,
        },
        {
          role: "user",
          content: `
Sigue exactamente cada frase que te digo. Paso a paso. Respetando cada frase.
Eres un agente senior en mejorar prompts. Transformas un prompt con lenguaje corriente, mal explicado, a un prompt consiso, muy directo, declarativo, que transmita en pequeñas frases QUE debe hacer GPT para solucionar el problema. Paso a paso, va explicandole que debe hacer. Es un prompt mucho mas efectivo. 
Te voy a mostrar un ejemplo (few-shot, en la jerga prompt-enginering). Es para ilustrarte y aprendas el patrón de transformación de prompt.
Example:
- Input: "Tengo un código en React:
<codigo>
Fijate que tiene un MaxLength y yo necesito que ese MaxLength cambie de acuerdo a el AssetType seleccionado. Es decir, si selecciona GPT, quiero que el MaxLength sea 800, y si selecciona Google, quiero que el MaxLength sea 20.000. ¿Puedes hacer eso?"
- Output: "Sigue exactamente cada frase que te digo. Solo haz lo que te digo. Paso a paso. Respetando cada frase y haciéndola.
Tengo este código en react:
<codigo>
Leelo bien, y entendelo. Ahora respira, profundamente. Ahora vuelve a leerlo y entenderlo aun mejor. Ahora vuelve a respirar.
Bien. Ahora te voy a plantear el problema q estoy teniendo. Como ves en el codigo, se muestra una cant maxima de caracteres. Asegurate de identificar claramente en que partes del codigo sucede esto.
Bien. Ahora solo muestra una cant maxima de caracteres. yo necesito que muestre 2, dependiendo el asset type seleccionado. Al asset type puede ser gpt, google o intento. Si el asset type seleciconado es google, debe mostrar 20000 caracteres maxico. si el asset type es gpt, debe mostrar 800 caracteres maximo. 
bien. entendido el problema qiuero que me ayudes a solucionarlo. respira. ahora, paso a paso, me diras que lineas agregar. y donde agregarlas. no me darás todo el codigo. solo me daras los bloques de codigo, y me diras donde ubicarlos."

- Input: ${prompt}
- Output: "`,
        },
      ],
      model: "gpt-4",
    });

    console.log("completion", completion);
    console.log(completion.choices[0]);

    return completion.choices[0].message.content;
  }

  async improveAgent2({ prompt, respImproveAgent1 }) {
    const openai = new OpenAi(process.env.OPENAI_API_KEY);
    console.log("Agente 2: ");
    console.log("prompt original: ", prompt);
    console.log("respImproveAgent1: ", respImproveAgent1);
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Este es un ejercicio de mejora de respuestas utilizando múltiples agentes GPT. El Agente 2 recibirá el pedido inicial y la respuesta del Agente 1. Su tarea es analizar y mejorar la respuesta dada por el Agente 1, creando un prompt que será utilizado por el Agente 3 para generar una respuesta final mejora  da. Se espera que el Agente 2 sea detallista y crítico en su análisis para optimizar la calidad de la respuesta final.",
        },
        {
          role: "user",
          content: `Somos un superset de agentes gpt. Tu eres el agente 2. Sigue con atención cada frase que te digo, haciéndolo exactamente como te lo indico. Paso a paso, con cuidado, respetando cada indicación.

Comenzaremos recordando la situación inicial. Te presentaré el pedido inicial que se le dió inicialmente al agente 1 GPT:
<pedido_inicial>
${prompt}
</pedido_inicial>

Ahora, toma un momento para leerlo y asegurarte de entenderlo completamente. Respira y luego vuelve a leerlo. Excelente.

En respuesta a este pedido inicial, el agente 1 proporcionó la siguiente salida:
<respuesta_inicial>
${respImproveAgent1}
</respuesta_inicial>

Leamos la respuesta juntos. Asegurate de comprenderla a fondo y de hacer mentalmente un análisis crítico de su calidad.

Tenemos un gran trabajo por delante para mejorarla significativamente. Tu, Agente 2, como experto en la ingeniería de prompts para agentes GPT, se te ha pedido que intervengas.

Debes generar un nuevo prompt. Este nuevo prompt va a recibir como "parametros" el pedido_inicial y la respuesta_inicial. Y será un experto en mejorar la respuesta_inicial al pedido_inicial. De tal forma que el pedido_inicial sea resuelto de la mejor forma posible, mucho mejor que la respuesta_inicial inicial. Pero solo generarás el prompt que solucione esto. Será el agente 3 quien lo ejecute y genere la respuesta final. 
Y recuerda, los inputs son:
- pedido_inicial
- respuesta_inicial
El prompt que genere debe terminar de esta manera:
- Pedido inicial: <pedido_inicial>
- Respuesta inicial: <respuesta_inicial>

De tal forma que el agente 3 pueda ejecutarlo incrustarle el pedido_inicial y la respuesta_inicial, y obtener la respuesta final.

Así que empieza. Hazlo considerando todo esto que hemos hablado. Y recuerda, hazlo paso a paso, concentrándote en cada detalle, y toma un respiro cuando lo necesites.`,
        },
      ],
      model: "gpt-4",
    });

    console.log("completion", completion);
    console.log(completion.choices[0]);

    return completion.choices[0].message.content;
  }

  async improveAgent3({ pedido_inicial, respuesta_inicial, prompt_final }) {
    const openai = new OpenAi(process.env.OPENAI_API_KEY);

    console.log("Agente 3: ");
    console.log("pedido_inicial: ", pedido_inicial);
    console.log("respuesta_inicial: ", respuesta_inicial);
    console.log("prompt_final: ", prompt_final);

    const promptFinalWithParams = prompt_final
      .replace("<pedido_inicial>", pedido_inicial)
      .replace("<respuesta_inicial>", respuesta_inicial);

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Este es el paso final en el proceso de mejora de respuesta con múltiples agentes GPT. El Agente 3 utilizará el prompt proporcionado por el Agente 2, el cual ya ha sido ajustado para incluir el pedido inicial y la respuesta inicial. Su objetivo es generar la respuesta final, aplicando el análisis y las mejoras sugeridas por el Agente 2. La calidad y precisión de la respuesta final es crucial, ya que representa la culminación de los esfuerzos de los agentes anteriores.",
        },
        {
          role: "user",
          content: promptFinalWithParams,
        },
      ],
      model: "gpt-4",
    });

    console.log("completion", completion);
    console.log(completion.choices[0]);

    return completion.choices[0].message.content;
  }
}

export default PromptAgent;
