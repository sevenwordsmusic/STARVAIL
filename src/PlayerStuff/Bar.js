export default class Bar {
    constructor (scene, x, y, width, height, col1, colbg, colborder, total){
        this.bar = scene.add.graphics();
        this.bar.setScrollFactor(0).setDepth(100);;

        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.proportion = width / total;
        this.colors = [3];
        this.colors[0] = col1;
        this.colors[1] = colbg;
        this.colors[2] = colborder;

        this.draw(total);
        //this.decrease (20);
    }

    draw(num){
      this.bar.clear();
      this.bar.fillStyle(this.colors[2]);
      this.bar.fillRect(this.x, this.y, this.width +4, this.height + 4);

      this.bar.fillStyle(this.colors[1]);
      this.bar.fillRect(this.x + 2, this.y + 2, this.width, this.height);

      this.bar.fillStyle(this.colors[0]);
      this.bar.fillRect(this.x + 2, this.y + 2, num * this.proportion, this.height);
    }

    reset(){
      this.bar.clear();
      this.bar.fillStyle(this.colors[2]);
      this.bar.fillRect(this.x, this.y, this.width +4, this.height + 4);

      this.bar.fillStyle(this.colors[1]);
      this.bar.fillRect(this.x + 2, this.y + 2, this.width, this.height);

      this.bar.fillStyle(this.colors[0]);
      this.bar.fillRect(this.x + 2, this.y + 2, this.width, this.height);
    }
}
