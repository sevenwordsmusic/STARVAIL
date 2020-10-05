Kierkegaard's Tower
======

Introducción
============

Éste es el documento de diseño de juego (GDD por sus siglas inglesas)
para el juego desarrollado por *Kilonova Studios* para el proyecto de
juego W3C de la asignatura de 'Juegos para Web y Redes Sociales' del
cuarto año de la carrera de Diseño y Desarrollo de Videojuegos, cuyo
nombre temporal es '*Kierkegaard's Tower'*[^1]. A continuación, se
describirán todos los aspectos del juego, desde su concepto hasta sus
detalles de implementación. Téngase en mente que este es un documento en
constante evolución, y, por lo tanto, [todo lo aquí escrito está sujeto
a cambios]{.ul}:

Elevator Pitch.
---------------

*Kierkegaard's Tower* es un shooter sidescroller 2D de acción dinámica
similar a la de 'My Friend Pedro' y de estética pixel art, donde el
jugador debe subir hasta la cima de una torre antes de que se le acabe
el tiempo, y decidir si quiere y puede ayudar a otros durante el camino.

Concepto de juego.
------------------

*Kierkegaard's Tower* es un shooter sidescroller 2D donde el jugador
tiene como objetivo subir hasta lo alto de una torre antes de que 'se le
acabe el tiempo'. Por el camino, el jugador tendrá que pelear contra
distintos enemigos para sobrevivir y obtener los recursos necesarios
para continuar su ascenso, durante el cual se le presentará en varias
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

*Kierkegaard's Tower* es un shooter sidescroller 2D de acción de
estética pixel art con un fuerte componente de gestión de recursos y
resolución de puzles a gran escala.

Plataformas
===========

*Kierkegaard's Tower* es un juego web, disponible en:

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

El mundo de Kierkegaard's Tower se establece en un futuro lejano, donde
la humanidad ha sido reemplazada por máquinas y androides. Algunos de
estos androides despiertan al uso de la razón, preguntándose de esta
manera cuál es el sentido de la vida, y sintiendo la misma angustia que
sus antecesores, los humanos, sentían al preguntarse cuál era su
cometido en esta vida. Los androides, dotados de cuerpos inmortales,
entienden este tipo de comportamiento como un virus informático.

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
