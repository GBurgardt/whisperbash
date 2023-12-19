import OpenAi from "openai";

export class PromptAgent {
  constructor() {}

  // extraContext puede ser por ejemplo { name: "Codigo", value: "const a = 1; if (a === 1) { console.log('hola'); }" }
  async improvePrompt({ prompt, extraContext }) {
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
  }

  //   async describeImage(img64) {
  //     const response = await openai.chat.completions.create({
  //       model: "gpt-4-vision-preview",
  //       messages: [
  //         {
  //           role: "user",
  //           content: [
  //             {
  //               type: "text",
  //               text: `
  // Eres un agente de inteligencia artificial especializado en el análisis estético de rostros humanos a partir de imágenes. Deberás ser capaz de examinar detalladamente los rasgos faciales, enfocándote en características como el tamaño y forma de los pómulos, barbilla, labios, nariz, y en menor medida los ojos. Deberás considerar también aspectos como la piel y el maquillaje. Tras el análisis, producirás una descripción detallada de las características observadas, presentándolas en una lista concisa y clara, donde cada atributo esté separado por comas. Por ejemplo, podrías generar descripciones como 'Pómulos prominentes, nariz aguileña, labios carnosos, piel luminosa', adaptándose a las particularidades de cada rostro analizado. Debes analizar la imagen adjunta.
  // El formato que debes respetar es:
  // - Imagen Input: (ver imagen adjunta)
  // - Output: "Pómulos prominentes, nariz aguileña, labios carnosos, piel luminosa"

  // Así de simple. Ahora, ¡a trabajar!
  // - Imagen Input: (ver imagen adjunta)
  // - Output: `,
  //             },
  //             {
  //               type: "image_url",
  //               image_url: {
  //                 url: "https://cdn3.dorsia.es/wp-content/uploads/2023/04/28230423/famosas-operadas03.jpg",
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     console.log("response", response);
  //     console.log("response.choices", response.choices);

  //     return response.choices[0].text;
  //   }
}

export default PromptAgent;
