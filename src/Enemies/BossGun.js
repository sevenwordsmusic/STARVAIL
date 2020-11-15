import BossBomb from "../Objects/Projectiles/EnemyProjectiles/BossBomb.js"
import BossMisile from "../Objects/Projectiles/EnemyProjectiles/BossMisile.js"
import BossBullet from "../Objects/Projectiles/EnemyProjectiles/BossBullet.js"
import BossLaser from "../Objects/Projectiles/EnemyProjectiles/BossLaser.js"

export default class BossGun {
  constructor(scene, x, y, dmg0, dmg1, dmg2){
    this.scene = scene;
    this.sprite = scene.add.image(x,y,'bossFireArm')
    this.sprite.angle = Phaser.Math.Between(-180,0);
    this.sprite.setScale(1.5).setOrigin(0.05,0.5).setDepth(6);
    this.exists = true;

    this.dmg0 = dmg0;
    this.dmg1 = dmg1;
    this.dmg2 = dmg2;

    this.shoulderOffsetX = -4;
    this.shoulderOffsetY = -22;
    this.aimVector = new Phaser.Math.Vector2(1,0);

    this.laser = undefined;
    this.autoAim = 0.6 / this.scene.matter.world.getDelta();
  }
  followPosition(xPos, yPos){
    if(this.exists){
      this.sprite.x = xPos + this.shoulderOffsetX;
      this.sprite.y = yPos + this.shoulderOffsetY;
    }
  }
  aimGun(ang){
    if(this.exists){
      this.aimVector.x = Math.cos(ang);
      this.aimVector.y = Math.sin(ang);
      this.sprite.angle = ang * 180/Math.PI;
    }
  }
  shoot(weaponId){
    if(this.exists){
      switch (weaponId) {
        case 0:
          new BossBullet(this.scene, this.sprite.x + this.aimVector.x*30, this.sprite.y + this.aimVector.y*30, this.dmg0, 0.1, 15, this.aimVector, 2000);
        break;
        case 1:
          new BossMisile(this.scene, this.sprite.x + this.aimVector.x*30, this.sprite.y + this.aimVector.y*30, this.dmg1, 0.1, 15, this.aimVector, 2000);
        break;
        case 2:
          new BossBomb(this.scene, this.sprite.x + this.aimVector.x*30, this.sprite.y + this.aimVector.y*30, this.dmg2, 0.2, 10, this.aimVector, 2000);
        break;
        default:
          new BossBomb(this.scene, this.sprite.x + this.aimVector.x*30, this.sprite.y + this.aimVector.y*30, this.dmg2, 0.2, 10, this.aimVector, 2000);
        break;
      }
    }
  }
  fireLaser(){
    if(this.laser == undefined)
      this.laser = new BossLaser(this.scene, this.sprite.x, this.sprite.y, this.aimVector, this);
  }

  fireMegaLaser(){
    new BossLaser(this.scene, this.sprite.x, this.sprite.y, new Phaser.Math.Vector2(1,0));
    new BossLaser(this.scene, this.sprite.x, this.sprite.y, new Phaser.Math.Vector2(3,1));
    new BossLaser(this.scene, this.sprite.x, this.sprite.y, new Phaser.Math.Vector2(-3,1));
    new BossLaser(this.scene, this.sprite.x, this.sprite.y, new Phaser.Math.Vector2(1,3));
    new BossLaser(this.scene, this.sprite.x, this.sprite.y, new Phaser.Math.Vector2(-1,3));
  }

  destroy(){
    this.exists = false;
    this.sprite.destroy();
  }

  adjustOffset(xOff, yOff){
    this.shoulderOffsetX = xOff;
    this.shoulderOffsetY = yOff;
  }

  adjustLaser(ang, delta){
    if(this.laser != undefined){
      this.aimVector.x = Math.cos(ang);
      this.aimVector.y = Math.sin(ang);
      this.sprite.angle = ang * 180/Math.PI;

      var objectiveAngle = this.sprite.angle;
      var currentAngle = this.laser.sprite.angle;

      objectiveAngle = -objectiveAngle;
      currentAngle = -currentAngle;

      if(objectiveAngle < currentAngle)
        this.laser.sprite.angle += this.autoAim * delta
      else
        this.laser.sprite.angle -= this.autoAim * delta

      this.sprite.angle = this.laser.sprite.angle;
      //this.laser.sprite.angle = this.sprite.angle;
    }
  }
  followLaser(){
    if(this.laser != undefined){
      this.laser.sprite.x = this.sprite.x;
      this.laser.sprite.y = this.sprite.y;
    }
  }
}
