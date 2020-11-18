import Audio from "../../Audio.js";

export default class LaserTrap {
  constructor(scene, x, y ){
    this.scene= scene;
    this.x= x;
    this.y= y;
    this.exists = true;

    //AUDIO
      this.sfx=Audio.play3DinstanceNoRate(this, 89);
    //
    this.scene.events.on("update", this.update, this);
  }

  //AUDIO
  update(time, delta){
    if(this!= undefined && Audio.waitForUpdate()){
        this.sfx.volume=Audio.volume3D(this)
    }
  }
  //

  distanceToPlayer(){
    if(this.scene.game.player == undefined || this.scene.game.player.sprite == undefined  || this.scene.game.player.sprite.body == undefined || !this.exists)
      return Number.MAX_SAFE_INTEGER;
    else
      return Math.sqrt(Math.pow(this.x - this.scene.game.player.sprite.x,2) + Math.pow(this.y - this.scene.game.player.sprite.y,2));
  }

  destroy(){
    if(this.sfx.isPlaying){
      this.sfx.stop();
    }
    this.exists = false;
  }

}
