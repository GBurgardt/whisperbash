1. Análisis del Código Existente
   El código actual realiza las siguientes tareas:

Crea una carpeta para la sesión.
Configura y maneja la grabación de audio.
Visualiza el audio mientras se graba.
Transcribe el audio grabado.
Permite la mejora de la transcripción.
Permite agregar código al final de la transcripción.
Imprime el resultado y lo copia al portapapeles.

2. División en Módulos
   Basándonos en las funcionalidades, podemos dividir el código en los siguientes módulos:

SessionManager: Maneja la creación de la carpeta de sesión.
RecordingManager: Configura y controla la grabación de audio.
VisualizerManager: Visualiza el audio.
TranscriptionManager: Transcribe y mejora la transcripción del audio.
PromptHandler: Maneja las interacciones del usuario en la consola.
ResultManager: Imprime y copia el resultado al portapapeles.
