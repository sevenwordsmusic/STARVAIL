import PlayerFireArm from "./PlayerFireArm.js";

export default class PlayerFireArmMobile extends PlayerFireArm{
  constructor(scene, x, y){
    super(scene,x,y)
    this.afterActive = 100 * this.scene.matter.world.getDelta();
  }

  update(time, delta){
      this.sprite.x = this.scene.game.player.sprite.x + this.shoulderOffsetX;
      this.sprite.y = this.scene.game.player.sprite.y + this.shoulderOffsetY;
  }

  enableFireArm(){
    this.scene.events.on("update", this.update, this);
    this.sprite.setActive(true).setVisible(true);
    this.fireArmActive = true;
    this.update();
  }
  disableFireArm(){
    this.scene.events.off("update", this.update, this);
    this.sprite.setActive(false).setVisible(false);
    this.fireArmActive = false;
  }
  changeCrosshairSpr(){
  }

  fireBullet(bulletSpeed = 30, bulletExpireTime = 1000){
    this.armDir.x = this.scene.input.activePointer.x + this.cam.scrollX - (this.scene.game.player.sprite.x + this.shoulderOffsetX);
    this.armDir.y = this.scene.input.activePointer.y + this.cam.scrollY - (this.scene.game.player.sprite.y + this.shoulderOffsetY);
    this.sprite.angle = this.armDir.angle() * 180/Math.PI - 90;
    super.fireBullet(bulletSpeed, bulletExpireTime);
  }

  fireBomb(){
    this.armDir.x = this.scene.input.activePointer.x + this.cam.scrollX - (this.scene.game.player.sprite.x + this.shoulderOffsetX);
    this.armDir.y = this.scene.input.activePointer.y + this.cam.scrollY - (this.scene.game.player.sprite.y + this.shoulderOffsetY);
    this.sprite.angle = this.armDir.angle() * 180/Math.PI - 90;
    super.fireBomb();
  }
}
