export default class Bar {
    constructor (scene, x, y, width, height, col1, total){
        this.bar = scene.add.graphics();
        this.bar.setScrollFactor(0).setDepth(100);;

        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.proportion = width / total;
        this.colors = [3];
        this.colors[0] = col1;

        this.draw(total);
        //this.decrease (20);
    }

    //dibujar barra de vida
    draw(num){
      this.bar.clear();

      this.bar.fillStyle(this.colors[0]);
      this.bar.fillRect(this.x + 2, this.y + 2, num * this.proportion, this.height);
    }

    //resetear barra de vida
    reset(){
      this.bar.clear();

      this.bar.fillStyle(this.colors[0]);
      this.bar.fillRect(this.x + 2, this.y + 2, this.width, this.height);
    }
}
