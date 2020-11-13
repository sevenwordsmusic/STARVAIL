import PlayerFireArm from "./PlayerFireArm.js";

export default class PlayerFireArmPC extends PlayerFireArm{
  constructor(scene, x, y){
    super(scene,x,y)
    this.afterActive = 100 * this.scene.matter.world.getDelta();

    //variables para el "crosshair"
    this.chMultip = 1;
    this.chSize = 1;
    this.chChangeSpeed = 0.0075;
    this.graphics = this.scene.add.graphics({ fillStyle: { color: 0xE38989}});
    this.chLine = new Phaser.Geom.Line(this.sprite.x, this.sprite.y, this.scene.input.activePointer.x + this.cam.scrollX, this.scene.input.activePointer.y + this.cam.scrollY);
    this.crosshairSpr = this.scene.add.sprite(this.scene.input.activePointer.x + this.cam.scrollX, this.scene.input.activePointer.y + this.cam.scrollY, 'crosshair', 0);
    this.crosshairSpr.setDepth(110);
    this.crosshairSpr.tint = 0xE38989;

    this.scene.events.on("update", this.update, this);  //para que el update funcione
  }

  update(time, delta){
      const spX = this.scene.game.player.sprite.x + this.shoulderOffsetX;
      const spY = this.scene.game.player.sprite.y + this.shoulderOffsetY;
      //if(this.fireArmState){} //pos is hace falta
      this.sprite.x = spX;
      this.sprite.y = spY;
      this.armDir.x = this.scene.input.activePointer.x + this.cam.scrollX - spX;
      this.armDir.y = this.scene.input.activePointer.y + this.cam.scrollY - spY;
      this.sprite.angle = this.armDir.angle() * 180/Math.PI;

      //crosshair code
      this.crosshairSpr.x = this.scene.input.activePointer.x + this.cam.scrollX;
      this.crosshairSpr.y = this.scene.input.activePointer.y + this.cam.scrollY;

      if(this.chSize >= 1 && this.chMultip == 1)
        this.chMultip = -1;
      if(this.chSize <= 0.75 && this.chMultip == -1)
        this.chMultip = 1;
      this.chSize = this.chSize + (this.chChangeSpeed * this.chMultip);
      this.crosshairSpr.setScale(this.chSize);

      this.armDir.normalize();
      this.chLine.x1 = spX + this.armDir.x * (this.armExtnension-10);
      this.chLine.y1 = spY + this.armDir.y * (this.armExtnension-10);
      this.chLine.x2 = this.crosshairSpr.x;
      this.chLine.y2 = this.crosshairSpr.y;

      var numPoints = Math.sqrt(Math.pow(this.chLine.x2 - this.chLine.x1, 2) + Math.pow(this.chLine.y2 - this.chLine.y1, 2)) /15 //mejor x2;
      var linePoints = this.chLine.getPoints(numPoints);
      this.graphics.clear();
      for(var i=0; i<numPoints; i++){
        var pAux = linePoints[i];
        this.graphics.fillCircle(pAux.x, pAux.y, 1.25);
      }
  }

  enableFireArm(){
    this.sprite.setActive(true).setVisible(true);
    this.crosshairSpr.tint = 0xff0000;
    this.graphics.setDefaultStyles({ fillStyle: { color: 0xff0000}});
    this.fireArmActive = true;
  }
  disableFireArm(){
    this.crosshairSpr.tint = 0xE38989;
    this.graphics.setDefaultStyles({ fillStyle: { color: 0xE38989}});
    this.sprite.setActive(false).setVisible(false);
    this.fireArmActive = false;
  }
  destroyFireArm(){
    this.scene.events.off("update", this.update, this);
    this.graphics.clear();
    this.crosshairSpr.destroy();
    this.sprite.destroy();
    this.fireArmActive = false;
  }
  changeCrosshairSpr(spNumber){
    this.crosshairSpr.setFrame(spNumber);
  }

  adjustFireDirection(){
    //does nothing
  }
}
