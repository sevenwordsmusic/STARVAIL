export default class Audio extends Phaser.Scene {
    constructor() {
        super("Audio");
    }
    static counter = 0;
    static earlyPos = 0.0;
    static earlyPropeller = false;
    static earlyWeapon = -1;
    static vanishingPoint = 960;
    static halfDistance = this.vanishingPoint / 2;
    static bpm = 104;
    static beat = 16;
    static barRate = 60*1000 / this.bpm * this.beat;
    static barRateDiv = [this.barRate / 2, this.barRate / 4, this.barRate / 8, this.barRate / 64];
    static maxVolume = 1.0;
    static volumeBGM = 1.0;
    static volumeSFX = 1.0;
    static load;
    static desechable = [];
    static barTimer;

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
                        duration: this.barRateDiv[2],
                    });
                } else {
                    scene.tweens.add({
                        targets: this.load.bgmIfWeapon[i],
                        volume: 0.0,
                        duration: this.barRateDiv[0],
                    });
                }
            }
        } else {
            for (var i = 0; i < scene.game.player.weapons.length; i++) {
                if (this.load.bgmIfWeapon[i].volume > 0.0) {
                    scene.tweens.add({
                        targets: this.load.bgmIfWeapon[i],
                        volume: 0.0,
                        duration: this.barRateDiv[1],
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
                volume: 0.0,
                duration: this.barRateDiv[1],
            });
        } else {
            scene.tweens.add({
                targets: this.load.loopLevitating,
                volume: this.volumeBGM,
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
    static distancePlayRate(scene, audio, rate) {
        if (scene.distanceToPlayer() > this.vanishingPoint) {
            var distance = this.volumeSFX;
        } else if (scene.distanceToPlayer() < 0.0) {
            var distance = 0.0;
        } else {
            var distance = (this.vanishingPoint - scene.distanceToPlayer()) / this.vanishingPoint;
        }
        audio.volume = distance;
        this.desechable.push(audio);
        this.desechable.pop().play();
        audio.setRate(rate);
    }
    static playRate(audio, rate) {
        audio.volume = this.volumeSFX;
        audio.play();
        audio.setRate(rate);
        return audio;
    }
    static musicUpdate(scene) {
        this.musicLayerEnemies(scene);
        this.musicLayerHeight(scene);
        this.propellerFliying(scene);
        if (scene.game.isFiring && !this.stingerShot) {
            this.stingerShot = true;
        }
        if (scene.game.player.isTouching.ground && !this.stingerJet) {
            this.stingerJet = true;
        }
        if (scene.game.player.weaponCounter != this.earlyWeapon) {
            this.earlyWeapon = scene.game.player.weaponCounter;
            this.load.weaponChange_00.setRate(0.75 + scene.game.player.weaponCounter * 0.05 );
            this.load.weaponChange_00.play();
        }
        if (Math.floor(scene.game.player.earlyPos.x) != this.earlyPos) {
            this.earlyPos = Math.floor(scene.game.player.earlyPos.x);
            this.stingerMovement = true;
        }
    }
    static propellerFliying(scene) {
        if (scene.game.player.activatedJet && !this.earlyPropeller) {
            this.earlyPropeller = true;
            this.load.propellerStop.volume = 0.0;
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
                rate: scene.game.player.energy / this.halfDistance + 0.85 + this.volumeSFX,
                duration: this.barRateDiv[3],
            });
        } else if (!scene.game.player.activatedJet && this.earlyPropeller) {
            this.earlyPropeller = false;
            Audio.load.propellerStop.play();
            Audio.load.propellerStop.setRate(0.9 + (Math.random() * 0.1));
            Audio.load.propellerStop.volume = this.volumeSFX;
            Audio.load.propellerLoop.volume = 0.0;
            Audio.load.propellerLoop.setRate(0.001);
            Audio.load.propellerLoop.stop();
            Audio.load.engineLoop.volume = 0.0;
            Audio.load.engineLoop.setRate(0.9 + (Math.random() * 0.1));
            Audio.load.engineLoop.stop();
            Audio.load.propellerLoop.stop();
        } else if (this.earlyPropeller) {
            scene.tweens.add({
                targets: Audio.load.propellerLoop,
                volume: this.volumeSFX,
                rate: scene.game.player.energy / this.halfDistance + 0.85,
                duration: this.barRateDiv[2],
            });
        }
    }
    preload() {
        //LOAD AUDIO
        this.load.audio('loop0000base', 'assets/audio/BGM/loop0000base.mp3');
        this.load.audio('loop0000enemies', 'assets/audio/BGM/loop0000enemies.mp3');
        this.load.audio('loop0000flying', 'assets/audio/BGM/loop0000flying.mp3');
        this.load.audio('loop0000levitating', 'assets/audio/BGM/loop0000levitating.mp3');
        this.load.audio('loop0000moving', 'assets/audio/BGM/loop0000moving.mp3');
        this.load.audio('loop0000weapon_00', 'assets/audio/BGM/loop0000weapon_00.mp3');
        this.load.audio('loop0000weapon_01', 'assets/audio/BGM/loop0000weapon_01.mp3');
        this.load.audio('loop0000weapon_02', 'assets/audio/BGM/loop0000weapon_02.mp3');
        this.load.audio('loop0000weapon_03', 'assets/audio/BGM/loop0000weapon_03.mp3');
        this.load.audio('loop0000weapon_04', 'assets/audio/BGM/loop0000weapon_01.mp3');
        this.load.audio('loop0000weapon_05', 'assets/audio/BGM/loop0000weapon_01.mp3');
        this.load.audio('propellerLoop_00', 'assets/audio/SFX/propellerLoop_00.mp3');
        this.load.audio('engineLoop_00', 'assets/audio/SFX/engineLoop_00.mp3');
        this.load.audio('propellerStop_00', 'assets/audio/SFX/propellerStop_00.mp3');
        this.load.audio('shot_00', 'assets/audio/SFX/shot_00.mp3');
        this.load.audio('shot_01', 'assets/audio/SFX/shot_01.mp3');
        this.load.audio('impact_00', 'assets/audio/SFX/impact_00.mp3');
        this.load.audio('impact_01', 'assets/audio/SFX/impact_01.mp3');
        this.load.audio('wick_00', 'assets/audio/SFX/wick_00.mp3');
        this.load.audio('explosion_01', 'assets/audio/SFX/explosion_01.mp3');
        this.load.audio('weaponChange_00', 'assets/audio/SFX/weaponChange_00.mp3');
    }
    create() {
        //INIT de AUDIO
        this.shot_00 = this.sound.add('shot_00');
        this.shot_01 = this.sound.add('shot_01');
        this.impact_00 = this.sound.add('impact_00');
        this.impact_01 = this.sound.add('impact_01');
        this.wick_00 = this.sound.add('wick_00');
        this.explosion_01 = this.sound.add('explosion_01');
        this.weaponChange_00 = this.sound.add('weaponChange_00');
        this.propellerLoop = this.sound.add('propellerLoop_00', {
            volume: 0.0,
            loop: true
        })
        this.engineLoop = this.sound.add('engineLoop_00', {
            volume: 0.0,
            loop: true
        })
        this.propellerStop = this.sound.add('propellerStop_00');
        this.stingerShot = false;
        this.stingerJet = false;
        this.stingerMovement = false;
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
        this.bgmIfWeapon[4] = this.sound.add('loop0000weapon_01', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon[5] = this.sound.add('loop0000weapon_01', {
            volume: 0.0,
            loop: true
        })
        this.bgmIfWeapon[6] = this.sound.add('loop0000weapon_00', {
            volume: 0.0,
            loop: true
        })
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
        this.bgmIfWeapon[5].play();
        this.bgmIfWeapon[6].play();
        Audio.load = this;
        console.log("AUDIO LOADED.")
        this.scene.start("SceneLoading");
    }
}