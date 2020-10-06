Vagrant's Tower (nombre temporal)
======

[1. Introducción 3](#introducción)

[1.1. Elevator Pitch. 3](#elevator-pitch.)

[1.2. Concepto de juego. 3](#concepto-de-juego.)

[2. Género 3](#género)

[3. Plataformas 3](#plataformas)

[4. Alcance del proyecto 4](#alcance-del-proyecto)

[5. Narrativa y personajes 4](#narrativa-y-personajes)

[5.1. Sinopsis 4](#sinopsis)

[5.2. Trasfondo general 4](#trasfondo-general)

[5.3. Personajes 4](#personajes)

[6. Controles e Interfaz 5](#controles-e-interfaz)

[6.1. Interfaz 5](#interfaz)

[6.1.1. Intro Cutscene 6](#intro-cutscene)

[6.1.2. Menú principal (Pantalla de Título)
6](#menú-principal-pantalla-de-título)

[6.1.3. Menú de opciones 6](#menú-de-opciones)

[6.1.4. In Game HUD 6](#in-game-hud)

[6.1.5. Menú de pausa 6](#menú-de-pausa)

[6.1.6. Pantalla de Game Over 6](#pantalla-de-game-over)

[6.1.7. Pantalla de puntuaciones 6](#pantalla-de-puntuaciones)

[6.1.8. Pantalla de créditos 6](#pantalla-de-créditos)

[6.2. Controles 6](#controles)

[6.2.1. Controles en PC 6](#controles-en-pc)

[6.2.2. Controles en móvil 6](#controles-en-móvil)

[7. Gameplay 7](#gameplay)

[8. Estilo visual. 7](#estilo-visual.)

[9. Referencias y anexos 7](#referencias-y-anexos)

Introducción
============

Éste es el documento de diseño de juego (GDD por sus siglas inglesas)
para el juego desarrollado por *Kilonova Studios* para el proyecto de
juego W3C de la asignatura de 'Juegos para Web y Redes Sociales' del
cuarto año de la carrera de Diseño y Desarrollo de Videojuegos, cuyo
nombre temporal es '*Vagrant's Tower'*[^1]. A continuación, se
describirán todos los aspectos del juego, desde su concepto hasta sus
detalles de implementación. Téngase en mente que este es un documento en
constante evolución, y, por lo tanto, [todo lo aquí escrito está sujeto
a cambios]{.ul}:

 {#section .list-paragraph}

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

Controles e Interfaz
====================

La idea fundamental de la interfaz y controles de Vagrant's Tower es
ofrecer un set de controles reducido y adaptable a las distintas
plataformas en las que se presenta, manteniendo toda la profundidad de
la jugabilidad. A continuación, se detallan los controles y la interfaz
en cada plataforma:

Interfaz
--------

![](media/image1.png){width="7.883333333333334in"
height="1.2680555555555555in"}En este apartado se definirá el aspecto
esquemático de las distintas interfaces del juego, comenzando por el
diagrama de flujo, que será común a ambas plataformas:

Se recomienda **encarecidamente** consultar visualizar este esquema en
su versión
[online](https://viewer.diagrams.net/?highlight=0000ff&edit=_blank&layers=1&nav=1&title=flowchart.drawio#Uhttps%3A%2F%2Fdrive.google.com%2Fuc%3Fid%3D1aeL-hrU-MbZA63SvlsCBrGhGhFWdBx7c%26export%3Ddownload).

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

### Intro Cutscene

### Menú principal (Pantalla de Título)

### Menú de opciones

### In Game HUD

### Menú de pausa

### Pantalla de Game Over

### Pantalla de puntuaciones

### Pantalla de créditos

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

Gameplay
========

Estilo visual.
==============

Animaciones que se necesitan de la androide protagonista. Ambas con y
sin brazo:

-   Idle

-   Correr

-   Correr mientras se mira hacia atrás

-   Idle en el aire

-   Volar en las cuatro direcciones

Además de todo eso, es necesario disponer del sprite separado del brazo,
para poder rotarlo en la dirección en la que disparará el jugador.

Referencias y anexos
====================

[^1]: Filosofo danés considerado como el padre del existencialismo, rama
    de la filosofía que explora este juego.
