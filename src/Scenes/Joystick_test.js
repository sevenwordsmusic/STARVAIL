
var cursorKeys
export default class Joystick_test extends Phaser.Scene {
  constructor() {
    super("Joystick");
  }

  preload() {
    var url;

    url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
    this.load.plugin('rexvirtualjoystickplugin', url, true);
  }

  create() {
    this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 400,
      y: 300,
      radius: 100,
      base: this.add.circle(0, 0, 100, 0x888888),
      thumb: this.add.circle(0, 0, 50, 0xcccccc),
      // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
      // forceMin: 16,
      // enable: true
    });
      //.on('update', this.dumpJoyStickState, this);

    this.text = this.add.text(0, 0);

    cursorKeys = this.joyStick.createCursorKeys();
    console.log(cursorKeys);
    console.log(this.joyStick);
  }
  update(){
    var s = 'Key down: ';
    for (var name in cursorKeys) {
        if (cursorKeys[name].isDown) {
            s += name + ' ';
        }
    }
    s += '\n';
    s += ('Force: ' + Math.min(1,this.joyStick.force/100) + '\n');
    s += ('ForceX: ' + Math.min(Math.max(this.joyStick.forceX/100, -1), 1) + '\n');
    s += ('ForceY: ' + Math.min(Math.max(this.joyStick.forceY/100, -1), 1) + '\n');
    this.text.setText(s);
    var auxtext = "";
    if(cursorKeys.up.isDown)
      auxtext += "up  ";
    if(cursorKeys.down.isDown)
      auxtext += "down  ";
    if(cursorKeys.right.isDown)
      auxtext += "right  ";
    if(cursorKeys.left.isDown)
      auxtext += "left  ";
    musicManager();
    console.log(auxtext);
  }

}
