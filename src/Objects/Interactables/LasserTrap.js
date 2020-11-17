import Audio from "../../Audio.js";

export default class LasserTrap {
  constructor(scene, x, y ){
    this.scene= scene;
    this.x= x;
    this.y= y;

    //AUDIO
      this.sfx=Audio.play3Dinstance(this, 89);
    //
    this.scene.events.on("update", this.update, this);
  }

  //AUDIO
  update(time, delta){
    if(this.sprite!= undefined ){
        this.sfx.volume=Audio.volume3D(this)
    }
  }
  //

  distanceToPlayer(){
    if(this != undefined)
      return Math.sqrt(Math.pow(this.x - this.scene.game.player.sprite.x,2) + Math.pow(this.y - this.scene.game.player.sprite.y,2));
    else
      return 512;    //ARREGLAR ESTO
  }

}
