//escena que carga todos los recursos para el juego
export default class SceneLoading extends Phaser.Scene {
  constructor() {
    super("SceneLoading");
  }

  preload(){

    //IMAGES, SPRITES, SPRITESHEETS
    this.load.image('square', 'assets/square.jpg');
    this.load.image('hexa', 'assets/hexa.png');
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
    //this.load.spritesheet('androidJumpDown', 'assets/Sprites/Player/male_android_jumping_down.png', { frameWidth: 32, frameHeight: 64 });

    this.load.image('playerFireArm', 'assets/Sprites/Player/player_FireArm.png', { frameWidth: 32, frameHeight: 64 });

    this.load.image('dummy', 'assets/Sprites/Enemies/dummy.png');

    this.load.image('bg_e', 'assets/Backgrounds/Sky/SkyBG.png');
    this.load.image('bg1_e', 'assets/Backgrounds/Sky/CloudsFar.png');
    this.load.image('bg2_e', 'assets/Backgrounds/Sky/CloudsMid.png');
    this.load.image('bg3_e', 'assets/Backgrounds/Sky/CloudsClose.png');

    this.load.image("tiles2", "../assets/Tilesets/Tileset_central_electrica.png");
    this.load.tilemapTiledJSON("map2", "../assets/Mapas/Electrical_medium.json");


    this.load.image('bullet', 'assets/Sprites/Bullet/bullet.png');
    this.load.spritesheet('explodingBomb', 'assets/Sprites/Bomb/bomb_ss.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('explosion', 'assets/Sprites/Explosions/explosion-6.png', { frameWidth: 48, frameHeight: 48 });

    //preload del joystick
    this.load.plugin('rexvirtualjoystickplugin', 'src/rexvirtualjoystickplugin.min.js', true);
    this.load.plugin('rexdragplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdragplugin.min.js', true);
    this.load.image('arrow', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow.png');
  }

  create(){
    console.log(this);
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
        frameRate: 10,
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
        frameRate: 10,
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
        repeat: -1
    });
    this.anims.create({
        key: 'arm_airMove',
        frames: this.anims.generateFrameNumbers('arm_playerAirMove', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: 'arm_airDown',
        frames: this.anims.generateFrameNumbers('arm_playerAirDown', { start: 0, end: 0 }),
        frameRate: 1,
        repeat: -1
    });

    this.anims.create({
            key: 'eBomb',
            frames: this.anims.generateFrameNumbers('explodingBomb', { start: 0, end: 13 }),
            frameRate: 7,
            repeat: 0
        });

    this.anims.create({
            key: 'exprosion',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 7 }),
            frameRate: 12,
            repeat: 0
        });

    //transicion a siguiente escena
    this.scene.start("SceneMM");

  }
}
