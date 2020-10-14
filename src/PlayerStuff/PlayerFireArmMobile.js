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
  destroyFireArm(){
    this.scene.events.off("update", this.update, this);
    this.sprite.destroy();
  }
  changeCrosshairSpr(){
  }

  fireBullet(bulletSpeed, bulletExpireTime){
    this.armDir.x = this.scene.game.player.firingPointer.x + this.cam.scrollX - (this.scene.game.player.sprite.x + this.shoulderOffsetX);
    this.armDir.y = this.scene.game.player.firingPointer.y + this.cam.scrollY - (this.scene.game.player.sprite.y + this.shoulderOffsetY);
    this.sprite.angle = this.armDir.angle() * 180/Math.PI;
    super.fireBullet(bulletSpeed, bulletExpireTime);
  }

  fireBomb(bombSpeed, dir, bombExpireTime){
    this.armDir.x = this.scene.game.player.firingPointer.x + this.cam.scrollX - (this.scene.game.player.sprite.x + this.shoulderOffsetX);
    this.armDir.y = this.scene.game.player.firingPointer.y + this.cam.scrollY - (this.scene.game.player.sprite.y + this.shoulderOffsetY);
    this.sprite.angle = this.armDir.angle() * 180/Math.PI;
    super.fireBomb(bombSpeed, dir, bombExpireTime);
  }
}
