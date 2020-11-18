import Chatter from "./Chatter.js";
export default class Audio extends Phaser.Scene {
    constructor() {
        super("Audio");
    }
    //MUSIC
    static bpm = 104;
    static beat = 16;
    static barRate = 60 * 1000 / this.bpm * this.beat;
    static barRateDiv = [this.barRate / 2, this.barRate / 4, this.barRate / 8, this.barRate / 64, this.barRate / 128];
    static barCounter=0;
    static paused = false;
    static musicLayerBarEvent;
    static musicLayerJetEvent;
    //DISTANCES
    static vanishingPoint = 960;
    static inRangeDistance = this.vanishingPoint * 2;
    //PLAYER
    static earlyPos = 0.0;
    static earlyWeapon = -1;
    static earlyPropeller = false;
    static propellerTween = false;
    static currentLevel = 0;
    //VOLUMES
    static maxVolume = 1.0;
    static volumeBGM = 0.5;
    static volumeSFX = 0.5;
    static maxBGMvolumeByEnemies = this.volumeBGM;
    static oldVolumes = [];
    //INSTANCES
    static load;
    static maxSFXinstances = 8;
    static SFXinstance = 0;
    static ambientLoop;
    //STINGERS
    static stingerJet = false;
    static stingerMovement = false;
    static stingerSurface = false;
    static stingerChill = false;
    //
    static ctf = "background-color: #FF8000; color: #000000; font-weight: bold; font-family: Arial Black;";
    //letsTalk caller:
    static chat(words, scene, character) {
        switch (character) {
            case "D42K-H":
                Chatter.letsTalk(words, scene, 0, 0.5, 0.6);
                break;
            case "D42K_H":
                Chatter.letsTalk(words, scene, 0, 0.7, 0.8);
                break;
            case scene.game.playerName:
                Chatter.letsTalk(words, scene, 1, 0.3, 0.4);
                break;
            case "sithDroid":
                Chatter.letsTalk(words, scene, 0, 0.4, 0.8);
                break;
            case "Vagrant Droid #0":
                Chatter.letsTalk(words, scene, 1, 0.2, 0.2);
                break;
            case "B0RG35":
            case "Vagrant Droid #1":
                Chatter.letsTalk(words, scene, 0, 0.5, 0.4);
                break;
            case "Y04K3":
            case "Vagrant Droid #2":
                Chatter.letsTalk(words, scene, 0, 0.2, 0.3);
                break;
            case "L41N":
            case "Vagrant Droid #3":
                Chatter.letsTalk(words, scene, 1, 0.2, 0.3);
                break;
            case "N14L":
            case "Vagrant Droid #4":
                Chatter.letsTalk(words, scene, 1, 0.3, 0.2);
                break;
            case "FR3UD":
            case "Vagrant Droid #5":
                Chatter.letsTalk(words, scene, 0, 0.4, 0.5);
                break;
            case "JUN6":
            case "Vagrant Droid #6":
                Chatter.letsTalk(words, scene, 0, 0.6, 0.3);
                break;
            case "K4N7":
            case "Vagrant Droid #7":
                Chatter.letsTalk(words, scene, 0, 0.8, 0.7);
                break;
            default:
                break;
        }
    }
    static pause() {
        Audio.oldVolumes = [this.load.musicLoop0000levitating.volume, this.load.musicLoop0000moving.volume, this.load.musicLoop0000flying.volume];
        this.load.musicLoop0000levitating.volume = 0.0;
        this.load.musicLoop0000moving.volume = 0.0;
        this.load.musicLoop0000flying.volume = 0.0;
        this.load.musicLoop0000chill.volume = Audio.volumeBGM;
        //
        this.load.walkLoop.volume=Audio.volumeSFX;
        this.load.surfaceLoop.volume=Audio.volumeSFX;
        this.load.propellerLoop.volume=Audio.volumeSFX;
        this.load.engineLoop.volume=Audio.volumeSFX;
        this.load.lasserLoop.volume=Audio.volumeSFX;
        this.load.beamLoop.volume=Audio.volumeSFX;
        this.load.lasserSufferingLoop.volume=0.0;
        //
        if(Audio.currentLevel==3){
            this.load.musicLoop0001.pause();
        }
        for(var type=0; type<this.load.soundInstance.length; type++){
            for(var rndOrInstance=0; rndOrInstance<this.load.soundInstance[type].length; rndOrInstance++){
                if(Array.isArray(this.load.soundInstance[type][rndOrInstance])){
                    for(var instance=0; instance<this.load.soundInstance[type][rndOrInstance].length; instance++){
                        this.load.soundInstance[type][rndOrInstance][instance].volume=0.0;
                    }
                }else{
                    this.load.soundInstance[type][rndOrInstance].volume=0.0;
                }
            }
        }
        this.load.walkLoop.volume=0.0;
        this.load.surfaceLoop.volume=0.0;
        this.load.propellerLoop.volume=0.0;
        this.load.engineLoop.volume=0.0;
        this.load.lasserLoop.volume=0.0;
        this.load.beamLoop.volume=0.0;
        this.load.lasserSufferingLoop.volume=0.0;
        Audio.play2DinstanceRate(81, 1.0);
        Audio.paused = true;
    }
    static resume() {
        Audio.play2DinstanceRate(80, 1.0);
        this.load.musicLoop0000levitating.volume = Audio.oldVolumes[0];
        this.load.musicLoop0000moving.volume = Audio.oldVolumes[1];
        this.load.musicLoop0000flying.volume = Audio.oldVolumes[2];
        this.load.musicLoop0000chill.volume = 0.0;
        //
        this.load.walkLoop.volume=Audio.volumeSFX;
        this.load.surfaceLoop.volume=Audio.volumeSFX;
        this.load.propellerLoop.volume=Audio.volumeSFX;
        this.load.engineLoop.volume=Audio.volumeSFX;
        this.load.lasserLoop.volume=Audio.volumeSFX;
        this.load.beamLoop.volume=Audio.volumeSFX;
        this.load.lasserSufferingLoop.volume=0.0;
        //
        if(Audio.currentLevel==3){
            this.load.musicLoop0001.resume();
        }
        Audio.paused = false;
    }
    static updateVolumes() {
        if (document.getElementById("bgmSlider").value / 10 != Audio.volumeBGM) {
            Audio.volumeBGM = document.getElementById("bgmSlider").value / 10;
            this.load.musicLoop0000chill.volume = Audio.volumeBGM;
            this.load.musicLoop0001.volume = Audio.volumeBGM;
            var click= Audio.play2DinstanceRate(88, 1.0);
            click.volume=document.getElementById("bgmSlider").value / 10;
        }
        if (document.getElementById("sfxSlider").value / 10 != Audio.volumeSFX) {
            Audio.volumeSFX = document.getElementById("sfxSlider").value / 10;
            this.load.ambientLoop.volume = Audio.volumeSFX;
            this.load.walkLoop.volume = Audio.volumeSFX;
            this.load.surfaceLoop.volume = Audio.volumeSFX;
            this.load.propellerLoop.volume = Audio.volumeSFX;
            this.load.engineLoop.volume = Audio.volumeSFX;
            this.load.lasserLoop.volume = Audio.volumeSFX;
            this.load.beamLoop.volume = Audio.volumeSFX;
            var click= Audio.play2DinstanceRate(88, 1.0);
            click.volume=document.getElementById("sfxSlider").value / 10;
        }
    }
    static maxBGMvolume(scene) {
        if (scene.game.player.getClosestEnemyDistance() > Audio.inRangeDistance) {
            var distance = 0.0;
        } else if (scene.game.player.getClosestEnemyDistance() < 0.0) {
            var distance = Audio.maxVolume;
        } else {
            var distance = (Audio.inRangeDistance - scene.game.player.getClosestEnemyDistance()) / Audio.inRangeDistance;
        }
        Audio.maxBGMvolumeByEnemies = distance * Audio.volumeBGM;
    }
    static volume2D(length) {
        if (length > this.vanishingPoint) {
            var distance = 0.0;
        } else if (length < 0.0) {
            var distance = Audio.maxVolume;
        } else {
            var distance = (this.vanishingPoint - length) / this.vanishingPoint;
        }
        return distance * Audio.volumeSFX;
    }
    static volume3D(scene) {
        if (scene.distanceToPlayer() > this.vanishingPoint) {
            var distance = 0.0;
        } else if (scene.distanceToPlayer() < 0.0) {
            var distance = Audio.maxVolume;
        } else {
            var distance = (this.vanishingPoint - scene.distanceToPlayer()) / this.vanishingPoint;
        }
        return distance * Audio.volumeSFX;
    }
    //MUSIC ENGINE level #1 starter:
    static startMusicEngine(scene) {
        this.load.ambientLoop.play();
        this.load.musicLoop0000chill.play();
        scene.tweens.add({
            targets: this.load.ambientLoop,
            volume: Audio.volumeSFX,
            duration: Audio.barRateDiv[2],
        });
        scene.tweens.add({
            targets: this.load.musicLoop0000chill,
            volume: Audio.volumeBGM,
            duration: Audio.barRateDiv[1],
        });
        console.log("%c | AUDIO ENGINE | %c > INTERACTIVE MUSIC : activated.", Audio.ctf, "");
    }
    static levelZero(scene) {
        Audio.stingerJet = false;
        Audio.stingerMovement = false;
        Audio.stingerSurface = false;
        Audio.stingerChill = false;
        //
        this.load.musicLoop0000chill.volume = 0;
        console.log("%c | AUDIO ENGINE | %c > INTERACTIVE MUSIC : level #0.", Audio.ctf, "");
    }
    static levelOne(scene) {
        Audio.stingerJet = false;
        Audio.stingerMovement = false;
        Audio.stingerSurface = false;
        Audio.stingerChill = false;
        //
        Audio.currentLevel = 1;
        this.load.musicLoop0000chill.stop();
        this.load.musicLoop0000levitating.play();
        this.load.musicLoop0000moving.play();
        this.load.musicLoop0000flying.play();
        this.load.musicLoop0000chill.play();
        this.load.musicLoop0000levitating.volume= 0.0;
        this.load.musicLoop0000moving.volume= 0.0;
        this.load.musicLoop0000flying.volume= 0.0;
        this.load.musicLoop0000chill.volume= 0.0;
        Audio.musicLayerBarEvent = scene.time.addEvent({
            delay: Audio.barRateDiv[0],
            callback: () => Audio.musicLayerBar(scene),
            loop: true,
        });
        Audio.musicLayerJetEvent = scene.time.addEvent({
            delay: Audio.barRateDiv[1],
            callback: () => Audio.musicLayerJet(scene),
            loop: true,
        });
        console.log("%c | AUDIO ENGINE | %c > INTERACTIVE MUSIC : level #1.", Audio.ctf, "");
    }
    static levelTwo(scene) {
        Audio.stingerJet = false;
        Audio.stingerMovement = false;
        Audio.stingerSurface = false;
        Audio.stingerChill = false;
        //
        Audio.currentLevel = 2;
        this.load.musicLoop0000chill.volume = 0;
        console.log("%c | AUDIO ENGINE | %c > INTERACTIVE MUSIC : level #2.", Audio.ctf, "");
    }
    static sceneChange(scene){
        if(Audio.currentLevel == 2){
            scene.tweens.add({
                targets: this.load.musicLoop0000levitating,
                volume: 0.0,
                duration: Audio.barRateDiv[2],
            });
            scene.tweens.add({
                targets: this.load.musicLoop0000moving,
                volume: 0.0,
                duration: Audio.barRateDiv[2],
            });
            scene.tweens.add({
                targets: this.load.musicLoop0000flying,
                volume: 0.0,
                duration: Audio.barRateDiv[2],
            });
        }
    }
    static levelThree(scene) {
        Audio.stingerJet = false;
        Audio.stingerMovement = false;
        Audio.stingerSurface = false;
        Audio.stingerChill = false;
        //
        Audio.currentLevel = 3;
        if(Audio.musicLayerBarEvent!= undefined && Audio.musicLayerJetEvent != undefined){
            Audio.musicLayerBarEvent.remove();
            Audio.musicLayerJetEvent.remove();
        }
        this.load.musicLoop0000levitating.stop();
        this.load.musicLoop0000moving.stop();
        this.load.musicLoop0000flying.stop();
        this.load.musicLoop0000chill.volume = 0;
            scene.tweens.add({
                targets: this.load.musicLoop0001,
                volume: Audio.volumeBGM,
                duration: Audio.barRateDiv[2],
            });
        this.load.musicLoop0001.play();
        console.log("%c | AUDIO ENGINE | %c > INTERACTIVE MUSIC : level #3.", Audio.ctf, "");
    }
    static levelFour(scene) {
        Audio.currentLevel = 4;
        this.load.musicLoop0000chill.volume = 0;
        console.log("%c | AUDIO ENGINE | %c > INTERACTIVE MUSIC : level #4.", Audio.ctf, "");
    }
    static musicLayerBar(scene) {
        //console.log("BAR #" + Audio.barCounter);
        Audio.barCounter++;
        if (!Audio.paused) {
            Audio.musicLayerHeight(scene);
            Audio.musicLayerMovement(scene);
        }
    }
    static musicLayerHeight(scene) {
        var factor = 8180;
        if (scene.game.player.earlyPos.y > factor) {
            var volumeNormalized = 0.0;
        } else if (scene.game.player.earlyPos.y < 0.0) {
            var volumeNormalized = Audio.maxVolume;
        } else {
            var volumeNormalized = (factor - scene.game.player.earlyPos.y) / factor;
        }
        scene.tweens.add({
            targets: this.load.musicLoop0000levitating,
            volume: volumeNormalized * Audio.maxBGMvolumeByEnemies,
            duration: Audio.barRateDiv[0],
        });
    }
    static musicLayerMovement(scene) {
        if (this.stingerMovement) {
            this.stingerMovement = false;
            scene.tweens.add({
                targets: this.load.musicLoop0000moving,
                volume: Audio.maxBGMvolumeByEnemies,
                duration: Audio.barRateDiv[1],
            });
        } else {
            scene.tweens.add({
                targets: this.load.musicLoop0000moving,
                volume: 0.0,
                duration: Audio.barRateDiv[0],
            });
        }
    }
    static musicLayerJet(scene) {
        if (!Audio.paused) {
            if (this.stingerJet) {
                this.stingerJet = false;
                scene.tweens.add({
                    targets: this.load.musicLoop0000flying,
                    volume: Audio.maxBGMvolumeByEnemies,
                    duration: Audio.barRateDiv[2],
                });
            } else {
                scene.tweens.add({
                    targets: this.load.musicLoop0000flying,
                    volume: 0.0,
                    duration: Audio.barRateDiv[1],
                });
            }
        }
    }
    //INSTANCE PLAYERS:
    //Default 2D:
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
    //2D with rate setter:
    static play2DinstanceRate(type, rate) {
        this.load.soundInstance[type][Audio.SFXinstance].setRate(rate);
        this.load.soundInstance[type][Audio.SFXinstance].volume = Audio.volumeSFX;
        this.load.soundInstance[type][Audio.SFXinstance].play();
        var instance = this.load.soundInstance[type][Audio.SFXinstance];
        if (Audio.SFXinstance == Audio.SFXinstance && Audio.SFXinstance < Audio.maxSFXinstances - 1) {
            Audio.SFXinstance++;
        } else {
            Audio.SFXinstance = 0;
        }
        return instance;
    }
    //2D randomized:
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
    //Default 3D:
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
    //?
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
    //3D randomized:
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
    //3D with volume setter:
    static play3DinstanceVolume(scene, type, volume) {
        this.load.soundInstance[type][Audio.SFXinstance].setRate(0.80 + (Math.random() * 0.2));
        this.load.soundInstance[type][Audio.SFXinstance].setDetune(-100 + (Math.random() * 200));
        this.load.soundInstance[type][Audio.SFXinstance].volume = Audio.volume3D(scene) * volume;
        this.load.soundInstance[type][Audio.SFXinstance].play();
        var instance = this.load.soundInstance[type][Audio.SFXinstance];
        if (Audio.SFXinstance < Audio.maxSFXinstances - 1) {
            Audio.SFXinstance++;
        } else {
            Audio.SFXinstance = 0;
        }
        return instance;
    }
    //3D with small modulation:
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
    //3D randomized with volume setter:
    static play3DinstanceRndVolume(scene, type, volume) {
        var rnd = [Math.floor(Math.random() * this.load.soundInstance[type].length)];
        this.load.soundInstance[type][rnd][Audio.SFXinstance].setRate(0.80 + (Math.random() * 0.2));
        this.load.soundInstance[type][rnd][Audio.SFXinstance].setDetune(-100 + (Math.random() * 200));
        this.load.soundInstance[type][rnd][Audio.SFXinstance].volume = Audio.volume3D(scene) * volume;
        this.load.soundInstance[type][rnd][Audio.SFXinstance].play();
        var instance = this.load.soundInstance[type][rnd][Audio.SFXinstance];
        if (Audio.SFXinstance < Audio.maxSFXinstances - 1) {
            Audio.SFXinstance++;
        } else {
            Audio.SFXinstance = 0;
        }
        return instance;
    }
    //GENERAL METHODS:
    //Frame update:
    static update(scene) {
        Audio.maxBGMvolume(scene);
        Audio.propellerFliying(scene);
        if (scene.game.isFiring && scene.game.player.energy == 0.0) {
            Audio.play2DinstanceRate(10, 0.8 + scene.game.player.weaponCounter * 0.05);
        }
        if (scene.game.player.inRoom() && !this.stingerChill) {
            this.stingerChill = true;
        }
        if (scene.game.player.activatedJet && !this.stingerJet) {
            this.stingerJet = true;
        }
        if (scene.game.player.weaponCounter != Audio.earlyWeapon) {
            Audio.earlyWeapon = scene.game.player.weaponCounter;
            Audio.play2DinstanceRate(8, 0.8 + scene.game.player.weaponCounter * 0.05);
            Audio.play2DinstanceRate(9, 0.8 + scene.game.player.weaponCounter * 0.05);
        }
        if (!this.stingerSurface && !scene.game.player.activatedJet && scene.game.player.isTouching.ground && (scene.game.player.cursors.right.isDown || scene.game.player.cursors.left.isDown)) {
            this.stingerSurface = true;
            this.load.surfaceLoop.volume = Audio.volumeSFX;
            this.load.surfaceLoop.setDetune(-25 + (Math.random() * 50));
            this.load.surfaceLoop.play();
            this.load.walkLoop.volume = Audio.volumeSFX;
            this.load.walkLoop.setDetune(-25 + (Math.random() * 50));
            this.load.walkLoop.play();
        }else if (this.stingerSurface && ((scene.game.player.activatedJet || !scene.game.player.isTouching.ground) || (!scene.game.player.cursors.right.isDown && !scene.game.player.cursors.left.isDown))) {
            this.stingerSurface = false;
            this.load.surfaceLoop.stop();
            this.load.walkLoop.stop();
            Audio.play2DinstanceRate(28, 1.0);
        }
        if (!this.stingerMovement && ((Math.floor(scene.game.player.earlyPos.x) != Audio.earlyPos))) {
            Audio.earlyPos = Math.floor(scene.game.player.earlyPos.x);
            this.stingerMovement = true;
        }else if(this.stingerMovement) {
            this.stingerMovement = false;
        }
    }
    //Propeller:
    static propellerFliying(scene) {
        if (scene.game.player.activatedJet && !this.earlyPropeller) {
            Audio.earlyPropeller = true;
            Audio.load.engineLoop.setDetune(-25 + (Math.random() * 50));
            Audio.load.engineLoop.volume = Audio.volumeSFX;
            Audio.load.engineLoop.play();
            Audio.load.propellerLoop.setDetune(-25 + (Math.random() * 50));
            Audio.load.propellerLoop.volume = Audio.volumeSFX;
            Audio.load.propellerLoop.play();
            Audio.play2Dinstance(71);
            Audio.play2DinstanceRate(9, 0.4);
        } else if (!scene.game.player.activatedJet && this.earlyPropeller) {
            Audio.earlyPropeller = false;
            Audio.propellerTween = false;
            Audio.play2Dinstance(11);
            Audio.play2Dinstance(82);
            Audio.load.propellerLoop.stop();
            Audio.load.propellerLoop.setRate(1.0);
            Audio.load.engineLoop.stop();
        } else if (Audio.earlyPropeller && !Audio.propellerTween) {
            Audio.propellerTween = true;
            scene.tweens.add({
                targets: Audio.load.propellerLoop,
                volume: Audio.volumeSFX,
                rate: 0.4,
                duration: Audio.barRateDiv[2],
            });
        }
    }
    //Lasser for player:
    static lasserLoop(on) {
        if (on) {
            Audio.play2Dinstance(32);
            this.load.lasserLoop.setDetune(-50 + (Math.random() * 100));
            this.load.lasserLoop.play();
            this.load.beamLoop.setDetune(-50 + (Math.random() * 100));
            this.load.beamLoop.play();
        } else {
            Audio.play2Dinstance(33);
            this.load.lasserLoop.stop();
            this.load.beamLoop.stop();
        }
        return this.load.beamLoop;
    }
    //Lasser for enemies:
    static lasserSufferingLoop(on) {
        if (on) {
            this.load.lasserSufferingLoop.play();
        } else {
            this.load.lasserSufferingLoop.stop();
        }
        return this.load.lasserSufferingLoop;
    }
    //SFX INSTANCE CREATORS:
    //Default:
    static createSFXinstance(name, num, load) {
        load.soundInstance[num] = [];
        for (var i = 0; i < Audio.maxSFXinstances; i++) {
            load.soundInstance[num][i] = load.sound.add(name);
        }
    }
    //Randomized instances:
    static createSFXinstanceSub(name, num, sub, load) {
        load.soundInstance[num][sub] = [];
        for (var i = 0; i < Audio.maxSFXinstances; i++) {
            load.soundInstance[num][sub][i] = load.sound.add(name);
        }
    }
    //Looped instances:
    static createSFXloopInstance(name, num, load) {
        load.soundInstance[num] = [];
        for (var i = 0; i < Audio.maxSFXinstances; i++) {
            load.soundInstance[num][i] = load.sound.add(name, {
                volume: Audio.volumeSFX,
                loop: true
            })
        }
    }
    //LOAD:
    preload() {
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
        this.load.audio('dead', 'assets/audio/SFX/dead.ogg');
        this.load.audio('beep', 'assets/audio/SFX/beep.ogg');
        this.load.audio('jetStop', 'assets/audio/SFX/jetStop.ogg');
        this.load.audio('theStart', 'assets/audio/SFX/theStart.ogg');
        this.load.audio('getWeapon', 'assets/audio/SFX/getWeapon.ogg');
        this.load.audio('hover', 'assets/audio/SFX/menu/hover.ogg');
        this.load.audio('back', 'assets/audio/SFX/menu/back.ogg');
        this.load.audio('forth', 'assets/audio/SFX/menu/forth.ogg');
        this.load.audio('click', 'assets/audio/SFX/menu/click.ogg');
        //UI LOOPS
        this.load.audio('walkLoop_00', 'assets/audio/SFX/walkLoop_00.ogg');
        this.load.audio('surfaceLoop_00', 'assets/audio/SFX/surfaceLoop_00.ogg');
        this.load.audio('propellerLoop_00', 'assets/audio/SFX/propellerLoop_00.ogg');
        this.load.audio('engineLoop_00', 'assets/audio/SFX/engineLoop_00.ogg');
        this.load.audio('lasserLoop_00', 'assets/audio/SFX/lasserLoop_00.ogg');
        this.load.audio('beamLoop_00', 'assets/audio/SFX/beamLoop_00.ogg');
        this.load.audio('lasserTrapLoop', 'assets/audio/SFX/lasserTrapLoop.ogg');
        //EXPLOSIONS
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
        this.load.audio('explode_00A', 'assets/audio/SFX/enemies/explode_00A.ogg');
        this.load.audio('explode_00B', 'assets/audio/SFX/enemies/explode_00B.ogg');
        this.load.audio('explode_00C', 'assets/audio/SFX/enemies/explode_00C.ogg');
        this.load.audio('explode_00D', 'assets/audio/SFX/enemies/explode_00D.ogg');
        this.load.audio('explode_01A', 'assets/audio/SFX/enemies/explode_01A.ogg');
        this.load.audio('explode_01B', 'assets/audio/SFX/enemies/explode_01B.ogg');
        this.load.audio('explode_01C', 'assets/audio/SFX/enemies/explode_01C.ogg');
        this.load.audio('explode_01D', 'assets/audio/SFX/enemies/explode_01D.ogg');
        this.load.audio('explode_02A', 'assets/audio/SFX/enemies/explode_02A.ogg');
        this.load.audio('explode_02B', 'assets/audio/SFX/enemies/explode_02B.ogg');
        this.load.audio('explode_02C', 'assets/audio/SFX/enemies/explode_02C.ogg');
        this.load.audio('explode_02D', 'assets/audio/SFX/enemies/explode_02D.ogg');
        this.load.audio('explode_03A', 'assets/audio/SFX/enemies/explode_03A.ogg');
        this.load.audio('explode_03B', 'assets/audio/SFX/enemies/explode_03B.ogg');
        this.load.audio('explode_03C', 'assets/audio/SFX/enemies/explode_03C.ogg');
        this.load.audio('explode_03D', 'assets/audio/SFX/enemies/explode_03D.ogg');
        this.load.audio('explode_04A', 'assets/audio/SFX/enemies/explode_04A.ogg');
        this.load.audio('explode_04B', 'assets/audio/SFX/enemies/explode_04B.ogg');
        this.load.audio('explode_04C', 'assets/audio/SFX/enemies/explode_04C.ogg');
        this.load.audio('explode_04D', 'assets/audio/SFX/enemies/explode_04D.ogg');
        this.load.audio('explode_05A', 'assets/audio/SFX/enemies/explode_05A.ogg');
        this.load.audio('explode_05B', 'assets/audio/SFX/enemies/explode_05B.ogg');
        this.load.audio('explode_05C', 'assets/audio/SFX/enemies/explode_05C.ogg');
        this.load.audio('explode_05D', 'assets/audio/SFX/enemies/explode_05D.ogg');
        this.load.audio('sword', 'assets/audio/SFX/enemies/sword.ogg');
        this.load.audio('mechGun_00A', 'assets/audio/SFX/enemies/mechGun_00A.ogg');
        this.load.audio('mechGun_00B', 'assets/audio/SFX/enemies/mechGun_00B.ogg');
        this.load.audio('mechGun_00C', 'assets/audio/SFX/enemies/mechGun_00C.ogg');
        this.load.audio('mechGun_00D', 'assets/audio/SFX/enemies/mechGun_00D.ogg');
        this.load.audio('gunGun_00A', 'assets/audio/SFX/enemies/gunGun_00A.ogg');
        this.load.audio('gunGun_00B', 'assets/audio/SFX/enemies/gunGun_00B.ogg');
        this.load.audio('gunGun_00C', 'assets/audio/SFX/enemies/gunGun_00C.ogg');
        this.load.audio('gunGun_00D', 'assets/audio/SFX/enemies/gunGun_00D.ogg');
        this.load.audio('energyImpact', 'assets/audio/SFX/enemies/energyImpact.ogg');
        this.load.audio('sithVanish', 'assets/audio/SFX/enemies/sithVanish.ogg');
        this.load.audio('sithSwing_00', 'assets/audio/SFX/enemies/sithSwing_00.ogg');
        this.load.audio('sithSwing_01', 'assets/audio/SFX/enemies/sithSwing_01.ogg');
        this.load.audio('sithSwing_02', 'assets/audio/SFX/enemies/sithSwing_02.ogg');
        this.load.audio('sithSwing_03', 'assets/audio/SFX/enemies/sithSwing_03.ogg');
        this.load.audio('sithSwing_04', 'assets/audio/SFX/enemies/sithSwing_04.ogg');
        this.load.audio('sithSwing_05', 'assets/audio/SFX/enemies/sithSwing_05.ogg');
        this.load.audio('sithSwing_06', 'assets/audio/SFX/enemies/sithSwing_06.ogg');
        this.load.audio('sithSwing_07', 'assets/audio/SFX/enemies/sithSwing_07.ogg');
        this.load.audio('sithHumLoop', 'assets/audio/SFX/enemies/sithHumLoop.ogg');
        this.load.audio('sithPursue', 'assets/audio/SFX/enemies/sithPursue.ogg');
        //MENTOR
        this.load.audio('mentorWalkLoop', 'assets/audio/SFX/mentor/walkLoop_00.ogg');
        this.load.audio('mentorSurfaceLoop', 'assets/audio/SFX/mentor/surfaceLoop_00.ogg');
        this.load.audio('mentorWalkStop', 'assets/audio/SFX/mentor/walkStop_00.ogg');
        this.load.audio('mentorEngineLoop', 'assets/audio/SFX/mentor/engineLoop_00.ogg');
        this.load.audio('mentorPropellerLoop', 'assets/audio/SFX/mentor/propellerLoop_00.ogg');
        this.load.audio('mentorMovingPart', 'assets/audio/SFX/mentor/movingPart_00.ogg');
        this.load.audio('mentorPropellerStop', 'assets/audio/SFX/mentor/propellerStop_00.ogg');
        //MUSIC LOOPS
        this.load.audio('musicLoop0000levitating', 'assets/audio/BGM/musicLoop0000levitating.ogg');
        this.load.audio('musicLoop0000moving', 'assets/audio/BGM/musicLoop0000moving.ogg');
        this.load.audio('musicLoop0000flying', 'assets/audio/BGM/musicLoop0000flying.ogg');
        this.load.audio('musicLoop0000chill', 'assets/audio/BGM/musicLoop0000chill.ogg')
        this.load.audio('musicLoop0001', 'assets/audio/BGM/musicLoop0001.ogg')
    }
    //CREATION:
    create() {
        //INIT AUDIO
        this.soundInstance = [];
        //
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
        Audio.createSFXinstance('shot', 53, this);
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
        Audio.createSFXinstance('dead', 73, this);
        Audio.createSFXinstance('sword', 74, this);
        this.soundInstance[75] = [];
        Audio.createSFXinstanceSub('mechGun_00A', 75, 0, this);
        Audio.createSFXinstanceSub('mechGun_00B', 75, 1, this);
        Audio.createSFXinstanceSub('mechGun_00C', 75, 2, this);
        Audio.createSFXinstanceSub('mechGun_00D', 75, 3, this);
        this.soundInstance[76] = [];
        Audio.createSFXinstanceSub('gunGun_00A', 76, 0, this);
        Audio.createSFXinstanceSub('gunGun_00B', 76, 1, this);
        Audio.createSFXinstanceSub('gunGun_00C', 76, 2, this);
        Audio.createSFXinstanceSub('gunGun_00D', 76, 3, this);
        Audio.createSFXinstance('energyImpact', 77, this);
        Audio.createSFXinstance('beep', 78, this);
        Audio.createSFXinstance('hover', 79, this);
        Audio.createSFXinstance('back', 80, this);
        Audio.createSFXinstance('forth', 81, this);
        Audio.createSFXinstance('jetStop', 82, this);
        Audio.createSFXinstance('theStart', 83, this);
        Audio.createSFXinstance('sithVanish', 84, this);
        this.soundInstance[85] = [];
        Audio.createSFXinstanceSub('sithSwing_00', 85, 0, this);
        Audio.createSFXinstanceSub('sithSwing_01', 85, 1, this);
        Audio.createSFXinstanceSub('sithSwing_02', 85, 2, this);
        Audio.createSFXinstanceSub('sithSwing_03', 85, 3, this);
        Audio.createSFXinstanceSub('sithSwing_04', 85, 4, this);
        Audio.createSFXinstanceSub('sithSwing_05', 85, 5, this);
        Audio.createSFXinstanceSub('sithSwing_06', 85, 6, this);
        Audio.createSFXinstanceSub('sithSwing_07', 85, 7, this);
        Audio.createSFXloopInstance('sithHumLoop', 86, this);
        Audio.createSFXloopInstance('sithPursue', 87, this);
        Audio.createSFXinstance('click', 88, this);
        Audio.createSFXloopInstance('lasserTrapLoop', 89, this);
        Audio.createSFXinstance('getWeapon', 90, this);
        //MENTOR
        Audio.createSFXloopInstance('mentorWalkLoop', 91, this);
        Audio.createSFXloopInstance('mentorSurfaceLoop', 92, this);
        Audio.createSFXinstance('mentorWalkStop', 93, this);
        Audio.createSFXloopInstance('mentorEngineLoop', 94, this);
        Audio.createSFXloopInstance('mentorPropellerLoop', 95, this);
        Audio.createSFXinstance('mentorMovingPart', 96, this);
        Audio.createSFXinstance('mentorPropellerStop', 97, this);
        //AMBIENT
        this.ambientLoop = this.sound.add('ambientLoop_00', {
            volume: 0.0,
            loop: true
        })
        //UI LOOPS
        this.walkLoop = this.sound.add('walkLoop_00', {
            volume: Audio.volumeSFX,
            loop: true
        })
        this.surfaceLoop = this.sound.add('surfaceLoop_00', {
            volume: Audio.volumeSFX,
            loop: true
        })
        this.propellerLoop = this.sound.add('propellerLoop_00', {
            volume: Audio.volumeSFX,
            loop: true
        })
        this.engineLoop = this.sound.add('engineLoop_00', {
            volume: Audio.volumeSFX,
            loop: true
        })
        this.lasserLoop = this.sound.add('lasserLoop_00', {
            volume: Audio.volumeSFX,
            loop: true
        })
        this.beamLoop = this.sound.add('beamLoop_00', {
            volume: Audio.volumeSFX,
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
         this.musicLoop0001 = this.sound.add('musicLoop0001', {
            volume: 0.0,
            loop: true
        })
        //THE LOAD: let's go motherfuckers~
        Audio.load = this;
        console.log("%c | AUDIO ENGINE | %c > RESOURCES LOADED : everything went better than expected :D !!!", Audio.ctf, "");
        this.scene.start("Chatter");
    }
}
