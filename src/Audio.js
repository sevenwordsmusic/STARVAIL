export default class Audio extends Phaser.Scene {
    constructor() {
        super("Audio");
    }
    static counter = 0;
    static earlyPos = 0.0;
    static earlyPropeller = false;
    static earlyWeapon = -1;
    static bpm = 104;
    static beat = 16;
    static barRate = 60*1000 / this.bpm * this.beat;
    static barRateDiv = [this.barRate / 2, this.barRate / 4, this.barRate / 8, this.barRate / 64, this.barRate / 128];
    static maxVolume = 1.0;
    static vanishingPoint = this.barRateDiv[2]/this.maxVolume;
    static halfDistance = this.vanishingPoint / 2;
    static volumeBGM = this.maxVolume;
    static volumeSFX = this.maxVolume;
    static load;
    static barTimer;
    static maxSFXinstances=128;
    static SFXinstance=0;

    static startAudioEngine(scene){
        Audio.barTimer = scene.time.addEvent({
            delay: Audio.barRateDiv[0],
            callback: ()=> Audio.musicBar(scene),
            loop: true,
        });
        console.log("AUDIO ENGINE STARTED.")
    }
    static musicBar(scene) {
        this.counter++;
        this.musicLayerShot(scene);
        this.musicLayerJet(scene);
        this.musicLayerMovement(scene);
    }
    static volumeBGM(value){
        this.volumeBGM = value;
    }
    static volumeSFX(value){
        this.volumeSFX = value;
    }
    static musicLayerHeight(scene) {
        var volumeNormalized = this.volumeBGM - (scene.game.player.earlyPos.y * (this.volumeBGM / this.vanishingPoint));
        if (volumeNormalized <= this.volumeBGM && volumeNormalized > 0.0) {
                    scene.tweens.add({
                        targets: this.load.loopFliying,
                        volume: volumeNormalized,
                        duration: this.barRateDiv[0],
                    });
        }
    }
    static musicLayerEnemies(scene) {
        if (scene.game.player.getClosestEnemyDistance() > this.vanishingPoint) {
            var distance = 0.0;
        } else if (scene.game.player.getClosestEnemyDistance() < 0.0) {
            var distance = this.volumeBGM;
        } else {
            var distance = (this.vanishingPoint - scene.game.player.getClosestEnemyDistance()) / this.vanishingPoint;
        }
                    scene.tweens.add({
                        targets: this.load.loopBase,
                        volume: this.volumeBGM-distance,
                        duration: this.barRateDiv[1],
                    });
                    scene.tweens.add({
                        targets: this.load.loopEnemies,
                        volume: distance,
                        duration: this.barRateDiv[2],
                    });

    }
    static musicLayerShot(scene) {
        if (this.stingerShot && scene.game.player.getClosestEnemyDistance() < this.halfDistance) {
            this.stingerShot = false;
            for (var i = 0; i < scene.game.player.weapons.length; i++) {
                if (scene.game.player.weaponCounter == i) {
                    scene.tweens.add({
                        targets: this.load.bgmIfWeapon[i],
                        volume: this.volumeBGM,
                        duration: this.barRateDiv[3],
                    });
                } else {
                    scene.tweens.add({
                        targets: this.load.bgmIfWeapon[i],
                        volume: 0.0,
                        duration: this.barRateDiv[3],
                    });
                }
            }
        } else {
            for (var i = 0; i < scene.game.player.weapons.length; i++) {
                if (this.load.bgmIfWeapon[i].volume > 0.0) {
                    scene.tweens.add({
                        targets: this.load.bgmIfWeapon[i],
                        volume: 0.0,
                        duration: this.barRate,
                    });
                }
            }
        }
    }
    static musicLayerJet(scene) {
        if (this.stingerJet) {
            this.stingerJet = false;
            scene.tweens.add({
                targets: this.load.loopLevitating,
                volume: this.volumeBGM,
                duration: this.barRateDiv[1],
            });
        } else {
            scene.tweens.add({
                targets: this.load.loopLevitating,
                volume: 0.0,
                duration: this.barRateDiv[2],
            });
        }
    }
    static musicLayerMovement(scene) {
        if (this.stingerMovement) {
            this.stingerMovement = false;
            scene.tweens.add({
                targets: this.load.loopMovement,
                volume: this.volumeBGM,
                duration: this.barRateDiv[3],
            });
        } else {
            scene.tweens.add({
                targets: this.load.loopMovement,
                volume: 0.0,
                duration: this.barRateDiv[2],
            });
        }
    }
    static play2Dinstance(type) {
        this.load.soundInstance[type][Audio.SFXinstance].setRate(0.85 + (Math.random() * 0.15));
        this.load.soundInstance[type][Audio.SFXinstance].volume = Audio.volumeSFX;
        this.load.soundInstance[type][Audio.SFXinstance].play();
        if(Audio.SFXinstance<Audio.maxSFXinstances-1){
            Audio.SFXinstance++;
        }else{
            Audio.SFXinstance=0;
        } 
        return  this.load.soundInstance[type][Audio.SFXinstance-1];      
    }
    static play3Dinstance(scene, type) {
        if (scene.distanceToPlayer() > this.vanishingPoint) {
            var distance = 0.0;
        } else if (scene.distanceToPlayer() < 0.0) {
            var distance = Audio.volumeSFX;
        } else {
            var distance = (this.vanishingPoint - scene.distanceToPlayer()) / this.vanishingPoint;
        }
        this.load.soundInstance[type][Audio.SFXinstance].setRate(0.85 + (Math.random() * 0.15));
        this.load.soundInstance[type][Audio.SFXinstance].volume = distance;
        this.load.soundInstance[type][Audio.SFXinstance].play();
        if(Audio.SFXinstance<Audio.maxSFXinstances-1){
            Audio.SFXinstance++;
        }else{
            Audio.SFXinstance=0;
        }
        return  this.load.soundInstance[type][Audio.SFXinstance-1];
    }
    static play3DinstanceRnd(scene, type, sub, bounces) {
        var rnd= Math.floor(Math.random() * sub);
        var SFXinstance= Audio.SFXinstance;
        if (scene.distanceToPlayer() > this.vanishingPoint) {
            var distance = 0.0;
        } else if (scene.distanceToPlayer() < 0.0) {
            var distance = Audio.volumeSFX;
        } else {
            var distance = (this.vanishingPoint - scene.distanceToPlayer()) / this.vanishingPoint;
        }
        this.load.soundInstance[type][rnd][SFXinstance].setRate(0.75 + (Math.random() * 0.25));
        this.load.soundInstance[type][rnd][SFXinstance].volume = distance*bounces;
        this.load.soundInstance[type][rnd][SFXinstance].play();
        if(Audio.SFXinstance==SFXinstance && SFXinstance<Audio.maxSFXinstances-1){
            Audio.SFXinstance++;
        }else{
            Audio.SFXinstance=0;
        }
        console.log(type + " " + rnd + " " + SFXinstance );
    }
    
    static playUIinstance(type, rate) {
        this.load.soundInstance[type][Audio.SFXinstance].setRate(rate);
        this.load.soundInstance[type][Audio.SFXinstance].volume = Audio.volumeSFX;
        this.load.soundInstance[type][Audio.SFXinstance].play();
        if(Audio.SFXinstance<Audio.maxSFXinstances-1){
            Audio.SFXinstance++;
        }else{
            Audio.SFXinstance=0;
        }   
    }
    static audioUpdate(scene) {
        this.musicLayerEnemies(scene);
        this.musicLayerHeight(scene);
        this.propellerFliying(scene);
        if (scene.game.isFiring && scene.game.player.energy<1) {
            this.load.soundInstance[10].setRate(0.9 + scene.game.player.weaponCounter * 0.05);
            this.load.soundInstance[10].play();
        }
        if (scene.game.isFiring && !this.stingerShot) {
            this.stingerShot = true;
        }
        if (scene.game.player.activatedJet && !this.stingerJet) {
            this.stingerJet = true;
        }
        if (Math.floor(scene.game.player.earlyPos.x) != Math.floor(this.earlyPos) && !scene.game.player.activatedJet && !this.stingerWalk) {
            this.stingerWalk = true;
            this.load.walkLoop.play();
        }
        if(this.stingerWalk && (scene.game.player.activatedJet || Math.floor(scene.game.player.earlyPos.x) == Math.floor(this.earlyPos))){
            this.stingerWalk = false;
            this.load.walkLoop.stop();
        }
        if (scene.game.player.weaponCounter != this.earlyWeapon) {
            this.earlyWeapon = scene.game.player.weaponCounter;
            this.load.soundInstance[8].setRate(0.9 + scene.game.player.weaponCounter * 0.05);
            this.load.soundInstance[8].play();
            this.load.soundInstance[9].setRate(0.9 + scene.game.player.weaponCounter * 0.05);
            this.load.soundInstance[9].play();
        }
        if (Math.floor(scene.game.player.earlyPos.x) != this.earlyPos) {
            this.earlyPos = Math.floor(scene.game.player.earlyPos.x);
            this.stingerMovement = true;
        }
    }
    static propellerFliying(scene) {
        if (scene.game.player.activatedJet && !this.earlyPropeller) {
            this.load.soundInstance[11].volume = 0.0;
            this.earlyPropeller = true;
            this.load.engineLoop.play();
            scene.tweens.add({
                targets: this.load.engineLoop,
                volume: this.volumeSFX,
                duration: this.barRateDiv[2],
            });
            this.load.propellerLoop.play();
            scene.tweens.add({
                targets: this.load.propellerLoop,
                volume: this.volumeSFX,
                rate: scene.game.player.energy /  this.barRateDiv[3] + this.volumeSFX + this.volumeSFX,
                duration: this.barRateDiv[3],
            });
            this.load.soundInstance[9].setRate(0.5);
            this.load.soundInstance[9].play();
        } else if (!scene.game.player.activatedJet && this.earlyPropeller) {
            this.earlyPropeller = false;
            this.load.soundInstance[11].volume = Audio.volumeSFX;
            this.load.soundInstance[11].setRate(0.9 + (Math.random() * 0.1));
            this.load.soundInstance[11].play();
            Audio.load.propellerLoop.stop();
            Audio.load.engineLoop.stop();
            Audio.load.propellerLoop.setRate(0.001);
            Audio.load.propellerLoop.volume = 0.0;
        } else if (this.earlyPropeller) {
            scene.tweens.add({
                targets: Audio.load.propellerLoop,
                volume: this.volumeSFX,
                rate: scene.game.player.energy / this.barRateDiv[1],
                duration: this.barRateDiv[2],
            });
        }
    }
    preload() {
        //LOAD AUDIO
        //IMPACTS
        this.load.audio('impact_00', 'assets/audio/SFX/impact_00.mp3');
        this.load.audio('impact_01', 'assets/audio/SFX/impact_01.mp3');
        this.load.audio('impact_02', 'assets/audio/SFX/impact_02.mp3');
        this.load.audio('impact_03A', 'assets/audio/SFX/impact_03A.mp3');
        this.load.audio('impact_03B', 'assets/audio/SFX/impact_03B.mp3');
        this.load.audio('impact_03C', 'assets/audio/SFX/impact_03C.mp3');
        this.load.audio('impact_03D', 'assets/audio/SFX/impact_03D.mp3');
        this.load.audio('impact_03E', 'assets/audio/SFX/impact_03E.mp3');
        this.load.audio('impact_04', 'assets/audio/SFX/impact_04.mp3');
        this.load.audio('impact_05', 'assets/audio/SFX/impact_05.mp3');
        this.load.audio('impact_06', 'assets/audio/SFX/impact_06.mp3');
        this.load.audio('impact_07', 'assets/audio/SFX/impact_07.mp3');
        //UI
        this.load.audio('weaponChange_00', 'assets/audio/SFX/weaponChange_00.mp3');
        this.load.audio('movingPart_00', 'assets/audio/SFX/movingPart_00.mp3');
        this.load.audio('trigger_00', 'assets/audio/SFX/trigger_00.mp3');
        this.load.audio('propellerStop_00', 'assets/audio/SFX/propellerStop_00.mp3');
        this.load.audio('wick_00', 'assets/audio/SFX/wick_00.mp3');
        //EXPLOSION
        this.load.audio('explosion_00', 'assets/audio/SFX/explosion_00.mp3');
        this.load.audio('explosion_01', 'assets/audio/SFX/explosion_01.mp3');
        this.load.audio('explosion_02', 'assets/audio/SFX/explosion_02.mp3');
        this.load.audio('explosion_03', 'assets/audio/SFX/explosion_03.mp3');
        this.load.audio('explosion_04', 'assets/audio/SFX/explosion_04.mp3');
        //SHOTS
        this.load.audio('shot_00', 'assets/audio/SFX/shot_00.mp3');
        this.load.audio('shot_01', 'assets/audio/SFX/shot_01.mp3');
        this.load.audio('shot_02', 'assets/audio/SFX/shot_02.mp3');
        this.load.audio('shot_03', 'assets/audio/SFX/shot_03.mp3');
        this.load.audio('shot_04', 'assets/audio/SFX/shot_04.mp3');
        this.load.audio('shot_05', 'assets/audio/SFX/shot_05.mp3');
        this.load.audio('shot_06', 'assets/audio/SFX/shot_06.mp3');
        this.load.audio('shot_07', 'assets/audio/SFX/shot_07.mp3');
        //UI LOOPS
        this.load.audio('walkLoop_00', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('propellerLoop_00', 'assets/audio/SFX/propellerLoop_00.mp3');
        this.load.audio('engineLoop_00', 'assets/audio/SFX/engineLoop_00.mp3');
        //MUSIC LOOPS
        this.load.audio('loop0000base', 'assets/audio/BGM/loop0000base.mp3');
        this.load.audio('loop0000enemies', 'assets/audio/BGM/loop0000enemies.mp3');
        this.load.audio('loop0000flying', 'assets/audio/BGM/loop0000flying.mp3');
        this.load.audio('loop0000levitating', 'assets/audio/BGM/loop0000levitating.mp3');
        this.load.audio('loop0000moving', 'assets/audio/BGM/loop0000moving.mp3');
        this.load.audio('loop0000weapon_00', 'assets/audio/BGM/loop0000weapon_00.mp3');
        this.load.audio('loop0000weapon_01', 'assets/audio/BGM/loop0000weapon_01.mp3');
        this.load.audio('loop0000weapon_02', 'assets/audio/BGM/loop0000weapon_02.mp3');
        this.load.audio('loop0000weapon_03', 'assets/audio/BGM/loop0000weapon_03.mp3');
        this.load.audio('loop0000weapon_04', 'assets/audio/BGM/loop0000weapon_04.mp3');
    }
    create() {
        //INIT AUDIO
        this.soundInstance=[];
        //STINGERS
        this.stingerShot = false;
        this.stingerJet = false;
        this.stingerWalk = false;
        this.stingerMovement = false;
        //IMPACTS
        this.soundInstance[0]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[0][i] = this.sound.add('impact_00');
        }
        this.soundInstance[1]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[1][i] = this.sound.add('impact_01');
        }
        this.soundInstance[2]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[2][i] = this.sound.add('impact_02');
        }
        //SPECIAL
        this.soundInstance[3]=[];
        this.soundInstance[3][0]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[3][0][i] = this.sound.add('impact_03A');
        }
        this.soundInstance[3][1]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[3][1][i] = this.sound.add('impact_03B');
        }
        this.soundInstance[3][2]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[3][2][i] = this.sound.add('impact_03C');
        }
        this.soundInstance[3][3]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[3][3][i] = this.sound.add('impact_03D');
        }
        this.soundInstance[3][4]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[3][4][i] = this.sound.add('impact_03E');
        }
        //
        this.soundInstance[4]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[4][i] = this.sound.add('impact_04');
        }
        this.soundInstance[5]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[5][i] = this.sound.add('impact_05');
        }
        this.soundInstance[6]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[6][i] = this.sound.add('impact_06');
        }
        this.soundInstance[7]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[7][i] = this.sound.add('impact_07');
        }
        //UI
        this.soundInstance[8]= this.sound.add('weaponChange_00');
        
        this.soundInstance[9]= this.sound.add('movingPart_00');
        
        this.soundInstance[10]= this.sound.add('trigger_00');
        
        this.soundInstance[11]= this.sound.add('propellerStop_00');
        
        this.soundInstance[12]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[12][i] = this.sound.add('wick_00');
        }
        //EXPLOSION
        this.explosion_01 = this.sound.add('explosion_01');



        //SHOTS
        this.soundInstance[20]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[20][i] = this.sound.add('shot_00');
        }
        this.soundInstance[21]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[21][i] = this.sound.add('shot_01');
        }
        this.soundInstance[22]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[22][i] = this.sound.add('shot_02');
        }
        this.soundInstance[23]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[23][i] = this.sound.add('shot_03');
        }
        this.soundInstance[24]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[24][i] = this.sound.add('shot_04');
        }
        this.soundInstance[25]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[25][i] = this.sound.add('shot_05');
        }
        this.soundInstance[26]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[26][i] = this.sound.add('shot_06');
        }
        this.soundInstance[27]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            this.soundInstance[27][i] = this.sound.add('shot_07');
        }
        //UI LOOPS
        this.walkLoop = this.sound.add('walkLoop_00', {
            volume: this.volumeSFX,
            loop: true
        })
        this.propellerLoop = this.sound.add('propellerLoop_00', {
            volume: 0.0,
            loop: true
        })
        this.engineLoop = this.sound.add('engineLoop_00', {
            volume: 0.0,
            loop: true
        })
        //MUSIC LOOPS
        this.loopBase = this.sound.add('loop0000base', {
            volume: this.volumeBGM,
            loop: true
        })
        this.loopEnemies = this.sound.add('loop0000enemies', {
            volume: 0.0,
            loop: true
        })
        this.loopFliying = this.sound.add('loop0000flying', {
            volume: 0.0,
            loop: true
        })
        this.loopLevitating = this.sound.add('loop0000levitating', {
            volume: 0.0,
            loop: true
        })
        this.loopMovement = this.sound.add('loop0000moving', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon = [];
        this.bgmIfWeapon[0] = this.sound.add('loop0000weapon_00', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon[1] = this.sound.add('loop0000weapon_01', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon[2] = this.sound.add('loop0000weapon_02', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon[3] = this.sound.add('loop0000weapon_03', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon[4] = this.sound.add('loop0000weapon_04', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon[5] = this.sound.add('loop0000weapon_00', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon[6] = this.sound.add('loop0000weapon_01', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon[7] = this.sound.add('loop0000weapon_02', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon[8] = this.sound.add('loop0000weapon_03', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon[9] = this.sound.add('loop0000weapon_04', {
            volume: 0.0,
            loop: true
        })
        //INIT PLAY LEVEL0000
        this.loopBase.play();
        this.loopEnemies.play();
        this.loopFliying.play();
        this.loopLevitating.play();
        this.loopMovement.play();
        this.bgmIfWeapon[0].play();
        this.bgmIfWeapon[1].play();
        this.bgmIfWeapon[2].play();
        this.bgmIfWeapon[3].play();
        this.bgmIfWeapon[4].play();
        //THE LOAD.
        Audio.load = this;
        console.log("AUDIO LOADED: everything went better than expected :D !!!");
        //Let's go motherfuckers~ 
        this.scene.start("SceneLoading");
    }
}
