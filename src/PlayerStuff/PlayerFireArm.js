import Bomb from "../Objects/Bomb.js";
import Bullet from "../Objects/Bullet.js";
import SuperiorQuery from "../SuperiorQuery.js";

export default class PlayerFireArm {
  constructor(scene, x, y){
      this.sprite = scene.add.sprite(x, y, 'playerFireArm', 0);
      this.scene = scene;
      this.mouse = this.scene.input.activePointer;
      this.cam = this.scene.cameras.main;

      this.spread = 0.1;

      this.sprite.setOrigin(0.5,0.05);
      this.sprite.setDepth(6);
      this.fireArmState = 2;

      this.shoulderOffsetX = -5;
      console.log(this.scene.game);
      this.shoulderOffsetY = -this.scene.game.player.sprite.height/2 + 25;
      this.armDir = new Phaser.Math.Vector2(this.mouse.x + this.cam.scrollX - this.sprite.x, this.mouse.y + this.cam.scrollY - this.sprite.y);
      this.armDir.normalize();

      this.sprite.setScale(0.3, 0.25);

      //variables para el "crosshair"
      this.chMultip = 1;
      this.chSize = 1;
      this.chChangeSpeed = 0.0075;
      this.graphics = this.scene.add.graphics({fillStyle: { color: 0xff0000 }});
      this.chLine = new Phaser.Geom.Line(this.sprite.x, this.sprite.y, this.mouse.x + this.cam.scrollX, this.mouse.y + this.cam.scrollY);
      this.crosshairSpr = this.scene.add.sprite(this.mouse.x + this.cam.scrollX, this.mouse.y + this.cam.scrollY, 'crosshair', 0);
      this.crosshairSpr.setDepth(90);
      this.crosshairSpr.tint = 0xff0000;

      this.scene.events.on("update", this.update, this);  //para que el update funcione

      /*var auxVecc = new Phaser.Math.Vector2(-0.84991, -0.52691);
      const spreadAux = 18.78787159662 * Math.PI/180;
      const radiusAux = 9;
      console.log("H: " + SuperiorQuery.superiorCircleAngle(40,43,radiusAux, spreadAux, 40, 40, auxVecc));
      console.log("I: " + SuperiorQuery.superiorCircleAngle(20,40,radiusAux, spreadAux, 40, 40, auxVecc));
      console.log("J: " + SuperiorQuery.superiorCircleAngle(40,40,radiusAux, spreadAux, 40, 40, auxVecc));
      console.log("K: " + SuperiorQuery.superiorCircleAngle(45,40,radiusAux, spreadAux, 40, 40, auxVecc));
      console.log("L: " + SuperiorQuery.superiorCircleAngle(-40,20,radiusAux, spreadAux, 40, 40, auxVecc));
      console.log("M: " + SuperiorQuery.superiorCircleAngle(-10,-30,radiusAux, spreadAux, 40, 40, auxVecc));*/


  }

  update(time, delta){
      //si estado de fireArm == 0 se desactiva el update entero
      if(this.fireArmState != 0){
        const spX = this.scene.game.player.sprite.x + this.shoulderOffsetX;
        const spY = this.scene.game.player.sprite.y + this.shoulderOffsetY;
        //if(this.fireArmState){} //pos is hace falta
        this.sprite.x = spX;
        this.sprite.y = spY;
        this.armDir.x = this.mouse.x + this.cam.scrollX - spX;
        this.armDir.y = this.mouse.y + this.cam.scrollY - spY;
        this.sprite.angle = this.armDir.angle() * 180/Math.PI - 90;


        //crosshair code
        this.crosshairSpr.x = this.mouse.x + this.cam.scrollX;
        this.crosshairSpr.y = this.mouse.y + this.cam.scrollY;

        if(this.chSize >= 1 && this.chMultip == 1)
          this.chMultip = -1;
        if(this.chSize <= 0.75 && this.chMultip == -1)
          this.chMultip = 1;
        this.chSize = this.chSize + (this.chChangeSpeed * this.chMultip);
        this.crosshairSpr.setScale(this.chSize);

        this.armDir.normalize();
        this.chLine.x1 = spX + this.armDir.x * 30;
        this.chLine.y1 = spY + this.armDir.y * 30;
        this.chLine.x2 = this.crosshairSpr.x;
        this.chLine.y2 = this.crosshairSpr.y;

        var numPoints = Math.sqrt(Math.pow(this.chLine.x2 - this.chLine.x1, 2) + Math.pow(this.chLine.y2 - this.chLine.y1, 2)) /15 //mejor x2;
        var linePoints = this.chLine.getPoints(numPoints);
        this.graphics.clear();
        for(var i=0; i<numPoints; i++){
          var pAux = linePoints[i];
          this.graphics.fillCircle(pAux.x, pAux.y, 2);
        }
      }
  }

  fireBullet(bulletSpeed = 30, bulletExpireTime = 1000){
      this.armDir.normalize();
      const addedRandomAngle = (2*Math.random() - 1) * this.spread;
      this.armDir.x = Math.cos(this.armDir.angle() + addedRandomAngle);
      this.armDir.y = Math.sin(this.armDir.angle() + addedRandomAngle);
      //this.armDir.x = Math.cos((2*Math.random() - 1) * this.spread);
      //this.armDir.y = Math.sin((2*Math.random() - 1) * this.spread);
      //console.time("a");
      //for(var i=0; i<1000; i++){
        //bulletCollision = SuperiorQuery.superiorRayCast(this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, this.armDir, 14, this.scene.bulletInteracBodies);
      //}
      var bulletCollision = SuperiorQuery.superiorRayCast(this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, this.armDir, 14, this.scene.bulletInteracBodies);
      //console.timeEnd("a");
      if(bulletCollision.collided){
        var bulletDistance = Math.sqrt(Math.pow(bulletCollision.colX - this.sprite.x - this.armDir.x * 30,2) + Math.pow(bulletCollision.colY - this.sprite.y - this.armDir.y * 30,2));
        return new Bullet(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, bulletSpeed, this.armDir, Math.min(bulletExpireTime,(bulletDistance * this.scene.matter.world.getDelta())/bulletSpeed), bulletCollision);
      }else{
        return new Bullet(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, bulletSpeed, this.armDir, bulletExpireTime, bulletCollision);
      }
  }

  fireBomb(){
    this.armDir.normalize();
    return new Bomb(this.scene, this.sprite.x + this.armDir.x * 30, this.sprite.y + this.armDir.y * 30, (this.mouse.x < this.scene.game.player.sprite.x)?-1:1);
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

  setFireArmState(state){
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
  }

  changeCrosshairSpr(spNumber){
    this.crosshairSpr.setFrame(spNumber);
  }

}
