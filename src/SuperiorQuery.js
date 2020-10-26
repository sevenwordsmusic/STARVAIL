import Enemy from "./Enemies/Enemy.js";

//quitar clase especial para linelineCol (inecesaria?)

//cambiar colisiones entre segmento-segmento a recta-segmento (nos ahorramos escalar el vetor y algunos calculos)y el if!!

//ver si circulo con r=bound maximo esta dentro de las lineas creadas por el spread para eliminar bodies inecesarios
//https://www.wyzant.com/resources/answers/607711/determine-which-side-of-a-line-a-point-lies     (ver si punto esta a izq o drch de linea)
//https://pier.guillen.com.mx/algorithms/07-geometricos/07.4-interseccion_segmentos.htm
//calcular punto de la tangente de vector de linea sup e inferior y ver si esta a izq o der de dichas bulletInteracBodies
//para calcularlo, antes de escalar dir usar para calcular dos vectores (sup e inf) e usar perpendicualres de estos * maxBound

//clase para realizar raycasts con otros cuerpos o arrays de cuerpos
export default class SuperiorQuery{
  constructor(){
  }
  //clase estatica auxiliar para calcular interseccion entre dos segmentos
  static superiorLineLineCollision(x1, y1, x2, y2, x3, y3, x4, y4){
      var returnInfo = new ClosestLineCollision();
      const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
      const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

      if (uA >= 0 && /*uA <= 1 &&*/ uB >= 0 && uB <= 1) {
        returnInfo.collided = true;
        returnInfo.colX = x1 + (uA * (x2-x1));
        returnInfo.colY = y1 + (uA * (y2-y1));
      }
      //se devuelve una clase especial para organizar la información de la intersección
      return returnInfo;
  }

  //clase para calcular punto de collision entre una linea y un cuerpo o array de cuerpos (devuelve la collisión más cercana al origen del raycast)
  static superiorRayCast(x1, y1, dir, indentation, bodies){
      //console.log(bodies)
      var dir = new Phaser.Math.Vector2(dir.x, dir.y);
      const indentationX = indentation * dir.x;
      const indentationY = indentation * dir.y;
      //dir.scale(5000);
      var closestCollision = new ClosestBodyCollision();
      var closestDistance = Number.MAX_SAFE_INTEGER - 1;

      //variables auxiliares para optimizar el algoritmo
      const vecSquareSum = dir.x*dir.x + dir.y*dir.y;
      const vecCombSum = x1*dir.x + y1*dir.y;
      const vecCombDif = y1*dir.x - x1*dir.y;

      //se calculan las collisiones con todas los lados de todos los cuerpos seleccionados con el segmento del raycast
      for(var i=0; i<bodies.length; i++){
          if(bodies[i] != null && SuperiorQuery.superiorCircleSector( x1, y1, dir, vecSquareSum, vecCombSum, vecCombDif, bodies[i].position.x, bodies[i].position.y, 46)){
            //console.log("a");
            for(var j=0; j<bodies[i].parts.length; j++){
                var vertices = bodies[i].parts[j].vertices;
                var next = 0;
                for (var current=0; current<vertices.length; current++) {
                  next = (current+1) % vertices.length;

                  var hit = SuperiorQuery.superiorLineLineCollision(x1, y1, x1 + dir.x, y1 + dir.y, vertices[current].x, vertices[current].y, vertices[next].x, vertices[next].y);
                  if (hit.collided) {
                    var currentDistance = Math.sqrt(Math.pow(hit.colX - x1,2) + Math.pow(hit.colY - y1,2));
                    if(currentDistance < closestDistance){
                      closestDistance = currentDistance;
                      closestCollision.collided = true;
                      closestCollision.colX = hit.colX + indentationX;
                      closestCollision.colY = hit.colY + indentationY;
                      if(bodies[i].gameObject.parent != undefined /* || */){
                        closestCollision.colSpecialObj = bodies[i].gameObject.parent;
                      }
                    }
                  }
                }
            }
          }
      }
      //se devuelve una clase especial para organizar la información de la colisión
      return closestCollision;
  }

