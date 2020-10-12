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

    this.load.spritesheet('playerRun', 'assets/Sprites/Player/player_run.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('playerIdle', 'assets/Sprites/Player/player_idle.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('playerJumpUp', 'assets/Sprites/Player/player_jump.png', { frameWidth: 64, frameHeight: 64 });
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
        key: 'jumpUp',
        frames: this.anims.generateFrameNumbers('playerJumpUp', { start: 0, end: 2 }),
        frameRate: 10,
        repeat: 0
    });
    /*this.anims.create({
        key: 'jumpDown',
        frames: this.anims.generateFrameNumbers('androidJumpDown', { start: 0, end: 1 }),
        frameRate: 6,
        repeat: -1
    });*/

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
    this.scene.start("test1");

  }
}
