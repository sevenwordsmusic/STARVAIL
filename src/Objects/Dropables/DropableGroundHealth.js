import DropableGround from "./DropableGround.js";
export default class DropableGroundHealth extends DropableGround{
  constructor(scene, x, y, dir, hp){
    super(scene, x, y, 'drop', 10000);
    this.hp = hp;
    this.bounce(1.51, dir, 4.5, 0.5);
    this.sprite.setFrame(0);
  }

  dropablePicked(drop){
    this.scene.game.player.playerGainHealth(Math.min(this.hp, this.scene.game.totalPlayerHp-this.scene.game.player.hp));
    super.dropablePicked(drop);
  }

  dropableExpire(drop){
    super.dropableExpire(drop);
  }
}
