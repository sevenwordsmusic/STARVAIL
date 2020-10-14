//Clase padre de todos los proyectiles
export default class Projectile {
  constructor(scene, x, y, expTime){
    //inicializacion
    this.scene = scene;
    this.expTime = expTime;

    //despues de un tiempo determinado el proyectil sera destruido por este timer
    this.timer = this.scene.time.addEvent({
      delay: this.expTime,
      callback: () => (this.itemExpire(this))
    });
  }

  //funcion que destruye al proyectil
  itemExpire(proj){
    //console.log("item expired");
    proj.sprite.destroy();
    proj = undefined;
  }
}
