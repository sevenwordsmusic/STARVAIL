export default class Dialog {
    static preloadToScene(scene){
      scene.load.scenePlugin({
          key: 'rexuiplugin',
          url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
          sceneKey: 'rexUI'
      });
    }
    //Parametros: escena, posicion x, posicion y, booleano que determina si se destruirá el dialogo cuando acaba,
    //tiempo que pasará en milisegundos desde que acaba el dialogo hasta que se destruye si lo anterior es cierto, y configuración
    constructor(scene, x, y, destroyonEnd,timeToDestroy, config) {
        this.scene = scene;
        scene.dialogManager = this;

        //Colores para el dialogo
        const COLOR_PRIMARY = 0x181818;
        const COLOR_LIGHT = 0xFFFFFF;
        const COLOR_DARK = 0x00000;

        const GetValue = Phaser.Utils.Objects.GetValue;

        var wrapWidth = GetValue(config, 'wrapWidth', 0);
        var fixedWidth = GetValue(config, 'fixedWidth', 0);
        var fixedHeight = GetValue(config, 'fixedHeight', 0);
        this.textBox = scene.rexUI.add.textBox({
            x: x,
            y: y,

            background: scene.rexUI.add.roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
                .setStrokeStyle(2, COLOR_LIGHT),

            icon: scene.rexUI.add.roundRectangle(100, 50, 2, 2, 30, COLOR_DARK),

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
            },

            currentSpeaker: undefined

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
                    if(this.isLastPage){
                      this.setVisible(false);
                      for(var i=0; i<this.children.length; i++){
                        this.children[i].setVisible(false);
                      }
                      if(this.currentSpeaker !== undefined){
                        this.currentSpeaker.finishedDialog();
                        this.currentSpeaker = undefined;
                      }
                    }
                    else
                      this.typeNextPage();
                }
            }, this.textBox)
            .on('pageend', function () {
                if (this.isLastPage) {

                    if(destroyonEnd) {
                        var timer = scene.time.addEvent({
                            delay: timeToDestroy,                // ms
                            callback: () =>  (this.destroy())
                        });
                    }

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


        this.textBox.setScrollFactor(0).setDepth(101);
        this.textBox.playerInteractable = true;
        this.hideDialogBox();
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

      showDialogBox(){
        this.textBox.setVisible(true);
        for(var i=0; i<this.textBox.children.length; i++){
          this.textBox.children[i].setVisible(true);
        }
      }
      hideDialogBox(){
        this.textBox.setVisible(false);
        for(var i=0; i<this.textBox.children.length; i++){
          this.textBox.children[i].setVisible(false);
        }
      }
      setCurrentSpeaker(speaker){
        if(this.textBox.currentSpeaker !== undefined)
          this.textBox.currentSpeaker.isTalking = false;
        this.textBox.currentSpeaker = speaker;
      }


}
