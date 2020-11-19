
export default class SceneEffectBackground extends Phaser.Scene {
  constructor() {
    super("SceneEffectBackground");
  }


  //Creación de todo el contenido de la escena. Aquí es donde se distribuyen todos los elementos.
  create(){

    //Color de fondo prueba
    this.cameras.main.setBackgroundColor(0xdbdace);
    const bg = this.add.image(0,0,'white_rectangle').setOrigin(0).setScale(35).setDepth(-500);
    bg.tint = 0x000000;
    bg.alpha = 0.7;

    //efecto
    this.effect = this.add.sprite(480, 270, 'kilonova1', 0).setDepth(-400);
    if(this.game.timeExpired){
      this.effect.setScale(1.8).setAlpha(0.8).anims.play('darkHole', true);
    }else{
      if(this.game.npcHelped >= 2){
        this.effect.setScale(2).setAlpha(0.7).anims.play('pulsar', true);
      }else{
        this.effect.setScale(1.8).setAlpha(0.7).anims.play('kilonova', true);
      }
    }
    //console.log(this.effect);

  }
}
