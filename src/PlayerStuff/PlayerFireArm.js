import SuperiorQuery from "../SuperiorQuery.js";
import Bullet from "../Objects/Projectiles/Bullet.js";
import BulletBounce from "../Objects/Projectiles/BulletBounce.js";
import Bomb from "../Objects/Projectiles/Bomb.js";
import Megaton from "../Objects/Projectiles/Megaton.js";
import MultiMissile from "../Objects/Projectiles/MultiMissile.js";
import Missile from "../Objects/Projectiles/Missile.js";
import Audio from "../Audio.js";

export default class PlayerFireArm {
  constructor(scene, x, y){
      this.sprite = scene.add.sprite(x, y, 'playerFireArm', 0);
      this.scene = scene;
      this.cam = this.scene.cameras.main;

      this.sprite.setOrigin(0.05,0.5);
      this.sprite.setDepth(6);

      this.sprite.setScale(1.2);

      this.shoulderOffsetX = -4;
      this.shoulderOffsetY = -22;
      this.armDir = new Phaser.Math.Vector2(1, 1);
      this.fireArmActive = false;
      this.sprite.setActive(false).setVisible(false);

      //array de funciones de distintas armas
      this.fireWeaponFunctions = [];
      this.fireWeaponFunctions[0] = this.fireBullet;
      this.fireWeaponFunctions[1] = this.fireBomb;
  }

  //cambiar speed a array de weapons
  fireBullet(spr, damage, bulletSpread, bulletSpeed, bulletExpireTime){
      //AUDIO
        if(this.scene.game.player.weaponCounter==0){
          Audio.play2Dinstance(20);
        }else if(this.scene.game.player.weaponCounter==1){
          Audio.play2Dinstance(22);
        }else{
          Audio.play2Dinstance(21);
        }
      //
      this.armDir.normalize();
      const addedRandomAngle = (2*Math.random() - 1) * bulletSpread;
      this.armDir.x = Math.cos(this.armDir.angle() + addedRandomAngle);
      this.armDir.y = Math.sin(this.armDir.angle() + addedRandomAngle);
      var bulletCollision = SuperiorQuery.superiorRayCast(this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, this.armDir, 14, this.scene.bulletInteracBodies);
      if(bulletCollision.collided){
        var bulletDistance = Math.sqrt(Math.pow(bulletCollision.colX - this.sprite.x - this.armDir.x * 30,2) + Math.pow(bulletCollision.colY - this.sprite.y - this.armDir.y * 30,2));
        new Bullet(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, spr, damage, bulletSpeed, this.armDir, Math.min(bulletExpireTime,(bulletDistance * this.scene.matter.world.getDelta())/bulletSpeed), bulletCollision, bulletDistance);
      }else{
        new Bullet(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, spr, damage, bulletSpeed, this.armDir, bulletExpireTime, bulletCollision, -1);
      }
  }
  fireBulletFast(spr, damage, bulletSpread, bulletSpeed, bulletExpireTime){
      this.armDir.normalize();
      const addedRandomAngle = (2*Math.random() - 1) * bulletSpread;
      this.armDir.x = Math.cos(this.armDir.angle() + addedRandomAngle);
      this.armDir.y = Math.sin(this.armDir.angle() + addedRandomAngle);
      var bulletCollision = SuperiorQuery.superiorRayCast(this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, this.armDir, 14, this.scene.bulletInteracBodies);
      if(bulletCollision.collided){
        var bulletDistance = Math.sqrt(Math.pow(bulletCollision.colX - this.sprite.x - this.armDir.x * 30,2) + Math.pow(bulletCollision.colY - this.sprite.y - this.armDir.y * 30,2));
        new Bullet(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, spr, damage, bulletSpeed, this.armDir, Math.min(Math.max(25,bulletExpireTime,(bulletDistance * this.scene.matter.world.getDelta())/bulletSpeed)), bulletCollision, bulletDistance);
      }else{
        new Bullet(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, spr, damage, bulletSpeed, this.armDir, bulletExpireTime, bulletCollision, -1);
      }
  }
  fireBulletBounce(spr, damage, bounce, bulletSpread, bulletSpeed, bulletExpireTime){
      //AUDIO
        Audio.play2Dinstance(23);
      //
      this.armDir.normalize();
      const addedRandomAngle = (2*Math.random() - 1) * bulletSpread;
      this.armDir.x = Math.cos(this.armDir.angle() + addedRandomAngle);
      this.armDir.y = Math.sin(this.armDir.angle() + addedRandomAngle);
      var bulletCollision = SuperiorQuery.superiorRayCastBounce(this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, this.armDir, 14, this.scene.bulletInteracBodies);
      if(bulletCollision.collided){
        var bulletDistance = Math.sqrt(Math.pow(bulletCollision.colX - this.sprite.x - this.armDir.x * 30,2) + Math.pow(bulletCollision.colY - this.sprite.y - this.armDir.y * 30,2));
        new BulletBounce(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, spr, damage, bounce, bulletSpeed, this.armDir, Math.min(bulletExpireTime,(bulletDistance * this.scene.matter.world.getDelta())/bulletSpeed), bulletCollision, bulletDistance);
      }else{
        new BulletBounce(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, spr, damage, bounce, bulletSpeed, this.armDir, bulletExpireTime, bulletCollision, -1);
      }
  }
  fireBomb(spr, damage, bombArea, bombSpeed, bombExpireTime){
    //AUDIO
      Audio.play2Dinstance(24);
    //
    this.armDir.normalize();
    const xSpawn = this.sprite.x + this.armDir.x * 30;
    const ySpawn = this.sprite.y + this.armDir.y * 30;
    const dirVector = new Phaser.Math.Vector2(this.scene.input.activePointer.x + this.scene.cameras.main.scrollX -xSpawn, this.scene.input.activePointer.y + this.scene.cameras.main.scrollY-ySpawn);
    var bombProjectile = new Bomb(this.scene, xSpawn, ySpawn, spr, damage, bombArea, bombSpeed, dirVector, (this.armDir.x < 0)?-1:1, bombExpireTime);
    bombProjectile.armBomb();
  }
  fireMegaton(spr, damage, bombArea, extraEffect, bombSpeed, bombExpireTime){
    //AUDIO
      Audio.play2Dinstance(25);
    //
    this.armDir.normalize();
    const xSpawn = this.sprite.x + this.armDir.x * 30;
    const ySpawn = this.sprite.y + this.armDir.y * 30;
    const dirVector = new Phaser.Math.Vector2(this.scene.input.activePointer.x + this.scene.cameras.main.scrollX -xSpawn, this.scene.input.activePointer.y + this.scene.cameras.main.scrollY-ySpawn);
    var bombProjectile = new Megaton(this.scene, xSpawn, ySpawn, spr, damage, bombArea, extraEffect, bombSpeed, dirVector, (this.armDir.x < 0)?-1:1, bombExpireTime);
    bombProjectile.armBomb();
  }

