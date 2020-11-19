import Audio from "../../Audio.js";

//emisor de sonido para los laseres
export default class LaserTrap {
  static lasserTrapCount=0;
  constructor(scene, x, y ){
    //inicializacion
    this.scene= scene;
    this.x= x;
    this.y= y;
    this.exists = true;

    //AUDIO
      this.sfx=Audio.soundInstance[89][LaserTrap.lasserTrapCount];
      this.sfx.play();
      LaserTrap.lasserTrapCount++;
      if(LaserTrap.lasserTrapCount==Audio.soundInstance[89].length){
        LaserTrap.lasserTrapCount=0;
      }
    //
    this.scene.events.on("update", this.update, this);
  }

  //AUDIO
  update(time, delta){
    if(this!= undefined && !Audio.waitForUpdate()){
        this.sfx.volume=Audio.volume3D(this);
    }
  }
  //
  //distancia al jugador
  distanceToPlayer(){
    if(this.scene.game.player == undefined || this.scene.game.player.sprite == undefined  || this.scene.game.player.sprite.body == undefined || !this.exists)
      return Number.MAX_SAFE_INTEGER;
    else
      return Math.sqrt(Math.pow(this.x - this.scene.game.player.sprite.x,2) + Math.pow(this.y - this.scene.game.player.sprite.y,2));
  }

  //destruir objeto
  destroy(){
    if(this.sfx.isPlaying){
      this.sfx.stop();
    }
    this.exists = false;
  }

}
