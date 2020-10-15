export default class Audio extends Phaser.Scene {
  constructor() {
    super("Audio");
  }

  static musicBar(scene){
    if(scene.stinger0000){
      scene.stinger0000=false;
      scene.bgm0000.volume=1.0;
    }else{
      scene.bgm0000.volume=0.0;
    }
  }

  preload(){
    //LOAD AUDIO
    this.load.audio('bgm0000', 'assets/audio/BGM/0000.wav');
    this.load.audio('bgm0001a', 'assets/audio/BGM/0001a.wav');
    this.load.audio('bgm0001b', 'assets/audio/BGM/0001b.wav');
    this.load.audio('bgm0002', 'assets/audio/BGM/0002.wav');

  }

  create(){
    //AUDIO
    this.game.musicVolume= 0.5;
    this.game.bgm0000 = this.sound.add('bgm0000', { loop: true, volume: this.game.musicVolume });
    this.game.bgm0001a = this.sound.add('bgm0001a', { loop: true, volume: this.game.musicVolume });
    this.game.bgm0001b = this.sound.add('bgm0001b', { loop: true, volume: this.game.musicVolume });
    this.game.bgm0002 = this.sound.add('bgm0001b', { loop: true, volume: this.game.musicVolume });

    console.log("AUDIO LOADED.")
    this.scene.start("SceneLoading");
  }
}
