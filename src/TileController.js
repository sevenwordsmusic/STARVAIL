//clase que se encarga de gestionar el filtrado de collisiones y el boundry box del player
export default class TileController {
  constructor(){
  }

  //categoria disponible por ser usada por proximo enemigos que entre en pantalla
  static category = 32768;

  //preparar sprite de enemigo cuando entra en pantalla
  static enableEnemy(enemySpr){
    enemySpr.body.isSleeping = false;
    enemySpr.body.collisionFilter.mask = 1;
    TileController.requestCategory()
    enemySpr.body.collisionFilter.category = TileController.category;
    enemySpr.setVisible(true);
  }

  //preparar sprite de enemigo cuando sale en pantalla
  static disableEnemy(enemySpr){
    enemySpr.body.isSleeping = true;
    enemySpr.body.collisionFilter.mask = 0;
    TileController.releaseCategory();
    enemySpr.setVisible(false);
  }

  //pide categoria siguiente para ponersela a un enemigo que entra en pantalla
  static requestCategory(){
    if(TileController.category >= 1073741824)
      TileController.category = 4;
    else
      TileController.category  = TileController.category << 1;
  }
  //suelta una categoria cuando un enemigo sale de pantalla
  static releaseCategory(){
    if(TileController.category <= 4)
      TileController.category = 1073741824;
    else
      TileController.category  = TileController.category >> 1;
  }

  //preparar un tile cuando entra en pantalla
  static enableTileBody(body){
    body.body.isSleeping = false;
    body.body.collisionFilter.mask = 1;
    body.active = true;
    body.body.gameObject.tile.setVisible(true);
  }

  //preparar un tile cuando sale de pantalla
  static disableTileBody(body){
    body.body.isSleeping = true;
    body.body.collisionFilter.mask = 0;
    body.active = false;
    body.body.gameObject.tile.setVisible(false);
  }

  //resetear tile al final de cada update
  static resetTileBody(tileBody){
    tileBody.body.collisionFilter.mask = 1;
    //tileBody.body.gameObject.tile.setVisible(false);
  }

  //modifica la mascara de tileBody añadiendole la categoria del enemigo que esta collisionando con el
  static modifyTileBody(scene, tileBody, category){
    tileBody.body.collisionFilter.mask = tileBody.body.collisionFilter.mask|category;
    if(!tileBody.touched){
      tileBody.touched = true;
      scene.touchedTiles.push(tileBody);
      //tileBody.body.gameObject.tile.setVisible(true);
    }
  }

  //función para activar tiles con los que collisiona un sprite
  static enemyHalfTouchBoundry(scene, sprite, sideNum, verNum, verDisplace = 0){
    if(scene.tileBodyMatrix == undefined || scene.tileBodyMatrix[0] == undefined) return;
    var tileBody;
    for(var i=-sideNum; i<sideNum+1; i++){
      for(var j=0; j<verNum; j++){
        //scene.graphics.fillCircle(sprite.x + i*32 , sprite.y + j*32 + verDisplace, 2);
        tileBody  = scene.tileBodyMatrix[Math.floor((sprite.x+ i*32) / 32)][Math.floor((sprite.y + j*32 + verDisplace)/ 32)];
        if(tileBody != undefined){
          TileController.modifyTileBody(scene, tileBody, sprite.body.collisionFilter.category)
       }
      }
    }
    tileBody = undefined;
  }

  //función para activar tiles con los que collisiona un sprite
  static enemyFullTouchBoundry(scene, sprite, sideNum, verNum){
    if(scene.tileBodyMatrix == undefined || scene.tileBodyMatrix[0] == undefined) return;
    var tileBody;
    for(var i=-sideNum; i<sideNum+1; i++){
      for(var j=-verNum; j<verNum+1; j++){
        //scene.graphics.fillCircle(sprite.x + i*32 , sprite.y + j*32, 2);
        tileBody  = scene.tileBodyMatrix[Math.floor((sprite.x+ i*32) / 32)][Math.floor((sprite.y + j*32)/ 32)];
        if(tileBody != undefined){
          TileController.modifyTileBody(scene, tileBody, sprite.body.collisionFilter.category)
       }
      }
    }
    tileBody = undefined;
  }