  //clase para calcular punto de collision entre una linea y un cuerpo o array de cuerpos (devuelve la collisión más cercana al origen del raycast)
  static superiorRayCastBounce(x1, y1, dir, indentation, bodies){
      //console.log(bodies)
      var dir = new Phaser.Math.Vector2(dir.x, dir.y);
      const indentationX = indentation * dir.x;
      const indentationY = indentation * dir.y;
      //dir.scale(5000);
      var closestCollision = new ClosestBodyCollision();
      var closestDistance = Number.MAX_SAFE_INTEGER - 1;

      //variables auxiliares para optimizar el algoritmo
      const vecSquareSum = dir.x*dir.x + dir.y*dir.y;
      const vecCombSum = x1*dir.x + y1*dir.y;
      const vecCombDif = y1*dir.x - x1*dir.y;

      //se calculan las collisiones con todas los lados de todos los cuerpos seleccionados con el segmento del raycast
      for(var i=0; i<bodies.length; i++){
          if(bodies[i] != null && SuperiorQuery.superiorCircleSector( x1, y1, dir, vecSquareSum, vecCombSum, vecCombDif, bodies[i].position.x, bodies[i].position.y, 46)){
            //console.log("a");
            for(var j=0; j<bodies[i].parts.length; j++){
                var vertices = bodies[i].parts[j].vertices;
                var next = 0;
                for (var current=0; current<vertices.length; current++) {
                  next = (current+1) % vertices.length;

                  var hit = SuperiorQuery.superiorLineLineCollision(x1, y1, x1 + dir.x, y1 + dir.y, vertices[current].x, vertices[current].y, vertices[next].x, vertices[next].y);
                  if (hit.collided) {
                    var currentDistance = Math.sqrt(Math.pow(hit.colX - x1,2) + Math.pow(hit.colY - y1,2));
                    if(currentDistance < closestDistance){
                      closestDistance = currentDistance;
                      closestCollision.collided = true;
                      closestCollision.colX = hit.colX + indentationX;
                      closestCollision.colY = hit.colY + indentationY;
                      if(bodies[i].gameObject.parent != undefined /* || */){
                        closestCollision.colSpecialObj = bodies[i].gameObject.parent;
                      }
                      closestCollision.body = bodies[i];
                      closestCollision.vertex = current;
                      closestCollision.part = j;
                    }
                  }
                }
            }
          }
      }
      //se devuelve una clase especial para organizar la información de la colisión
      return closestCollision;
  }

  //clase para calcular punto de collision entre una linea y un cuerpo o array de cuerpos (devuelve la collisión más cercana al origen del raycast)
  static superiorRayCastMisile(x1, y1, dir, bodies){
      //console.log(bodies)
      var dir = new Phaser.Math.Vector2(dir.x, dir.y);
      //dir.scale(5000);
      var closestCollision = new ClosestBodyCollision();
      var closestDistance = Number.MAX_SAFE_INTEGER - 1;

      //variables auxiliares para optimizar el algoritmo
      const vecSquareSum = dir.x*dir.x + dir.y*dir.y;
      const vecCombSum = x1*dir.x + y1*dir.y;
      const vecCombDif = y1*dir.x - x1*dir.y;

      //se calculan las collisiones con todas los lados de todos los cuerpos seleccionados con el segmento del raycast
      for(var i=0; i<bodies.length; i++){
          if(bodies[i] != null && SuperiorQuery.superiorCircleSector( x1, y1, dir, vecSquareSum, vecCombSum, vecCombDif, bodies[i].position.x, bodies[i].position.y, 46)){
            //console.log("a");
            for(var j=0; j<bodies[i].parts.length; j++){
                var vertices = bodies[i].parts[j].vertices;
                var next = 0;
                for (var current=0; current<vertices.length; current++) {
                  next = (current+1) % vertices.length;

                  var hit = SuperiorQuery.superiorLineLineCollision(x1, y1, x1 + dir.x, y1 + dir.y, vertices[current].x, vertices[current].y, vertices[next].x, vertices[next].y);
                  if (hit.collided) {
                    var currentDistance = Math.sqrt(Math.pow(hit.colX - x1,2) + Math.pow(hit.colY - y1,2));
                    if(currentDistance < closestDistance){
                      closestDistance = currentDistance;
                      closestCollision.collided = true;
                      closestCollision.body = bodies[i];
                      closestCollision.vertex = current;
                      closestCollision.part = j;
                    }
                  }
                }
            }
          }
      }
      //se devuelve una clase especial para organizar la información de la colisión
      return closestCollision;
  }

