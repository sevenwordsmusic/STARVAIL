
export default class TileController {
  constructor(){
  }

  static category = 32768;

  static enableEnemy(enemySpr){
    enemySpr.body.isSleeping = false;
    enemySpr.body.collisionFilter.mask = 1;
    TileController.requestCategory()
    enemySpr.body.collisionFilter.category = TileController.category;
    enemySpr.setVisible(true);
  }

  static disableEnemy(enemySpr){
    enemySpr.body.isSleeping = true;
    enemySpr.body.collisionFilter.mask = 0;
    TileController.releaseCategory();
    enemySpr.setVisible(false);
  }

  static requestCategory(){
    if(TileController.category >= 1073741824)
      TileController.category = 4;
    else
      TileController.category  = TileController.category << 1;
  }
  static releaseCategory(){
    if(TileController.category <= 4)
      TileController.category = 1073741824;
    else
      TileController.category  = TileController.category >> 1;
  }

  static enableTileBody(body){
    body.body.isSleeping = false;
    body.body.collisionFilter.mask = 1;
    body.active = true;
    body.body.gameObject.tile.setVisible(true);
  }

  static disableTileBody(body){
    body.body.isSleeping = true;
    body.body.collisionFilter.mask = 0;
    body.active = false;
    body.body.gameObject.tile.setVisible(false);
  }

  static resetTileBody(tileBody){
    tileBody.body.collisionFilter.mask = 1;
    //tileBody.body.gameObject.tile.setVisible(false);
  }

  static modifyTileBody(scene, tileBody, category){
    tileBody.body.collisionFilter.mask = tileBody.body.collisionFilter.mask|category;
    if(!tileBody.touched){
      tileBody.touched = true;
      scene.touchedTiles.push(tileBody);
      //tileBody.body.gameObject.tile.setVisible(true);
    }
  }

  static enemyHalfTouchBoundry(scene, sprite, sideNum, verNum, verDisplace = 0){
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
  }

  static enemyFullTouchBoundry(scene, sprite, sideNum, verNum){
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
  }

  static playerTouchBoundry(scene, sprite){
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

  static xFrontiers(scene, dir, boundry, xNormalized, yNormalized){
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

  static yFrontiers(scene, dir, boundry, xNormalized, yNormalized){
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
