import Bomb from "../Objects/Bomb.js";
import Bullet from "../Objects/Bullet.js";
import SuperiorQuery from "../SuperiorQuery.js";

export default class PlayerFireArm {
  constructor(scene, x, y){
      this.sprite = scene.add.sprite(x, y, 'playerFireArm', 0);
      this.scene = scene;
      this.cam = this.scene.cameras.main;

      this.spread = 0.1;

      this.sprite.setOrigin(0.5,0.05);
      this.sprite.setDepth(6);

      this.shoulderOffsetX = -5;
      this.shoulderOffsetY = -this.scene.game.player.sprite.height/2 + 25;
      this.armDir = new Phaser.Math.Vector2(this.scene.input.activePointer.x + this.cam.scrollX - this.sprite.x, this.scene.input.activePointer.y + this.cam.scrollY - this.sprite.y);
      this.armDir.normalize();

      this.sprite.setScale(0.3, 0.25);
      this.fireArmActive = false;
      this.sprite.setActive(false).setVisible(false);
  }

  fireBullet(bulletSpeed = 30, bulletExpireTime = 1000){
      this.armDir.normalize();
      const addedRandomAngle = (2*Math.random() - 1) * this.spread;
      this.armDir.x = Math.cos(this.armDir.angle() + addedRandomAngle);
      this.armDir.y = Math.sin(this.armDir.angle() + addedRandomAngle);
      var bulletCollision = SuperiorQuery.superiorRayCast(this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, this.armDir, 14, this.scene.bulletInteracBodies);
      if(bulletCollision.collided){
        var bulletDistance = Math.sqrt(Math.pow(bulletCollision.colX - this.sprite.x - this.armDir.x * 30,2) + Math.pow(bulletCollision.colY - this.sprite.y - this.armDir.y * 30,2));
        return new Bullet(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, bulletSpeed, this.armDir, Math.min(bulletExpireTime,(bulletDistance * this.scene.matter.world.getDelta())/bulletSpeed), bulletCollision);
      }else{
        return new Bullet(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, bulletSpeed, this.armDir, bulletExpireTime, bulletCollision);
      }
  }

  fireBomb(){
    this.armDir.normalize();
    return new Bomb(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, (this.scene.input.activePointer.x < this.scene.game.player.sprite.x)?-1:1);
  }

  fireWeaponProjectile(wNumber){
    switch(wNumber){
      case 0:
        this.fireBullet();
      break;
      case 1:
        this.fireBomb();
      break;
      default:
        console.log("no weapon");
      break;
    }
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
