import Chatter from "./Chatter.js";

export default class Audio extends Phaser.Scene {
    constructor() {
        super("Audio");
    }
    static counter = 0;
    static earlyPos = 0.0;
    static earlyPropeller = false;
    static earlyWeapon = -1;
    static propellerTween = false;
    static bpm = 104;
    static beat = 16;
    static barRate = 60 * 1000 / this.bpm * this.beat;
    static barRateDiv = [this.barRate / 2, this.barRate / 4, this.barRate / 8, this.barRate / 64, this.barRate / 128];
    static vanishingPoint = 1080;
    static halfDistance = this.vanishingPoint / 2;
    static volumeBGM = 1.0;
    static volumeSFX = 1.0;
    static load;
    static maxSFXinstances = 28;
    static SFXinstance = 0;


    //letsTalk caller:
    static chat(words, scene, character){
        switch(character){
          case 0:
                Chatter.letsTalk(words, scene, 0, 0.7, 0.8);
            break;
          case 1:
                Chatter.letsTalk(words, scene, 1, 0.3, 0.2);
            break;
          case 2:
                Chatter.letsTalk(words, scene, 1, 0.1, 0.1);
            break;
          case 3:
                Chatter.letsTalk(words, scene, 1, 0.1, 0.1);
            break;
          case 4:
                Chatter.letsTalk(words, scene, 1, 0.1, 0.1);
            break;
          case 5:
                Chatter.letsTalk(words, scene, 1, 0.1, 0.1);
            break;
          case 6:
                Chatter.letsTalk(words, scene, 1, 0.1, 0.1);
            break;
        }
    }
    //SFX instance creators:
    static createSFXinstance(name, num, load) {
        load.soundInstance[num] = [];
        for (var i = 0; i < Audio.maxSFXinstances; i++) {
            load.soundInstance[num][i] = load.sound.add(name);
        }
    }
    static createSFXinstanceSub(name, num, sub, load) {
        load.soundInstance[num][sub] = [];
        for (var i = 0; i < Audio.maxSFXinstances; i++) {
            load.soundInstance[num][sub][i] = load.sound.add(name);
        }
    }
    static createSFXloopInstance(name, num, load) {
        load.soundInstance[num] = [];
        for (var i = 0; i < Audio.maxSFXinstances; i++) {
                load.soundInstance[num][i]= load.sound.add(name, {
                volume: this.volumeSFX,
                loop: true
            })
        }
    }
    //MUSIC ENGINE starter:
    static startAudioEngine(scene) {
        scene.time.addEvent({
            delay: Audio.barRateDiv[0],
            callback: () => Audio.musicBar(scene),
            loop: true,
        });
        scene.time.addEvent({
            delay: Audio.barRateDiv[1],
            callback: () => Audio.musicHalfBar(scene),
            loop: true,
        });
        console.log("MUSIC ENGINE STARTED.")
    }
    //EVERY BAR MUSIC UPDATES:
    static musicBar(scene) {
        this.counter++;
        this.musicLayerHeight(scene);
        this.musicLayerMovement(scene);
        //this.musicLayerEnemies(scene);
    }
    //EVERY HALF BAR MUSIC UPDATES:
    static musicHalfBar(scene) {
        this.musicLayerJet(scene);
        //this.musicLayerChill(scene);
    }
    static musicLayerHeight(scene) {
        var volumeNormalized = this.volumeBGM - ((scene.game.player.earlyPos.y / 4096) * this.volumeBGM);
        if (volumeNormalized <= this.volumeBGM && volumeNormalized > 0.0) {
            scene.tweens.add({
                targets: this.load.musicLoop0000levitating,
                volume: volumeNormalized,
                duration: this.barRateDiv[0],
            });
        }
    }
    static musicLayerMovement(scene) {
        if (this.stingerMovement) {
            this.stingerMovement = false;
            scene.tweens.add({
                targets: this.load.musicLoop0000moving,
                volume: this.volumeBGM,
                duration: this.barRateDiv[1],
            });
        } else {
            scene.tweens.add({
                targets: this.load.musicLoop0000moving,
                volume: 0.0,
                duration: this.barRateDiv[1],
            });
        }
    }
    static musicLayerJet(scene) {
        if (this.stingerJet) {
            this.stingerJet = false;
            scene.tweens.add({
                targets: this.load.musicLoop0000flying,
                volume: this.volumeBGM,
                duration: this.barRateDiv[2],
            });
        } else {
            scene.tweens.add({
                targets: this.load.musicLoop0000flying,
                volume: 0.0,
                duration: this.barRateDiv[2],
            });
        }
    }
    static musicLayerChill(scene) {
        if (Audio.stingerChill && scene.game.player.inRoom()) {
            Audio.stingerChill = false;
            scene.tweens.add({
                targets: this.load.musicLoop0000levitating,
                volume: 0.0,
                duration: this.barRateDiv[2],
            });
            scene.tweens.add({
                targets: this.load.musicLoop0000moving,
                volume: 0.0,
                duration: this.barRateDiv[2],
            });
            scene.tweens.add({
                targets: this.load.musicLoop0000flying,
                volume: 0.0,
                duration: this.barRateDiv[2],
            });
            scene.tweens.add({
                targets: this.load.musicLoop0000chill,
                volume: this.volumeBGM,
                duration: this.barRateDiv[2],
            });
            console.log("IN CHILL")
        } else if (!Audio.stingerChill && !scene.game.player.inRoom()) {
            scene.tweens.add({
                targets: this.load.musicLoop0000levitating,
                volume: this.volumeBGM,
                duration: this.barRateDiv[2],
            });
            scene.tweens.add({
                targets: this.load.musicLoop0000moving,
                volume: this.volumeBGM,
                duration: this.barRateDiv[2],
            });
            scene.tweens.add({
                targets: this.load.musicLoop0000flying,
                volume: this.volumeBGM,
                duration: this.barRateDiv[2],
            });
            scene.tweens.add({
                targets: this.load.musicLoop0000chill,
                volume: 0.0,
                duration: this.barRateDiv[2],
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
            volume: this.volumeBGM - (this.volumeBGM * (distance / 1)),
            duration: this.barRateDiv[1],
        });
        scene.tweens.add({
            targets: this.load.loopEnemies,
            volume: this.volumeBGM * (distance / 1),
            duration: this.barRateDiv[2],
        });
    }
    static volume2D(length) {
        if (length > this.vanishingPoint) {
            var distance = 0.0;
        } else if (length < 0.0) {
            var distance = Audio.volumeSFX;
        } else {
            var distance = (this.vanishingPoint - length) / this.vanishingPoint;
        }
        if (distance * Audio.volumeSFX == Audio.volumeSFX) {
            return 0.0;
        }
        return distance * Audio.volumeSFX;
    }
    static volume3D(scene) {
        if (scene.distanceToPlayer() > this.vanishingPoint) {
            var distance = 0.0;
        } else if (scene.distanceToPlayer() < 0.0) {
            var distance = Audio.volumeSFX;
        } else {
            var distance = (this.vanishingPoint - scene.distanceToPlayer()) / this.vanishingPoint;
        }
        if (distance * Audio.volumeSFX == Audio.volumeSFX) {
            return 0.0;
        }
        return distance * Audio.volumeSFX;
    }
    static play2Dinstance(type) {
        this.load.soundInstance[type][Audio.SFXinstance].setRate(0.80 + (Math.random() * 0.2));
        this.load.soundInstance[type][Audio.SFXinstance].setDetune(-50 + (Math.random() * 100));
        this.load.soundInstance[type][Audio.SFXinstance].volume = Audio.volumeSFX;
        this.load.soundInstance[type][Audio.SFXinstance].play();
        if (Audio.SFXinstance == Audio.SFXinstance && Audio.SFXinstance < Audio.maxSFXinstances - 1) {
            Audio.SFXinstance++;
        } else {
            Audio.SFXinstance = 0;
        }
        return this.load.soundInstance[type][Audio.SFXinstance];
    }
    static play2DinstanceRate(type, rate) {
        this.load.soundInstance[type][Audio.SFXinstance].setRate(rate);
        this.load.soundInstance[type][Audio.SFXinstance].volume = Audio.volumeSFX;
        this.load.soundInstance[type][Audio.SFXinstance].play();
        if (Audio.SFXinstance == Audio.SFXinstance && Audio.SFXinstance < Audio.maxSFXinstances - 1) {
            Audio.SFXinstance++;
        } else {
            Audio.SFXinstance = 0;
        }
    }
    static play2DinstanceRnd(type) {
        var rnd = [Math.floor(Math.random() * this.load.soundInstance[type].length)];
        this.load.soundInstance[type][rnd][Audio.SFXinstance].setRate(0.80 + (Math.random() * 0.2));
        this.load.soundInstance[type][rnd][Audio.SFXinstance].setDetune(-100 + (Math.random() * 200));
        this.load.soundInstance[type][rnd][Audio.SFXinstance].volume = Audio.volumeSFX;
        this.load.soundInstance[type][rnd][Audio.SFXinstance].play();
        var instance = this.load.soundInstance[type][rnd][Audio.SFXinstance];
        if (Audio.SFXinstance < Audio.maxSFXinstances - 1) {
            Audio.SFXinstance++;
        } else {
            Audio.SFXinstance = 0;
        }
        return instance;
    }
    static play3Dinstance(scene, type) {
        this.load.soundInstance[type][Audio.SFXinstance].setRate(0.80 + (Math.random() * 0.2));
        this.load.soundInstance[type][Audio.SFXinstance].setDetune(-100 + (Math.random() * 200));
        this.load.soundInstance[type][Audio.SFXinstance].volume = Audio.volume3D(scene);
        this.load.soundInstance[type][Audio.SFXinstance].play();
        var instance = this.load.soundInstance[type][Audio.SFXinstance];
        if (Audio.SFXinstance < Audio.maxSFXinstances - 1) {
            Audio.SFXinstance++;
        } else {
            Audio.SFXinstance = 0;
        }
        return instance;
    }
    static play3DenemyInstance(scene, type) {
        this.load.soundInstance[type][Audio.SFXinstance].setRate(0.80 + (Math.random() * 0.2));
        this.load.soundInstance[type][Audio.SFXinstance].setDetune(-100 + (Math.random() * 200));
        this.load.soundInstance[type][Audio.SFXinstance].volume = Audio.volumeSFX;
        this.load.soundInstance[type][Audio.SFXinstance].play();
        var instance = this.load.soundInstance[type][Audio.SFXinstance];
        if (Audio.SFXinstance < Audio.maxSFXinstances - 1) {
            Audio.SFXinstance++;
        } else {
            Audio.SFXinstance = 0;
        }
        return instance;
    }
    static play3DinstanceRnd(scene, type) {
        var rnd = [Math.floor(Math.random() * this.load.soundInstance[type].length)];
        this.load.soundInstance[type][rnd][Audio.SFXinstance].setRate(0.80 + (Math.random() * 0.2));
        this.load.soundInstance[type][rnd][Audio.SFXinstance].setDetune(-100 + (Math.random() * 200));
        this.load.soundInstance[type][rnd][Audio.SFXinstance].volume = Audio.volume3D(scene);
        this.load.soundInstance[type][rnd][Audio.SFXinstance].play();
        var instance = this.load.soundInstance[type][rnd][Audio.SFXinstance];
        if (Audio.SFXinstance < Audio.maxSFXinstances - 1) {
            Audio.SFXinstance++;
        } else {
            Audio.SFXinstance = 0;
        }
        return instance;
    }
    static play3DinstanceVolume(scene, type, volume) {
        this.load.soundInstance[type][Audio.SFXinstance].setRate(0.80 + (Math.random() * 0.2));
        this.load.soundInstance[type][Audio.SFXinstance].setDetune(-100 + (Math.random() * 200));
        this.load.soundInstance[type][Audio.SFXinstance].volume = Audio.volume3D(scene)*volume;
        this.load.soundInstance[type][Audio.SFXinstance].play();
        var instance = this.load.soundInstance[type][Audio.SFXinstance];
        if (Audio.SFXinstance < Audio.maxSFXinstances - 1) {
            Audio.SFXinstance++;
        } else {
            Audio.SFXinstance = 0;
        }
        return instance;
    }
    static play3DinstanceNoRate(scene, type) {
        this.load.soundInstance[type][Audio.SFXinstance].setRate(1.0);
        this.load.soundInstance[type][Audio.SFXinstance].setDetune(-25 + (Math.random() * 50));
        this.load.soundInstance[type][Audio.SFXinstance].volume = Audio.volume3D(scene);
        this.load.soundInstance[type][Audio.SFXinstance].play();
        var instance = this.load.soundInstance[type][Audio.SFXinstance];
        if (Audio.SFXinstance < Audio.maxSFXinstances - 1) {
            Audio.SFXinstance++;
        } else {
            Audio.SFXinstance = 0;
        }
        return instance;
    }
    static play3DinstanceRndVolume(scene, type, volume) {
        var rnd = [Math.floor(Math.random() * this.load.soundInstance[type].length)];
        this.load.soundInstance[type][rnd][Audio.SFXinstance].setRate(0.80 + (Math.random() * 0.2));
        this.load.soundInstance[type][rnd][Audio.SFXinstance].setDetune(-100 + (Math.random() * 200));
        this.load.soundInstance[type][rnd][Audio.SFXinstance].volume = Audio.volume3D(scene)*volume;
        this.load.soundInstance[type][rnd][Audio.SFXinstance].play();
        var instance = this.load.soundInstance[type][rnd][Audio.SFXinstance];
        if (Audio.SFXinstance < Audio.maxSFXinstances - 1) {
            Audio.SFXinstance++;
        } else {
            Audio.SFXinstance = 0;
        }
        return instance;
    }
    static audioUpdate(scene) {
        this.propellerFliying(scene);
        if (scene.game.isFiring && scene.game.player.energy == 0.0 && !scene.game.player.activatedJet) {
            Audio.play2DinstanceRate(10, 0.8 + scene.game.player.weaponCounter * 0.05);
        }
        if (scene.game.player.inRoom() && !this.stingerChill) {
            this.stingerChill = true;
        }
        if (scene.game.isFiring && !this.stingerShot) {
            this.stingerShot = true;
        }
        if (scene.game.player.activatedJet && !this.stingerJet) {
            this.stingerJet = true;
        }
        if (!this.stingerSurface && Math.floor(scene.game.player.earlyPos.x) != this.earlyPos && !scene.game.player.activatedJet && scene.game.player.isTouching.ground && (scene.game.player.cursors.right.isDown || scene.game.player.cursors.left.isDown)) {
            this.stingerSurface = true;
            this.load.surfaceLoop.volume = Audio.volumeSFX;
            this.load.surfaceLoop.setDetune(-25 + (Math.random() * 50));
            this.load.surfaceLoop.play();
            this.load.walkLoop.volume = Audio.volumeSFX;
            this.load.walkLoop.setDetune(-25 + (Math.random() * 50));
            this.load.walkLoop.play();
        }
        if (this.stingerSurface && (Math.floor(scene.game.player.earlyPos.x) == this.earlyPos || scene.game.player.activatedJet || !scene.game.player.isTouching.ground)) {
            this.stingerSurface = false;
            this.load.surfaceLoop.stop();
            this.load.walkLoop.stop();
            Audio.play2DinstanceRate(28, 1.0);
        }
        if (scene.game.player.weaponCounter != this.earlyWeapon) {
            this.earlyWeapon = scene.game.player.weaponCounter;
            Audio.play2DinstanceRate(8, 0.8 + scene.game.player.weaponCounter * 0.05);
            Audio.play2DinstanceRate(9, 0.8 + scene.game.player.weaponCounter * 0.05);
        }
        if (Math.floor(scene.game.player.earlyPos.x) != this.earlyPos) {
            this.earlyPos = Math.floor(scene.game.player.earlyPos.x);
            this.stingerMovement = true;
        }
    }
    static lasserLoop(on){
        if(on){
            Audio.play2Dinstance(32);
            this.load.lasserLoop.setDetune(-50 + (Math.random() * 100));
            this.load.lasserLoop.play();
            this.load.beamLoop.setDetune(-50 + (Math.random() * 100));
            this.load.beamLoop.play();
        }else{
            Audio.play2Dinstance(33);
            this.load.lasserLoop.stop();
            this.load.beamLoop.stop();
        }
        return  this.load.beamLoop;
    }
    static lasserSufferingLoop(on){
        if(on){
            this.load.lasserSufferingLoop.play();
        }else{
            this.load.lasserSufferingLoop.stop();
        }
        return  this.load.lasserSufferingLoop;
    }
    static propellerFliying(scene) {
        if (scene.game.player.activatedJet && !this.earlyPropeller) {
            this.earlyPropeller = true;
            this.load.engineLoop.setDetune(-25 + (Math.random() * 50));
            this.load.engineLoop.play();
            this.load.propellerLoop.setDetune(-25 + (Math.random() * 50));
            this.load.propellerLoop.play();
            Audio.play2Dinstance(71);
            Audio.play2DinstanceRate(9, 0.4);
        } else if (!scene.game.player.activatedJet && this.earlyPropeller) {
            this.earlyPropeller = false;
            this.propellerTween = false;
            Audio.play2Dinstance(11);
            Audio.load.propellerLoop.stop();
            Audio.load.propellerLoop.setRate(1.0);
            Audio.load.engineLoop.stop();
        } else if (this.earlyPropeller && !this.propellerTween) {
            this.propellerTween = true;
            scene.tweens.add({
                targets: Audio.load.propellerLoop,
                volume: this.volumeSFX,
                rate: 0.4,
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
        this.load.audio('impact_05A', 'assets/audio/SFX/impact_05A.ogg');
        this.load.audio('impact_05B', 'assets/audio/SFX/impact_05B.ogg');
        this.load.audio('impact_05C', 'assets/audio/SFX/impact_05C.ogg');
        this.load.audio('impact_06', 'assets/audio/SFX/impact_06.ogg');
        this.load.audio('impact_07', 'assets/audio/SFX/impact_07.ogg');
        this.load.audio('ballBounce_00A', 'assets/audio/SFX/ballBounce_00A.ogg');
        this.load.audio('ballBounce_00B', 'assets/audio/SFX/ballBounce_00B.ogg');
        //UI
        this.load.audio('null', 'assets/audio/SFX/null.ogg');
        this.load.audio('weaponChange_00', 'assets/audio/SFX/weaponChange_00.ogg');
        this.load.audio('movingPart_00', 'assets/audio/SFX/movingPart_00.ogg');
        this.load.audio('trigger_00', 'assets/audio/SFX/trigger_00.ogg');
        this.load.audio('propellerStop_00', 'assets/audio/SFX/propellerStop_00.ogg');
        this.load.audio('propellerStart_00', 'assets/audio/SFX/propellerStart_00.ogg');
        this.load.audio('wick_00', 'assets/audio/SFX/wick_00.ogg');
        this.load.audio('wick_01', 'assets/audio/SFX/wick_01.ogg');
        this.load.audio('wick_02', 'assets/audio/SFX/wick_02.ogg');
        this.load.audio('wick_03', 'assets/audio/SFX/wick_03.ogg');
        this.load.audio('trace_00', 'assets/audio/SFX/trace_00.ogg');
        this.load.audio('trace_01', 'assets/audio/SFX/trace_01.ogg');
        this.load.audio('lasserStart_00', 'assets/audio/SFX/lasserStart_00.ogg');
        this.load.audio('lasserStop_00', 'assets/audio/SFX/lasserStop_00.ogg');
        this.load.audio('walkStop_00', 'assets/audio/SFX/walkStop_00.ogg');
        this.load.audio('dropEnergy', 'assets/audio/SFX/dropEnergy.ogg');
        this.load.audio('dropHealth', 'assets/audio/SFX/dropHealth.ogg');
        this.load.audio('openChest', 'assets/audio/SFX/openChest.ogg');
        this.load.audio('hurtZap_00A', 'assets/audio/SFX/hurtZap_00A.ogg');
        this.load.audio('hurtZap_00B', 'assets/audio/SFX/hurtZap_00B.ogg');
        this.load.audio('hurtZap_00C', 'assets/audio/SFX/hurtZap_00C.ogg');
        this.load.audio('hurtZap_00D', 'assets/audio/SFX/hurtZap_00D.ogg');
        //EXPLOSION
        this.load.audio('explosion_00A', 'assets/audio/SFX/explosion_00A.ogg');
        this.load.audio('explosion_00B', 'assets/audio/SFX/explosion_00B.ogg');
        this.load.audio('explosion_00C', 'assets/audio/SFX/explosion_00C.ogg');
        this.load.audio('explosion_01A', 'assets/audio/SFX/explosion_01A.ogg');
        this.load.audio('explosion_01B', 'assets/audio/SFX/explosion_01B.ogg');
        this.load.audio('explosion_01C', 'assets/audio/SFX/explosion_01C.ogg');
        this.load.audio('explosion_02A', 'assets/audio/SFX/explosion_02A.ogg');
        this.load.audio('explosion_02B', 'assets/audio/SFX/explosion_02B.ogg');
        this.load.audio('explosion_02C', 'assets/audio/SFX/explosion_02C.ogg');
        this.load.audio('explosion_03A', 'assets/audio/SFX/explosion_03A.ogg');
        this.load.audio('explosion_03B', 'assets/audio/SFX/explosion_03B.ogg');
        this.load.audio('explosion_03C', 'assets/audio/SFX/explosion_03C.ogg');
        this.load.audio('explosion_04A', 'assets/audio/SFX/explosion_04A.ogg');
        this.load.audio('explosion_04B', 'assets/audio/SFX/explosion_04B.ogg');
        this.load.audio('explosion_04C', 'assets/audio/SFX/explosion_04C.ogg');
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
        this.load.audio('lasserLoop_00', 'assets/audio/SFX/lasserLoop_00.ogg');
        this.load.audio('beamLoop_00', 'assets/audio/SFX/beamLoop_00.ogg');
        //ENEMIES
        this.load.audio('droneLoop', 'assets/audio/SFX/enemies/droneLoop.ogg');
        this.load.audio('droneLoopDetect', 'assets/audio/SFX/enemies/droneLoopDetect.ogg');
        this.load.audio('damage_00A', 'assets/audio/SFX/enemies/damage_00A.ogg');
        this.load.audio('damage_00B', 'assets/audio/SFX/enemies/damage_00B.ogg');
        this.load.audio('damage_00C', 'assets/audio/SFX/enemies/damage_00C.ogg');
        this.load.audio('damage_01A', 'assets/audio/SFX/enemies/damage_01A.ogg');
        this.load.audio('damage_01B', 'assets/audio/SFX/enemies/damage_01B.ogg');
        this.load.audio('damage_01C', 'assets/audio/SFX/enemies/damage_01C.ogg');
        this.load.audio('damage_02A', 'assets/audio/SFX/enemies/damage_02A.ogg');
        this.load.audio('damage_02B', 'assets/audio/SFX/enemies/damage_02B.ogg');
        this.load.audio('damage_02C', 'assets/audio/SFX/enemies/damage_02C.ogg');
        this.load.audio('damage_03A', 'assets/audio/SFX/enemies/damage_03A.ogg');
        this.load.audio('damage_03B', 'assets/audio/SFX/enemies/damage_03B.ogg');
        this.load.audio('damage_03C', 'assets/audio/SFX/enemies/damage_03C.ogg');
        this.load.audio('gunnerLoop', 'assets/audio/SFX/enemies/gunnerLoop.ogg');
        this.load.audio('gunnerLoopDetect', 'assets/audio/SFX/enemies/gunnerLoopDetect.ogg');
        this.load.audio('homingLoop', 'assets/audio/SFX/enemies/homingLoop.ogg');
        this.load.audio('homingLoopDetect', 'assets/audio/SFX/enemies/homingLoopDetect.ogg');
        this.load.audio('zapperLoop', 'assets/audio/SFX/enemies/zapperLoop.ogg');
        this.load.audio('zapperLoopDetect', 'assets/audio/SFX/enemies/zapperLoopDetect.ogg');
        this.load.audio('swordLoop', 'assets/audio/SFX/enemies/swordLoop.ogg');
        this.load.audio('swordLoopDetect', 'assets/audio/SFX/enemies/swordLoopDetect.ogg');
        this.load.audio('mechaLoop', 'assets/audio/SFX/enemies/mechaLoop.ogg');
        this.load.audio('mechaLoopDetect', 'assets/audio/SFX/enemies/mechaLoopDetect.ogg');
        this.load.audio('hit_00A', 'assets/audio/SFX/enemies/hit_00A.ogg');
        this.load.audio('hit_00B', 'assets/audio/SFX/enemies/hit_00B.ogg');
        this.load.audio('hit_00C', 'assets/audio/SFX/enemies/hit_00C.ogg');
        this.load.audio('hit_01A', 'assets/audio/SFX/enemies/hit_01A.ogg');
        this.load.audio('hit_01B', 'assets/audio/SFX/enemies/hit_01B.ogg');
        this.load.audio('hit_01C', 'assets/audio/SFX/enemies/hit_01C.ogg');
        this.load.audio('airDeath_00A', 'assets/audio/SFX/enemies/airDeath_00A.ogg');
        this.load.audio('airDeath_00B', 'assets/audio/SFX/enemies/airDeath_00B.ogg');
        this.load.audio('airDeath_00C', 'assets/audio/SFX/enemies/airDeath_00C.ogg');
        this.load.audio('shot', 'assets/audio/SFX/enemies/shot.ogg');
        this.load.audio('lasserSufferingLoop', 'assets/audio/SFX/enemies/lasserSufferingLoop.ogg');
        this.load.audio('zap', 'assets/audio/SFX/enemies/zap.ogg');
        this.load.audio('zapAir', 'assets/audio/SFX/enemies/zapAir.ogg');
        this.load.audio('groundDeath_00A', 'assets/audio/SFX/enemies/groundDeath_00A.ogg');
        this.load.audio('groundDeath_00B', 'assets/audio/SFX/enemies/groundDeath_00B.ogg');
        this.load.audio('groundDeath_00C', 'assets/audio/SFX/enemies/groundDeath_00C.ogg');
        this.load.audio('groundDeath_01A', 'assets/audio/SFX/enemies/groundDeath_01A.ogg');
        this.load.audio('groundDeath_01B', 'assets/audio/SFX/enemies/groundDeath_01B.ogg');
        this.load.audio('groundDeath_01C', 'assets/audio/SFX/enemies/groundDeath_01C.ogg');
        this.load.audio('groundDeath_02A', 'assets/audio/SFX/enemies/groundDeath_02A.ogg');
        this.load.audio('groundDeath_02B', 'assets/audio/SFX/enemies/groundDeath_02B.ogg');
        this.load.audio('groundDeath_02C', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_00A', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_00B', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_00C', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_00C', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_01A', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_01B', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_01C', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_01C', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_02A', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_02B', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_02C', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_02C', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_03A', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_03B', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_03C', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_03C', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_04A', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_04B', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_04C', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_04C', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_05A', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_05B', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_05C', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_05C', 'assets/audio/SFX/enemies/groundDeath_02C.ogg');
        this.load.audio('explode_00A', 'assets/audio/SFX/enemies/explode_00A.ogg');
        this.load.audio('explode_00B', 'assets/audio/SFX/enemies/explode_00B.ogg');
        this.load.audio('explode_00C', 'assets/audio/SFX/enemies/explode_00C.ogg');
        this.load.audio('explode_00C', 'assets/audio/SFX/enemies/explode_00D.ogg');
        this.load.audio('explode_01A', 'assets/audio/SFX/enemies/explode_01A.ogg');
        this.load.audio('explode_01B', 'assets/audio/SFX/enemies/explode_01B.ogg');
        this.load.audio('explode_01C', 'assets/audio/SFX/enemies/explode_01C.ogg');
        this.load.audio('explode_01C', 'assets/audio/SFX/enemies/explode_01D.ogg');
        this.load.audio('explode_02A', 'assets/audio/SFX/enemies/explode_02A.ogg');
        this.load.audio('explode_02B', 'assets/audio/SFX/enemies/explode_02B.ogg');
        this.load.audio('explode_02C', 'assets/audio/SFX/enemies/explode_02C.ogg');
        this.load.audio('explode_02C', 'assets/audio/SFX/enemies/explode_02D.ogg');
        this.load.audio('explode_03A', 'assets/audio/SFX/enemies/explode_03A.ogg');
        this.load.audio('explode_03B', 'assets/audio/SFX/enemies/explode_03B.ogg');
        this.load.audio('explode_03C', 'assets/audio/SFX/enemies/explode_03C.ogg');
        this.load.audio('explode_03C', 'assets/audio/SFX/enemies/explode_03D.ogg');
        this.load.audio('explode_04A', 'assets/audio/SFX/enemies/explode_04A.ogg');
        this.load.audio('explode_04B', 'assets/audio/SFX/enemies/explode_04B.ogg');
        this.load.audio('explode_04C', 'assets/audio/SFX/enemies/explode_04C.ogg');
        this.load.audio('explode_04C', 'assets/audio/SFX/enemies/explode_04D.ogg');
        this.load.audio('explode_05A', 'assets/audio/SFX/enemies/explode_05A.ogg');
        this.load.audio('explode_05B', 'assets/audio/SFX/enemies/explode_05B.ogg');
        this.load.audio('explode_05C', 'assets/audio/SFX/enemies/explode_05C.ogg');
        this.load.audio('explode_05C', 'assets/audio/SFX/enemies/explode_05D.ogg');


        //MUSIC LOOPS
        this.load.audio('musicLoop0000levitating', 'assets/audio/BGM/musicLoop0000levitating.ogg');
        this.load.audio('musicLoop0000moving', 'assets/audio/BGM/musicLoop0000moving.ogg');
        this.load.audio('musicLoop0000flying', 'assets/audio/BGM/musicLoop0000flying.ogg');
        this.load.audio('musicLoop0000chill', 'assets/audio/BGM/musicLoop0000chill.ogg');
        /*this.load.audio('musicLoop0000levitating', 'assets/audio/SFX/null.ogg');
        this.load.audio('musicLoop0000moving', 'assets/audio/SFX/null.ogg');
        this.load.audio('musicLoop0000flying', 'assets/audio/SFX/null.ogg');
        this.load.audio('musicLoop0000chill', 'assets/audio/SFX/null.ogg');*/
    }
    create() {
        //INIT AUDIO
        this.soundInstance = [];
        //STINGERS
        this.stingerShot = false;
        this.stingerJet = false;
        this.stingerMovement = false;
        this.stingerSurface = false;
        this.stingerChill = false;
        this.overallVolume = 0.0;
        //IMPACTS
        this.soundInstance[0] = [];
        Audio.createSFXinstanceSub('impact_00A', 0, 0, this);
        Audio.createSFXinstanceSub('impact_00B', 0, 1, this);
        Audio.createSFXinstanceSub('impact_00C', 0, 2, this);
        this.soundInstance[1] = [];
        Audio.createSFXinstanceSub('impact_01A', 1, 0, this);
        Audio.createSFXinstanceSub('impact_01B', 1, 1, this);
        Audio.createSFXinstanceSub('impact_01C', 1, 2, this);
        Audio.createSFXinstance('impact_02', 2, this);
        this.soundInstance[3] = [];
        Audio.createSFXinstanceSub('impact_03A', 3, 0, this);
        Audio.createSFXinstanceSub('impact_03B', 3, 1, this);
        Audio.createSFXinstanceSub('impact_03C', 3, 2, this);
        Audio.createSFXinstanceSub('impact_03D', 3, 3, this);
        Audio.createSFXinstanceSub('impact_03E', 3, 4, this);
        Audio.createSFXinstance('impact_04', 4, this);
        this.soundInstance[5] = [];
        Audio.createSFXinstanceSub('impact_05A', 5, 0, this);
        Audio.createSFXinstanceSub('impact_05B', 5, 1, this);
        Audio.createSFXinstanceSub('impact_05C', 5, 2, this);
        Audio.createSFXinstance('impact_06', 6, this);
        Audio.createSFXinstance('impact_07', 7, this);
        //
        Audio.createSFXinstance('weaponChange_00', 8, this);
        Audio.createSFXinstance('movingPart_00', 9, this);
        Audio.createSFXinstance('trigger_00', 10, this);
        Audio.createSFXinstance('propellerStop_00', 11, this);
        //
        Audio.createSFXinstance('wick_00', 12, this);
        Audio.createSFXinstance('wick_01', 13, this);
        //
        this.soundInstance[14] = [];
        Audio.createSFXinstanceSub('explosion_00A', 14, 0, this);
        Audio.createSFXinstanceSub('explosion_00B', 14, 1, this);
        Audio.createSFXinstanceSub('explosion_00C', 14, 2, this);
        this.soundInstance[15] = [];
        Audio.createSFXinstanceSub('explosion_01A', 15, 0, this);
        Audio.createSFXinstanceSub('explosion_01B', 15, 1, this);
        Audio.createSFXinstanceSub('explosion_01C', 15, 2, this);
        this.soundInstance[16] = [];
        Audio.createSFXinstanceSub('explosion_02A', 16, 0, this);
        Audio.createSFXinstanceSub('explosion_02B', 16, 1, this);
        Audio.createSFXinstanceSub('explosion_02C', 16, 2, this);
        this.soundInstance[17] = [];
        Audio.createSFXinstanceSub('explosion_03A', 17, 0, this);
        Audio.createSFXinstanceSub('explosion_03B', 17, 1, this);
        Audio.createSFXinstanceSub('explosion_03C', 17, 2, this);
        this.soundInstance[18] = [];
        Audio.createSFXinstanceSub('explosion_04A', 18, 0, this);
        Audio.createSFXinstanceSub('explosion_04B', 18, 1, this);
        Audio.createSFXinstanceSub('explosion_04C', 18, 2, this);
        Audio.createSFXinstance('explosion_05', 19, this);
        //
        Audio.createSFXinstance('shot_00', 20, this);
        Audio.createSFXinstance('shot_01', 21, this);
        Audio.createSFXinstance('shot_02', 22, this);
        Audio.createSFXinstance('shot_03', 23, this);
        Audio.createSFXinstance('shot_04', 24, this);
        Audio.createSFXinstance('shot_05', 25, this);
        Audio.createSFXinstance('shot_06', 26, this);
        Audio.createSFXinstance('shot_07', 27, this);
        //
        Audio.createSFXinstance('walkStop_00', 28, this);
        Audio.createSFXinstance('trace_00', 29, this);
        Audio.createSFXinstance('trace_01', 30, this);
        Audio.createSFXinstance('wick_02', 31, this);
        Audio.createSFXinstance('lasserStart_00', 32, this);
        Audio.createSFXinstance('lasserStop_00', 33, this);
        //
        Audio.createSFXloopInstance('droneLoop', 34, this);
        Audio.createSFXloopInstance('droneLoopDetect', 35, this);
        this.soundInstance[36] = [];
        Audio.createSFXinstanceSub('damage_00A', 36, 0, this);
        Audio.createSFXinstanceSub('damage_00B', 36, 1, this);
        Audio.createSFXinstanceSub('damage_00C', 36, 2, this);
        this.soundInstance[37] = [];
        Audio.createSFXinstanceSub('damage_01A', 37, 0, this);
        Audio.createSFXinstanceSub('damage_01B', 37, 1, this);
        Audio.createSFXinstanceSub('damage_01C', 37, 2, this);
        this.soundInstance[38] = [];
        Audio.createSFXinstanceSub('damage_02A', 38, 0, this);
        Audio.createSFXinstanceSub('damage_02B', 38, 1, this);
        Audio.createSFXinstanceSub('damage_02C', 38, 2, this);
        this.soundInstance[39] = [];
        Audio.createSFXinstanceSub('damage_03A', 39, 0, this);
        Audio.createSFXinstanceSub('damage_03B', 39, 1, this);
        Audio.createSFXinstanceSub('damage_03C', 39, 2, this);
        Audio.createSFXloopInstance('gunnerLoop', 40, this);
        Audio.createSFXloopInstance('gunnerLoopDetect', 41, this);
        Audio.createSFXloopInstance('homingLoop', 42, this);
        Audio.createSFXloopInstance('homingLoopDetect', 43, this);
        this.soundInstance[44] = [];
        Audio.createSFXinstanceSub('hit_00A', 44, 0, this);
        Audio.createSFXinstanceSub('hit_00B', 44, 1, this);
        Audio.createSFXinstanceSub('hit_00C', 44, 2, this);
        this.soundInstance[45] = [];
        Audio.createSFXinstanceSub('hit_01A', 45, 0, this);
        Audio.createSFXinstanceSub('hit_01B', 45, 1, this);
        Audio.createSFXinstanceSub('hit_01C', 45, 2, this);
        Audio.createSFXloopInstance('zapperLoop', 46, this);
        Audio.createSFXloopInstance('zapperLoopDetect', 47, this);
        Audio.createSFXloopInstance('swordLoop', 48, this);
        Audio.createSFXloopInstance('swordLoopDetect', 49, this);
        Audio.createSFXloopInstance('mechaLoop', 50, this);
        Audio.createSFXloopInstance('mechaLoopDetect', 51, this);
        this.soundInstance[52] = [];
        Audio.createSFXinstanceSub('airDeath_00A', 52, 0, this);
        Audio.createSFXinstanceSub('airDeath_00B', 52, 1, this);
        Audio.createSFXinstanceSub('airDeath_00C', 52, 2, this);
        Audio.createSFXloopInstance('shot', 53, this);
        Audio.createSFXinstance('null', 54, this);
        Audio.createSFXinstance('zap', 55, this);
        Audio.createSFXinstance('zapAir', 56, this);
        this.soundInstance[57] = [];
        Audio.createSFXinstanceSub('groundDeath_00A', 57, 0, this);
        Audio.createSFXinstanceSub('groundDeath_00B', 57, 1, this);
        Audio.createSFXinstanceSub('groundDeath_00C', 57, 2, this);
        this.soundInstance[58] = [];
        Audio.createSFXinstanceSub('groundDeath_01A', 58, 0, this);
        Audio.createSFXinstanceSub('groundDeath_01B', 58, 1, this);
        Audio.createSFXinstanceSub('groundDeath_01C', 58, 2, this);
        this.soundInstance[59] = [];
        Audio.createSFXinstanceSub('groundDeath_02A', 59, 0, this);
        Audio.createSFXinstanceSub('groundDeath_02B', 59, 1, this);
        Audio.createSFXinstanceSub('groundDeath_02C', 59, 2, this);
        this.soundInstance[60] = [];
        Audio.createSFXinstanceSub('explode_00A', 60, 0, this);
        Audio.createSFXinstanceSub('explode_00B', 60, 1, this);
        Audio.createSFXinstanceSub('explode_00C', 60, 2, this);
        Audio.createSFXinstanceSub('explode_00D', 60, 3, this);
        this.soundInstance[61] = [];
        Audio.createSFXinstanceSub('explode_01A', 61, 0, this);
        Audio.createSFXinstanceSub('explode_01B', 61, 1, this);
        Audio.createSFXinstanceSub('explode_01C', 61, 2, this);
        Audio.createSFXinstanceSub('explode_01D', 61, 3, this);
        this.soundInstance[62] = [];
        Audio.createSFXinstanceSub('explode_02A', 62, 0, this);
        Audio.createSFXinstanceSub('explode_02B', 62, 1, this);
        Audio.createSFXinstanceSub('explode_02C', 62, 2, this);
        Audio.createSFXinstanceSub('explode_02D', 62, 3, this);
        this.soundInstance[63] = [];
        Audio.createSFXinstanceSub('explode_03A', 63, 0, this);
        Audio.createSFXinstanceSub('explode_03B', 63, 1, this);
        Audio.createSFXinstanceSub('explode_03C', 63, 2, this);
        Audio.createSFXinstanceSub('explode_03D', 63, 3, this);
        this.soundInstance[64] = [];
        Audio.createSFXinstanceSub('explode_04A', 64, 0, this);
        Audio.createSFXinstanceSub('explode_04B', 64, 1, this);
        Audio.createSFXinstanceSub('explode_04C', 64, 2, this);
        Audio.createSFXinstanceSub('explode_04D', 64, 3, this);
        this.soundInstance[65] = [];
        Audio.createSFXinstanceSub('explode_05A', 65, 0, this);
        Audio.createSFXinstanceSub('explode_05B', 65, 1, this);
        Audio.createSFXinstanceSub('explode_05C', 65, 2, this);
        Audio.createSFXinstanceSub('explode_05D', 65, 3, this);
        Audio.createSFXinstance('wick_03', 66, this);
        this.soundInstance[67] = [];
        Audio.createSFXinstanceSub('ballBounce_00A', 67, 0, this);
        Audio.createSFXinstanceSub('ballBounce_00B', 67, 1, this);
        Audio.createSFXinstance('dropEnergy', 68, this);
        Audio.createSFXinstance('dropHealth', 69, this);
        Audio.createSFXinstance('openChest', 70, this);
        Audio.createSFXinstance('propellerStart_00', 71, this);
        this.soundInstance[72] = [];
        Audio.createSFXinstanceSub('hurtZap_00A', 72, 0, this);
        Audio.createSFXinstanceSub('hurtZap_00B', 72, 1, this);
        Audio.createSFXinstanceSub('hurtZap_00C', 72, 2, this);
        Audio.createSFXinstanceSub('hurtZap_00D', 72, 3, this);

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
            volume: this.volumeSFX,
            loop: true
        })
        this.engineLoop = this.sound.add('engineLoop_00', {
            volume: this.volumeSFX,
            loop: true
        })
        this.ambientLoop = this.sound.add('ambientLoop_00', {
            volume: this.volumeSFX,
            loop: true
        })
        this.lasserLoop = this.sound.add('lasserLoop_00', {
            volume: this.volumeSFX,
            loop: true
        })
        this.beamLoop = this.sound.add('beamLoop_00', {
            volume: this.volumeSFX,
            loop: true
        })
        this.lasserSufferingLoop = this.sound.add('lasserSufferingLoop', {
            volume: 0.0,
            loop: true
        })
        //MUSIC LOOPS
        this.musicLoop0000levitating = this.sound.add('musicLoop0000levitating', {
            volume: 0.0,
            loop: true
        })
        this.musicLoop0000moving = this.sound.add('musicLoop0000moving', {
            volume: 0.0,
            loop: true
        })
        this.musicLoop0000flying = this.sound.add('musicLoop0000flying', {
            volume: 0.0,
            loop: true
        })
        this.musicLoop0000chill = this.sound.add('musicLoop0000chill', {
            volume: 0.0,
            loop: true
        })
        //INIT PLAY LEVEL0000
        this.ambientLoop.play();
        this.musicLoop0000levitating.play();
        this.musicLoop0000moving.play();
        this.musicLoop0000flying.play();
        this.musicLoop0000chill.play();
        //THE LOAD.
        Audio.load = this;
        console.log("AUDIO LOADED: everything went better than expected :D !!!");
        //Let's go motherfuckers~
        this.scene.start("Chatter");
    }
}
