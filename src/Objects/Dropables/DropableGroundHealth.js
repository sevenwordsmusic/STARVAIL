import DropableGround from "./DropableGround.js";
import Audio from "../../Audio.js";
export default class DropableGroundHealth extends DropableGround{
  constructor(scene, x, y, dir, hp){
    super(scene, x, y, 'drop', 10000);
    this.hp = hp;
    this.bounce(1.51, dir, 10, 0.5);
    this.sprite.setFrame(0);
    this.sprite.setScale(Phaser.Math.Clamp((hp/100),1,2.5));
  }

  dropablePicked(drop){
    //AUDIO
      Audio.play3DinstanceNoRate(this,69);
    //
    this.scene.game.player.playerGainHealth(Math.min(this.hp, this.scene.game.totalPlayerHp-this.scene.game.player.hp));
    super.dropablePicked(drop);
  }

  dropableExpire(drop){
    super.dropableExpire(drop);
  }

  distanceToPlayer(){
    if(this.sprite != undefined)
      return Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2));
    else
      return 1000;    //ARREGLAR ESTO
  }
  
}
