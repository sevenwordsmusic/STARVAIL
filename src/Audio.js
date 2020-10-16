export default class Audio extends Phaser.Scene {
  constructor() {
    super("Audio");
  }

  static musicBar(scene){
    if(scene.stinger0000){
      scene.stinger0000=false;
        for(var i=0; i<scene.game.player.weapons.length; i++){
            if(scene.game.player.weaponCounter==i){
                scene.tweens.add({
                    targets:  scene.bgmIfWeapon[i],
                    volume:   1.0,
                    duration: 1250,
                });
            }else{
                scene.tweens.add({
                    targets:  scene.bgmIfWeapon[i],
                    volume:   0.0,
                    duration: 1250,
                });  
            }
        }
    }else{
        for(var i=0; i<scene.game.player.weapons.length; i++){
            if(scene.bgmIfWeapon[i].volume>0.0){
                scene.tweens.add({
                    targets:  scene.bgmIfWeapon[i],
                    volume:   0.0,
                    duration: 1250,
                });
            }
        }
    }
  }

  static musicLayerHeight(scene){
    var relativeHeight=960;
    var maxVolume=1;
    var volumeNormalized=maxVolume-(scene.game.player.earlyPos.y*(maxVolume/relativeHeight));
    scene.bgm0001a.volume=volumeNormalized;
    scene.bgm0001b.volume=1-volumeNormalized;
    scene.bgm0002.volume=volumeNormalized;
    if(scene.game.isFiring && !scene.stinger0000){
      scene.stinger0000=true;
    }
  }

  preload(){
    //LOAD AUDIO
    this.load.audio('bgm0000', 'assets/audio/BGM/0000.wav');
    this.load.audio('bgm0001a', 'assets/audio/BGM/0001a.wav');
    this.load.audio('bgm0001b', 'assets/audio/BGM/0001b.wav');
    this.load.audio('bgm0002', 'assets/audio/BGM/0002.wav');
    this.load.audio('bgmIfWeapon0', 'assets/audio/BGM/ifWeapon0.wav');
    this.load.audio('bgmIfWeapon1', 'assets/audio/BGM/ifWeapon1.wav');
  }

  create(){
    console.log("AUDIO LOADED.")
    this.scene.start("SceneLoading");
  }
}
