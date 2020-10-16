export default class Audio extends Phaser.Scene {
  constructor() {
    super("Audio");
  }

  static musicBar(scene){
    if(scene.stingerShot){
      scene.stingerShot=false;
        for(var i=0; i<scene.game.player.weapons.length; i++){
            if(scene.game.player.weaponCounter==i){
                scene.tweens.add({
                    targets:  scene.bgmIfWeapon[i],
                    volume:   1.0,
                    duration: 2.307692305,
                });
            }else{
                scene.tweens.add({
                    targets:  scene.bgmIfWeapon[i],
                    volume:   0.0,
                    duration: 1.1538461525,
                });  
            }
        }
    }else{
        for(var i=0; i<scene.game.player.weapons.length; i++){
            if(scene.bgmIfWeapon[i].volume>0.0){
                scene.tweens.add({
                    targets:  scene.bgmIfWeapon[i],
                    volume:   0.0,
                    duration: 1.1538461525,
                });
            }
        }
    }
  }

  static musicLayerHeight(scene){
    var relativeHeight=920;
    var maxVolume=1;
    var volumeNormalized=maxVolume-(scene.game.player.earlyPos.y*(maxVolume/relativeHeight));
    scene.loopFliying.volume=volumeNormalized;
  }

  static musicUpdate(scene){
    this.musicLayerHeight(scene);
    if(scene.game.isFiring && !scene.stingerShot){
      scene.stingerShot=true;
    }
  }

  preload(){
    //LOAD AUDIO
    this.load.audio('loop0000base', 'assets/audio/BGM/loop0000base.mp3');
    this.load.audio('loop0000flying', 'assets/audio/BGM/loop0000flying.mp3');
    this.load.audio('loop0000weapon_00', 'assets/audio/BGM/loop0000weapon_00.mp3');
    this.load.audio('loop0000weapon_01', 'assets/audio/BGM/loop0000weapon_01.mp3');


    this.load.audio('bgm0001a', 'assets/audio/BGM/0001a.wav');
    this.load.audio('bgm0001b', 'assets/audio/BGM/0001b.wav');


    this.load.audio('shot_00', 'assets/audio/SFX/shot_00.mp3');
    this.load.audio('shot_01', 'assets/audio/SFX/shot_01.mp3');

    this.load.audio('impact_00', 'assets/audio/SFX/impact_00.mp3');
  }

  create(){
    console.log("AUDIO LOADED.")
    this.scene.start("SceneLoading");
  }

}
