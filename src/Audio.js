export default class Audio extends Phaser.Scene {
    constructor() {
        super("Audio");
    }
    static counter = 0;
    static earlyPos = 0.0;
    static earlyPropeller = false;
    static earlyWeapon = -1;
    static tweenPropeller = false;
    static bpm = 104;
    static beat = 16;
    static barRate = 60*1000 / this.bpm * this.beat;
    static barRateDiv = [this.barRate / 2, this.barRate / 4, this.barRate / 8, this.barRate / 64, this.barRate / 128];
    static maxVolume = 1.0;
    static vanishingPoint = this.barRateDiv[2]*this.maxVolume;
    static halfDistance = this.vanishingPoint / 2;
    static volumeBGM = this.maxVolume;
    static volumeSFX = this.maxVolume;
    static load;
    static barTimer;
    static halfBarTimer;
    static maxSFXinstances=32;
    static SFXinstance=0;
    static stingerKilling=false;

    static createSFXinstance(name, num, load){
        load.soundInstance[num]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            load.soundInstance[num][i] = load.sound.add(name);
        }
    }
    static createSFXinstanceSub(name, num, sub, load){
        load.soundInstance[num][sub]=[];
        for(var i=0; i<Audio.maxSFXinstances; i++){
            load.soundInstance[num][sub][i] = load.sound.add(name);
        }
    }
    static startAudioEngine(scene){
        Audio.barTimer = scene.time.addEvent({
            delay: Audio.barRateDiv[0],
            callback: ()=> Audio.musicBar(scene),
            loop: true,
        });
        Audio.halfBarTimer = scene.time.addEvent({
            delay: Audio.barRateDiv[1],
            callback: ()=> Audio.musicHalfBar(scene),
            loop: true,
        });
        console.log("AUDIO ENGINE STARTED.")
    }
    static musicBar(scene) {
        this.counter++;
        this.musicLayerShot(scene);
        this.musicLayerKilling(scene);
        this.musicLayerJet(scene);
        this.musicLayerHeight(scene);
    }
    static musicHalfBar(scene) {
        this.musicLayerEnemies(scene);
        this.musicLayerMovement(scene);
    }
    static volumeBGM(value){
        this.volumeBGM = value;
    }
    static volumeSFX(value){
        this.volumeSFX = value;
    }
    static musicLayerHeight(scene) {
        var volumeNormalized = this.volumeBGM-((scene.game.player.earlyPos.y/4800)*this.volumeBGM);
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
            Audio.stingerKilling = false;
        } else if (scene.game.player.getClosestEnemyDistance() < 0.0) {
            var distance = this.volumeBGM;
        } else {
            var distance = (this.vanishingPoint - scene.game.player.getClosestEnemyDistance()) / this.vanishingPoint;
        }
                    scene.tweens.add({
                        targets: this.load.loopBase,
                        volume: this.volumeBGM-(this.volumeBGM*(distance/1)),
                        duration: this.barRateDiv[1],
                    });
                    scene.tweens.add({
                        targets: this.load.loopEnemies,
                        volume: this.volumeBGM*(distance/1),
                        duration: this.barRateDiv[2],
                    });
    }
    static musicLayerKilling(scene) {
        if (Audio.stingerKilling && scene.game.isFiring) {
            Audio.stingerKilling = false;
            scene.tweens.add({
                targets: this.load.loopKilling,
                volume: this.volumeBGM,
                duration: this.barRateDiv[2],
            });
        } else if (!Audio.stingerKilling){
            scene.tweens.add({
                targets: this.load.loopKilling,
                volume: 0.0,
                duration: this.barRateDiv[0],
            });
        }
    }
    static musicLayerShot(scene) {
        if (this.stingerShot && scene.game.player.getClosestEnemyDistance() < this.halfDistance) {
            this.stingerShot = false;
            for (var i = 0; i < scene.game.player.weapons.length; i++) {
                if (scene.game.player.weaponCounter == i) {
                    scene.tweens.add({
                        targets: this.load.bgmIfWeapon[i],
                        volume: this.volumeBGM,
                        duration: this.barRateDiv[2],
                    });
                } else {
                    scene.tweens.add({
                        targets: this.load.bgmIfWeapon[i],
                        volume: 0.0,
                        duration: this.barRateDiv[1],
                    });
                }
            }
        } else {
            for (var i = 0; i < scene.game.player.weapons.length; i++) {
                if (this.load.bgmIfWeapon[i].volume > 0.0) {
                    scene.tweens.add({
                        targets: this.load.bgmIfWeapon[i],
                        volume: 0.0,
                        duration: this.barRateDiv[0],
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
                duration: this.barRateDiv[0],
            });
        } else {
            scene.tweens.add({
                targets: this.load.loopLevitating,
                volume: 0.0,
                duration: this.barRateDiv[1],
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
        var SFXinstance= Audio.SFXinstance;
        this.load.soundInstance[type][SFXinstance].setRate(0.75 + (Math.random() * 0.25));
        this.load.soundInstance[type][SFXinstance].volume = Audio.volumeSFX;
        this.load.soundInstance[type][SFXinstance].play();
        if(Audio.SFXinstance==SFXinstance && SFXinstance<Audio.maxSFXinstances-1){
            Audio.SFXinstance++;
        }else{
            Audio.SFXinstance=0;
        }
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
        this.load.soundInstance[type][Audio.SFXinstance].volume = distance*Audio.volumeSFX;
        this.load.soundInstance[type][Audio.SFXinstance].play();
        var instance = this.load.soundInstance[type][Audio.SFXinstance];
        if(Audio.SFXinstance<Audio.maxSFXinstances-1){
            Audio.SFXinstance++;
        }else{
            Audio.SFXinstance=0;
        }
        return  instance;
    }
    static play3DinstanceSub(scene, type) {
        var rnd= [Math.round(Math.random()*2)];
        if (scene.distanceToPlayer() > this.vanishingPoint) {
            var distance = 0.0;
        } else if (scene.distanceToPlayer() < 0.0) {
            var distance = Audio.volumeSFX;
        } else {
            var distance = (this.vanishingPoint - scene.distanceToPlayer()) / this.vanishingPoint;
        }
        this.load.soundInstance[type][rnd][Audio.SFXinstance].setRate(0.80 + (Math.random() * 0.2));
        this.load.soundInstance[type][rnd][Audio.SFXinstance].volume = distance*Audio.volumeSFX;
        this.load.soundInstance[type][rnd][Audio.SFXinstance].play();
        if(Audio.SFXinstance<Audio.maxSFXinstances-1){
            Audio.SFXinstance++;
        }else{
            Audio.SFXinstance=0;
        }
    }
    static play3DinstanceRnd(scene, type, sub, bounces) {
        var rnd= Math.round(Math.random()*sub);
        var SFXinstance= Audio.SFXinstance;
        if (scene.distanceToPlayer() > this.vanishingPoint) {
            var distance = 0.0;
        } else if (scene.distanceToPlayer() < 0.0) {
            var distance = Audio.volumeSFX;
        } else {
            var distance = (this.vanishingPoint - scene.distanceToPlayer()) / this.vanishingPoint;
        }
        this.load.soundInstance[type][rnd][Audio.SFXinstance].setRate(0.75 + (Math.random() * 0.25));
        this.load.soundInstance[type][rnd][Audio.SFXinstance].volume = (distance*bounces)*Audio.volumeSFX;
        this.load.soundInstance[type][rnd][Audio.SFXinstance].play();
        if(Audio.SFXinstance<Audio.maxSFXinstances-1){
            Audio.SFXinstance++;
        }else{
            Audio.SFXinstance=0;
        }
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
        this.propellerFliying(scene);
        if (scene.game.isFiring && scene.game.player.energy==0.0 && !scene.game.player.activatedJet) {
            this.load.soundInstance[10].setRate(0.9 + scene.game.player.weaponCounter * 0.05);
            this.load.soundInstance[10].volume = Audio.volumeSFX;
            this.load.soundInstance[10].play();
        }
        if (scene.game.isFiring && !this.stingerShot) {
            this.stingerShot = true;
        }
        if (scene.game.player.activatedJet && !this.stingerJet) {
            this.stingerJet = true;
        }
        if (Math.floor(scene.game.player.earlyPos.x) != this.earlyPos && !scene.game.player.activatedJet && !this.stingerWalk && (scene.game.player.cursors.right.isDown || scene.game.player.cursors.left.isDown )) {
            this.stingerWalk = true;
            this.load.walkLoop.volume = Audio.volumeSFX;
            this.load.walkLoop.play();
        }
        if(this.stingerWalk && (scene.game.player.activatedJet || Math.floor(scene.game.player.earlyPos.x) == this.earlyPos)){
            this.stingerWalk = false;
            this.load.walkLoop.stop();
        }else if(this.stingerWalk && !scene.game.player.cursors.left.isDown && !scene.game.player.cursors.right.isDown){
            this.stingerWalk = false;
            this.load.walkLoop.stop();
        }
        if (!this.stingerSurface && Math.floor(scene.game.player.earlyPos.x) != this.earlyPos && !scene.game.player.activatedJet && scene.game.player.isTouching.ground && (scene.game.player.cursors.right.isDown || scene.game.player.cursors.left.isDown )) {
            this.stingerSurface = true;
            this.load.surfaceLoop.volume = Audio.volumeSFX;
            this.load.surfaceLoop.play();
            this.clockWalk = new Date();
        }
        if(this.stingerSurface && ( Math.floor(scene.game.player.earlyPos.x) == this.earlyPos || scene.game.player.activatedJet || !scene.game.player.isTouching.ground)){
            if(((new Date().getTime()-this.clockWalk.getTime()) % 125)<50){
                this.stingerSurface = false;
                this.load.surfaceLoop.stop();
                this.load.soundInstance[28].play();
            }
        }
        if (scene.game.player.weaponCounter != this.earlyWeapon) {
            this.earlyWeapon = scene.game.player.weaponCounter;
            this.load.soundInstance[8].setRate(0.9 + scene.game.player.weaponCounter * 0.05);
            this.load.soundInstance[8].volume = Audio.volumeSFX;
            this.load.soundInstance[8].play();
            this.load.soundInstance[9].setRate(0.9 + scene.game.player.weaponCounter * 0.05);
            this.load.soundInstance[9].volume = Audio.volumeSFX;
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
            this.load.soundInstance[9].volume = Audio.volumeSFX;
            this.load.soundInstance[9].setRate(0.4);
            this.load.soundInstance[9].play();
        } else if (!scene.game.player.activatedJet && this.earlyPropeller) {
            this.earlyPropeller = false;
            this.propellerTween=false;
            this.load.soundInstance[11].volume = Audio.volumeSFX;
            this.load.soundInstance[11].setRate(0.9 + (Math.random() * 0.1));
            this.load.soundInstance[11].play();
            Audio.load.propellerLoop.stop();
            Audio.load.engineLoop.stop();
            Audio.load.propellerLoop.setRate(0.001);
            Audio.load.propellerLoop.volume = 0.0;
        } else if (this.earlyPropeller && !this.propellerTween) {
            this.propellerTween=true;
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
        //AMBIENT
        this.load.audio('ambientLoop_00', 'assets/audio/SFX/ambientLoop_00.ogg');
        //IMPACTS
        this.load.audio('impact_00A', 'assets/audio/SFX/impact_00A.ogg');
        this.load.audio('impact_00B', 'assets/audio/SFX/impact_00B.ogg');
        this.load.audio('impact_00C', 'assets/audio/SFX/impact_00C.ogg');
        this.load.audio('impact_01A', 'assets/audio/SFX/impact_01A.ogg');
        this.load.audio('impact_01B', 'assets/audio/SFX/impact_01B.ogg');
        this.load.audio('impact_01C', 'assets/audio/SFX/impact_01C.ogg');
        this.load.audio('impact_02', 'assets/audio/SFX/impact_02.ogg');
        this.load.audio('impact_03A', 'assets/audio/SFX/impact_03A.ogg');
        this.load.audio('impact_03B', 'assets/audio/SFX/impact_03B.ogg');
        this.load.audio('impact_03C', 'assets/audio/SFX/impact_03C.ogg');
        this.load.audio('impact_03D', 'assets/audio/SFX/impact_03D.ogg');
        this.load.audio('impact_03E', 'assets/audio/SFX/impact_03E.ogg');
        this.load.audio('impact_04', 'assets/audio/SFX/impact_04.ogg');
        this.load.audio('impact_05', 'assets/audio/SFX/impact_05.ogg');
        this.load.audio('impact_06', 'assets/audio/SFX/impact_06.ogg');
        this.load.audio('impact_07', 'assets/audio/SFX/impact_07.ogg');
        //UI
        this.load.audio('weaponChange_00', 'assets/audio/SFX/weaponChange_00.ogg');
        this.load.audio('movingPart_00', 'assets/audio/SFX/movingPart_00.ogg');
        this.load.audio('trigger_00', 'assets/audio/SFX/trigger_00.ogg');
        this.load.audio('propellerStop_00', 'assets/audio/SFX/propellerStop_00.ogg');
        this.load.audio('wick_00', 'assets/audio/SFX/wick_00.ogg');
        //EXPLOSION
        this.load.audio('explosion_00A', 'assets/audio/SFX/explosion_00A.ogg');
        this.load.audio('explosion_00B', 'assets/audio/SFX/explosion_00B.ogg');
        this.load.audio('explosion_00C', 'assets/audio/SFX/explosion_00C.ogg');
        this.load.audio('explosion_01A', 'assets/audio/SFX/explosion_01A.ogg');
        this.load.audio('explosion_01B', 'assets/audio/SFX/explosion_01B.ogg');
        this.load.audio('explosion_01C', 'assets/audio/SFX/explosion_01C.ogg');
        this.load.audio('explosion_02', 'assets/audio/SFX/explosion_02.ogg');
        this.load.audio('explosion_03', 'assets/audio/SFX/explosion_03.ogg');
        this.load.audio('explosion_04', 'assets/audio/SFX/explosion_04.ogg');
        this.load.audio('explosion_05', 'assets/audio/SFX/explosion_05.ogg');
        //SHOTS
        this.load.audio('shot_00', 'assets/audio/SFX/shot_00.ogg');
        this.load.audio('shot_01', 'assets/audio/SFX/shot_01.ogg');
        this.load.audio('shot_02', 'assets/audio/SFX/shot_02.ogg');
        this.load.audio('shot_03', 'assets/audio/SFX/shot_03.ogg');
        this.load.audio('shot_04', 'assets/audio/SFX/shot_04.ogg');
        this.load.audio('shot_05', 'assets/audio/SFX/shot_05.ogg');
        this.load.audio('shot_06', 'assets/audio/SFX/shot_06.ogg');
        this.load.audio('shot_07', 'assets/audio/SFX/shot_07.ogg');
        //UI LOOPS
        this.load.audio('walkLoop_00', 'assets/audio/SFX/walkLoop_00.ogg');
        this.load.audio('surfaceLoop_00', 'assets/audio/SFX/surfaceLoop_00.ogg');
        this.load.audio('propellerLoop_00', 'assets/audio/SFX/propellerLoop_00.ogg');
        this.load.audio('engineLoop_00', 'assets/audio/SFX/engineLoop_00.ogg');
        this.load.audio('walkStop_00', 'assets/audio/SFX/walkStop_00.ogg');
        //MUSIC LOOPS

        this.load.audio('loop0000base', 'assets/audio/BGM/loop0000base.mp3');
        this.load.audio('loop0000enemies', 'assets/audio/BGM/loop0000enemies.mp3');
        this.load.audio('loop0000killing', 'assets/audio/BGM/loop0000killing.mp3');
        this.load.audio('loop0000flying', 'assets/audio/BGM/loop0000flying.mp3');
        this.load.audio('loop0000levitating', 'assets/audio/BGM/loop0000levitating.mp3');
        this.load.audio('loop0000moving', 'assets/audio/BGM/loop0000moving.mp3');
        this.load.audio('loop0000weapon_00', 'assets/audio/BGM/loop0000weapon_00.mp3');
        this.load.audio('loop0000weapon_01', 'assets/audio/BGM/loop0000weapon_01.mp3');
        this.load.audio('loop0000weapon_02', 'assets/audio/BGM/loop0000weapon_02.mp3');
        this.load.audio('loop0000weapon_03', 'assets/audio/BGM/loop0000weapon_03.mp3');
        this.load.audio('loop0000weapon_04', 'assets/audio/BGM/loop0000weapon_04.mp3');
        this.load.audio('loop0000weapon_05', 'assets/audio/BGM/loop0000weapon_05.mp3');
        this.load.audio('loop0000weapon_06', 'assets/audio/BGM/loop0000weapon_06.mp3');
        this.load.audio('loop0000weapon_07', 'assets/audio/BGM/loop0000weapon_07.mp3');

        /*this.load.audio('loop0000base', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('loop0000enemies', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('loop0000killing', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('loop0000flying', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('loop0000levitating', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('loop0000moving', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('loop0000weapon_00', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('loop0000weapon_01', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('loop0000weapon_02', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('loop0000weapon_03', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('loop0000weapon_04', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('loop0000weapon_05', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('loop0000weapon_06', 'assets/audio/SFX/walkLoop_00.mp3');
        this.load.audio('loop0000weapon_07', 'assets/audio/SFX/walkLoop_00.mp3');*/
    }
    create() {
        //INIT AUDIO
        this.soundInstance=[];
        this.clockWalk = new Date();
        //STINGERS
        this.stingerShot = false;
        this.stingerJet = false;
        this.stingerWalk = false;
        this.stingerMovement = false;
        this.stingerSurface = false;
        //IMPACTS
        this.soundInstance[0]=[];
        Audio.createSFXinstanceSub('impact_00A', 0, 0, this);
        Audio.createSFXinstanceSub('impact_00B', 0, 1, this);
        Audio.createSFXinstanceSub('impact_00C', 0, 2, this);
        this.soundInstance[1]=[];
        Audio.createSFXinstanceSub('impact_01A', 1, 0, this);
        Audio.createSFXinstanceSub('impact_01B', 1, 1, this);
        Audio.createSFXinstanceSub('impact_01C', 1, 2, this);
        Audio.createSFXinstance('impact_02', 2, this);
        this.soundInstance[3]=[];
        Audio.createSFXinstanceSub('impact_03A', 3, 0, this);
        Audio.createSFXinstanceSub('impact_03B', 3, 1, this);
        Audio.createSFXinstanceSub('impact_03C', 3, 2, this);
        Audio.createSFXinstanceSub('impact_03D', 3, 3, this);
        Audio.createSFXinstanceSub('impact_03E', 3, 4, this);
        //
        Audio.createSFXinstance('impact_04', 4, this);
        Audio.createSFXinstance('impact_05', 5, this);
        Audio.createSFXinstance('impact_06', 6, this);
        Audio.createSFXinstance('impact_07', 7, this);
        //UI_monoinstance
        this.soundInstance[8]= this.sound.add('weaponChange_00');
        this.soundInstance[9]= this.sound.add('movingPart_00');
        this.soundInstance[10]= this.sound.add('trigger_00');
        this.soundInstance[11]= this.sound.add('propellerStop_00');
        //EXTRA
        Audio.createSFXinstance('wick_00', 12, this);
        Audio.createSFXinstance('wick_00', 13, this);
        //EXPLOSION
        this.soundInstance[14]=[];
        Audio.createSFXinstanceSub('explosion_00A', 14, 0, this);
        Audio.createSFXinstanceSub('explosion_00B', 14, 1, this);
        Audio.createSFXinstanceSub('explosion_00C', 14, 2, this);
        this.soundInstance[15]=[];
        Audio.createSFXinstanceSub('explosion_01A', 15, 0, this);
        Audio.createSFXinstanceSub('explosion_01B', 15, 1, this);
        Audio.createSFXinstanceSub('explosion_01C', 15, 2, this);
        Audio.createSFXinstance('explosion_02', 16, this);
        Audio.createSFXinstance('explosion_03', 17, this);
        Audio.createSFXinstance('explosion_04', 18, this);
        Audio.createSFXinstance('explosion_05', 19, this);
        //SHOTS
        Audio.createSFXinstance('shot_00', 20, this);
        Audio.createSFXinstance('shot_01', 21, this);
        Audio.createSFXinstance('shot_02', 22, this);
        Audio.createSFXinstance('shot_03', 23, this);
        Audio.createSFXinstance('shot_04', 24, this);
        Audio.createSFXinstance('shot_05', 25, this);
        Audio.createSFXinstance('shot_06', 26, this);
        Audio.createSFXinstance('shot_07', 27, this);
        //
        this.soundInstance[28]= this.sound.add('walkStop_00');


        //UI LOOPS
        this.walkLoop = this.sound.add('walkLoop_00', {
            volume: this.volumeSFX,
            loop: true
        })
        this.surfaceLoop = this.sound.add('surfaceLoop_00', {
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
        this.ambientLoop = this.sound.add('ambientLoop_00', {
            volume: this.volumeSFX,
            loop: true
        })
        //MUSIC LOOPS
        this.loopBase = this.sound.add('loop0000base', {
            volume: 0.0,
            loop: true
        })
        this.loopEnemies = this.sound.add('loop0000enemies', {
            volume: 0.0,
            loop: true
        })
        this.loopKilling = this.sound.add('loop0000killing', {
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
        this.bgmIfWeapon[5] = this.sound.add('loop0000weapon_05', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon[6] = this.sound.add('loop0000weapon_06', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon[7] = this.sound.add('loop0000weapon_07', {
            volume: 0.0,
            loop: true
        })
        //esto lo he añadido como placeholder para el lasser
        this.bgmIfWeapon[8] = this.sound.add('loop0000weapon_01', {
            volume: 0.0,
            loop: true
        })
        //INIT PLAY LEVEL0000
        this.loopBase.play();
        this.loopEnemies.play();
        this.loopKilling.play();
        this.loopFliying.play();
        this.loopLevitating.play();
        this.loopMovement.play();
        this.ambientLoop.play();
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
