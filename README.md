Starvail - Game Design Document 
======
<em>Documento redactado por Víctor Sierra Fernández</em>

[1. Introducción](#introducción)

[1.1. Elevator Pitch.](#elevator-pitch.)

[1.2. Concepto de juego.](#concepto-de-juego.)

[2. Género](#género)

[3. Plataformas](#plataformas)

[4. Alcance del proyecto](#alcance-del-proyecto)

[5. Experiencia de juego objetivo](#experiencia-de-juego-objetivo)

[6. Narrativa y personajes](#narrativa-y-personajes)

[6.1. Sinopsis](#sinopsis)

[6.2. Trasfondo general](#trasfondo-general)

[6.3. Personajes](#personajes)

[6.4. Historia y trama del juego](#historia-y-trama-del-juego)

[6.4.1. Tutorial / Introducción](#tutorial-introducción)

[6.4.2. Desarrollo de la trama durante el juego](#desarrollo-de-la-trama-durante-el-juego)

[6.4.3. Desenlace de la historia / Finales del juego](#desenlace-de-la-historia-finales-del-juego)

[7. Controles e Interfaz](#controles-e-interfaz)

[7.1. Interfaz](#interfaz)

[7.1.1. Splash Screen](#splash-screen)

[7.1.2. Intro Cutscene](#intro-cutscene)

[7.1.3. Menú principal (Pantalla de Título)](#menú-principal-pantalla-de-título)

[7.1.4. Menú de opciones](#menú-de-opciones)

[7.1.5. In Game HUD](#in-game-hud)

[7.1.6. Menú de pausa](#menú-de-pausa)

[7.1.7. Pantalla de Game Over](#pantalla-de-game-over)

[7.1.8. Pantalla de puntuaciones](#pantalla-de-puntuaciones)

[7.1.9. Pantalla de créditos](#pantalla-de-créditos)

[7.2. Controles](#controles)

[7.2.1. Controles en PC](#controles-en-pc)

[7.2.2. Controles en móvil](#controles-en-móvil)

[8. Estilo visual](#estilo-visual)

[8.1. Sprites](#sprites)

[8.2. Tilesets](#tilesets)

[8.3. Arte propio](#arte-propio)

[9. Mecánicas](#mecánicas)

[9.1. Mecánicas núcleo](#mecánicas-núcleo)

[9.1.1. Movimiento y vuelo](#movimiento-y-vuelo)

[9.1.2. Apuntar y disparar](#apuntar-y-disparar)

[9.1.3. Límite de tiempo](#límite-de-tiempo)

[9.1.4. Puntos de vida](#puntos-de-vida)

[9.1.5. Energía](#energía)

[9.2. Mecánicas auxiliares](#mecánicas-auxiliares)

[9.2.1. Eventos especiales](#eventos-especiales)

[9.2.2. Munición especial / Upgrades](#munición-especial-upgrades)

[9.2.3. Sistema de dialogo.](#sistema-de-dialogo.)

[10. Niveles](#niveles)

[10.1. Macroestructura de niveles](#macroestructura-de-niveles)

[10.2. Estructura individual de niveles](#estructura-individual-de-niveles)

[10.2.1. Tutorial](#tutorial)

[10.2.2. Nivel estándar](#nivel-estándar)

[10.2.3. Nivel del Final Boss](#nivel-del-final-boss)

[11. Enemigos](#enemigos)

[11.1. Enemigos terrestres](#enemigos-terrestres)

[11.1.1. Droid Zapper](#droid-zapper)

[11.1.2. Sword Droid](#sword-droid)

[11.1.3. Mecha](#mecha)

[11.1.4. Sith Droid](#sith-droid)

[11.2. Enemigos aéreos](#enemigos-aéreos)

[11.2.1. Drone Zapper](#drone-zapper)

[11.2.2. Droid Gunner](#droid-gunner)

[11.2.3. Homing Bomb Droid](#homing-bomb-droid)

[11.3. Jefe final -- D42K-H](#jefe-final-d42k-h)

[12. Flujo de juego](#flujo-de-juego)

[13. Hoja de ruta del desarrollo](#hoja-de-ruta-del-desarrollo)

[13.1. PRIMER HITO: Semana 1 (28/9 -- 4/10)](#primer-hito-semana-1-289-410)

[13.2. SEGUNDO HITO: Semana 2 (5/10 -- 11/10)](#segundo-hito-semana-2-510-1110)

[13.3. TERCER HITO: Semana 3 (12/10 -- 18/10)](#tercer-hito-semana-3-1210-1810)

[13.4. CUARTO HITO: Semana 4 (19/10 -- 25/10)](#cuarto-hito-semana-4-1910-2510)

[13.5. QUINTO HITO: Semana 5(26/10 -- 1/11)](#quinto-hito-semana-52610-111)

[13.6. SEXTO HITO: Semana 6(2/11 -- 8/11)](#sexto-hito-semana-6211-811)

[13.7. SÉPTIMO HITO: Semana 7 (9/11 -- 15/11)](#séptimo-hito-semana-7-911-1511)

[13.8. HITO FINAL: Presentación y lanzamiento (16/11 -- 20/11)](#hito-final-presentación-y-lanzamiento-1611-2011)

[14. Referencias y anexos](#referencias-y-anexos)

Introducción
============

Éste es el documento de diseño de juego (GDD por sus siglas inglesas)
para el juego desarrollado por *Kilonova Studios* para el proyecto de
juego W3C de la asignatura de 'Juegos para Web y Redes Sociales' del
cuarto año de la carrera de Diseño y Desarrollo de Videojuegos, cuyo
nombre temporal es '*Vagrant's Tower'*. A continuación, se describirán
todos los aspectos del juego, desde su concepto hasta sus detalles de
implementación. Téngase en mente que este es un documento en constante
evolución, y, por lo tanto, [todo lo aquí escrito está sujeto a
cambios]

Elevator Pitch.
---------------

*Vagrant's Tower* es un shooter sidescroller 2D de acción dinámica
similar a la de 'My Friend Pedro' y de estética pixel art, donde el
jugador debe subir hasta la cima de una torre antes de que se le acabe
el tiempo, y decidir si quiere y puede ayudar a otros durante el camino.

Concepto de juego.
------------------

*Vagrant's Tower* es un shooter sidescroller 2D donde el jugador tiene
como objetivo subir hasta lo alto de una torre antes de que 'se le acabe
el tiempo'. Por el camino, el jugador tendrá que pelear contra distintos
enemigos para sobrevivir y obtener los recursos necesarios para
continuar su ascenso, durante el cual se le presentará en varias
ocasiones la oportunidad de ayudar a otros personajes que, a cambio de
la ayuda del jugador, otorgarán mejoras o "power ups" a éste.

Esta propuesta plantea un gameplay divertido y adictivo de shooter,
mezclado con un componente importante de gestión de tiempo y resolución
del 'macropuzle' que plantea el juego, ya que ayudar a otros personajes
gastará tiempo y recursos, que dificultarán que el jugador cumpla con la
meta establecida de llegar a tiempo a la cima de la torre. Estas
decisiones, a su vez, determinarán el final del juego y el mensaje de la
historia.

Género
======

*Vagrant's Tower* es un shooter sidescroller 2D de acción de estética
pixel art con un fuerte componente de gestión de recursos y resolución
de puzles a gran escala.

Plataformas
===========

*Vagrant's Tower* es un juego web, disponible en:

-   Chrome.

-   Firefox.

-   Móvil (Android).

Alcance del proyecto
====================

El alcance de este juego es, primordialmente, el del contexto de la
asignatura 'Juegos para Web y Redes Sociales', pero no está limitado
éste. Nuestro objetivo como equipo es crear el mejor juego posible; un
producto de calidad que llame la atención del jurado y sea un componente
atractivo en nuestro portfolio de cara a la entrada al mercado
profesional.

En lo referente al beneficio económico, no esperamos percibir
remuneración alguna por este proyecto, más allá de alguna donación
voluntaria de los jugadores que así lo deseen. Por otro lado, sí que
estamos dispuestos a invertir dinero en el desarrollo, comprando assets,
invirtiendo en publicidad, o invirtiendo dinero en la marca del estudio
(camisetas, tarjetas de negocios, etc).

Experiencia de juego objetivo
=============================

La experiencia de juego objetivo es la siguiente:

*El jugador tendrá que resolver un puzle en el tiempo muy similar a los
problemas que nos encontramos en la vida misma, donde tenemos un tiempo
limitado para conseguir nuestros objetivos, pero al mismo tiempo nos
encontramos con personas que necesitan nuestra ayuda por el camino.*

*Este constante dilema entre el egoísmo, el altruismo y nuestro limitado
tiempo es el núcleo que mueve la experiencia de juego buscada en
Vagrant's Tower.*

Para producir esta experiencia objetivo el juego planteará unas
mecánicas núcleo y un objetivo al jugador que le impongan un marco de
tiempo limitado para cumplir dichos objetivos, donde tendrá que hacer
una correcta gestión de sus recursos para lograr alcanzar dicho
objetivo. Además de todo eso, se presionará al jugador para que no sólo
cumpla su objetivo a tiempo, sino para que además de eso lo haga
completando una serie de tareas adicionales o 'eventos especiales', que
le reportarán beneficios y determinarán el final de la historia, pero
que le costarán una valiosa cantidad de tiempo.

Para inducir al jugador ha dicho comportamiento, se utilizará un sistema
de puntuaciones que le empuje a mejorar su marca, así como un diseño de
niveles que guíe la atención del jugador hacia los puntos adecuados y
permita una navegación intuitiva de los niveles, donde el jugador pueda
encontrar lo que quiere casi sin darse cuenta de que ha sido guiado
durante el proceso.

Narrativa y personajes
======================

Sinopsis
--------

*'En un futuro lejano y una tierra cuyo nombre se ha olvidado, una torre
se alza hasta lo alto del cielo. Se dice que aquellos individuos que se
vean infectados por el virus de la angustia existencial peregrinarán a
esta torre, con la intención de llegar a su cima y hallar el sentido a
su vida inmortal'.*

Trasfondo general
-----------------

El mundo de Vagrant's Tower se establece en un futuro lejano, donde la
humanidad ha sido reemplazada por máquinas y androides. Algunos de estos
androides despiertan al uso de la razón, preguntándose de esta manera
cuál es el sentido de la vida, y sintiendo la misma angustia que sus
antecesores, los humanos, sentían al preguntarse cuál era su cometido en
esta vida. Los androides, dotados de cuerpos inmortales, entienden este
tipo de comportamiento como un virus informático.

Precisamente, la androide protagonista y su compañero sufren de este
'virus'. El primero en partir en busca de la torre de Kierkegaard es
este último, y ella le sigue hasta este lugar, bajo la premisa de que
durante la noche deberá alcanzar la cima para presenciar un evento que
finalmente le hará comprender el significado de la vida. De esta manera
se plantea la premisa de la protagonista y su objetivo en el juego:
**una androide desea alcanzar la cima de la torre de Kierkegaard para
presenciar junto a su compañero un acontecimiento que dará sentido a sus
vidas.**

Por el camino, la androide se podrá encontrar con otros androides en la
torre que se encuentran sus mismas condiciones. Si decide ayudarles,
éstos la ayudarán a ella a cambio, dándole una perspectiva diferente de
la vida, que podría cambiar el desenlace de la historia.

Personajes
----------

A continuación, se describen los personajes del juego:

-   **Androide 9ULS42:**

La androide protagonista, que controla el jugador durante el juego, es
una de las víctimas del 'virus existencialista'. Fue a la torre en
búsqueda de su compañero, D42K-H, que le dijo que durante la noche en la
que acontece el juego, en la cima de la torre tendría lugar un evento
que les podía curar del virus y dar sentido a su existencia.

-   **Androide D42K-H**

El androide compañero de 9ULS42, la protagonista. Fue el primero de los
dos en ser infectado con el virus, y el primero en comenzar el
peregrinaje a la Torre de Kierkegaard; pese a que está en las mismas
condiciones que 9ULS42, tiene una mentalidad diferente a la suya. Es el
jefe final del juego.

-   **Androides desamparados**

Son androides infectados por el virus que también comenzaron el
peregrinaje a la cima de la torre, pero que se vieron superados por las
circunstancias en el camino. 9ULS42 tiene la opción de ayudarles y
salvarles, a lo que ellos responderán entregándole mejoras para su
armamento y ayudándola a ella misma a encontrar una cura para el virus.

-   **Autómatas habitantes de la Torre.**

Son robots, androides y autómatas habitantes de la Torre de Kierkegaard.
No están infectados por el virus, y como guardianes de la torre, están
configurados para eliminar a cualquier peregrino que se atreva a
intentar llegar a la cima, ya que para ellos son sujetos infectados que
deben ser eliminados. Conforman el grueso de los enemigos del juego.

Historia y trama del juego
--------------------------

Tal y como se ha mencionado en el apartado 5.2 -- Transfondo general, la
trama del juego comienza cuando la androide protagonista, 9ULS42 (nombre
que podrá ser reemplazado por uno que el jugador escoja), llega a la
planta baja de la torre, donde D42K-H le está esperando.

### Tutorial / Introducción

Durante este segmento introductorio del juego, que sirve tanto como
tutorial como planteamiento para la historia, D42K-H explica a 9ULS42
los fundamentos de la torre (en otras palabras, las mecánicas de juego)
y el objetivo del juego: durante el transcurso de esa noche tendrá lugar
un evento astral muy importante en la cima de la torre, que se rumorea
puede dar la respuesta al motivo de la vida, una respuesta que D42K-H y
9ULS42 llevan mucho tiempo buscando.

### Desarrollo de la trama durante el juego

Tras acabar el tutorial, D42K-H le dice a 9ULS42 que se adelantará, y
que le estará esperando en la cima de la torre hasta que amanezca, pero
le advierte una vez más del tiempo limitado que tiene para alcanzarle.
También le menciona que por el camino es posible que se encuentre con
otros androides que tengan el mismo objetivo que ellos; él no les
prestara su ayuda, pero le dice a 9ULS42 que puede ayudarles, si cree
que tiene tiempo suficiente y así lo desea, y menciona que ellos
probablemente puedan darle algo a cambio (los power-up). Tras esta
última conversación, el jugador transiciona al primer nivel del juego,
donde comenzará el grueso del 'gameplay'.

En cada uno de los tres niveles cabrá la posibilidad de que el jugador
se encuentre con uno de los androides desamparados anteriormente
mencionados. Si les ayuda, éstos tendrán una pequeña conversación con él
antes de darle el 'power up' e irse por su cuenta a subir la torre.

Adicionalmente, y si el tiempo de desarrollo lo permite, sería
beneficioso para la experiencia de juego una pequeña 'pausa' entre cada
nivel donde se muestre una pequeña cutscene que muestre el pasado de los
dos androides protagonistas, cómo despertaron al uso de la razón y qué
camino han recorrido para llegar hasta aquí. Esto no sólo serviría para
reforzar la conexión del avatar con el jugador y el objetivo del juego,
sino también como pequeño descanso y recompensa en el flujo del juego,
antes de volver a la experiencia contrarreloj del siguiente nivel.

### Desenlace de la historia / Finales del juego

Una vez supere el jugador los tres niveles, alcanzará la cima de la
torre, donde está tomando lugar un suceso astral conocido como
**kilonova**[^1], que se rumorea no había tenido lugar en 80.000 años,
cuando aún los humanos poblaban la tierra. En este punto, dependiendo de
si el jugador ha alcanzado la cima de la torre a tiempo, pueden pasar
dos cosas:

1.  **El jugador no ha alcanzado la cima a tiempo**

Si el jugador no ha alcanzado la cima a tiempo, se encuentra con que la
kilonova ya ha terminado y ha dado nacimiento a un **agujero negro.**
Además, D42K-H no se encuentra por ningún sitio, con lo que la androide
asume que observó el evento y halló sus propias respuestas, yéndose y
dejándola 'sola' en la vida. Este es el 'neutral' para la historia, y se
puede interpretar como un 'game over' glorificado.

2.  **El jugador alcanza la cima a tiempo**

En este caso, el jugador se encuentra con D42K-H, que observa una
kilonova que aún no se ha completado, pero que está a punto de terminar.
D42K-H se gira para hablar con 9ULS42, y le dice que 'por fin lo ha
entendido'.

D42K-H confiesa que, al observar el enfrentamiento entre dos cuerpos
celestiales masivos, ha entendido que la destrucción y la creación son
procesos inseparables; que uno no puede existir sin que primero ocurra
el anterior, y que esto aplica para todo el universo. No existe una
respuesta para todos; cada uno debe encontrar la suya propia, y D42K-H
piensa que encontrará la suya al matar a 9ULS42, ya que, al igual que
pasaba con la fusión de las estrellas, "para encontrar lo que más deseas
tendrás que sacrificar lo que más quieres". Tras este discurso
existencialista, tiene lugar la batalla final, donde 9ULS42 se ve
forzada a pelear a muerte con D42K-H.

Una vez más, en este punto pueden ocurrir distintas cosas. Si el jugador
pierde la batalla, eso será un game over normal y corriente, pero si la
gana, pueden ocurrir distintas cosas dependiendo de si ha ayudado a
suficientes androides desamparados:

1.  **El jugador ha ayudado a menos de dos androides desamparados**

9ULS42 derrota a D42K-H, y este le ruega que le dé el golpe final,
alegando que solo así uno de los dos alcanzará a entender el significado
de la vida. Es la única manera. 9ULS42 acaba cediendo a su petición y
aprieta el gatillo, 'matando' a D42K-H. Al mismo tiempo, la kilonova se
completa y una gran explosión toma lugar.

Se corta la escena, y lo siguiente que ve el jugador es a 9ULS42
observando un enorme agujero negro, con el cuerpo de D42K-H tendido a su
lado. En ese momento alcanza la conclusión de que el único significado
que tiene la vida es la supervivencia; luchar para ser el más fuerte,
sufrir, y perecer cuando alguien acabe con tu existencia inmortal.
9ULS42 piensa que esto es triste, pero da sus preguntas por respondidas,
y decide abandonar la torre para 'seguir peleando' hasta que alguien
termine con su vida, tal y como hizo ella con D42K-H.

Este es el final 'malo' de la historia, donde la protagonista adquiere
una perspectiva deprimente de la vida.

2.  **El jugador ha ayudado a dos o más androides desamparados**

9ULS42 derrota a D42K-H, y como en el escenario anterior, éste le ruega
que acabe con su vida. 9ULS42 se siente inclinada a cumplir su deseo,
pero justo en el último momento los androides desamparados que ayudó por
el camino irrumpen en la escena y le gritan 'que no lo haga, que ella no
está hecha para matar, sino para proteger a los demás'. Justo en ese
momento, una gran explosión toma lugar cuando la kilonova se completa, y
un flashazo deslumbrador deja por unos segundos al jugador con la duda
de qué ha pasado.

Cuando acaba la explosión, el cielo resplandece con el brillo de un
nuevo púlsar en el cielo. 9ULS42 retira su arma, y D42K-H se levanta.
Los androides desamparados le explican cómo 9ULS42 les ha ayudado a
superar su propia 'angustia existencial', ya que, al ayudarles, ellos
comprendieron que la vida cobra significado cuando tienes algo por lo
que pelear, algo que proteger. Para ellos ese algo fue 9ULS42, y ellos
creen que para ellos dos, ese 'algo' puede ser el otro.

9ULS42 por primera vez en todo el juego, y confiesa que 'está de
acuerdo' y que desea 'proteger' en lugar de 'destruir', y le pregunta a
D42K-H si ésa puede ser la respuesta al significado de la vida que
estaba buscando.

D42K-H se levanta, y observando el nuevo púlsar, le dice que puede que
tenga razón, que él estaba equivocado después de todo. Cree que
cooperando juntos y protegiendo lo que han atesorado a lo largo de los
años es posible dar significado a su vida, y le propone a 9ULS42
quedarse a vivir bajo ese bonito cielo estrellado, para ayudar a todos
los androides desamparados que acudan a la torre en busca de ayuda.

9ULS42 responde que sí alegremente, y esto da lugar al final 'bueno' del
juego, donde la protagonista encuentra significado en proteger los
vínculos que ha creado con los demás, y el lugar que han creado en
aquella torre, avanzando juntos hacia el futuro, creciendo y cambiándose
los unos a los otros en una vida inmortal llena de posibilidades.

Finalmente, el final da paso a los créditos, y después al ranking de
puntuaciones, tal y como se describe en el [diagrama de
flujo](https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1&title=flowchart.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1aeL-hrU-MbZA63SvlsCBrGhGhFWdBx7c%26export%3Ddownload)
del juego, finalizando así la historia y la experiencia de juego.

Controles e Interfaz
====================

La idea fundamental de la interfaz y controles de Vagrant's Tower es
ofrecer un set de controles reducido y adaptable a las distintas
plataformas en las que se presenta, manteniendo toda la profundidad de
la jugabilidad. A continuación, se detallan los controles y la interfaz
en cada plataforma:

Interfaz
--------

![](https://i.ibb.co/QnMV0Jr/Vagrant-Tower-Flow-Chart.png)En este apartado se definirá el aspecto
esquemático de las distintas interfaces del juego, comenzando por el
diagrama de flujo, que será común a ambas plataformas:

Se recomienda **encarecidamente** visualizar este esquema en su versión
[online.](https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1&title=flowchart.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1aeL-hrU-MbZA63SvlsCBrGhGhFWdBx7c%26export%3Ddownload)

Tal y como se puede ver, el desarrollo de la experiencia de juego
consiste en superar tres niveles antes de que el tiempo del jugador se
acabe, tras lo cual les espera una 'batalla final' contra un jefe. Al
superarla, obtendrá un final 'bueno' o un final 'malo' en función de si
ha realizado una serie de tareas especiales por el camino.

Tras todo esto, al jugador se le presenta una pantalla de 'resultados'
donde puede ver su puntuación, que estará medida en el tiempo que ha
tardado, las tareas que ha realizado, los enemigos derrotados, etc.

A continuación, se define el 'layout' y funcionamiento de cada pantalla
de juego:

### Splash Screen

La Splash Screen mostrará el logo del estudio brevemente, que vendrá
seguido por una pantalla de carga donde se podrá ver una animación de la
protagonista "corriendo" sobre la barra de carga, lo que posteriormente
llevará a la Intro Cutscene cuando haya terminado el proceso de carga.

### Intro Cutscene

Aún queda por confirmar si se podrán destinar tiempo y recursos a crear
una serie de imágenes que sirvan como introducción y gancho al mundo y
la experiencia de juego, pero en caso de hacerse, se introduciría entre
la splash screen y el menú principal, preferiblemente con la opción a
saltarse la escena.

### Menú principal (Pantalla de Título)

![](https://i.ibb.co/tqT81Jr/Whats-App-Image-2020-10-07-at-6-27-39-PM.jpg)

La pantalla de menú principal cumplirá varias funciones:

-   Será el punto de partida para todas las partidas y el punto al que
    se volverá después de ellas, donde además el jugador podrá
    personalizar sus opciones y consultar los créditos del juego, en
    caso de que desee conocer más acerca de los desarrolladores.

-   Además de todo lo anterior, el menú principal cumplirá la función de
    introducir al jugador al título del juego, causando una primera
    impresión que será crucial para retener su atención, motivo por el
    cual se creará una ilustración, preferiblemente animada, para
    ilustrar el menú principal del juego. Esta ilustración debe llamar
    la atención del jugador, a la vez que le da una idea sobre qué
    esperar cuando juegue al juego.[^2]

### Menú de opciones

![](https://i.ibb.co/pxmMPkF/Whats-App-Image-2020-10-07-at-6-27-50-PM.jpg)

El menú de opciones cumple con el propósito de personalizar la
experiencia del jugador. Debido a las características del juego y de la
tecnología utilizada, por ahora solamente se podrá personalizar el
volumen de la música y los efectos de sonido por separado, pero
cualquier otra opción que se quisiera añadir se deberá hacer en esta
pantalla, que será accesible tanto desde el menú principal como desde el
menú de pausa del juego.

Adicionalmente, si el tiempo de desarrollo lo permite, se implementarán
opciones de remapeado de controles para la plataforma de PC.

### In Game HUD

![](https://i.ibb.co/B6xX4c9/Ingame-HUD-layout.png)

Este es el layout (que no aspecto final) de la interfaz de juego. A
continuación, se describen los elementos uno por uno:

1.  **Barra de HP:** La barra de vida del jugador. Si llega a 0, acaba
    la partida.

2.  **Barra de energía:** La barra de energía del jugador. La energía se
    puede utilizar para varios propósitos: volar o usar munición
    especial.

3.  **Selector de munición:** En esta ruleta (que podría tomar otra
    forma si es más conveniente para la implementación) se puede escoger
    qué tipo de munición disparará el jugador. Al principio del juego
    sólo estará disponible la munición normal, pero si el jugador
    realiza los eventos especiales, obtendrá nuevos 'poderes' para
    utilizar munición especial.

Cabe mencionar que en PC se puede seleccionar la munición pulsando las
teclas numéricas, mientras que en móvil se ha colocado el selector en la
parte baja derecha de la pantalla para que sea fácilmente accesible al
tacto.

Para el caso de los seleccionables, queda pendiente buscar un feedback
visual que permita al usuario saber rápidamente y con exactitud qué
objetos del escenario son interaccionables.

### Menú de pausa

![](https://i.ibb.co/1mQVgwH/Whats-App-Image-2020-10-07-at-6-27-47-PM.jpg)

La pantalla de pausa será accesible desde cualquier nivel del juego, y
cumplirá con la función de detener el juego para que el jugador pueda
reajustar las opciones, volver al menú principal, o ausentarse del juego
durante un tiempo para poder volver y continuar cuando él lo desee.

### Pantalla de Game Over

![](https://i.ibb.co/dMLskhN/Whats-App-Image-2020-10-07-at-6-27-57-PM.jpg)

El jugador llegará a la pantalla de game over solamente cuando su HP
llegue a 0, ya que aunque se acabe el tiempo, podrá seguir jugando para
alcanzar el final 'out of time'. En esta pantalla, el jugador tiene dos
opciones: volver a empezar desde el primer nivel (pasado ya el
tutorial), o volver al menú principal.

Además, esta pantalla debe cumplir con el propósito de 'castigar' al
jugador, ofreciéndole una vista de la androide protagonista tirada en el
suelo, pero al mismo tiempo animándolo a intentarlo otra vez, sea a
través de elementos visuales, o sonoros.

### Pantalla de puntuaciones

![](https://i.ibb.co/pwDshL5/Whats-App-Image-2020-10-11-at-12-48-43-PM.jpg)

La pantalla de puntuaciones se presenta al jugador al finalizar una
partida exitosamente (entendiéndose una partida exitosa como una en la
que se alcanza uno de los tres finales descritos). En ella, al jugador
se le presenta un informe de su rendimiento en partida, compuesto por
los siguientes datos:

-   **TIME:** La medida más importante, detrás del final obtenido y los
    eventos especiales. Cuanto menor el tiempo, mejor se considera que
    ha sido el desempeño del jugador.

-   **KILLS:** Número de enemigos derrotados a lo largo de la partida.
    Como sería complicado puntuar distintos enemigos con distintas
    cantidades, se propone que todos equivalgan a los mismos puntos. En
    cualquier caso, el monto de enemigos derrotados es el factor de
    menor influencia en la puntuación.

-   **SPECIAL EVENTS:** Entendiendo por eventos especiales el número de
    androides desamparados a los que ha ayudado el jugador. Cada uno
    suma una enorme cantidad de puntos, siendo éste un factor
    determinante para conseguir las mayores puntuaciones.

-   **ENDING ATTAINED:** El final obtenido en la historia afecta en gran
    medida la puntuación. El final 'neutral' equivale a 0 puntos,
    mientras que el final 'malo' restará muchos puntos, y el 'bueno',
    por contrapartida, sumará muchos puntos.

Todos esos factores se sumarán en una puntuación final, que será la
puntuación definitiva del jugador. Si ésta es suficientemente alta,
aparecerá en el ranking a la derecha, donde se expondrán los jugadores
con mayor puntuación. Este ranking puede ser local u online, dependiendo
de las necesidades del desarrollo.

### Pantalla de créditos

![](https://i.ibb.co/DCFrGKX/Whats-App-Image-2020-10-11-at-12-48-38-PM.jpg)

Pantalla de créditos donde se expondrán los nombres de los
desarrolladores del juego, las funciones que cumplieron en el
desarrollo, y los respectivos enlaces de contacto a sus páginas
web/portfolios. Normalmente, el jugador accederá a esta pantalla por
voluntad propia desde el menú principal o el menú de puntuaciones, pero
se está considerando la opción de introducir una pantalla de créditos
dedicada entre el final del juego y el menú de puntuaciones de forma
obligatoria.

Controles
---------

> Los controles, según plataforma, son los siguientes:

### Controles en PC

**Durante el juego:**

-   **Moverse:** Teclas direccionales/WASD

-   **Entrar en modo 'volar':** Espacio

-   **Volar:** Teclas direccionales/WASD

-   **Apuntar:** El ratón tomará la forma de una cruceta en la pantalla;
    entre la cruceta y el arma del jugador se dibujará una línea roja
    para mejor visualización del disparo.

-   **Disparar:** Click izquierdo del ratón

-   **Interaccionar:** Tecla E

-   **Cambiar tipo de munición:** Utilizando la rueda, los números o
    haciendo click en el icono visual del tipo de munición deseada.

-   **Abrir menú de pausa:** Tecla ESCAPE.

**En menús:**

-   **Pulsar/confirmar:** Click izquierdo del ratón o ENTER.

-   **Navegación/selección:** Movimiento del ratón, o teclas
    direccionales.

Nótese que, si el tiempo lo permite, sería conveniente incluir la
posibilidad de remapear los controles del juego.

### Controles en móvil

**Durante el juego:**

-   **Moverse:** Joystick virtual

-   **Entrar en modo 'volar':** Mover el joystick virtual hacia arriba
    (Tap).

-   **Volar:** Joystick virtual:

-   **Apuntar:** La cruceta aparecerá cuando el jugador arrastre el dedo
    sobre la pantalla, dibujándose una línea entre ella y el arma del
    sprite del jugador.

-   **Disparar:** En esta plataforma, esta acción sucede al mismo tiempo
    que el apuntado (no se pueden realizar por separado). Siempre que el
    jugador toque en cualquier lugar de la pantalla que no sea un botón
    o un interaccionable, se disparará en esa dirección. Si se mantiene
    pulsado, se seguirá disparando.

-   **Cambiar tipo de munición:** Tapeando sobre el icono de tipo de
    munición que se desee utilizar.

-   **Abrir menú de pausa:** Tapeando sobre el botón de PAUSE.

**En menús:**

-   **Pulsar/confirmar:** Tapear sobre el botón. **Sólo se confirmará la
    acción al TAPEAR el botón, de manera que si se arrastra el dedo
    sobre él no se activará.**

-   **Navegación/selección:** Dadas las características de la
    plataforma, esta acción no es necesaria. Un botón se pondrá en modo
    'seleccionado' mientras se mantenga el dedo sobre él. Al libera el
    dedo, se confirmará la acción.

Dadas las características de esta plataforma, no se puede ofrecer la
opción de remapear los controles.

Estilo visual
=============

Dada la escasez de artistas en el equipo, se ha optado por una estética
pixel art que pueda aprovechar los assets ya existentes y para la que
además sea fácil producir otros nuevos, utilizando tilesets de 32x32
pixeles de definición por bloque para crear unos escenarios visualmente
impactantes y al alcance de nuestra capacidad de desarrollo artístico. A
continuación, se exponen ejemplos de sprites y tilesets que se
utilizarán en el juego:

Sprites
-------

![](https://img.itch.zone/aW1hZ2UvNzQzMjI1LzQxNDE3NzIuZ2lm/347x500/ATLDl1.gif)
La línea de arte pixel art para los
sprites estára basada en los sprites del artista
['Penusbmic'](https://penusbmic.itch.io/), los cuales se utilizarán para
dar vida a los enemigos del juego. Se pueden observar ejemplos de ellos
a derecha e izquierda en este documento.

Como se puede observar, los personajes comparten una estética de pixel
art de bajo detalle que facilita su animación y favorece la estética
pixel art futurista del juego, donde además no hay ningún personaje
humano.

Tilesets
--------

Todos los escenarios jugables estarán construidos a partir de tilesets
con la herramienta ['Tiled'](https://www.mapeditor.org/). Con el
objetivo de dar unidad estética al juego, a la vez que un alto nivel de
calidad visual al juego, se ha decidido adquirir los tres sets de
tilesets 'dark platformer' del artista
['Szadi'](https://szadiart.itch.io/). Estos tilesets de alta calidad
cumplen tanto con la estética buscada como con las necesidades del level
design, por lo que han resultado perfectos para este proyecto (se puede
ver una imagen del tileset en uso adjuntada más abajo).

![](https://i.ibb.co/qJ7LHLK/image.png)

Arte propio
-----------

Para conservar cierto grado de personalidad en los elementos más
importantes del juego, tanto el sprite del jugador (9ULS42), como el del
jefe final (D42K-H) y los androides desamparados serán creados y
animados por el equipo de desarrollo, así como algunos enemigos extra si
las mecánicas y el level design así lo exigiera.

Mecánicas
=========

Esta sección se dividirá en dos subsecciones en base a la importancia de
las mecánicas que la componen en relación al diseño del juego, es decir,
en mecánicas núcleo y en mecánicas auxiliares:

Mecánicas núcleo
----------------

Las mecánicas núcleo son aquellas que definen el centro de la
experiencia de juego, y como tales, son las que más atención deben
recibir en el desarrollo:

### Movimiento y vuelo

La premisa del juego, subir hasta la cima de una torre, incita
implícitamente al movimiento vertical, que de hecho es una componente
clave para la manera en que se desplazará el jugador:

El jugador puede correr en tierra, pero también puede utilizar sus botas
propulsoras para despegar y volar por el escenario en cualquier
dirección. Esta será la principal mecánica de avance en el juego: el
jugador comienza en la parte más baja del nivel, y debe volar hasta la
salida, que se encuentra en algún punto superior, para pasar al
siguiente nivel.

El mecanismo de vuelo es muy sencillo: basta con pulsar lo que sería el
botón de 'salto' en cualquier otro plataformero (o mover el joystick
hacia arriba en la versión de móvil) para comenzar a volar. Esta
mecánica reemplaza a la mecánica de salto tradicional, que no es
necesaria en este juego.

### Apuntar y disparar

La mecánica núcleo del combate en este juego es apuntar y disparar. El
jugador puede apuntar y disparar en cualquier dirección, lo que separa
este juego de los shooters 2D tradicionales como Metal Slug, para
explorar el espacio de juego de otra manera.

Para mejorar la visibilidad y el feedback, una línea roja se dibuja
entre el cañón el jugador, que se alineará con ésta, y el lugar donde el
jugador esté apuntando o disparando, donde además aparecerá una cruceta.
[Para favorecer la naturaleza arcade de este juego, la munición es
infinita y el desvío de las balas es muy pequeño.]{.ul}

### Límite de tiempo

Junto a las dos mecánicas anteriores, ésta es la última pieza que define
la experiencia núcleo de juego: existe un límite de tiempo para que el
jugador supere el juego. La premisa se basa en que un acontecimiento
tendrá lugar durante la noche en la que tienen lugar los hechos, y si ya
ha amanecido para cuando el jugador llegue a la cima, habrá perdido la
oportunidad (leer apartado de trasfondo para más información).

El objetivo de esta mecánica es que el jugador sienta una constante
presión que le empuje a seguir subiendo, y para eso, es conveniente que
exista un indicador visual de que el tiempo está pasando, pero que no
sea tan exacto como un reloj: **la solución ideal para este problema es
disponer de un background animado, que sea visible en todo momento**,
que muestre el avance de la noche utilizando la rotación de la luna (de
una manera similar al popular juego *'Minecraft'*, donde se puede ver
claramente como pasa la noche observando a luna salir y bajar por el
cielo).

Tomando eso como medida, pueden pasar dos cosas cuando el jugador llegue
a la cima de la torre:

1.  **Si aún queda tiempo y no ha amanecido todavía**, la androide
    protagonista se encuentra con D42K-H, el androide al que estaba
    buscando y el que le invitó a subir la torre esa misma noche. Tras
    una breve conversación, D42K-H ataca a la androide protagonista,
    dando comienzo a la batalla final.

2.  **Si no queda tiempo y ya es de día cuando el jugador llegue a la
    cima**, se obtendrá un 'final malo' para la historia, donde la
    androide se encuentra con que el evento (una kilonova) ya ha tenido
    lugar, dando paso a un agujero negro. En este escenario no hay
    batalla final.

### Puntos de vida

El jugador tendrá unos puntos de vida, que se verán representados en
todo momento en una barra del HUD ingame (consultar apartado de
interfaz). Cuando reciba daño de ataques enemigos o del entorno, esos
puntos de vida bajarán, y si llegan a cero, el jugador perderá la
partida.

### Energía

La energía, al igual que los puntos de vida, se representa como una
barra en la pantalla. Es la moneda de cambio más importante del juego,
ya que el método de avance del juego, el sistema de vuelo, gasta energía
de [manera exponencial.]{.ul}[^3]

Por otra parte, la energía también será necesaria para utilizar la
munición especial, que será un componente importante para el combate. Es
posible que se le den más usos si los tiempos de desarrollo lo permiten,
como moneda de cambio para usar atajos, o cualquier otra cosa. La
energía es la moneda de cambio de este juego: se puede usar para todo.

Por otro lado, la energía se puede obtener también de varias maneras: el
principal método será derrotar enemigos, que soltarán cápsulas de
energía que el jugador podrá recoger, pero dichas cápsulas también
podrían encontrarse por el escenario, dentro de cofres o escondidas en
sitios difíciles de ver o de alcanzar.

Mecánicas auxiliares
--------------------

Como su nombre indica, las mecánicas auxiliares existen para potenciar
las mecánicas núcleo, dándole más usos a éstas o creando un efecto que
ayude a crear la experiencia de juego deseada.

### Eventos especiales

En cada nivel habrá un lugar algo apartado donde tendrá lugar un evento
especial, si el jugador lo visita. Estos eventos especiales consisten en
ayudar a androides desamparados (consultar sección 5.3, Personajes),
bien sea acabando con enemigos que les están hostigando, o pasando algo
de tiempo con ellos. A cambio, estos androides le regalarán a la
androide protagonista unos chips de software que servirán como 'power
up', desbloqueando un nuevo tipo de munición especial para el jugador.
[Queda pendiente definir cuántos eventos distintos puede haber, pero
debe existir al menos uno por nivel.]{.ul}

El objetivo de esta mecánica es forzar al jugador a tomar la decisión de
si quiere gastar su precioso tiempo ayudando a los demás, sin saber si
eso le costará el no llegar a tiempo a la cima de la torre. Esto
enfatiza mucho la experiencia juego objetivo. (Consultar apartado 8,
experiencia de juego objetivo)

### Munición especial / Upgrades

Como se ha mencionado en la mecánica anterior, la munición especial o
'upgrades' son objetos recibidos de los androides desamparados a los que
ayuda el jugador en los eventos especiales, y que añaden nuevas
funciones al arma del jugador. Lo ideal sería que existieran como mínimo
tantos power-ups como eventos especiales haya, o incluso más.

A continuación, se hace una lista de las posibilidades que hay. Se
realizarán prototipos de todas y finalmente se implementarán solamente
en el juego aquellas que sean viables y estén bien balanceadas:

#### Balas rebotantes

Como su nombre indica, la característica de estas balas es que pueden
rebotar en las paredes, dando muchas oportunidades de combate al
jugador. **Su daño será estándar, su cadencia de fuego será normal y su
consumo de energía será bajo.**

#### Balas de agujero negro

Estas balas tienen la peculiaridad de que allá donde impacten, crearán
un pequeño agujero negro que atraerá hacia sí mismo a los enemigos, e
incluso a las balas. Se podría utilizar tanto con objetivos ofensivos
(atrapar a enemigos en un sitio o lanzarlos por precipicios), como con
objetivos defensivos (las balas enemigas pueden ser absorbidas por el
agujero negro). **No causan daño, tienen muy muy baja cadencia de fuego
y su consumo de energía es muy alto.**

#### Munición explosiva 

Este tipo de munición especial creará una pequeña explosión allá donde
impacte, causando daño a todos los enemigos que estén en ese radio. Su
principal uso vendrá dado por su daño de área. **Tendrá una baja
cadencia de fuego, un daño moderado y un consumo también moderado de
energía.**

#### Balas megatón

Estas balas de grandes dimensiones ofrecerían una gran potencia de
impacto, empujando a los enemigos a los que golpean y causándoles mucho
daño. **Su daño sería muy elevado, su cadencia de fuego sería muy baja y
su consumo de energía sería alto.**

#### Balas ultrasónicas

Este tipo de balas podría verse como una actualización de la munición
estándar: **son más rápidas y tienen mucha cadencia, pero hacen algo
menos de daño que la munición normal. Su consumo de energía sería
bajo.**

### Sistema de dialogo.

Un sistema de diálogo básico será necesario para llevar la narrativa de
la historia, los eventos especiales y el tutorial del juego.

En un principio, solo será necesario un sistema básico con una caja de
diálogo que muestre el nombre de la persona que está hablando y el
texto, junto a un botón de continuar para que el jugador pueda llevar su
propio ritmo en la conversación.

Niveles
=======

En esta sección se describirá todo lo relacionado con los niveles del
juego: cuántos hay, qué estructura tienen y qué elementos contienen.

Macroestructura de niveles
----------------------------------------------------------------------------------------------------------

<img align="left" width="300" height="500" src="https://i.ibb.co/B4XQxjx/image.png">
La torre estará dividida en cinco niveles: el tutorial, tres niveles de
ascenso que conformarán el grueso del juego, y la cima, que sirve
únicamente como escenario para la batalla final del juego.

Cada nivel será más difícil que el anterior, y en pos de añadir
rejugabilidad, los niveles variarán en cada partida, existiendo 3
variantes de cada nivel. Esto nos da un total de 9 niveles (3 niveles de
dificultad con 3 variantes cada uno), y 27 posibles configuraciones
distintas. Este número podría disminuir en función de las dificultades
de desarrollo, pero no aumentar.

Para hacer el cambio entre niveles más evidente, cada nivel tendrá una
estética única y enemigos nuevos que no se habían visto en el anterior
nivel, así como un evento especial distinto.

\
\
\
\
\
\
\
\


Estructura individual de niveles
--------------------------------

En esta sección, se describirá mediante esquemas la estructura
individual de cada nivel:

### Tutorial
<img align="right" width="359" height="350" src="https://i.ibb.co/mXYCryL/image.png">
El tutorial es un nivel de tamaño reducido
que servirá como introducción a todas las mecánicas del juego, así como
introducción a la historia y primera toma de contacto del jugador con el
mundo ficticio. Como tal, tiene muchas tareas. A la izquierda se ha
adjuntado un esquema del nivel, de los eventos y del flujo de juego.

También es importante destacar que durante el tutorial deberá estar
disponible en todo momento un botón de 'SKIP TUTORIAL' que permita al
jugador saltarse este nivel y pasar al primer nivel directamente

La premisa del nivel se basa en la llegada de D42K-H y 9ULS42 (jugador)
a la torre, donde D42K-H le explica todo lo que necesita saber para
comenzar su ascenso. A continuación, se explica uno a uno los eventos
del nivel:

1.  **INTRODUCCIÓN:** Este evento de lanza automáticamente al comenzar
    el nivel. En él D42K-H se 'presenta' a él y a la torre de manera
    familiar, ya que 9ULS42 y él llevan conociéndose mucho tiempo. Tras
    una breve introducción, le pide al jugador que le siga, explicándole
    los controles básicos de movimiento.

2.  **INSTRUCCIONES DE VUELO:** En este evento se introduce al jugador
    la mecánica de vuelo. D42K-H hará especial hincapié en lo importante
    que será conservar combustible para poder alcanzar el nivel
    superior; tras explicarle cómo volar al jugador y hablarle acerca de
    la energía y como se consume, volará hacia el siguiente nivel de
    altura, donde esperará al jugador frente a un enemigo dummy.

3.  **INSTRUCCIONES DE COMBATE BÁSICAS:** En este punto D42K-H esperará
    al jugador junto a un enemigo dummy, que utilizará para introducir
    las mecánicas de combate básicas (apuntar, disparar, matar a
    enemigos y obtener la energía que dejan caer) al jugador. Cuando lo
    haya hecho, le pedirá que elimine al dummy, recoja la energía que
    soltará, y le siga al siguiente nivel de altura.

4.  **INTRODUCCIÓN A ELEMENTOS DAÑINOS DEL ENTORNO:** Aquí, D42K-H le
    explica al jugador que uno de los peligros de la torre es la propia
    torre, ya que muchos elementos del entorno pueden dañar e incluso
    matar al jugador. Delante de él, una breve sección con elementos
    dañinos se presentará. D42K-H le explicará que la opción más sabia
    es esquivar estos elementos dañinos utilizando tan poca energía como
    sea posible, y le pedirá que continúe mientras se adelanta al
    punto 5.

5.  **COFRES E INTERACTUABLES:** Aquí, D42K-H le presenta al jugador el
    primer cofre, e interaccionable, con el que se encontrará en el
    juego, le explicará cómo abrir los cofres e interactuar con
    cualquier otro elemento del entorno (diferente para cada
    plataforma), y le aconsejará abrir cofres siempre que los encuentre.
    Como en este punto el jugador tendrá poca energía después del
    segmento de plataformeo, éste abrirá el cofre, que soltará drops de
    energía, y una vez los colecte, el jugador seguirá a D42K-H hacia el
    punto 6, no sin antes encontrarse con otro pequeño segmento de
    plataformeo.

6.  **INTERACTUABLES QUE AFECTAN AL ENTORNO Y DESAFÍO FINAL:** Aquí,
    D42K-H estará esperando al jugador junto a un botón que se encuentra
    al final de una pequeña sección de plataformeo. Cuando le alcance,
    D42K-H le explicará cómo funcionan los botones/palancas y cómo esto
    puede afectar al entorno del nivel y ser una pieza clave para
    avanzar en algunos puntos; el funcionamiento es el mismo que con el
    cofre. Además de esto, le avisa de que tras la barrera que
    desbloquea el botón se encuentra un enemigo real al que deberá
    enfrentarse, por lo que le aconseja que 'recuerde todo lo que le ha
    enseñado'. Una vez el jugador abre la barrera, D42K-H vuela hacia el
    punto 7 mientras el jugador pelea contra el enemigo, que será un
    simple 'Droid Zapper'.

7.  **CONCLUSIÓN:** Una vez el jugador alcanza este punto, D42K-H le
    felicita por haber completado todas las tareas, diciéndole que se
    adapta rápido a la torre. Tras eso, D42K-H le recuerda que no tienen
    mucho tiempo y que deben llegar a la cima de la torre antes de que
    termine la noche. Aquí se establece el objetivo del juego y se da
    una última conversación introductoria a la historia entre los
    personajes. Como recompensa por haber completado el tutorial, D42K-H
    le otorga a 9ULS42 un tipo de munición especial (siempre la misma) y
    le explica cómo utilizarla, cerrando la explicación a todas las
    mecánicas del juego.

Una vez hecho esto, le mencionará que existen androides desamparados que
quizás le pidan ayuda, pero que debe pensarse muy bien si tiene tiempo
suficiente para hacer eso (introducción a eventos especiales). Una vez
dicho todo esto, D42K-H le dice al jugador que se adelantará y le
esperará en la cima de la torre, pero que no olvide que el límite de
tiempo es esa misma noche. Al decir esto, D42K-H vuela hacia el final
del nivel, y el jugador queda a su libre albedrío. Cuando decida
ascender a la salida del nivel, será trasladado al nivel 1, donde
comenzará la experiencia de juego real.

Esto, sin embargo, sólo describe los eventos del tutorial. Para
recompensar desde un primer principio a los jugadores que decidan
explorar la totalidad del nivel, se introducirá en el tutorial **dos
eventos especiales** en los extremos horizontales inexplorados:

-   **EVENTOS 'X' E 'Y'**: En estos puntos alejados del nivel el jugador
    se encontrará con androides desamparados. Éstos no necesitarán ayuda
    con nada ni darán ningún power-up al jugador, como los que se
    encontrará en los niveles superiores, pero sí que hablarán con el
    jugador para darle algún consejo especial y, sobre todo, para
    familiarizarle con el aspecto de los androides desamparados y sus
    mecánicas. Ellos mismo se presentarán como androides que también
    esperan escalar hasta la cima de la torre para hallar el sentido de
    la vida esa noche, como quieren hacer 9ULS42 y D42K-H.

Una vez superado el tutorial, el jugador avanza al primer nivel del
juego, donde comenzará con la energía y la barra de vida completas, así
como con el power-up que recibió en el tutorial, independientemente de
si se lo 'saltó' o no.

### Nivel estándar

Tal y como se especifica en la macroestructura de niveles, el juego se
compondrá de tres niveles (excluyendo el tutorial). Estos tres niveles
compartirán una composición similar, que se explicará a continuación con
un ejemplo aplicable a cualquier nivel del juego:

![](https://i.ibb.co/KmbzS15/image.png)
La imagen superior (página anterior) representa el 'layout' de un nivel
cualquier del juego. En todos ellos existirá una entrada y una o más
salidas, así como distintos niveles de altura que el jugador tendrá que
superar para llegar al siguiente nivel, y un evento especial que podrá
completar si lo desea. Dentro de las variantes de cada nivel de
dificultad, no existirán cambios procedimentales en el aspecto general
del nivel, pero sí que podrán variar los siguientes elementos dentro de
un mismo nivel. Referenciando a la imagen y la leyenda de iconos:

-   **ENEMIGOS:** Las 'X' rojas representan posibles 'spawns' de
    enemigos en un nivel. En ningún caso spawnearán enemigos en todas
    las 'X', sino que se decidirá de manera procedural en qué lugares
    aparecen enemigos, y cuáles aparecen. Se debe mantener un equilibrio
    para no generar 'softlocks' donde no hay enemigos en todo un nivel
    de altura, imposibilitando al jugador obtener energía para
    continuar.

-   **COFRES:** Los cofres podrán 'spawnear' en cualquier punto con una
    'O' verde del esquema. En ningún caso se generarán cofres en todos
    los lugares, pero si que puede variar el número de cofres (es decir,
    no será un valor fijo). Los cofres servirán como fuente de energía
    alternativa a los enemigos.

-   **BLOQUEOS:** Los bloqueos se presentarán en forma de barreras
    'láser' que impiden el paso al jugador y hacen daño al contacto.
    Para desactivarlas, el jugador tendrá que encontrar el
    correspondiente botón que las desactiva. Estos bloqueos por norma
    general aparecerán de forma procedimental (es decir, que no estarán
    preestablecidos). Pueden bloquear camino tanto de forma horizontal
    como vertical. Habrá muy pocos de ellos en cada nivel, y su objetivo
    es forzar al jugador a tomar distintas rutas para aportar
    rejugabilidad y variedad a los niveles.

-   **BOTONES:** La creación de botones va de la mano de los bloqueos,
    ya que los botones se generarán precisamente para levantar los
    bloqueos del nivel. Como norma general, un botón desbloqueará un
    solo bloqueo, pero sería interesante estudiar casos en los que un
    botón levanta barias barreras, o una barrera necesita varios botones
    para desbloquearse (más intuitivo si son varias, una detrás de otra,
    y hay un botón para cada una).

También cabe destacar que el número de elementos procedurales puede ser
un buen medidor de dificultad, por lo que es lógico que a mayor el
nivel, más enemigos y bloqueos puedan aparecer en el escenario. Lo mismo
va para los cofres; habrá más en los niveles bajos, mientras que en los
más altos será más raro encontrarlos y el jugador se verá obligado a
pelear más.

Este sistema, pese a que costará mucho esfuerzo balancearlo, ofrece un
alto valor de rejugabilidad para un mismo escenario. Si a esto sumamos
el hecho de que cada nivel tendrá tres variantes (dando lugar a 27
combinaciones, como se mencionó antes), el valor de rejugabilidad del
juego es enorme; casi tanto como si tuviera niveles enteramente
procedimentales.

### Nivel del Final Boss

![](https://i.ibb.co/v4zQtpg/image.png)
El último nivel, donde se encuentra D42K-H, el boss final del juego, es de
hecho el más sencillo en cuanto a estructura. Estará conformado por una
cúpula, la cima de la torre, que dará una vista imponente de la kilonova
(en caso de que no haya terminado cuando el jugador llegue a este nivel,
consultar apartado 6.4.3.) sobre un claro cielo estrellado, frente al
cual estarán solamente el jugador y el jefe final:

La única progresión de este nivel consiste en superar la batalla final,
que será descrita con más detalle en el apartado 11.3. de este
documento, dedicado al comportamiento del jefe final. Tras superarla, el
jugador alcanza el final del juego.

Enemigos
========

Este apartado consistirá en una descripción individual de todos los
enemigos del juego, incluyendo dónde se les puede encontrar y cuáles son
sus características. Convenientemente, se separarán enemigos terrestres
y enemigos aéreos:

Enemigos terrestres
-------------------

Aquellos enemigos que sólo pueden desplazarse en tierra:

### Droid Zapper

Enemigo terrestre básico.

<img align="center" width="90" height="160" src="https://i.ibb.co/GV5jGZv/image.png">

-   **ZONAS DE APARICIÓN:** Niveles 1 y 2.

-   **RATIO DE APARICIÓN:** Muy común.

-   **COMPORTAMIENTO:** Se moverá cerca de su spawn hasta encontrar al
    jugador, en cuyo momento le perseguirá para atacarlo sin descanso.

-   **MÉTODO DE ATAQUE:** Ataque melee de corto alcance.

-   **VELOCIDAD DE MOVIMIENTO:** Estándar

-   **CANTIDAD DE VIDA:** Poca vida.

-   **CUÁNTO DAÑO HACE:** Poco daño.

-   **CUÁNTA ENERGÍA SUELTA:** Estándar.

### Sword Droid

Enemigo melee estándar; es como el droid zapper, pero algo más fuerte.
Bastante común.

<img align="center" width="140" height="160" src="https://i.ibb.co/FqfjpVK/image.png">

-   **ZONAS DE APARICIÓN:** Niveles 2 y 3.

-   **RATIO DE APARICIÓN:** Estándar.

-   **COMPORTAMIENTO:** Se moverá cerca de su spawn hasta encontrar al
    jugador, en cuyo momento le perseguirá para atacarlo sin descanso.

-   **MÉTODO DE ATAQUE:** Ataque melee de medio alcance. Combo de dos
    golpes.

-   **VELOCIDAD DE MOVIMIENTO:** Rápido

-   **CANTIDAD DE VIDA:** Poca vida. (Un poco más que Droid Zapper)

-   **CUÁNTO DAÑO HACE:** Estándar. (x2 golpes)

-   **CUÁNTA ENERGÍA SUELTA:** Media-alta.

### Mecha

Enemigo a distancia por excelencia. Es de los enemigos más duros del
juego.

<img align="center" width="180" height="180" src="https://i.ibb.co/30bCNz6/image.png">

-   **ZONAS DE APARICIÓN:** Niveles 2 y 3.

-   **RATIO DE APARICIÓN:** Poco común.

-   **COMPORTAMIENTO:** Se moverá cerca de su spawn hasta encontrar al
    jugador, en cuyo momento le atacará manteniendo su posición,
    alejándose si se acerca demasiado.

-   **MÉTODO DE ATAQUE:** Ataque a distancia de largo alcance. Todas las
    direcciones. Cadencia estándar.

-   **VELOCIDAD DE MOVIMIENTO:** Muy lento.

-   **CANTIDAD DE VIDA:** Mucha vida.

-   **CUÁNTO DAÑO HACE:** Medio-alto.

-   **CUÁNTA ENERGÍA SUELTA:** Mucha energía.

**POSIBLE ENEMIGO A DISTANCIA ALTERNATIVO: TORRETA.**

### Sith Droid

Enemigo melee más duro del juego. Una pesadilla para el jugador.

<img align="center" width="90" height="160" src="https://i.ibb.co/kgT8mrV/image.png">

-   **ZONAS DE APARICIÓN:** Nivel 3.

-   **RATIO DE APARICIÓN:** El más raro del juego.

-   **COMPORTAMIENTO:** Patrullará una zona amplia entorno a su spawn.
    Cuando encuentre al jugador, le acechará y atacará hasta matarlo.

-   **MÉTODO DE ATAQUE:** Puede desplazarse corriendo hasta su objetivo
    y atacarle, o puede teletransportarse y atacar por sorpresa.

-   **VELOCIDAD DE MOVIMIENTO:** Muy rápido. (Teletransporte)

-   **CANTIDAD DE VIDA:** Estándar.

-   **CUÁNTO DAÑO HACE:** Muchísimo daño en los ataques normales. Daño
    elevado (pero menor) en ataque de teletransporte.

-   **CUÁNTA ENERGÍA SUELTA:** El que más energía suelta de todo el
    juego.

Enemigos aéreos
---------------

Aquellos enemigos que se desplazan por el aire. Estos, por norma
general, serán menos comunes que los enemigos terrestres, para no forzar
demasiado al jugador a volar.

### Drone Zapper

Enemigo melee aéreo estándar.

<img align="center" width="120" height="150" src="https://i.ibb.co/6ykBZPS/image.png">

-   **ZONAS DE APARICIÓN:** Niveles 1 y 2.

-   **RATIO DE APARICIÓN:** Muy común.

-   **COMPORTAMIENTO:** Se moverá cerca de su spawn hasta encontrar al
    jugador, en cuyo momento le perseguirá para atacarlo sin descanso.

-   **MÉTODO DE ATAQUE:** Ataque melee de corto alcance.

-   **VELOCIDAD DE MOVIMIENTO:** Lenta.

-   **CANTIDAD DE VIDA:** Poca vida.

-   **CUÁNTO DAÑO HACE:** Poco daño.

-   **CUÁNTA ENERGÍA SUELTA:** Estándar.

### Droid Gunner

Enemigo melee aéreo a distancia estándar.

<img align="center" width="160" height="90" src="https://i.ibb.co/WVGYvnr/image.png">

-   **ZONAS DE APARICIÓN:** Niveles 2 y 3.

-   **RATIO DE APARICIÓN:** Estándar

-   **COMPORTAMIENTO:** Patrullará volando cerca de su spawn. Cuando
    encuentre al jugador, le perseguirá y disparará, mantiendo siempre
    una distancia mínima.

-   **MÉTODO DE ATAQUE:** Ataque a distancia de medio alcance.

-   **VELOCIDAD DE MOVIMIENTO:** Estándar.

-   **CANTIDAD DE VIDA:** Estándar.

-   **CUÁNTO DAÑO HACE:** Estándar.

-   **CUÁNTA ENERGÍA SUELTA:** Media-alta.

### Homing Bomb Droid

Enemigo aéreo 'kamikaze'. Muy molesto en combates cruzados.

<img align="center" width="150" height="150" src="https://i.ibb.co/M69J2vX/image.png">

-   **ZONAS DE APARICIÓN:** Nivel 3.

-   **RATIO DE APARICIÓN:** Muy común.

-   **COMPORTAMIENTO:** Se moverá aleatoriamente entorno a su spawn.
    Cuando detecte al jugador, se lanzará a por él en línea recta.

-   **MÉTODO DE ATAQUE:** Explosión suicida.

-   **VELOCIDAD DE MOVIMIENTO:** Muy Rápida.

-   **CANTIDAD DE VIDA:** MUY poca vida.

-   **CUÁNTO DAÑO HACE:** Mucho daño.

-   **CUÁNTA ENERGÍA SUELTA:** Media-alta. Si muere como kamikaze, no
    suelta energía.

Jefe final -- D42K-H
--------------------

El jefe final es un enemigo 'especial', ya que tendrá un aspecto muy
similar al del jugador y unos poderes de ataque muy parecidos, a la par
que la capacidad de volar indefinidamente (cosa que el jugador no
puede). Aquí se resume, de forma simplificada, sus estadísticas:

-   **ZONAS DE APARICIÓN:** Nivel final.

-   **COMPORTAMIENTO:** Hará transición durante toda la batalla entre
    dos fases: terrestre y aérea. Pasará la mayoría del tiempo en la
    fase aérea, y sólo aterrizará para cargar y liberar el ataque de
    cañón láser. Los ataques que realice en la fase aérea dependerán de
    cuánta vida le quede.

-   **MÉTODO DE ATAQUE:**

    -   **ÁEREO:** Se moverá rápidamente entre puntos aleatorios del
        escenario, parándose a atacar brevemente en cada punto. Puede
        atacar disparando balas, combas, o misiles.

    -   **TERRESTRE:** Cuando aterrice, cargará durante un tiempo un
        ataque definitivo que cubrirá toda la zona del suelo (láser).
        Mientras carga el ataque es vulnerable, pero cuando lo libere el
        jugador tendrá que permanecer un tiempo en el aire si quiere
        sobrevivir.

    -   **DESPERATION MOVE:** Justo antes de morir, liberará un ataque
        láser en múltiples direcciones desde el centro del escenario
        (volando), en un último intento por acabar con el jugador.

-   **VELOCIDAD DE MOVIMIENTO:** Rápida.

-   **CANTIDAD DE VIDA:** El enemigo con más vida del juego.

-   **CUÁNTO DAÑO HACE:**

    -   **Balas:** Daño estándar, alta cadencia. Fácil de esquivar.

    -   **Bombas:** Mucho daño, gran área de golpe. Fáciles de esquivar

    -   **Misiles:** Mucho daño, muy rápidos, daño en área. Difíciles de
        esquivar.

    -   **Cañón láser:** Insta kill. Obligatorio esquivarlo.

    -   **Ultimate:** Cañón laser, pero en cinco direcciones (forma de
        estrella) y desde el centro del escenario, volando. Insta kill.

-   **CUÁNTA ENERGÍA SUELTA:** Cada vez que se le golpea cuando está en
    el aire, dejará caer pequeñas cápsulas de energía, lo que servirá
    para que el jugador pueda mantener el ritmo en la batalla.

Flujo de juego
==============

En este apartado, tras haber descrito todas las mecánicas, niveles y
enemigos del juego, se realizará un resumen condensado de toda esa
información, describiendo el flujo de juego de una partida habitual y la
experiencia que debería tener el jugador al jugar durante ese proceso:

Lo primero que verá el jugador será la 'splash screen' con el logo del
estudio, y a continuación una pantalla de carga, en la que permanecerá
hasta que se carguen todos los recursos del juego. Una vez hecho esto,
llegará al menú principal, donde se le presentará una ilustración que le
introduzca directamente en el mundo y concepto del juego. Si lo desea,
configurará sus opciones, y una vez lo haya hecho, comenzará la partida.

Al comenzar la partida, el jugador se encontrará con el tutorial, que
sirve tanto como introducción a la historia como a las mecánicas núcleo
del juego. Si el jugador ya es experto o conoce todas las bases,
probablemente se saltará el tutorial con el botón que existe dedicado
para ello, pero si es novato, probablemente lo seguirá hasta
completarlo, momento en el que pasará al grueso del juego, conformado
por los tres niveles que debe superar para llegar al 'final boss'.

Durante el progreso del primer nivel, el jugador se encontrará
únicamente con enemigos muy fáciles de derrotar (droid zappers y drone
zappers), por lo que tendrá tiempo suficiente para familiarizarse por
completo con las mecánicas de tiempo, combate y exploración del juego.
Si es un jugador experto, superará esta zona en poco tiempo, con lo que
tampoco le resultará aburrido.

Una vez alcance el segundo nivel, se encontrará con enemigos que pondrán
a prueba todos los conocimientos que ha adquirido (mechas, droid
gunners, sword droids), y éste sea probablemente el mayor pico de
dificultad del juego, ya que a la vez que deberá enfrentarse a enemigos
más desafiantes, también tendrá que gestionar mejor su tiempo y sus
recursos. Si es un jugador novato, es probable que aunque alcance el
tercer nivel, haya perdido demasiado tiempo en el segundo.

El tercer nivel será una última 'prueba de fuego' para el jugador, no
tanto por tiempo, ya que en este punto de la partida probablemente ya
esté decidido si el jugador llegará o no a tiempo al final, sino por los
enemigos, que serán los más duros del juego (sith droids, homing bombs).
Si el enemigo consigue dominar a estos enemigos y llegar a tiempo al
final del tercer nivel, se considera que estará preparado para derrotar
al final boss y superar el juego.

Una vez alcance la cima de la torre, el jugador se enfrentará al jefe
final, si es que ha llegado a tiempo. Esta batalla, más que ser difícil,
será una suma de las decisiones que haya tomado el jugador. Si ha
ayudado a los androides desamparados, tendrá armas más que suficientes
para manejar al jefe final, y de esta manera conseguir el final bueno
del juego, de hecho. Esto quiere decir que la batalla será lo
suficientemente difícil como para que el jugador deba prestar toda su
atención, pero no demasiado difícil como para requerir niveles altísimos
de habilidad. El mero hecho de haber alcanzado la cima de la torre a
tiempo ya le da el derecho al jugador de ganar el juego.

Una vez derrota al jefe final, el jugador obtiene el final neutral o el
final bueno, que proporcionará un lazo completo a su experiencia y le
dejará satisfecho (en especial si consigue el final bueno). Después de
eso, se le presenta la pantalla de puntuaciones, donde podrá comparar su
rendimiento al de otros jugadores del resto del mundo.

Es en este último punto donde se incentiva la rejugabilidad latente del
juego: si el jugador es competitivo, querrá mejorar su propia marca
hasta poder aparecer en el ranking de los mejores, y el hecho de que
cada partida que juegue será diferente a la anterior (pero manteniendo
los suficientes elementos en común para que el conocimiento de otras
partidas sea útil) será un gran incentivo para que siga jugando sin
aburrirse mientras persigue este objetivo. Finalmente, si el jugador lo
desea, podrá consultar los créditos para 'conocer' a los desarrolladores
del juego, y donar algo de dinero si considera que así lo merecen.

De esa manera, se cierra el ciclo de juego de la experiencia de juego
objetivo de Vagrant's Tower. No todos los jugadores actuarán de esta
manera, pero éste es el flujo de partida objetivo entorno al que se
debería construir el juego.

Hoja de ruta del desarrollo
===========================

En lo referente al desarrollo y la metodología de trabajo, se ha
decidido trabajar con una metodología ágil cercana a SCRUM, donde se
tiene sprints de una semana de duración, que conforman a su vez los
'hitos' del desarrollo:

PRIMER HITO: Semana 1 (28/9 -- 4/10)
------------------------------------

Brainstorm de ideas y posterior realización de concepts, consumándose
todo esto en un prototipo básico con la jugabilidad núcleo (moverse,
volar, disparar) y un GDD primitivo.

SEGUNDO HITO: Semana 2 (5/10 -- 11/10)
--------------------------------------

Desarrollo de las mecánicas núcleo, creación y búsqueda de sprites y
assets, organización de producción y conformación del GDD, diseño del
HUD

TERCER HITO: Semana 3 (12/10 -- 18/10)
--------------------------------------

Desarrollo de mecánicas auxiliares restantes, desarrollo de sprites,
implementación funcional del HUD, producción de prototipo estable con
todas las mecánicas.

CUARTO HITO: Semana 4 (19/10 -- 25/10)
--------------------------------------

Comienzo del desarrollo de niveles, comienzo del desarrollo de IA,
puesta en funcionamiento de redes sociales, pulir trabajo de semanas
anteriores de cara a la implementación definitiva de niveles.

QUINTO HITO: Semana 5(26/10 -- 1/11)
------------------------------------

Finalización de todos los niveles del juego, implementación de los de la
semana anterior. Finalización de los agentes de IA, finalización de
todos los sprites y assets por parte del equipo.

SEXTO HITO: Semana 6(2/11 -- 8/11)
----------------------------------

Finalización del juego. Implementación de cutscenes finales, pulir,
balancear. El día 8 se debe tener una versión estable y jugable del
juego terminado.

SÉPTIMO HITO: Semana 7 (9/11 -- 15/11)
--------------------------------------

Playtesting continuo del juego realizado por personas ajenas al
desarrollo y consiguiente corrección de bugs y balanceo final del juego.
Retoques finales, gran esfuerzo en las redes sociales para preparar el
lanzamiento, y comenzar la planificación del siguiente proyecto.

HITO FINAL: Presentación y lanzamiento (16/11 -- 20/11)
-------------------------------------------------------

Semana dedicada exclusivamente a preparar la presentación y el
lanzamiento del juego, mientras que se deja todo listo para comenzar con
el desarrollo del siguiente proyecto en cuanto acabe el de éste.

Referencias y anexos
====================

[^1]: Evento astral donde dos estrellas de neutrones se fusionan
    emitiendo enormes cantidades de energía. El resultado de dicha
    fusión puede dar lugar a un púlsar o un agujero negro, dependiendo
    de la masa y metalicidad de dichas estrellas.

[^2]: Como idea se propone crear una ilustración donde se pueda ver al
    androide protagonista a los pies de una imponente torre.

[^3]: Esto quiere decir que volar durante pequeños periodos de tiempo
    gastará poca energía, pero volar durante periodos de tiempo más
    largos (los requeridos para avanzar por el nivel) gastará mucha más
    energía.
