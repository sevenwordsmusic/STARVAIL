import Bomb from "../Objects/Projectiles/Bomb.js";
import Bullet from "../Objects/Projectiles/Bullet.js";
import SuperiorQuery from "../SuperiorQuery.js";
import Audio from "../Audio.js";

export default class PlayerFireArm {
  constructor(scene, x, y){
      this.sprite = scene.add.sprite(x, y, 'playerFireArm', 0);
      this.scene = scene;
      this.cam = this.scene.cameras.main;

      this.spread = 0.1;

      this.sprite.setOrigin(0.05,0.5);
      this.sprite.setDepth(6);

      this.sprite.setScale(1.2);

      this.shoulderOffsetX = -4;
      this.shoulderOffsetY = -22;
      this.armDir = new Phaser.Math.Vector2(1, 1);
      this.fireArmActive = false;
      this.sprite.setActive(false).setVisible(false);
  }

  //cambiar speed a array de weapons
  fireBullet(bulletSpeed, bulletExpireTime){
      //AUDIO_BALAEXPLOSIVA_Shot
      Audio.playRate(Audio.load.shot_00,0.95+(Math.random() * 0.1));
      //
      this.armDir.normalize();
      const addedRandomAngle = (2*Math.random() - 1) * this.spread;
      this.armDir.x = Math.cos(this.armDir.angle() + addedRandomAngle);
      this.armDir.y = Math.sin(this.armDir.angle() + addedRandomAngle);
      var bulletCollision = SuperiorQuery.superiorRayCast(this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, this.armDir, 14, this.scene.bulletInteracBodies);
      if(bulletCollision.collided){
        var bulletDistance = Math.sqrt(Math.pow(bulletCollision.colX - this.sprite.x - this.armDir.x * 30,2) + Math.pow(bulletCollision.colY - this.sprite.y - this.armDir.y * 30,2));
        return new Bullet(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, bulletSpeed, this.armDir, Math.min(bulletExpireTime,(bulletDistance * this.scene.matter.world.getDelta())/bulletSpeed), bulletCollision, bulletDistance);
      }else{
        return new Bullet(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, bulletSpeed, this.armDir, bulletExpireTime, bulletCollision, -1);
      }

  }

  fireBomb(bombSpeed, bombExpireTime){
    //AUDIO_BOMBA_Shot
    Audio.playRate(Audio.load.shot_01,0.875+(Math.random() * 0.25));
    this.armDir.normalize();
    return new Bomb(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, bombSpeed, (this.armDir.x < 0)?-1:1, bombExpireTime);
  }

  adjustOffset(xOff, yOff){
    this.shoulderOffsetX = xOff;
    this.shoulderOffsetY = yOff;
  }

  flipOffset(dir){
    this.shoulderOffsetX = this.shoulderOffsetX * dir;
  }

  /*setFireArmState(state){
    switch(state){
      case 0:
        this.scene.events.off("update", this.update, this);
        this.crosshairSpr.setActive(false).setVisible(false);
        this.sprite.setActive(false).setVisible(false);
        this.graphics.clear();
      break;
      case 1:
        this.crosshairSpr.tint = 0x666666
        this.graphics.setDefaultStyles({ fillStyle: { color: 0x666666}});
        this.sprite.setActive(false).setVisible(false);
      break;
      case 2:
        if(!this.crosshairSpr.active){
          this.scene.events.on("update", this.update, this);
          this.crosshairSpr.setActive(true).setVisible(true);
        }
        this.sprite.setActive(true).setVisible(true);
        this.crosshairSpr.tint = 0xff0000;
        this.graphics.setDefaultStyles({ fillStyle: { color: 0xff0000}});
      break;
      default:
        console.log("??");
      break;
    }
    this.fireArmState = state;
  }*/



}
