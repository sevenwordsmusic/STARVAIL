//escena que carga todos los recursos para el juego
export default class SceneLoading extends Phaser.Scene {
  constructor() {
    super("SceneLoading");
  }

  preload(){
    //IMAGES, SPRITES, SPRITESHEETS
    this.load.image('square', 'assets/square.jpg');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('crosshair', 'assets/HUD/crosshair.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('weaponsHUD', 'assets/HUD/weaponsHUD.png', { frameWidth: 268, frameHeight: 252 });

    this.load.spritesheet('playerRun', 'assets/Sprites/Player/player_run_nogun.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('playerIdle', 'assets/Sprites/Player/player_idle_nogun.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('playerAirUp', 'assets/Sprites/Player/player_moveup_nogun.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('playerAirIdle', 'assets/Sprites/Player/player_flyidle_nogun.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('playerAirMove', 'assets/Sprites/Player/player_movefly_nogun.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('playerAirDown', 'assets/Sprites/Player/player_movedown_nogun.png', { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('arm_playerRun', 'assets/Sprites/Player/player_run_onlygun.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('arm_playerIdle', 'assets/Sprites/Player/player_idle_onlygun.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('arm_playerAirUp', 'assets/Sprites/Player/player_moveup_onlygun.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('arm_playerAirIdle', 'assets/Sprites/Player/player_flyidle_onlygun.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('arm_playerAirMove', 'assets/Sprites/Player/player_movefly_onlygun.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('arm_playerAirDown', 'assets/Sprites/Player/player_movedown_onlygun.png', { frameWidth: 64, frameHeight: 64 });

    this.load.spritesheet('playerDeath', 'assets/Sprites/Player/player_death.png', { frameWidth: 64, frameHeight: 64 });

    this.load.image('playerFireArm', 'assets/Sprites/Player/player_FireArm.png', { frameWidth: 32, frameHeight: 64 });

    this.load.spritesheet('dummy', 'assets/Sprites/Enemies/dummy.png', { frameWidth: 35, frameHeight: 44 });

    this.load.spritesheet('zapperGround', 'assets/Sprites/Enemies/DroidZapper/run.png', { frameWidth: 58, frameHeight: 41 });
    this.load.spritesheet('hero', 'assets/Sprites/Enemies/DroidHero/Blue Sword Run.png', { frameWidth: 93, frameHeight: 63 });
    this.load.spritesheet('mecha', 'assets/Sprites/Enemies/DroidMecha/mechNoGun.png', { frameWidth: 42, frameHeight: 60 }); //la cosa se pone interesante!
    this.load.spritesheet('gun', 'assets/Sprites/Enemies/gun.png', { frameWidth: 37, frameHeight: 7 });
    this.load.spritesheet('sith', 'assets/Sprites/Enemies/assassin/sithIdle.png', { frameWidth: 40, frameHeight: 30 });

    this.load.spritesheet('zapperAir', 'assets/Sprites/Enemies/DroidZapperAir/dronmove.png', { frameWidth: 91, frameHeight: 60 });
    this.load.spritesheet('bomb', 'assets/Sprites/Enemies/DroidBomb/Homing.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('gunner', 'assets/Sprites/Enemies/DroidGunner/Gunner.png', { frameWidth: 60, frameHeight: 40 });

    this.load.image('bg_e', 'assets/Backgrounds/Sky/SkyBG.png');
    this.load.image('bg1_e', 'assets/Backgrounds/Sky/CloudsFar.png');
    this.load.image('bg2_e', 'assets/Backgrounds/Sky/CloudsMid.png');
    this.load.image('bg3_e', 'assets/Backgrounds/Sky/CloudsClose.png');
    this.load.spritesheet('animatedBg', 'assets/animatedBgTest.png', { frameWidth: 631, frameHeight: 148 });

    //Tilesets de niveles y mapas de niveles
    this.load.image("tilesBackgorund", "assets/Tilesets/background_layer.png");
    this.load.image("tilesFront", "assets/Tilesets/front_layer.png");
    this.load.image("tilesMain", "assets/Tilesets/main_layer.png");
    this.load.image("tilesSecond", "assets/Tilesets/second_layer.png");
    //this.load.tilemapTiledJSON("map", "assets/Mapas/Level1.json");
    this.load.tilemapTiledJSON("map", "assets/Mapas/Level1Simple.json");


    this.load.image('bullet1', 'assets/Sprites/Bullet/bullet1.png');
    this.load.image('bullet2', 'assets/Sprites/Bullet/bullet2.png');
    this.load.image('bullet3', 'assets/Sprites/Bullet/bullet3.png');
    this.load.image('missile', 'assets/Sprites/Bullet/missile.png');
    this.load.spritesheet('laser', 'assets/Sprites/Bullet/laser.png', { frameWidth: 18, frameHeight: 600 });
    this.load.spritesheet('explodingBomb', 'assets/Sprites/Bomb/bomb_ss.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('bulletImpact', 'assets/Sprites/Impacts/expansive_100x100px.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('bulletImpact2', 'assets/Sprites/Impacts/big_directional_100x100px.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('bulletImpact3', 'assets/Sprites/Impacts/fast_100x100px.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('bulletImpact4', 'assets/Sprites/Impacts/full_100x100px.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('explosion', 'assets/Sprites/Explosions/explosion-6.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('smoke', 'assets/Sprites/Explosions/smoke.png', { frameWidth: 133, frameHeight: 160 });

    //preload del joystick
    this.load.plugin('rexvirtualjoystickplugin', 'src/rexvirtualjoystickplugin.min.js', true);
    this.load.plugin('rexdragplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdragplugin.min.js', true);
    this.load.image('arrow', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow.png');

    this.load.image('nextPage', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png');

  }

  create(){
    console.log(this);

    //BG ANIMADO
    this.anims.create({
        key: 'bgAnimation',
        frames: this.anims.generateFrameNumbers('animatedBg', { start: 0, end: 5 }),
        frameRate: 0.001,
        repeat: 0
    });

    //ANIMS
    this.anims.create({
        key: 'wRight',
        frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 7 }),
        frameRate: 14,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 6 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'propulsion',
        frames: this.anims.generateFrameNumbers('playerAirUp', { start: 0, end: 1 }),
        frameRate: 20,
        repeat: 0
    });
    this.anims.create({
        key: 'airIdle',
        frames: this.anims.generateFrameNumbers('playerAirIdle', { start: 0, end: 6 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'airUp',
        frames: this.anims.generateFrameNumbers('playerAirUp', { start: 1, end: 1 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'airMove',
        frames: this.anims.generateFrameNumbers('playerAirMove', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: 'airDown',
        frames: this.anims.generateFrameNumbers('playerAirDown', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: -1
    });

    //SOLO MANO
    this.anims.create({
        key: 'arm_wRight',
        frames: this.anims.generateFrameNumbers('arm_playerRun', { start: 0, end: 7 }),
        frameRate: 14,
        repeat: -1
    });
    this.anims.create({
        key: 'arm_idle',
        frames: this.anims.generateFrameNumbers('arm_playerIdle', { start: 0, end: 6 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'arm_propulsion',
        frames: this.anims.generateFrameNumbers('arm_playerAirUp', { start: 0, end: 1 }),
        frameRate: 20,
        repeat: 0
    });
    this.anims.create({
        key: 'arm_airIdle',
        frames: this.anims.generateFrameNumbers('arm_playerAirIdle', { start: 0, end: 6 }),
        frameRate: 5,
        repeat: -1
    });
    this.anims.create({
        key: 'arm_airUp',
        frames: this.anims.generateFrameNumbers('arm_playerAirUp', { start: 1, end: 1 }),
        frameRate: 5,
        repeat: 0
    });
    this.anims.create({
        key: 'arm_airMove',
        frames: this.anims.generateFrameNumbers('arm_playerAirMove', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: 0
    });
    this.anims.create({
        key: 'arm_airDown',
        frames: this.anims.generateFrameNumbers('arm_playerAirDown', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: 0
    });

    //MAS ANIMACIONES PERSONAJE
    this.anims.create({
        key: 'death',
        frames: this.anims.generateFrameNumbers('playerDeath', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: 0
    });

    this.anims.create({
            key: 'eBomb',
            frames: this.anims.generateFrameNumbers('explodingBomb', { start: 0, end: 13 }),
            frameRate: 7,
            repeat: 0
        });

    this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: 0
        });

    this.anims.create({
            key: 'explosion2',
            frames: this.anims.generateFrameNumbers('explosion2', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: 0
        });

    this.anims.create({
            key: 'bulletImpact',
            frames: this.anims.generateFrameNumbers('bulletImpact', { start: 0, end: 13 }),
            frameRate: 1000,
            repeat: 0
        });
    this.anims.create({
            key: 'bulletImpact2',
            frames: this.anims.generateFrameNumbers('bulletImpact2', { start: 0, end: 27 }),
            frameRate: 1000,
            repeat: 0
        });
    this.anims.create({
            key: 'bulletImpact3',
            frames: this.anims.generateFrameNumbers('bulletImpact3', { start: 0, end: 15 }),
            frameRate: 1000,
            repeat: 0
        });
    this.anims.create({
            key: 'bulletImpact4',
            frames: this.anims.generateFrameNumbers('bulletImpact4', { start: 0, end: 26 }),
            frameRate: 1000,
            repeat: 0
        });

    this.anims.create({
            key: 'dummy',
            frames: this.anims.generateFrameNumbers('dummy', { start: 0, end: 1 }),
            frameRate: 2,
            repeat: 0
        });

    this.anims.create({
            key: 'laser',
            frames: this.anims.generateFrameNumbers('laser', { start: 0, end: 2 }),
            frameRate: 8,
            yoyo: true,
            repeat: -1
        });

    this.anims.create({
            key: 'smoke',
            frames: this.anims.generateFrameNumbers('smoke', { start: 0, end: 20 }),
            frameRate: 12,
            repeat: -1
        });

    //transicion a siguiente escena
    this.scene.start("test1");

  }
}
