import Audio from "../Audio.js"
export default class LevelEnd {
  constructor(scene, x, y, spr){
    //inicializacion
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x,y,spr,0).setScale(20, 3);

    this.sprite.body.isSensor = true;
    this.sprite.body.isStatic = true;
    this.sprite.setVisible(false);
    this.giveBomb = false;

    scene.add.sprite(x,y-110,"goalVFX",0).setScale(6.00).setDepth(-15).anims.play("goalVFX", true);
  }

  initGoal(keyNext, sceneNext, updateLife = true){
    this.updateLife = updateLife;
    this.collisionTracker = this.scene.matterCollision.addOnCollideStart({         //si da problemas al colisonar con player añadir el resto de cuerpos de player al collider
      objectA: this.sprite.body,
      objectB: this.scene.game.player.mainBody,
      callback:() => (this.goToLevel(this.scene, keyNext, sceneNext)),
      context: this
  });
  }

  goToLevel(scene, keyNext, sceneNext){
    if(this.updateLife)
      this.updatePlayerLife();
    if(this.giveBomb){
      if(this.scene.game.player.nextButton <= 1){
        //AUDIO
          Audio.play2DinstanceRate(81, 1.0);
        //
        this.scene.game.obtainedWeapons.push(4);
        this.scene.game.player.recieveWeapon(4);
      }
    }
    this.scene.game.transitionToScene(this.scene, keyNext, sceneNext);
    this.collisionTracker();
  }

  updatePlayerLife(){
    this.scene.game.currentPlayerHp = this.scene.game.player.hp;
  }

  enableGiveBomb(){
    this.giveBomb = true;
  }
}
