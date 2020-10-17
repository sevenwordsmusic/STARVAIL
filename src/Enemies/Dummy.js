import Enemy from "./Enemy.js";
import DropableGroundEnergy from "../Objects/Dropables/DropableGroundEnergy.js"

//enemigo que hereda de Enemy
export default class Dummy extends Enemy {
  constructor(scene, x, y){
    super(scene, x, y, 'dummy', 100);
    this.sprite.setScale(0.4);

    //this.sprite.setBounce(1.01735).setFixedRotation().setFriction(0).setFrictionAir(0).setFrictionStatic(0);
    const body = Phaser.Physics.Matter.Matter.Bodies.rectangle(0, 6, 30, 75);
    this.sprite.setExistingBody(body).setOrigin(0.52, 0.55).setPosition(x, y).setFixedRotation();
    this.scene.bulletInteracBodies[this.currentBodyIndex] = this.sprite.body;
    this.scene.enemyBodies[this.currentEnemyIndex] = this.sprite.body;
    this.sprite.body.collisionFilter.group = -1;
  }

  damage(dmg, xDmg, yDmg){
    super.damage(dmg, xDmg, yDmg);
  }

  enemyDead(xDmg, yDmg){
    const xAux = this.sprite.x;
    const yAux = this.sprite.y;
    super.enemyDead();
    new DropableGroundEnergy(this.scene, xAux, yAux, Math.sign(xAux - xDmg),  23);
  }
}
