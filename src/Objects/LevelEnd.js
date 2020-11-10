
export default class LevelEnd {
  constructor(scene, x, y, spr){
    //inicializacion
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x,y,spr,0).setScale(3);
    this.sprite.body.isSensor = true;
    this.sprite.body.isStatic = true;
  }

  initGoal(keyNext, sceneNext){
    this.collisionTracker = this.scene.matterCollision.addOnCollideStart({         //si da problemas al colisonar con player añadir el resto de cuerpos de player al collider
    objectA: this.sprite.body,
    objectB: this.scene.game.player.mainBody,
    callback:() => (this.scene.game.transitionToScene(this.scene, keyNext, sceneNext), this.collisionTracker()),
    context: this
  });
  }
}
