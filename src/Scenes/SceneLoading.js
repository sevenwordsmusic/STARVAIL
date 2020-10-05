//escena que carga todos los recursos para el juego
export default class SceneLoading extends Phaser.Scene {
  constructor() {
    super("SceneLoading");
  }

  preload(){

    //IMAGES, SPRITES, SPRITESHEETS
    this.load.image('square', 'assets/square.jpg');
    this.load.image('hexa', 'assets/hexa.png');
    this.load.image('crosshair', 'assets/crosshair.png');

    this.load.spritesheet('androidRun', 'assets/Sprites/Player/male_android_running.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('androidIdle', 'assets/Sprites/Player/male_android_idle.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('androidJumpUp', 'assets/Sprites/Player/male_android_jumping_up.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('androidJumpDown', 'assets/Sprites/Player/male_android_jumping_down.png', { frameWidth: 32, frameHeight: 64 });

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

  }

  create(){
    console.log(this);
    //ANIMS
    this.anims.create({
        key: 'wRight',
        frames: this.anims.generateFrameNumbers('androidRun', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('androidIdle', { start: 0, end: 1 }),
        frameRate: 2,
        repeat: -1
    });
    this.anims.create({
        key: 'jumpUp',
        frames: this.anims.generateFrameNumbers('androidJumpUp', { start: 0, end: 1 }),
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'jumpDown',
        frames: this.anims.generateFrameNumbers('androidJumpDown', { start: 0, end: 1 }),
        frameRate: 6,
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
    this.scene.start("test1");

  }
}
