import SuperiorQuery from "../SuperiorQuery.js";
import Bullet from "../Objects/Projectiles/PlayerProjectiles/Bullet.js";
import BulletFast from "../Objects/Projectiles/PlayerProjectiles/BulletFast.js";
import BulletBounce from "../Objects/Projectiles/PlayerProjectiles/BulletBounce.js";
import BulletExplosive from "../Objects/Projectiles/PlayerProjectiles/BulletExplosive.js";
import Bomb from "../Objects/Projectiles/PlayerProjectiles/Bomb.js";
import Megaton from "../Objects/Projectiles/PlayerProjectiles/Megaton.js";
import MultiMissile from "../Objects/Projectiles/PlayerProjectiles/MultiMissile.js";
import Missile from "../Objects/Projectiles/PlayerProjectiles/Missile.js";
import Enemy from "../Enemies/Enemy.js";
import Audio from "../Audio.js";

export default class PlayerFireArm {
  constructor(scene, x, y){
      this.sprite = scene.add.sprite(x, y, 'playerFireArm', 0);
      this.scene = scene;
      this.cam = this.scene.cameras.main;

      this.sprite.setOrigin(0.05,0.5);
      this.sprite.setDepth(6);

      this.sprite.setScale(this.scene.game.player.sprite.scale);

      this.shoulderOffsetX = -4;
      this.shoulderOffsetY = -22;
      this.armDir = new Phaser.Math.Vector2(1, 1);
      this.fireArmActive = false;
      this.sprite.setActive(false).setVisible(false);

      /*//array de funciones de distintas armas
      this.fireWeaponFunctions = [];
      this.fireWeaponFunctions[0] = this.fireBullet;
      this.fireWeaponFunctions[1] = this.fireBomb;*/

      this.laser = scene.add.sprite(x,y, 'laser', 0);
      this.laser.setTint('0x19b6ff');
      this.laserHeight = this.laser.frame.height;
      this.laser.setScale(0.65, 1).setOrigin(0.5, 0.01);
      this.laser.anims.play('laser', true);

      this.laserSmoke = scene.add.sprite(x,y, 'smoke', 0);
      this.laserSmoke.setScale(0.75).setOrigin(0.5, 0.8);
      this.laserSmoke.anims.play('smoke', true);

      this.armExtnension = 40;

      this.disengageLaser();

      //AUDIO
      this.sfx;
      this.sfxLasser;
      //
  }

