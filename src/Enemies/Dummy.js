import Enemy from "./Enemy.js";
import DropableGroundEnergy from "../Objects/Dropables/DropableGroundEnergy.js"
import EnergyBall from "../Objects/Projectiles/EnemyProjectiles/EnergyBall.js"

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

    this.adjustedFriction = this.sprite.body.friction / this.scene.matter.world.getDelta();
    this.scene.events.on("update", this.update, this); //para que se ejecute el udate
  }

  update(time, delta){
      super.update(time, delta);
  }

  damage(dmg, v){
    super.damage(dmg, v);
  }

  enemyDead(vXDmg){
    const xAux = this.sprite.x;
    const yAux = this.sprite.y;
    new EnergyBall(this.scene, xAux, yAux, 14, 0.1, 15, new Phaser.Math.Vector2(-1,0), 1000);
    super.enemyDead();
    new DropableGroundEnergy(this.scene, xAux, yAux, Math.sign(vXDmg),  23);
  }
}
