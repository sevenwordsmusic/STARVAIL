import EnergyBall from "../Objects/Projectiles/EnemyProjectiles/EnergyBall.js"

export default class EnemyGun {
  constructor(scene, x, y, dmg){
    this.scene = scene;
    this.sprite = scene.add.image(x,y,'gun')
    this.sprite.angle = Phaser.Math.Between(-180,0);
    this.sprite.setScale(2.5).setOrigin(0.1,0.5).setDepth(-2);
    this.dmg = dmg;

    this.aimVector = new Phaser.Math.Vector2(1,0);
  }
  followPosition(xPos, yPos){
    this.sprite.x = xPos;
    this.sprite.y = yPos;
  }
  aimGun(ang){
    this.aimVector.x = Math.cos(ang);
    this.aimVector.y = Math.sin(ang);
    this.sprite.angle = ang * 180/Math.PI;
  }
  shoot(){
    new EnergyBall(this.scene, this.sprite.x + this.aimVector.x*70, this.sprite.y + this.aimVector.y*70, this.dmg, 0.1, 15, this.aimVector, 2000);
  }
  destroy(){
    this.sprite.destroy();
  }
}