  fireMissile(spr, damage, bombArea, autoAim, bombSpeed, bombExpireTime){
    //AUDIO
      Audio.play2Dinstance(26);
    //
    this.armDir.normalize();
    const xSpawn = this.sprite.x + this.armDir.x * 30;
    const ySpawn = this.sprite.y + this.armDir.y * 30;
    const dirVector = new Phaser.Math.Vector2(this.scene.input.activePointer.x + this.scene.cameras.main.scrollX -xSpawn, this.scene.input.activePointer.y + this.scene.cameras.main.scrollY-ySpawn);
    var bombProjectile = new Missile(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, spr, damage, bombArea, autoAim, bombSpeed, dirVector, (this.armDir.x < 0)?-1:1, bombExpireTime);
    bombProjectile.armBomb();
  }

  fireMulti(spr, damage, bombArea, offsprings, offspringScale, bombSpeed, bombExpireTime){
    //AUDIO
      Audio.play2Dinstance(27);
    //
    this.armDir.normalize();
    const xSpawn = this.sprite.x + this.armDir.x * 30;
    const ySpawn = this.sprite.y + this.armDir.y * 30;
    const dirVector = new Phaser.Math.Vector2(this.scene.input.activePointer.x + this.scene.cameras.main.scrollX -xSpawn, this.scene.input.activePointer.y + this.scene.cameras.main.scrollY-ySpawn);
    var bombProjectile = new MultiMissile(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, spr, damage, bombArea, offsprings, offspringScale, bombSpeed, dirVector, (this.armDir.x < 0)?-1:1, bombExpireTime);
    bombProjectile.armBomb();
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
