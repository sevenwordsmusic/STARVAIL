export default class Dialog {
    
    constructor(scene, x, y, config) {
        this.scene = scene;

        //Colores para el dialogo
        const COLOR_PRIMARY = 0x4e342e;
        const COLOR_LIGHT = 0x7b5e57;
        const COLOR_DARK = 0x260e04;

        const GetValue = Phaser.Utils.Objects.GetValue;

        var wrapWidth = GetValue(config, 'wrapWidth', 0);
        var fixedWidth = GetValue(config, 'fixedWidth', 0);
        var fixedHeight = GetValue(config, 'fixedHeight', 0);
        this.textBox = scene.rexUI.add.textBox({
            x: x,
            y: y,

            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
                .setStrokeStyle(2, COLOR_LIGHT),

            icon: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_DARK),

            // text: this.getBuiltInText(wrapWidth, fixedWidth, fixedHeight),
            text: this.getBBcodeText(wrapWidth, fixedWidth, fixedHeight),

            action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),

            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                icon: 10,
                text: 10,
            }
        })
            .setOrigin(0)
            .layout();

        this.textBox
            .setInteractive()
            .on('pointerdown', function () {
                var icon = this.getElement('action').setVisible(false);
                this.resetChildVisibleState(icon);
                if (this.isTyping) {
                    this.stop(true);
                } else {
                    this.typeNextPage();
                }
            }, this.textBox)
            .on('pageend', function () {
                if (this.isLastPage) {
                    return;
                }

                var icon = this.getElement('action').setVisible(true);
                this.resetChildVisibleState(icon);
                icon.y -= 30;
                var tween = scene.tweens.add({
                    targets: icon,
                    y: '+=30', // '+=100'
                    ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 500,
                    repeat: 0, // -1: infinity
                    yoyo: false
                });
            }, this.textBox)
        //.on('type', function () {
        //})


        this.textBox.setScrollFactor(0);
    }

     getBuiltInText (wrapWidth, fixedWidth, fixedHeight) {
        return this.scene.add.text(0, 0, '', {
          fontSize: '20px',
          wordWrap: {
            width: wrapWidth
          },
          maxLines: 3
        })
          .setFixedSize(fixedWidth, fixedHeight);
      }
      
     getBBcodeText (wrapWidth, fixedWidth, fixedHeight) {
        return this.scene.rexUI.add.BBCodeText(0, 0, '', {
          fixedWidth: fixedWidth,
          fixedHeight: fixedHeight,
      
          fontSize: '20px',
          wrap: {
            mode: 'word',
            width: wrapWidth
          },
          maxLines: 3
        })
      }


}