// src/data/questions.js
// 50 preguntas de Lenguaje Español Latinoamericano — Nivel Diversificado

export const QUESTIONS = [
  // ── ORTOGRAFÍA Y TILDACIÓN
  { q: "¿Cuál es el plural correcto de «régimen»?", opts: ["regímenes","regimenes","régimenes","regímens"], correct: 0 },
  { q: "¿En cuál caso se escribe «sí» con tilde diacrítica?", opts: ["Si vienes mañana, avísame.","Toca en si menor.","Respondió que sí estaba de acuerdo.","Si tuvieras tiempo, ven."], correct: 2 },
  { q: "Selecciona la oración con uso correcto de «a ver» o «haber»:", opts: ["Voy haber qué hay en la tienda.","A ver qué hay en la tienda.","Aver qué hay de nuevo.","Avoir qué pasa hoy."], correct: 1 },
  { q: "¿Cuál de estas palabras es esdrújula (sílaba tónica en la antepenúltima)?", opts: ["papel","árbol","música","camión"], correct: 2 },
  { q: "¿Cuál oración usa correctamente «porqué» (sustantivo)?", opts: ["No entiendo el porque de su actitud.","No entiendo el porqué de su actitud.","No entiendo el por qué de su actitud.","¿Por que no viniste hoy?"], correct: 1 },
  { q: "¿Cuál de las siguientes palabras está escrita correctamente?", opts: ["extrordinario","estraordinario","extraordinario","extraodinario"], correct: 2 },
  { q: "En «Ella canta muy bellamente», ¿cuál es el adverbio de modo?", opts: ["Ella","canta","muy","bellamente"], correct: 3 },
  { q: "¿Qué signo separa elementos de una enumeración cuando estos ya contienen comas internas?", opts: ["Punto","Punto y coma","Dos puntos","Paréntesis"], correct: 1 },
  { q: "¿Cuál es la función de los dos puntos en «Trajo de todo: pan, queso y jamón»?", opts: ["Pausar la oración","Anunciar una enumeración","Cerrar una cita textual","Separar oraciones independientes"], correct: 1 },
  { q: "¿Cuál de estas palabras presenta un hiato (dos vocales adyacentes de sílabas distintas)?", opts: ["traigo","piano","poesía","bueno"], correct: 2 },
  // ── GRAMÁTICA Y MORFOLOGÍA
  { q: "¿Cuál es el modo verbal de «¡Vengan inmediatamente!»?", opts: ["Indicativo","Subjuntivo","Imperativo","Condicional"], correct: 2 },
  { q: "En «El libro fue leído por María», el verbo está en:", opts: ["Voz activa","Voz pasiva","Modo subjuntivo","Tiempo futuro compuesto"], correct: 1 },
  { q: "¿Cuál de estos es un sustantivo abstracto?", opts: ["mesa","perro","libertad","ciudad"], correct: 2 },
  { q: "Identifica el adjetivo calificativo en: «La pequeña niña cantaba alegremente»:", opts: ["La","pequeña","cantaba","alegremente"], correct: 1 },
  { q: "¿Cuál oración usa el gerundio correctamente según la norma del español?", opts: ["Llegó una carta conteniendo documentos legales.","Vi a los niños corriendo por el parque.","Caja conteniendo objetos frágiles.","Decreto conteniendo las nuevas disposiciones."], correct: 1 },
  { q: "¿Qué significa el prefijo «hiper-»?", opts: ["Debajo de","En contra de","Encima de / en exceso","Fuera de"], correct: 2 },
  { q: "El sufijo «-ción» en palabras como «educación» forma principalmente:", opts: ["Adjetivos","Sustantivos de acción o resultado","Adverbios de modo","Verbos reflexivos"], correct: 1 },
  { q: "¿Cuál es una oración compuesta coordinada adversativa?", opts: ["Estudia y aprende.","Quiero ir, pero estoy cansado.","Si estudias, aprobarás.","Llegó cuando ya habíamos salido."], correct: 1 },
  { q: "¿Cuál uso de «haber» como verbo impersonal es correcto?", opts: ["Hubieron muchos accidentes ayer.","Habían muchos estudiantes presentes.","Hubo muchos problemas en la reunión.","Habieron pocas personas en el evento."], correct: 2 },
  { q: "En «aunque llueva, iré a la reunión», la conjunción «aunque» expresa valor:", opts: ["Causal","Final","Concesivo","Condicional"], correct: 2 },
  // ── VOCABULARIO Y SEMÁNTICA
  { q: "¿Cuál es el sinónimo más preciso de «ávido»?", opts: ["Harto","Ansioso / deseoso de algo","Tranquilo e indiferente","Perezoso y lento"], correct: 1 },
  { q: "¿Cuál es el antónimo de «efímero»?", opts: ["Breve","Fugaz","Eterno","Rápido"], correct: 2 },
  { q: "¿Qué significa la palabra «ubérrimo»?", opts: ["Muy escaso","Muy pobre","Muy abundante / extraordinariamente fértil","Muy frío"], correct: 2 },
  { q: "¿Cuál de estas palabras es un anglicismo incorporado al español?", opts: ["garaje","ventana","puerta","camino"], correct: 0 },
  { q: "¿Qué rama de la lingüística estudia el significado de las palabras?", opts: ["Fonología","Semántica","Morfología","Pragmática"], correct: 1 },
  { q: "La palabra «telepatía» se forma con los elementos:", opts: ["tele- (lejos) + -patía (sentimiento)","tel- (mar) + epatía (energía)","tele- (rápido) + -patía (fuerza)","te- (pronombre) + lepatía (comunicación)"], correct: 0 },
  { q: "¿Qué significa «acérrimo»?", opts: ["Débil e inseguro","Indiferente ante todo","Muy intenso / ferviente","Moderadamente contrario"], correct: 2 },
  { q: "La «prosodia» estudia:", opts: ["El significado de las palabras","La estructura sintáctica","Los aspectos fónicos: acento, entonación y ritmo","Las figuras retóricas"], correct: 2 },
  { q: "¿Cuál de estas palabras es un cultismo de origen griego?", opts: ["silla","crónica","mesa","casa"], correct: 1 },
  { q: "¿Cuál es el significado de «exégesis»?", opts: ["Resumen breve de una obra","Traducción literal de un texto","Interpretación o explicación crítica de un texto","Crítica negativa hacia un autor"], correct: 2 },
  // ── FIGURAS LITERARIAS Y RETÓRICA
  { q: "«Sus cabellos son de oro» es un ejemplo de:", opts: ["Hipérbole","Metáfora","Anáfora","Onomatopeya"], correct: 1 },
  { q: "«El viento susurra canciones entre los árboles» contiene la figura de:", opts: ["Ironía","Hipérbole","Personificación","Metonimia"], correct: 2 },
  { q: "«Llorar a mares» es una figura de:", opts: ["Metonimia","Hipérbole","Ironía","Elipsis"], correct: 1 },
  { q: "Decir «¡Qué gran escritor!» con sarcasmo sobre alguien que escribe muy mal es:", opts: ["Hipérbole","Metáfora","Ironía","Anáfora"], correct: 2 },
  { q: "«Temprano levantó la muerte el vuelo» (M. Hernández) usa la figura de:", opts: ["Aliteración","Hipérbaton","Eufemismo","Símil"], correct: 1 },
  { q: "«Verde que te quiero verde» (García Lorca) es un ejemplo de:", opts: ["Anáfora","Epanalepsis","Epífora","Anadiplosis"], correct: 1 },
  { q: "¿Qué es un «oxímoron»?", opts: ["Una figura que exagera la realidad","Una comparación usando «como»","La unión expresiva de dos conceptos contradictorios","La repetición de sonidos iniciales"], correct: 2 },
  { q: "«Las perlas de tu boca» (referido a los dientes) es una:", opts: ["Hipérbole","Metáfora","Ironía","Epíteto"], correct: 1 },
  { q: "«Muero porque no muero» (Santa Teresa) es ejemplo de:", opts: ["Anáfora","Oxímoron / paradoja","Hipérbaton","Onomatopeya"], correct: 1 },
  { q: "La repetición de una misma estructura al inicio de varios versos consecutivos se llama:", opts: ["Epífora","Anáfora","Epanalepsis","Pleonasmo"], correct: 1 },
  // ── LITERATURA, GÉNEROS Y COMUNICACIÓN
  { q: "¿A qué género literario pertenece «Cien años de soledad» de García Márquez?", opts: ["Poesía lírica","Teatro / drama","Narrativa (novela)","Ensayo filosófico"], correct: 2 },
  { q: "El «realismo mágico» como corriente literaria se asocia principalmente a:", opts: ["Europa del siglo XIX","Norteamérica del siglo XX","Latinoamérica del siglo XX","Asia contemporánea"], correct: 2 },
  { q: "«Rayuela» es una obra del escritor:", opts: ["Octavio Paz","Julio Cortázar","Carlos Fuentes","José Donoso"], correct: 1 },
  { q: "¿Quién escribió «El ingenioso hidalgo don Quijote de la Mancha»?", opts: ["Francisco de Quevedo","Lope de Vega","Miguel de Cervantes","Tirso de Molina"], correct: 2 },
  { q: "La obra «Romeo y Julieta» pertenece a:", opts: ["Molière","Miguel de Cervantes","William Shakespeare","Lope de Vega"], correct: 2 },
  { q: "Miguel Ángel Asturias (Premio Nobel guatemalteco) es reconocido por:", opts: ["La poesía modernista","La narrativa indigenista y el realismo mágico","El teatro del absurdo","La novela histórica europea"], correct: 1 },
  { q: "¿Qué tipo de texto es un artículo de opinión en un periódico?", opts: ["Descriptivo","Narrativo","Argumentativo","Instructivo"], correct: 2 },
  { q: "¿Cuál es la estructura básica de un soneto?", opts: ["Tres estrofas de cuatro versos","Dos cuartetos y dos tercetos","Cuatro estrofas de tres versos","Cinco estrofas de cuatro versos"], correct: 1 },
  { q: "¿Qué es el «narrador omnisciente»?", opts: ["Solo conoce sus propios pensamientos","Conoce todo: hechos y pensamientos de todos los personajes","Narra los hechos en segunda persona","Es el personaje principal que narra su propia historia"], correct: 1 },
  { q: "En narratología, la «diégesis» se refiere a:", opts: ["El discurso directo del narrador","Los personajes secundarios de la obra","El mundo narrado, el universo de la historia","El tiempo real que tarda en leerse la obra"], correct: 2 },
  { q: "En el proceso de comunicación, ¿cuál afirmación es correcta?", opts: ["El ruido solo puede ser de tipo sonoro","El receptor codifica el mensaje para enviarlo","El emisor produce y envía el mensaje al receptor","El canal es el contenido mismo del mensaje"], correct: 2 },
];

export const TOTAL = QUESTIONS.length;        // Banco total de preguntas (57)
export const QUIZ_SIZE = 50;                   // Preguntas por sesión de examen
export const TIME_PER_QUESTION = 60;           // segundos por pregunta
export const OPTION_LABELS = ["A", "B", "C", "D"];
