export default class Audio extends Phaser.Scene {
  constructor() {
    super("Audio");
  }
  static counter=-1;
  static earlyPos=0.0;
  static musicBar(scene){
    this.counter++;
    console.log("AUDIO BAR: " + this.counter);
    this.musicLayerShot(scene);
    this.musicLayerJet(scene);
    this.musicLayerMovement(scene);
  }

  static musicLayerHeight(scene){
    var relativeHeight=920;
    var maxVolume=1;
    var volumeNormalized=maxVolume-(scene.game.player.earlyPos.y*(maxVolume/relativeHeight));
    if(volumeNormalized<=1.0 && volumeNormalized >0.0){
        scene.loopFliying.volume=volumeNormalized; 
    }
  }

static musicLayerShot(scene){
    if(scene.stingerShot){
        console.log("AUDIO FIRING LAYER: " + scene.game.player.weaponCounter + " ON.");
      scene.stingerShot=false;
        for(var i=0; i<scene.game.player.weapons.length; i++){
            if(scene.game.player.weaponCounter==i){
                scene.tweens.add({
                    targets:  scene.bgmIfWeapon[i],
                    volume:   1.0,
                    duration: 18.028846,
                });
            }else{
                scene.tweens.add({
                    targets:  scene.bgmIfWeapon[i],
                    volume:   0.0,
                    duration: 18.028846,
                });  
            }
        }
    }else{
        console.log("AUDIO FIRING LAYER: " + scene.game.player.weaponCounter + " OFF.");
        for(var i=0; i<scene.game.player.weapons.length; i++){
            if(scene.bgmIfWeapon[i].volume>0.0){
                scene.tweens.add({
                    targets:  scene.bgmIfWeapon[i],
                    volume:   0.0,
                    duration: 4615.38461,
                });
            }
        }
    }
  }

static musicLayerJet(scene){
    if(scene.stingerJet){
        console.log("AUDIO JET LAYER: " + scene.game.player.weaponCounter + " OFF.");
        scene.stingerJet=false;
                scene.tweens.add({
                    targets:  scene.loopLevitating,
                    volume:   0.0,
                    duration: 9230.76922,
                }); 
    }else{
        console.log("AUDIO JET LAYER: " + scene.game.player.weaponCounter + " ON.");
                scene.tweens.add({
                    targets:  scene.loopLevitating,
                    volume:   1.0,
                    duration: 1153.8461525,
                }); 
    }
  }

  static musicLayerMovement(scene){
    if(scene.stingerMovement){
        console.log("AUDIO MOVEMENT LAYER: ON.");
        scene.stingerMovement=false;
                scene.tweens.add({
                    targets:  scene.loopMovement,
                    volume:   1.0,
                    duration: 2307.692305,
                });
    }else{
        console.log("AUDIO MOVEMENT LAYER: OFF.");
                scene.tweens.add({
                    targets:  scene.loopMovement,
                    volume:   0.0,
                    duration: 2307.692305,
                });
    }
  }
   static distanceAndPlay(scene,audio){
    var distance= (640-scene.distanceToPlayer())/640;
      if(distance<0.1){
        distance=0.0;
      }
      audio.volume=distance;;
      audio.play();
    }

  static musicUpdate(scene){
    this.musicLayerHeight(scene);
    if(scene.game.isFiring && !scene.stingerShot){
      scene.stingerShot=true;
    }
    if( scene.game.player.isTouching.ground && !scene.stingerJet){
      scene.stingerJet=true;
    }
    if( Math.floor(scene.game.player.earlyPos.x) != Math.floor(this.earlyPos)){
        this.earlyPos=Math.floor(scene.game.player.earlyPos.x);
        scene.stingerMovement=true;
    }else{

    }
  }

  preload(){
    //LOAD AUDIO
    this.load.audio('loop0000base', 'assets/audio/BGM/loop0000base.mp3');
    this.load.audio('loop0000flying', 'assets/audio/BGM/loop0000flying.mp3');
    this.load.audio('loop0000levitating', 'assets/audio/BGM/loop0000levitating.mp3');
    this.load.audio('loop0000moving', 'assets/audio/BGM/loop0000moving.mp3');
    this.load.audio('loop0000weapon_00', 'assets/audio/BGM/loop0000weapon_00.mp3');
    this.load.audio('loop0000weapon_01', 'assets/audio/BGM/loop0000weapon_01.mp3');

    this.load.audio('shot_00', 'assets/audio/SFX/shot_00.mp3');
    this.load.audio('shot_01', 'assets/audio/SFX/shot_01.mp3');

    this.load.audio('impact_00', 'assets/audio/SFX/impact_00.mp3');
    this.load.audio('impact_01', 'assets/audio/SFX/impact_01.mp3');

    this.load.audio('explosion_01', 'assets/audio/SFX/explosion_01.mp3'); 
  }

  create(){
    console.log("AUDIO LOADED.")
    this.scene.start("SceneLoading");
  }

}