  //cambiar speed a array de weapons
  fireBullet(spr, damage, bulletSpread, bulletSpeed, bulletExpireTime){
      //AUDIO
      Audio.play2Dinstance(20);
      //
      this.armDir.normalize();
      const addedRandomAngle = (2*Math.random() - 1) * bulletSpread;
      this.armDir.x = Math.cos(this.armDir.angle() + addedRandomAngle);
      this.armDir.y = Math.sin(this.armDir.angle() + addedRandomAngle);
      const bulletCollision = SuperiorQuery.superiorRayCast(this.sprite.x + this.armDir.x * this.armExtnension, this.sprite.y + this.armDir.y * this.armExtnension, this.armDir, 14, this.scene.bulletInteracBodies);
      if(bulletCollision.collided){
        const bulletDistance = Math.sqrt(Math.pow(bulletCollision.colX - this.sprite.x - this.armDir.x * this.armExtnension,2) + Math.pow(bulletCollision.colY - this.sprite.y - this.armDir.y * this.armExtnension,2));
        new Bullet(this.scene, this.sprite.x + this.armDir.x * this.armExtnension, this.sprite.y + this.armDir.y * this.armExtnension, spr, damage, bulletSpeed, this.armDir, Math.min(bulletExpireTime,(bulletDistance * this.scene.matter.world.getDelta())/bulletSpeed), bulletCollision, bulletDistance);
      }else{
        new Bullet(this.scene, this.sprite.x + this.armDir.x * this.armExtnension, this.sprite.y + this.armDir.y * this.armExtnension, spr, damage, bulletSpeed, this.armDir, bulletExpireTime, bulletCollision, -1);
      }
  }
  fireBulletFast(spr, damage, bulletSpread, bulletSpeed, bulletExpireTime){
      //AUDIO
      Audio.play2Dinstance(21);
      //
      this.armDir.normalize();
      const addedRandomAngle = (2*Math.random() - 1) * bulletSpread;
      this.armDir.x = Math.cos(this.armDir.angle() + addedRandomAngle);
      this.armDir.y = Math.sin(this.armDir.angle() + addedRandomAngle);
      const bulletCollision = SuperiorQuery.superiorRayCast(this.sprite.x + this.armDir.x * this.armExtnension, this.sprite.y + this.armDir.y * this.armExtnension, this.armDir, 4, this.scene.bulletInteracBodies);
      if(bulletCollision.collided){
        const bulletDistance = Math.sqrt(Math.pow(bulletCollision.colX - this.sprite.x - this.armDir.x * this.armExtnension,2) + Math.pow(bulletCollision.colY - this.sprite.y - this.armDir.y * this.armExtnension,2));
        new BulletFast(this.scene, this.sprite.x + this.armDir.x * this.armExtnension, this.sprite.y + this.armDir.y * this.armExtnension, spr, damage, bulletSpeed, this.armDir, Math.min(bulletExpireTime,(bulletDistance * this.scene.matter.world.getDelta())/bulletSpeed) + 7, bulletCollision, bulletDistance);
      }else{
        new BulletFast(this.scene, this.sprite.x + this.armDir.x * this.armExtnension, this.sprite.y + this.armDir.y * this.armExtnension, spr, damage, bulletSpeed, this.armDir, bulletExpireTime, bulletCollision, -1);
      }
  }
  fireBulletExplosive(spr, damage, knockback, bulletSpread, bulletSpeed, bulletExpireTime){
      //AUDIO
      Audio.play2Dinstance(22);
      //
      this.armDir.normalize();
      const addedRandomAngle = (2*Math.random() - 1) * bulletSpread;
      this.armDir.x = Math.cos(this.armDir.angle() + addedRandomAngle);
      this.armDir.y = Math.sin(this.armDir.angle() + addedRandomAngle);
      const bulletCollision = SuperiorQuery.superiorRayCast(this.sprite.x + this.armDir.x * this.armExtnension, this.sprite.y + this.armDir.y * this.armExtnension, this.armDir, 16, this.scene.bulletInteracBodies);
      if(bulletCollision.collided){
        const bulletDistance = Math.sqrt(Math.pow(bulletCollision.colX - this.sprite.x - this.armDir.x * this.armExtnension,2) + Math.pow(bulletCollision.colY - this.sprite.y - this.armDir.y * this.armExtnension,2));
        new BulletExplosive(this.scene, this.sprite.x + this.armDir.x * this.armExtnension, this.sprite.y + this.armDir.y * this.armExtnension, spr, damage, knockback, bulletSpeed, this.armDir, Math.min(bulletExpireTime,(bulletDistance * this.scene.matter.world.getDelta())/bulletSpeed), bulletCollision, bulletDistance);
      }else{
        new BulletExplosive(this.scene, this.sprite.x + this.armDir.x * this.armExtnension, this.sprite.y + this.armDir.y * this.armExtnension, spr, damage, knockback, bulletSpeed, this.armDir, bulletExpireTime, bulletCollision, -1);
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
      const bulletCollision = SuperiorQuery.superiorRayCastBounce(this.sprite.x + this.armDir.x * this.armExtnension, this.sprite.y + this.armDir.y * this.armExtnension, this.armDir, 14, this.scene.bulletInteracBodies);
      if(bulletCollision.collided){
        const bulletDistance = Math.sqrt(Math.pow(bulletCollision.colX - this.sprite.x - this.armDir.x * this.armExtnension,2) + Math.pow(bulletCollision.colY - this.sprite.y - this.armDir.y * this.armExtnension,2));
        new BulletBounce(this.scene, this.sprite.x + this.armDir.x * this.armExtnension, this.sprite.y + this.armDir.y * this.armExtnension, spr, damage, bounce, bulletSpeed, this.armDir, Math.min(bulletExpireTime,(bulletDistance * this.scene.matter.world.getDelta())/bulletSpeed), bulletCollision, bulletDistance);
      }else{
        new BulletBounce(this.scene, this.sprite.x + this.armDir.x * this.armExtnension, this.sprite.y + this.armDir.y * this.armExtnension, spr, damage, bounce, bulletSpeed, this.armDir, bulletExpireTime, bulletCollision, -1);
      }
  }
  fireLasser(damage){
      this.laser.setVisible(true);
      this.laser.angle = this.armDir.angle()*180/Math.PI - 90;
      this.laser.x = this.sprite.x + this.armDir.x/2;
      this.laser.y = this.sprite.y + this.armDir.y/2;
      this.armDir.normalize();
      this.laser.x += this.armDir.x * this.armExtnension;
      this.laser.y += this.armDir.y * this.armExtnension;
      var laserCollision = SuperiorQuery.superiorRayCast(this.sprite.x + this.armDir.x * this.armExtnension, this.sprite.y + this.armDir.y * this.armExtnension, this.armDir, 14, this.scene.bulletInteracBodies);
      if(laserCollision.collided){
        const laserDistance = Math.sqrt(Math.pow(laserCollision.colX - this.sprite.x - this.armDir.x * this.armExtnension,2) + Math.pow(laserCollision.colY - this.sprite.y - this.armDir.y * this.armExtnension,2));

        this.laserSmoke.x = laserCollision.colX - this.armDir.x*6;
        this.laserSmoke.y = laserCollision.colY - this.armDir.y*6;

        for(var i=0; i<this.laser.anims.currentAnim.frames.length; i++){
          this.laser.anims.currentAnim.frames[i].frame.cutHeight = Math.min(laserDistance, this.laserHeight);
        }
        if(laserCollision.colSpecialObj !== undefined && Object.getPrototypeOf(laserCollision.colSpecialObj.constructor) === Enemy){
          laserCollision.colSpecialObj.damageLaser(damage, this.armDir);
          //AUDIO
            if(this.sfxLasser!= undefined){
              this.sfxLasser.volume = Audio.volume2D(laserDistance);
            }
          //
        }else{
          //AUDIO
            if(this.sfxLasser!= undefined){
            this.sfxLasser.volume = 0.0;
            }
          //
        }
        //AUDIO
          if(this.sfx!= undefined){
            this.sfx.volume = Audio.volume2D(laserDistance);
          }
        //
      }else{
        this.laserSmoke.x = -9999;
        this.laserSmoke.y = -9999;

        for(var i=0; i<this.laser.anims.currentAnim.frames.length; i++){
          this.laser.anims.currentAnim.frames[i].frame.cutHeight = this.laserHeight;
        }

        //AUDIO
          if(this.sfx!= undefined){
            this.sfx.volume = 0.0;
          }
        //
      }
  }
  engageLaser(){
      this.laserSmoke.anims.resume();
      this.laser.setVisible(true);
      this.laser.anims.resume();
      this.laserSmoke.setVisible(true);
      //AUDIO
        this.sfx= Audio.lasserLoopSwitch(true);
        this.sfxLasser= Audio.lasserSufferingLoopSwitch(true);
      //
  }
  disengageLaser(){
      this.laser.anims.pause();
      this.laserSmoke.setVisible(false);
      this.laserSmoke.anims.pause();
      this.laser.setVisible(false);
      this.laserSmoke.x = -9999
      this.laserSmoke.y = -9999
      //AUDIO
        Audio.lasserLoopSwitch(false);
        Audio.lasserSufferingLoopSwitch(false);
      //
  }
  fireBomb(spr, damage, bombArea, knockback, bombSpeed, bombExpireTime){
    //AUDIO
    Audio.play2Dinstance(24);
    this.armDir.normalize();
    const xSpawn = this.sprite.x + this.armDir.x * (this.armExtnension-10);
    const ySpawn = this.sprite.y + this.armDir.y * (this.armExtnension-10);
    const dirVector = new Phaser.Math.Vector2(this.scene.input.activePointer.x + this.scene.cameras.main.scrollX -xSpawn, this.scene.input.activePointer.y + this.scene.cameras.main.scrollY-ySpawn);
    var bombProjectile = new Bomb(this.scene, xSpawn, ySpawn, spr, damage, bombArea, knockback, bombSpeed, dirVector, (this.armDir.x < 0)?-1:1, bombExpireTime, false);
    bombProjectile.armBomb();
  }
  fireMegaton(spr, damage, bombArea, knockback, extraEffect, bombSpeed, bombExpireTime){
    //AUDIO
    Audio.play2Dinstance(25);
    this.armDir.normalize();
    const xSpawn = this.sprite.x + this.armDir.x * (this.armExtnension-10);
    const ySpawn = this.sprite.y + this.armDir.y * (this.armExtnension-10);
    const dirVector = new Phaser.Math.Vector2(this.scene.input.activePointer.x + this.scene.cameras.main.scrollX -xSpawn, this.scene.input.activePointer.y + this.scene.cameras.main.scrollY-ySpawn);
    var bombProjectile = new Megaton(this.scene, xSpawn, ySpawn, spr, damage, bombArea, knockback, extraEffect, bombSpeed, dirVector, (this.armDir.x < 0)?-1:1, bombExpireTime);
    bombProjectile.armBomb();
  }

  fireMissile(spr, damage, bombArea, knockback, autoAim, bombSpeed, bombExpireTime){
    //AUDIO
    Audio.play2Dinstance(26);
    this.armDir.normalize();
    const xSpawn = this.sprite.x + this.armDir.x * (this.armExtnension-10);
    const ySpawn = this.sprite.y + this.armDir.y * (this.armExtnension-10);
    const dirVector = new Phaser.Math.Vector2(this.scene.input.activePointer.x + this.scene.cameras.main.scrollX -xSpawn, this.scene.input.activePointer.y + this.scene.cameras.main.scrollY-ySpawn);
    var bombProjectile = new Missile(this.scene, xSpawn, ySpawn, spr, damage, bombArea, knockback, autoAim, bombSpeed, dirVector, (this.armDir.x < 0)?-1:1, bombExpireTime);
    bombProjectile.armBomb();
  }

  fireMulti(spr, damage, bombArea, knockback, offsprings, offspringScale, bombSpeed, bombExpireTime){
    //AUDIO
    Audio.play2Dinstance(27);
    this.armDir.normalize();
    const xSpawn = this.sprite.x + this.armDir.x * (this.armExtnension-10);
    const ySpawn = this.sprite.y + this.armDir.y * (this.armExtnension-10);
    const dirVector = new Phaser.Math.Vector2(this.scene.input.activePointer.x + this.scene.cameras.main.scrollX -xSpawn, this.scene.input.activePointer.y + this.scene.cameras.main.scrollY-ySpawn);
    var bombProjectile = new MultiMissile(this.scene, xSpawn, ySpawn, spr, damage, bombArea, knockback, offsprings, offspringScale, bombSpeed, dirVector, (this.armDir.x < 0)?-1:1, bombExpireTime);
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
