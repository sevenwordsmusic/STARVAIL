import Enemy from "./Enemy.js";
import DropableAirEnergy from "../Objects/Dropables/DropableAirEnergy.js"

//enemigo que hereda de Enemy
export default class DummyAir extends Enemy {
  constructor(scene, x, y){
    super(scene, x, y, 'dummy', 100);

    this.sprite.setScale(0.4);
    this.sprite.setIgnoreGravity(true);
  }

  damage(dmg, xDmg, yDmg){
    super.damage(dmg, xDmg, yDmg);
  }

  enemyDead(xDmg, yDmg){
    const xAux = this.sprite.x;
    const yAux = this.sprite.y;
    super.enemyDead();
    new DropableAirEnergy(this.scene, xAux, yAux, Math.sign(xAux - xDmg), Math.sign(yAux - yDmg),  50);
  }
}