  //metodo para ver que cuerpos se collisiona con un semisegmento que empieza en x y
  //esta optimizado al maximo ya que se invoca 1000-2000 veces por disparo, según el numero de cuerpos collisionables del nivel
  static superiorCircleSector(x, y, vec, vecSquareSum, vecCombSum, vecCombDif, cx, cy, cRad){
    //var d1 = (cx - vec.y*cRad - x)*vec.y - (cy + vec.x*cRad - y)*vec.x ;
    //var d2 = (cx + vec.y*cRad - x)*vec.y - (cy - vec.x*cRad - y)*vec.x ;
    const cxVecy = cx*vec.y;
    const cyVecx = cy*vec.x;
    if(((cxVecy-cyVecx-cRad*vecSquareSum+vecCombDif)*(cxVecy-cyVecx+cRad*vecSquareSum+vecCombDif)) <= 0 && (cx*vec.x + cy*vec.y + cRad*vecSquareSum - vecCombSum) >= 0)
      return true;
    return false;
  }

  //método imperfecto (para areas muy pequeñas y cuerpos muy grandes no funciona!)
  static superiorRegion(x, y , radius, bodies){
      var touchedBodies = [];
      if(bodies == undefined) return touchedBodies;
      for(var i=0; i<bodies.length; i++){
          if(bodies[i] != null){
            bodyLoop:
            for(var j=0; j<bodies[i].parts.length; j++){
                var vertices = bodies[i].parts[j].vertices;
                for (var current=0; current<vertices.length; current++) {
                    if(Math.pow(x-vertices[current].x,2) + Math.pow(y-vertices[current].y,2) <= radius*radius){
                      touchedBodies[touchedBodies.length] = bodies[i];
                      break bodyLoop;
                    }
                }
                if(Math.pow(x-bodies[i].parts[j].position.x,2) + Math.pow(y-bodies[i].parts[j].position.y,2) <= radius*radius){
                  touchedBodies[touchedBodies.length] = bodies[i];
                  break bodyLoop;
                }
            }
          }
      }
      return touchedBodies;
  }

  static superiorBoundBodyOverlap(x1, y1, x2, y2, body){
    return (x1 <= body.bounds.max.x && x2 >= body.bounds.min.x
          && y2 >= body.bounds.min.y && y1 <= body.bounds.max.y);
  }



  /*static superiorCircleAngle(cX,cY,cRad, spread, x,y , vec){
    //if(Math.sign(vecToOrigin.x) * Math.sign(vec.x) >= 0 || Math.sign(vecToOrigin.y) * Math.sign(vec.y) >= 0|| vecToOrigin.length <= cRad){
    if(Math.sqrt(Math.pow(cX-x,2) + Math.pow(cY-y,2)) <= cRad)
      return true;

    var rotatedVector = new Phaser.Math.Vector2(vec.x, vec.y);
    rotatedVector.x = Math.cos(vec.angle() + spread)*cRad;
    rotatedVector.y = Math.sin(vec.angle() + spread)*cRad;
    //var perpendicularVec = new Phaser.Math.Vector2(rotatedVector.y, -rotatedVector.x);
    var pointToConsider = new Phaser.Math.Vector2(cX + rotatedVector.y, cY -rotatedVector.x );
    if((Math.sign(pointToConsider.x - x) * Math.sign(vec.x)) < 0 && (Math.sign(pointToConsider.y - y) * Math.sign(vec.y)) < 0)
      return false;
    const d1 = (pointToConsider.x - x)*rotatedVector.y - (pointToConsider.y - y)*rotatedVector.x;

    rotatedVector.x = Math.cos(vec.angle() - spread)*cRad;
    rotatedVector.y = Math.sin(vec.angle() - spread)*cRad;
    pointToConsider.x = cX - rotatedVector.y;
    pointToConsider.y = cY + rotatedVector.x;
    if((Math.sign(pointToConsider.x - x) * Math.sign(vec.x)) < 0 && (Math.sign(pointToConsider.y - y) * Math.sign(vec.y)) < 0)
      return false;
    const d2 = (pointToConsider.x - x)*rotatedVector.y - (pointToConsider.y - y)*rotatedVector.x;

    if(d1 >= 0 && d2 <= 0)
      return true;
    return false;
  }*/

}

//clase auxiliar para la intersección de 2 segmentos
class ClosestLineCollision{
  constructor(){
    this.collided = false;
    this.colX = 0.0;
    this.colY = 0.0;
  }
}

//clase auxiliar para la collision de 2 segmentos
class ClosestBodyCollision{
  constructor(){
    this.collided = false;
    this.colSpecialObj = undefined;
    this.colX = 0.0;
    this.colY = 0.0;
    //this.part = undefined;
    //this.vertex = undefined;
  }
}
