import Enemy from "./Enemy.js";

var ddiirr = -1;
//enemigo que hereda de Enemy
export default class Dummy extends Enemy {
  constructor(scene, x, y){
    super(scene, x, y, 'dummy', 100);
    this.sprite.setScale(0.4);
    //this.sprite.setBounce(1.01735).setFixedRotation().setFriction(0).setFrictionAir(0).setFrictionStatic(0);
    const body = Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 6, 30, 75);
    this.sprite.setExistingBody(body).setOrigin(0.52, 0.55).setPosition(x, y).setFixedRotation();
    this.sprite.body.collisionFilter.group = -1;
    this.scene.bulletInteracBodies[this.currentBodyIndex] = this.sprite.body;
    this.scene.enemyBodies[this.currentEnemyIndex] = this.sprite.body;
  }

  damage(dmg){
    super.damage(dmg);
  }

  enemyDead(){
    super.enemyDead();
  }
}
