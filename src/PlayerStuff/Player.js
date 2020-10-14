
import PlayerFireArmPC from "./PlayerFireArmPC.js";
import PlayerFireArmMobile from "./PlayerFireArmMobile.js";
import Bar from "./Bar.js";

export default class Player {
  constructor(scene, x, y) {
    //inicializacion
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x, y, 'playerIdle', 0);
    this.scene.game.player = this;

    scene.matter.world.on("beforeupdate", this.resetTouching, this);
    this.scene.events.on("update", this.update, this);  //para que el update funcione

    this.crossCounter = 0;

    //variables para el movimiento
    this.leftMultiply = 1;
    this.rightMultiply = 1;

    this.braceVelocity = 0.08;
    this.falseGravity = this.scene.game.config.physics.matter.gravity.y/(this.scene.matter.world.getDelta() * 30);
    this.falseVelocityY = 0;

    //generacion del cuerpo del personaje (cuerpo compuesto de 4 partes: una parte principal, 2 a cada lado y uno por debajo)
    //los 3 cuerpos que rodean al principal son sensores que detectan con que collisiona el personaje
    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this.sprite;
    this.mainBody = Bodies.rectangle(0, 6, w * 0.45, h * 0.85, { chamfer: { radius: 5 } });
    this.sensors = {
      bottom: Bodies.rectangle(0, 36, w * 0.3, 8, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.3, 6, 5, h * 0.6, { isSensor: true }),
      right: Bodies.rectangle(w * 0.3, 6, 5, h * 0.6, { isSensor: true })
    };
    const compoundBody = Body.create({
      parts: [this.mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
      frictionAir: 0.02
    });
    this.sprite.setScale(1.5);
    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation()
      .setPosition(x, y)
      .setOrigin(0.5, 0.72)     //0.5, 0.55
      .body.collisionFilter.group = -1;

    this.isTouching = { left: false, right: false, ground: false };

    //BRAZO
    this.movingArm = this.scene.add.sprite(x, y, 'arm_playerIdle', 0);
    this.movingArm.setOrigin(0.5, 0.75);
    this.movingArm.setScale(this.sprite.scale);
    //BRAZO

    //código para boundry box de cuerpos de matter (no se toca)
    this.earlyPos = new Phaser.Math.Vector2(this.sprite.body.position.x, this.sprite.body.position.y);
    this.advance32X = 0;
    this.advance32Y = 0;

    //vida, energía y sus barras correspondientes
    this.hp = this.scene.game.totalPlayerHp;
    this.energy = this.scene.game.totalPlayerEnergy;
    this.hpBar = new Bar(this.scene, 50,450, 250, 25, 0x00ff00, 0x999999, 0x000000, this.hp);
    this.energyBar = new Bar(this.scene, 50,485, 250, 25, 0x0000ff, 0x999999, 0x000000, this.energy);

    //miniinvulnerabilidad al ser dañado
    this.invulTimer = this.scene.time.addEvent({
      delay: 100
    });
    //jet
    this.activatedJet = false;
    this.isTakingOf = false;
    this.jetAumulator = 0;

    //disparo y brazo de disparo
    this.fireCounterTap = 0;
    this.fireCounterHold = 0;
    this.weapons = [];
    //creacion de armas con nombre, "rate" de ataque (cuanto más grande más lento), velocidad de proyectil, tiempo de vida de proyectil, coste de energia por disparo,
    //cuanta proporción de "recovery de energía" hay al disparar (por ej: si es 0.5 recuperamos la mitad de energía que de normal cada update), y el frame del crosshair.png que se usa
    this.weapons[0] = {name: "MachineGun", fireRate: 4 * this.scene.matter.world.getDelta(), projectileSpeed: 30, expireTime: 1000, energyCost: 1, energyRecoverProportion: 0, chFrame: 0};
    this.weapons[1] = {name: "BombLauncher", fireRate: 30 * this.scene.matter.world.getDelta(), projectileSpeed: 10, expireTime: 2000, energyCost: 10, energyRecoverProportion: 0.2, chFrame: 1};
    //this.weapons[2] = {name: "Ejemplo", fireRate: 10 * this.scene.matter.world.getDelta(), projectileSpeed: 10, expireTime: 1000, energyCost: 10 , chFrame: 1};
    this.weaponCounter = 0;

    if(this.scene.game.onPC){
      this.cursors = this.scene.input.keyboard.addKeys({
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D,
      'down': Phaser.Input.Keyboard.KeyCodes.S});
      this.weaponChange = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      this.fireArm = new PlayerFireArmPC(this.scene, x, y);
      this.firingPointer = this.scene.input.activePointer;
      this.movingPointer = undefined;

      //EVENTOS
      this.weaponChange.on('down', function(event){
        this.changeWeapon();
      }, this);

      //DISPARO
      this.scene.input.on('pointerdown', function(pointer){
        this.initializeFire();
      }, this);
      //DISPARO
      //EVENTOS
    }
    else {
      this.scene.input.addPointer(1);
      this.joyStick = this.scene.plugins.get('rexvirtualjoystickplugin').add(this, {
        x: 120,
        y: 420,
        radius: 100,
        base: this.scene.add.circle(0, 0, 100, 0x888888),
        thumb: this.scene.add.circle(0, 0, 50, 0xcccccc),
        // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
        // forceMin: 16,
        // enable: true
      });
      this.joyStick.base.setDepth(100);
      this.joyStick.thumb.setDepth(100);
      this.cursors = this.joyStick.createCursorKeys();

      this.button = this.scene.add.sprite(858, 450, 'weaponsHUD',0).setScale(0.75).setInteractive();
      this.button.setScrollFactor(0).setDepth(100);;

      this.fireArm = new PlayerFireArmMobile(this.scene, x, y);
      this.firingPointer = undefined;
      this.movingPointer = undefined;

      //EVENTOS
      this.button.on('pointerdown', function () {
        this.changeWeapon();
      }, this);

      //DISPARO
      this.scene.input.on('pointerdown', function(pointer){
        if(Math.pow(pointer.x - this.joyStick.base.x,2) + Math.pow(pointer.y - this.joyStick.base.y,2) - Math.pow(this.joyStick.base.width/2, 2) <= 0){
          this.movingPointer = pointer;
        }
        else if(Math.pow(pointer.x - this.button.x,2) + Math.pow(pointer.y - this.button.y,2) - Math.pow(this.button.width/2 ,2) <= 0){
          //boton cambio arma
        }
        else{
          this.firingPointer = pointer;
          this.initializeFire();
        }
      }, this);
      this.scene.input.on('pointerup', function(pointer){
        if(pointer == this.firingPointer){
          this.fireCounterHold = 0;
          this.firingPointer = undefined;
        }else {
          this.movingPointer = undefined;
        }
      }, this);
      //DISPARO
      //EVENTOS
    }

    scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });
    scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });

        /*
    scene.matterCollision.addOnCollideStart({
      objectA: this.sensors.bottom,
      callback: this.soundFall,
      context: this
    });*/

    //FIREARM

    console.log(this);
  }
  soundFall(bodyB){
    /*if (bodyB.isSensor) return;
    var landSound = this.scene.sound.add('land', {volume: this.scene.game.soundVolume});
    landSound.play();*/
  }
  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    if (bodyA === this.sensors.bottom) {
      this.isTouching.ground = true;
      if(this.activatedJet && this.cursors.down.isDown){
          this.sprite.body.frictionAir = 0.01;
          //this.sprite.setVelocityY(this.scene.game.jetVelocity * this.scene.matter.world.getDelta());
          this.sprite.setIgnoreGravity(false);
          this.activatedJet = false;
          this.jetAumulator = 0;
      }
    }
    //if (bodyB.name == "interactableBody") return;     //ejemplo para cuerpo NO chocables
    if (bodyB.label == "Body" && bodyB.parent.gameObject.tile.properties.lethal) return;
    if (bodyA === this.sensors.right) {
      this.isTouching.right = true;
      this.rightMultiply = 0;
      if (pair.separation > 2) { this.sprite.x -= 0.1 }
    }
    if (bodyA === this.sensors.left) {
      this.isTouching.left = true;
      this.leftMultiply = 0;
      if (pair.separation > 2) { this.sprite.x += 0.1 }
    }
  }

  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
    this.earlyPos.x = this.sprite.body.position.x;
    this.earlyPos.y = this.sprite.body.position.y;
  }

  playerMoveForceX(){
    if(!this.scene.game.onPC) return Math.abs(Math.min(Math.max(this.joyStick.forceX/100, -1), 1));
    else return 1;
  }
  playerMoveForceY(){
    if(!this.scene.game.onPC) return Math.abs(Math.min(Math.max(this.joyStick.forceY/100, -1), 1));
    else return 1;
  }

  update(time, delta) {
    this.updateBoundry();
    if (this.hp <= 0) { return; } //CAMBIAR ESPERA ACTIVA

    if (this.cursors.right.isDown) {
      if (!(this.isTouching.ground && this.isTouching.right)) {
        this.sprite.setVelocityX(this.scene.game.moveVelocity * delta * this.rightMultiply * this.playerMoveForceX());
      }
    }
    else if (this.cursors.left.isDown) {
      if (!(this.isTouching.ground && this.isTouching.left)) {
        this.sprite.setVelocityX(-this.scene.game.moveVelocity * delta * this.leftMultiply * this.playerMoveForceX());
      }
    }
    this.movingArm.x = this.sprite.x;
    this.movingArm.y = this.sprite.y;
    this.playAnimation(this.fireArm.fireArmActive);

    //código fantasma de juegos en red
    /*if (this.sprite.y > 640) {
      this.damaged(new Phaser.Math.Vector2(0, -1), 40);
    }*/
    this.leftMultiply = 1;
    this.rightMultiply = 1;

    //DISPARAR
    if(this.firingPointer != undefined && this.firingPointer.isDown){
      this.fireCounterHold += delta;
      if (this.fireCounterHold >= this.weapons[this.weaponCounter].fireRate){
        this.fireCounterHold = 0;
        this.fireCounterTap = 0;
        this.fireProjectile();
      }
    }
    else{
      if(this.crossCounter > this.fireArm.afterActive && this.fireArm.fireArmActive){
        this.fireArm.disableFireArm();
        this.movingArm.setVisible(true);
      }
      else
        this.crossCounter += delta;
    }
    this.fireCounterTap += delta;
    //DISPARAR

    //JET
    if(Phaser.Input.Keyboard.JustDown(this.cursors.up)){
        if(!this.activatedJet && this.energy >= this.scene.game.energyCostJetPropulsion){
          this.isTakingOf = true;
          this.sprite.anims.play('propulsion', true);
          this.movingArm.anims.play('arm_airUp', true);
          this.fireArm.adjustOffset(-5, -22);
          this.sprite.once('animationcomplete', function(){
            this.isTakingOf = false;
          },this);
          this.sprite.body.frictionAir = 0.06;
          this.activatedJet = true;
          //this.falseVelocityY = -1/this.scene.matter.world.getDelta();
          this.sprite.setIgnoreGravity(true);
          this.playerUseEnergy(this.scene.game.energyCostJetPropulsion);
        }
    }
    if(this.activatedJet){
      if(this.cursors.up.isDown && !this.isTakingOf){
        if(this.sprite.body.velocity.y >= this.braceVelocity){
          this.sprite.setVelocityY((this.sprite.body.velocity.y/this.scene.matter.world.getDelta() - this.braceVelocity) * delta * this.playerMoveForceY());
        }else {
          this.sprite.setVelocityY(-this.scene.game.jetVelocity * delta * this.playerMoveForceY());
        }
      }
      if(this.cursors.down.isDown){
        this.sprite.setVelocityY(this.scene.game.jetVelocity * delta * this.playerMoveForceY());
      }
      if(this.energy > 0){
        this.playerUseEnergy(this.scene.game.energyCostJetBeginning + this.jetAumulator);
        this.jetAumulator += (this.scene.game.energyJetIncrease * delta/this.scene.matter.world.getDelta());  //posiblemente cambiar coste con descenso para ofrecer al jugador posibilidades si se equivoca y activa sin querer el jet
      }else{
        this.playerUseEnergy(this.energy);
        this.offJet();
        this.jetAumulator = 0;
      }
    }else{
      if(this.energy < this.scene.game.totalPlayerEnergy){
        if(this.fireCounterTap >= this.weapons[this.weaponCounter].fireRate + 60)
          this.playerUseEnergy(-this.scene.game.energyRecoveryRate);
        else
          this.playerUseEnergy(-this.scene.game.energyRecoveryRate*this.weapons[this.weaponCounter].energyRecoverProportion);
      }
    }
    //gravedad falsa para el trhust inicial
    if(this.falseVelocityY < 0){
      this.sprite.y += (this.falseVelocityY * delta);
      this.falseVelocityY += (this.falseGravity * delta);
    }
    else
      this.falseVelocityY = 0;
    //JET
  }
  playAnimation(isFiring){
    if(this.activatedJet){
      this.sprite.anims.setTimeScale(1);
      this.movingArm.anims.setTimeScale(1);
      if(!this.isTakingOf){
        if(this.cursors.down.isDown){
          this.sprite.anims.play('airDown', true);
          this.movingArm.anims.play('arm_airDown', true);
          this.fireArm.adjustOffset(-7, -19);
        }else if(this.cursors.right.isDown || this.cursors.left.isDown){
          this.sprite.anims.play('airMove', true);
          this.movingArm.anims.play('arm_airMove', true);
          this.fireArm.adjustOffset(1, -19);
        }else if(this.cursors.up.isDown){
          this.sprite.anims.play('airUp', true);
          this.movingArm.anims.play('arm_airUp', true);
          this.fireArm.adjustOffset(-5, -25);
        }else{
          this.sprite.anims.play('airIdle', true);
          this.movingArm.anims.play('arm_airIdle', true);
          this.fireArm.adjustOffset(-5, -25);
        }
      }
    }else{
      if(this.cursors.right.isDown || this.cursors.left.isDown){
        this.sprite.anims.setTimeScale(this.playerMoveForceX());            //hay que clampear
        this.movingArm.anims.setTimeScale(this.playerMoveForceX());        //hay que clampear
        this.sprite.anims.play('wRight', true);
        this.movingArm.anims.play('arm_wRight', true);
        this.fireArm.adjustOffset(3, -14);
      }else{
        this.sprite.anims.setTimeScale(1);
        this.movingArm.anims.setTimeScale(1);
        this.sprite.anims.play('idle', true);
        this.movingArm.anims.play('arm_idle', true);
        this.fireArm.adjustOffset(-4, -22);
      }
    }

    if(isFiring){
      this.sprite.setFlipX(this.fireArm.armDir.x < 0);
      this.movingArm.setFlipX(this.fireArm.armDir.x < 0);
      this.fireArm.flipOffset((this.fireArm.armDir.x < 0)?-1:1);
    }else{
      if(this.cursors.right.isDown){
        this.sprite.setFlipX(false);
        this.movingArm.setFlipX(false);
      }else if(this.cursors.left.isDown){
        this.sprite.setFlipX(true);
        this.movingArm.setFlipX(true);
      }
    }
  }

  playerDamage(num, ignoreInvul = false) {
    const delayT = 100;
    if (this.invulTimer.elapsed == delayT || ignoreInvul) {
      //var dieSound = this.scene.sound.add('die', {volume: this.scene.game.soundVolume});  SONIDO MUERTE
      //dieSound.play();
      this.invulTimer = this.scene.time.addEvent({
        delay: delayT
      });

      this.hp -= num;
      if(this.hp < 0){
        this.hp = 0;
        this.playerDeath();
      }
      this.hpBar.draw(this.hp);
    }
  }

  playerDeath(){
    this.offJet();
    this.scene.input.off('pointerdown');
    this.scene.input.off('pointerup');
    if(this.weaponChange != undefined) {this.weaponChange.destroy();}
    this.fireArm.destroyFireArm();
    this.movingArm.destroy();
    this.sprite.anims.play('death', true);

    console.log("Te has Muerto...");
  }

  playerUseEnergy(num){
    this.energy -= num;
    this.energyBar.draw(this.energy);
  }

  offJet(){
    if(this.activatedJet){
      this.sprite.body.frictionAir = 0.01;
      this.sprite.setIgnoreGravity(false);
      this.activatedJet = false;
    }
  }

  initializeFire(){
    //inicializacón de disparo
    if(!this.fireArm.fireArmActive){
      this.fireArm.enableFireArm();
      this.movingArm.setVisible(false);
    }
    if (this.fireCounterTap >= this.weapons[this.weaponCounter].fireRate){
      //cooldown para el tap o al presionar una vez el arma
      this.fireCounterTap = 0;
      this.fireProjectile();
    }
    //variable que controla la velocidad de disparo del armo si se esta continuamente presionando el ratón
    this.fireCounterHold = 0;
    this.crossCounter = 0;
  }
  fireProjectile(){
    if(this.energy >= this.weapons[this.weaponCounter].energyCost){
      switch(this.weaponCounter){
        case 0:
          this.fireArm.fireBullet(this.weapons[this.weaponCounter].projectileSpeed, this.weapons[this.weaponCounter].expireTime);
        break;
        case 1:
          this.fireArm.fireBomb(this.weapons[this.weaponCounter].projectileSpeed,  this.weapons[this.weaponCounter].expireTime);
        break;
        default:
          console.log("no weapon");
        break;
      }
      this.playerUseEnergy(this.weapons[this.weaponCounter].energyCost);
    }
    else{
      this.playerUseEnergy(this.energy);
      this.offJet();
    }
  }
  changeWeapon(){
    this.fireCounterHold = 0;
    this.weaponCounter = (this.weaponCounter+1)%this.weapons.length;
    this.fireArm.changeCrosshairSpr(this.weapons[this.weaponCounter].chFrame)
    console.log(this.weapons[this.weaponCounter].name);
  }

  respawn() {
    /* POR SI QUEREMOS PARPADEO
    this.sprite.setDepth(1);
    this.otherAndroid.sprite.setDepth(0);
    this.sprite.setVelocityY(0);
    this.sprite.setVelocityX(0);
    this.sprite.x = this.otherAndroid.sprite.x;
    this.sprite.y = this.otherAndroid.sprite.y;

    this.invulnerable = true;
    this.sprite.visible = true;
    this.sprite.setActive(true);
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.5,
      ease: 'Cubic.easeOut',
      duration: 150,
      repeat: 6,
      yoyo: true
    })
    this.alive = true;
    this.scene.time.addEvent({
      delay: 6 * 150,
      callback: () => (this.invulnerable = false)
    });*/
  }
  deathSpawn(deathVector, deathSpread) {  //por si queremos particulas de muerte
    /*
    if (this.canDeathSpawn) {
      this.canDeathSpawn = false;
      var remainVelocity = 8;
      const dirAngle = deathVector.angle() * (180 / Math.PI);
      var randomAng;
      var randomVec;
      for (var i = 0; i < this.deathStuff.length; i++) {
        var debree = this.scene.matter.add.image(this.sprite.x, this.sprite.y, this.deathStuff[i], 0, { isSensor: true });
        randomAng = Phaser.Math.Between(dirAngle - deathSpread, dirAngle + deathSpread) * (Math.PI / 180);
        randomVec = new Phaser.Math.Vector2(Math.cos(randomAng), Math.sin(randomAng));
        randomVec.normalize();
        randomVec.scale(remainVelocity);
        debree.setVelocity(randomVec.x, randomVec.y);
        //debree.setAngularVelocity(Math.random()/10-0.05);
        this.scene.time.addEvent({
          delay: 3000,
          callback: (destroyDebree),
          args: [debree]
        });
      }
      this.scene.time.addEvent({
        delay: this.scene.game.respawnTime - 50,
        callback: () => (this.canDeathSpawn = true)
      });
    }
    function destroyDebree(debree) { debree.destroy() }
    */
  }

  updateBoundry(){
    //BAJO CONSTRUCCIÓN
    this.advance32X += (this.sprite.body.position.x - this.earlyPos.x);
    if(this.advance32X >= 32){
      const layersX = Math.floor(this.advance32X/32);
      this.xFrontiers(1, 17, layersX);
      this.advance32X = this.advance32X - 32*layersX;
    }else if (this.advance32X <= -32) {
      const layersX = Math.floor(Math.abs(this.advance32X/32));
      this.xFrontiers(-1, 17, layersX);
      this.advance32X = this.advance32X + 32*layersX;
    }
    this.advance32Y += (this.sprite.body.position.y - this.earlyPos.y);
    if(this.advance32Y >= 32){
      const layersY = Math.floor(this.advance32Y/32);
      this.yFrontiers(1, 17, layersY);
      this.advance32Y = this.advance32Y - 32*layersY;
    }else if (this.advance32Y <= -32) {
      const layersY = Math.floor(Math.abs(this.advance32Y/32));
      this.yFrontiers(-1, 17, layersY);
      this.advance32Y = this.advance32Y + 32*layersY;
    }
    this.earlyPos.x = this.sprite.body.position.x;
    this.earlyPos.y = this.sprite.body.position.y;
    //BAJO CONSTRUCCIÓN
  }
  xFrontiers(dir, boundry, layers = 1){
    const xBoundry = boundry*dir;
    const yBoundry = boundry + 1; //7+2
    const xNormalized = Math.floor(this.sprite.x/32);
    const yNormalized = Math.floor(this.sprite.y/32);
    var bodyWAdd;
    var bodyWRemove;

    for(var i=0; i<layers; i++){
      const xAdd = xNormalized + xBoundry + i*dir;
      const xRemove = xNormalized - xBoundry - 2*dir - i*dir;
      for(var j=-yBoundry; j<yBoundry+1; j++){
        bodyWAdd = this.scene.tileBodyMatrix[xAdd][yNormalized +j];
        bodyWRemove = this.scene.tileBodyMatrix[xRemove][yNormalized +j];
        if(bodyWAdd != undefined && !bodyWAdd.active){ //9-1 bugfix ya que el bounding box que elimina tiles es 2 casillas mas grande
          Phaser.Physics.Matter.Matter.Composite.addBody(this.scene.matter.world.localWorld, bodyWAdd.body);
          bodyWAdd.active = true;
        }
        if(bodyWRemove != undefined && bodyWRemove.active){
          Phaser.Physics.Matter.Matter.Composite.removeBody(this.scene.matter.world.localWorld, bodyWRemove.body);
          bodyWRemove.active = false;
        }
      }
      bodyWRemove = this.scene.tileBodyMatrix[xRemove][yNormalized  - yBoundry - 1];
      if(bodyWRemove != undefined && bodyWRemove.active){
        Phaser.Physics.Matter.Matter.Composite.removeBody(this.scene.matter.world.localWorld, bodyWRemove.body);
        bodyWRemove.active = false;
      }
      bodyWRemove = this.scene.tileBodyMatrix[xRemove][yNormalized  + yBoundry + 1];
      if(bodyWRemove != undefined && bodyWRemove.active){
        Phaser.Physics.Matter.Matter.Composite.removeBody(this.scene.matter.world.localWorld, bodyWRemove.body);
        bodyWRemove.active = false;
      }
    }
  }
  yFrontiers(dir, boundry, layers = 1){
    const xBoundry = boundry + 1; //7+2
    const yBoundry = boundry*dir;
    const xNormalized = Math.floor(this.sprite.x/32);
    const yNormalized = Math.floor(this.sprite.y/32);
    var bodyWAdd;
    var bodyWRemove;

    for(var i=-xBoundry; i<xBoundry+1; i++){
      const yAdd = yNormalized + yBoundry + j*dir;
      const yRemove = yNormalized - yBoundry - 2*dir - j*dir;
      for(var j=0; j<layers; j++){
        bodyWAdd = this.scene.tileBodyMatrix[xNormalized + i][yAdd];
        bodyWRemove = this.scene.tileBodyMatrix[xNormalized + i][yRemove];
        if(bodyWAdd != null && !bodyWAdd.active){
          Phaser.Physics.Matter.Matter.Composite.addBody(this.scene.matter.world.localWorld, bodyWAdd.body);
          bodyWAdd.active = true;
        }
        if(bodyWRemove != null && bodyWRemove.active){
          Phaser.Physics.Matter.Matter.Composite.removeBody(this.scene.matter.world.localWorld, bodyWRemove.body);
          bodyWRemove.active = false;
        }
      }
      bodyWRemove = this.scene.tileBodyMatrix[xNormalized - xBoundry - 1][yRemove];
      if(bodyWRemove != null && bodyWRemove.active){
        Phaser.Physics.Matter.Matter.Composite.removeBody(this.scene.matter.world.localWorld, bodyWRemove.body);
        bodyWRemove.active = false;
      }
      bodyWRemove = this.scene.tileBodyMatrix[xNormalized + xBoundry + 1][yRemove];
      if(bodyWRemove != null && bodyWRemove.active){
        Phaser.Physics.Matter.Matter.Composite.removeBody(this.scene.matter.world.localWorld, bodyWRemove.body);
        bodyWRemove.active = false;
      }
    }
  }

}