  //función para activar tiles con los que collisiona un sprite
  static playerTouchBoundry(scene, sprite){
    if(scene.tileBodyMatrix == undefined || scene.tileBodyMatrix[0] == undefined || sprite == undefined || sprite.body == undefined) return;
    var tileBody;
    for(var i=-1; i<2; i++){
      for(var j=-2; j<3; j++){
        //scene.graphics.fillCircle(sprite.x + i*32 , sprite.y + j*32 - 6, 2);
        tileBody  = scene.tileBodyMatrix[Math.floor((sprite.x+ i*32) / 32)][Math.floor((sprite.y + j*32 - 6)/ 32)];
        if(tileBody != undefined){
          TileController.modifyTileBody(scene, tileBody, sprite.body.collisionFilter.category)
       }
      }
    }
    tileBody = undefined;
  }

  //va desactivando tiles que se alejan del jugador y activando tiles que se le acercan en X
  static xFrontiers(scene, dir, boundry, xNormalized, yNormalized){
    if(scene.tileBodyMatrix == undefined || scene.tileBodyMatrix[0] == undefined) return;
    const xBoundry = boundry*dir;
    const yBoundry = boundry + 1; //7+2
    var bodyWAdd;
    var bodyWRemove;

    const xAdd = xNormalized + xBoundry;
    const xRemove = xNormalized - xBoundry - 2*dir;
    for(var j=-yBoundry; j<yBoundry+1; j++){
      bodyWAdd = scene.tileBodyMatrix[xAdd][yNormalized +j];
      bodyWRemove = scene.tileBodyMatrix[xRemove][yNormalized +j];
      if(bodyWAdd != undefined && !bodyWAdd.active){
        TileController.enableTileBody(bodyWAdd);
      }
      if(bodyWRemove != undefined && bodyWRemove.active){
        TileController.disableTileBody(bodyWRemove);
      }
    }
    bodyWRemove = scene.tileBodyMatrix[xRemove][yNormalized  - yBoundry - 1];
    if(bodyWRemove != undefined && bodyWRemove.active){
      TileController.disableTileBody(bodyWRemove);
    }
    bodyWRemove = scene.tileBodyMatrix[xRemove][yNormalized  + yBoundry + 1];
    if(bodyWRemove != undefined && bodyWRemove.active){
      TileController.disableTileBody(bodyWRemove);
    }
    bodyWAdd = undefined;
    bodyWRemove = undefined;
  }

  //va desactivando tiles que se alejan del jugador y activando tiles que se le acercan en Y
  static yFrontiers(scene, dir, boundry, xNormalized, yNormalized){
    if(scene.tileBodyMatrix == undefined || scene.tileBodyMatrix[0] == undefined) return;
    const xBoundry = boundry + 1; //7+2
    const yBoundry = boundry*dir;
    var bodyWAdd;
    var bodyWRemove;

    const yAdd = yNormalized + yBoundry;
    const yRemove = yNormalized - yBoundry - 2*dir;
    for(var i=-xBoundry; i<xBoundry+1; i++){
      bodyWAdd = scene.tileBodyMatrix[xNormalized + i][yAdd];
      bodyWRemove = scene.tileBodyMatrix[xNormalized + i][yRemove];
      if(bodyWAdd != null && !bodyWAdd.active){
        TileController.enableTileBody(bodyWAdd);
      }
      if(bodyWRemove != null && bodyWRemove.active){
        TileController.disableTileBody(bodyWRemove);
      }
    }
    bodyWRemove = scene.tileBodyMatrix[xNormalized - xBoundry - 1][yRemove];
    if(bodyWRemove != null && bodyWRemove.active){
      TileController.disableTileBody(bodyWRemove);
    }
    bodyWRemove = scene.tileBodyMatrix[xNormalized + xBoundry + 1][yRemove];
    if(bodyWRemove != null && bodyWRemove.active){
      TileController.disableTileBody(bodyWRemove);
    }
    bodyWAdd = undefined;
    bodyWRemove = undefined;
  }
}
