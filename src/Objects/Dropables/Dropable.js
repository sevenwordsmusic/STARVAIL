
export default class Dropable {
  constructor(scene, x, y, spr, expTime){
    //inicializacion
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x,y,spr,0);

    //despues de un tiempo determinado el Dropable sera destruido por este timer
    this.timer = this.scene.time.addEvent({
      delay: expTime,
      callback: () => (this.dropableExpire(this))
    });
  }

  //funcion de dropable recogido
  dropablePicked(drop){
    this.timer.destroy();
    this.sprite.destroy();
    drop = undefined;
  }

  //funcion que destruye al Dropable
  dropableExpire(drop){
    drop.sprite.destroy();
    drop = undefined;
  }
}
