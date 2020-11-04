
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
    this.scene.events.on("render", this.solveBoundry, this);  //para que el update funcione

    this.crossCounter = 0;

    //variables para el movimiento
    this.leftMultiply = 1;
    this.rightMultiply = 1;

    this.braceVelocity = 0.08;
    //this.falseGravity = this.scene.game.config.physics.matter.gravity.y/(this.scene.matter.world.getDelta() * 30);
    //this.falseVelocityY = 0;

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
    this.sprite.body.collisionFilter.group = -1;
    this.sprite.body.collisionFilter.mask = 123;

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
    this.updateBoundryCounterX = 0;
    this.updateBoundryCounterY = 0;

    //vida, energía y sus barras correspondientes
    this.alive = true;
    this.hp = this.scene.game.totalPlayerHp;
    this.energy = this.scene.game.totalPlayerEnergy;
    this.hpBar = new Bar(this.scene, 50,450, 250, 25, 0x00ff00, 0x999999, 0x000000, this.hp);
    this.energyBar = new Bar(this.scene, 50,485, 250, 25, 0x0000ff, 0x999999, 0x000000, this.energy);

    //miniinvulnerabilidad al ser dañado
    this.invulTimer = this.scene.time.addEvent({
      delay: 100
    });

    this.adjustedFriction = 0.2/this.scene.matter.world.getDelta();
    this.knockVector = new Phaser.Math.Vector2(0,0);
    this.knockVecNomralized = new Phaser.Math.Vector2(0,0);

    //jet
    this.activatedJet = false;
    this.isTakingOf = false;
    this.jetAumulator = 1;

    //disparo y brazo de disparo
    this.fireCounterTap = 0;
    this.fireCounterHold = 0;
    this.weapons = [];
    this.initializeWeaponsArray();
    //this.weapons[2] = {name: "Ejemplo", fireRate: 10 * this.scene.matter.world.getDelta(), projectileSpeed: 10, expireTime: 1000, energyCost: 10 , chFrame: 1};
    this.weaponCounter = 0;

    this.buttons = [5];
    for(var i=0; i<5;i++){
      this.buttons[i] = this.scene.add.sprite(200 + i*100, 450, 'square',0).setScale(0.75).setInteractive();
      this.buttons[i].setScrollFactor(0).setDepth(100);
      this.buttons[i].playerInteractable = true;
    }
    this.nextButton = 0;

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
        //this.playerDamageKnockback(20, 0.1, new Phaser.Math.Vector2(-1,0));
        this.changeWeapon();
      }, this);

      //DISPARO
      this.scene.input.on('pointerdown', function(pointer, gameObject){
        if(gameObject[0] != undefined && gameObject[0].playerInteractable === true){
          console.log("acabas de interactuar con algo interactuable");
        }else{
          this.firingPointer = pointer;
          this.initializeFire();
        }
      }, this);
      this.scene.input.on('pointerup', function(pointer){
        if(pointer == this.firingPointer){
          this.deinitializeFire();
          this.firingPointer = undefined;
        }
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
      this.joyStick.base.playerInteractable = true;
      this.joyStick.thumb.setDepth(100);
      this.joyStick.thumb.playerInteractable = true;
      this.cursors = this.joyStick.createCursorKeys();

      this.fireArm = new PlayerFireArmMobile(this.scene, x, y);
      this.firingPointer = undefined;
      this.movingPointer = undefined;

      //EVENTOS
      //DISPARO
      this.scene.input.on('pointerdown', function(pointer, gameObject){
        if(gameObject[0] != undefined && gameObject[0].playerInteractable === true){
          this.movingPointer = pointer;
        }else{
          this.firingPointer = pointer;
          this.initializeFire();
        }
      }, this);
      this.scene.input.on('pointerup', function(pointer){
        if(pointer == this.firingPointer){
          this.deinitializeFire();
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
    scene.matterCollision.addOnCollideStart({
      objectA: this.mainBody,
      callback: this.onBodyCollide,
      context: this
    });

    this.closestEnemy = undefined;
    this.initPosibleClosestEnemy();

        /*
    scene.matterCollision.addOnCollideStart({
      objectA: this.sensors.bottom,
      callback: this.soundFall,
      context: this
    });*/

    //FIREARM

    this.tween = this.scene.tweens.add({
      targets: this.sprite,
      alpha: {from: 1, to: 0.2},
      duration: 100,
      repeat: 0,
      yoyo: true
    })

    this.recieveWeapon(0);

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
          this.jetAumulator = 1;
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

  onBodyCollide({ gameObjectB }){
    if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;
    const tile = gameObjectB;
    if (tile.properties.Lethal) {
      this.playerDamageKnockback(20, 0.2, new Phaser.Math.Vector2(-this.sprite.body.velocity.x, -this.sprite.body.velocity.y));
    }
  }

  resetTouching() {
    this.isTouching.left = false;
    this.isTouching.right = false;
    this.isTouching.ground = false;
    this.earlyPos.x = this.sprite.body.position.x;
    this.earlyPos.y = this.sprite.body.position.y;
  }

  solveBoundry(){
    if(this.updateBoundryCounterX > 0)
      this.xFrontiers(1, 25);
    if(this.updateBoundryCounterX < 0)
      this.xFrontiers(-1, 25);
    this.updateBoundryCounterX = 0;

    if(this.updateBoundryCounterY > 0)
      this.yFrontiers(1, 25);
    if(this.updateBoundryCounterY < 0)
      this.yFrontiers(-1, 25);
    this.updateBoundryCounterY = 0;
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
    if (!this.alive) { return; } //CAMBIAR ESPERA ACTIVA
    //if(this.sprite.y > 5000)  this.sprite.y = 3000;
    this.updateKnockback(time, delta);
    this.updateBoundry();


    if(this.sprite.body.velocity.x > -0.01 && this.sprite.body.velocity.x < 0.01)
      this.sprite.body.velocity.x = 0;

    if(this.sprite.body.velocity.y > -0.01 && this.sprite.body.velocity.y < 0.01)
      this.sprite.body.velocity.y = 0;

    if (this.cursors.right.isDown) {
      if (!this.isTouching.right) {
        if(this.activatedJet)
          this.sprite.setVelocityX(this.scene.game.moveVelocityAir * delta * this.rightMultiply * this.playerMoveForceX());
        else
          this.sprite.setVelocityX(this.scene.game.moveVelocity * delta * this.rightMultiply * this.playerMoveForceX());
      }
    }
    else if (this.cursors.left.isDown) {
      if (!this.isTouching.left) {
        if(this.activatedJet)
          this.sprite.setVelocityX(-this.scene.game.moveVelocityAir * delta * this.leftMultiply * this.playerMoveForceX());
        else
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
      if(this.cursors.down.isDown){
        this.sprite.setVelocityY(this.scene.game.jetVelocityDown * delta * this.playerMoveForceY());
      }
      else if(this.cursors.up.isDown && !this.isTakingOf){
        if(this.sprite.body.velocity.y >= this.braceVelocity){
          this.sprite.setVelocityY((this.sprite.body.velocity.y/this.scene.matter.world.getDelta() - this.braceVelocity) * delta * this.playerMoveForceY());
        }else {
           this.sprite.setVelocityY(-this.scene.game.jetVelocity * delta * this.playerMoveForceY());
        }
      }
      if(this.energy > 0){
        this.playerUseEnergy(this.scene.game.energyCostJetBeginning + this.jetAumulator - 1);
        this.jetAumulator = this.jetAumulator * (1+((this.scene.game.energyJetIncrease-1) * delta/this.scene.matter.world.getDelta()));  //posiblemente cambiar coste con descenso para ofrecer al jugador posibilidades si se equivoca y activa sin querer el jet
      }else{
        this.playerUseEnergy(this.energy);
        this.offJet();
        this.jetAumulator = 1;
      }
    }else{
      if(this.energy < this.scene.game.totalPlayerEnergy){
        if(this.fireCounterTap >= this.weapons[this.weaponCounter].fireRate + 60)
          this.playerGainEnergy(this.scene.game.energyRecoveryRate);
        else
          this.playerGainEnergy(this.scene.game.energyRecoveryRate*this.weapons[this.weaponCounter].energyRecoverProportion);
      }
    }
    /*
    //gravedad falsa para el trhust inicial
    if(this.falseVelocityY < 0){
      this.sprite.y += (this.falseVelocityY * delta);
      this.falseVelocityY += (this.falseGravity * delta);
    }
    else
      this.falseVelocityY = 0;*/

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
      this.scene.game.isFiring=true;
      this.sprite.setFlipX(this.fireArm.armDir.x < 0);
      this.movingArm.setFlipX(this.fireArm.armDir.x < 0);
      this.fireArm.flipOffset((this.fireArm.armDir.x < 0)?-1:1);
    }else{
        this.scene.game.isFiring=false;
      if(this.cursors.right.isDown){
        this.sprite.setFlipX(false);
        this.movingArm.setFlipX(false);
      }else if(this.cursors.left.isDown){
        this.sprite.setFlipX(true);
        this.movingArm.setFlipX(true);
      }
    }
  }

  updateKnockback(time, delta){
    if(this.knockVector.length() > this.adjustedFriction){
      this.knockVector.x -= this.knockVecNomralized.x * this.adjustedFriction;
      this.knockVector.y -= this.knockVecNomralized.y * this.adjustedFriction;
      this.sprite.x += this.knockVector.x * delta;
      this.sprite.y += this.knockVector.y * delta;
      //this.knockVector.x -= this.adjustedFriction*Math.sign(this.knockVector.x);
      //this.knockVector.y -= this.adjustedFriction*Math.sign(this.knockVector.y);
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
      if(this.tween.progress == 1){
        this.tween.restart();
      }
      this.hp -= num;
      if(this.hp <= 0){
        this.hp = 0;
        this.playerDeath();
      }
      this.hpBar.draw(this.hp);
    }
  }
  playerDamageKnockback(num, knockback, knockVec , ignoreInvul = false) {
    this.knockVector.x = knockVec.x;
    this.knockVector.y = knockVec.y;
    this.knockVecNomralized = this.knockVector.normalize();
    this.knockVector.scale(knockback);

    this.playerDamage(num, ignoreInvul);
  }

  playerDeath(){
    this.alive = false;
    this.offJet();
    this.scene.input.off('pointerdown');
    this.scene.input.off('pointerup');
    if(this.weaponChange != undefined) {this.weaponChange.destroy();}
    this.fireArm.destroyFireArm();
    this.movingArm.destroy();
    this.sprite.anims.play('death', true);
  this.sprite.body.collisionFilter.mask = 0;
    console.log(this.sprite.body);

    console.log("Te has Muerto...");
  }

  playerUseEnergy(num){
    this.energy -= num;
    this.energyBar.draw(this.energy);
  }
  playerGainEnergy(num){
    this.energy += num;
    this.energyBar.draw(this.energy);
  }

  offJet(){
    if(this.activatedJet){
      this.sprite.body.frictionAir = 0.01;
      this.sprite.setIgnoreGravity(false);
      this.activatedJet = false;
    }
  }

  initializeWeaponsArray(){
    //creacion de armas con nombre, "rate" de ataque (cuanto más grande más lento), velocidad de proyectil, tiempo de vida de proyectil, coste de energia por disparo,
    //cuanta proporción de "recovery de energía" hay al disparar (por ej: si es 0.5 recuperamos la mitad de energía que de normal cada update), el sprite del proyectil, el frame del crosshair.png que se usa
    this.weapons[0] = {name: "BulletNormal", damage: 6, spread: 0.05, fireRate: 6 * this.scene.matter.world.getDelta(), projectileSpeed: 30, expireTime: 800, energyCost: 0, energyRecoverProportion: 0, wSprite: "bullet1", chFrame: 0};
    this.weapons[1] = {name: "BulletSuperSonic", damage: 6, spread: 0.05, fireRate: 3 * this.scene.matter.world.getDelta(), projectileSpeed: 40, expireTime: 800, energyCost: 0.1, energyRecoverProportion: 0, wSprite: "bullet3", chFrame: 0};
    this.weapons[2] = {name: "BulletExplosive", damage: 14, knockback: 2 / this.scene.matter.world.getDelta(),  spread: 0.1, fireRate: 8 * this.scene.matter.world.getDelta(), projectileSpeed: 25, expireTime: 800, energyCost: 0.25, energyRecoverProportion: 0, wSprite: "bullet2", chFrame: 0};
    this.weapons[3] = {name: "BulletBounce", damage: 10, bounce: 3, spread: 0.075, fireRate: 8 * this.scene.matter.world.getDelta(), projectileSpeed: 25, expireTime: 800, energyCost: 0.1, energyRecoverProportion: 0, wSprite: "bullet1", chFrame: 0};
    this.weapons[4] = {name: "BombNormal", damage: 40, area: 45, knockback:  2 / this.scene.matter.world.getDelta(), fireRate: 25 * this.scene.matter.world.getDelta(), projectileSpeed: 10, expireTime: 2000, energyCost: 3, energyRecoverProportion: 0.2, wSprite: "explodingBomb", chFrame: 1};
    this.weapons[5] = {name: "BombMegaton", damage: 95, area: 68, knockback: 3.5 / this.scene.matter.world.getDelta(), extraEffect: 1.5, fireRate: 30 * this.scene.matter.world.getDelta(), projectileSpeed: 10, expireTime: 2000, energyCost: 8, energyRecoverProportion: 0.2, wSprite: "explodingBomb", chFrame: 1};
    this.weapons[6] = {name: "Misil", damage: 40, area: 30, knockback: 1 / this.scene.matter.world.getDelta(), autoAim: 0.08 / this.scene.matter.world.getDelta(), fireRate: 20 * this.scene.matter.world.getDelta(), projectileSpeed: 15, expireTime: 4000, energyCost: 3, energyRecoverProportion: 0.2, wSprite: "missile", chFrame: 2};
    this.weapons[7] = {name: "MissileMulti", damage: 10, area: 25, knockback: 1 / this.scene.matter.world.getDelta(), offsprings: 7, offspringScale: 0.6, fireRate: 30 * this.scene.matter.world.getDelta(), projectileSpeed: 15, expireTime: 3000, energyCost: 8, energyRecoverProportion: 0.2, wSprite: "missile", chFrame: 2};
    this.weapons[8] = {name: "Lasser", damage: 0.82, spread: 0, fireRate: 0, projectileSpeed: 0, expireTime: 0, energyCost: 0.004, energyRecoverProportion: 0, wSprite: "", chFrame: 3};
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

    if(this.weaponCounter == 8){
      this.fireArm.engageLaser();
    }
  }
  deinitializeFire(){
    if(this.weaponCounter == 8){
      this.fireArm.disengageLaser();
    }
    this.fireCounterHold = 0;
  }
  fireProjectile(){
    const currentWeapon = this.weapons[this.weaponCounter];
    if(this.energy >= currentWeapon.energyCost){
      this.fireArm.adjustFireDirection();
      switch(this.weaponCounter){
        case 0:
          this.fireArm.fireBullet(currentWeapon.wSprite, currentWeapon.damage, currentWeapon.spread, currentWeapon.projectileSpeed, currentWeapon.expireTime);
        break;
        case 1:
          this.fireArm.fireBulletFast(currentWeapon.wSprite, currentWeapon.damage, currentWeapon.spread, currentWeapon.projectileSpeed, currentWeapon.expireTime);
        break;
        case 2:
          this.fireArm.fireBulletExplosive(currentWeapon.wSprite, currentWeapon.damage, currentWeapon.knockback, currentWeapon.spread, currentWeapon.projectileSpeed, currentWeapon.expireTime);
        break;
        case 3:
          this.fireArm.fireBulletBounce(currentWeapon.wSprite, currentWeapon.damage, currentWeapon.bounce, currentWeapon.spread, currentWeapon.projectileSpeed, currentWeapon.expireTime);
        break;
        case 4:
          this.fireArm.fireBomb(currentWeapon.wSprite, currentWeapon.damage, currentWeapon.area, currentWeapon.knockback, currentWeapon.projectileSpeed,  currentWeapon.expireTime);
        break;
        case 5:
          this.fireArm.fireMegaton(currentWeapon.wSprite, currentWeapon.damage, currentWeapon.area, currentWeapon.knockback, currentWeapon.extraEffect, currentWeapon.projectileSpeed,  currentWeapon.expireTime);
        break;
        case 6:
          this.fireArm.fireMissile(currentWeapon.wSprite, currentWeapon.damage, currentWeapon.area, currentWeapon.knockback, currentWeapon.autoAim, currentWeapon.projectileSpeed,  currentWeapon.expireTime);
        break;
        case 7:
          this.fireArm.fireMulti(currentWeapon.wSprite, currentWeapon.damage, currentWeapon.area, currentWeapon.knockback, currentWeapon.offsprings, currentWeapon.offspringScale, currentWeapon.projectileSpeed,  currentWeapon.expireTime);
        break;
        case 8:
          this.fireArm.fireLasser(currentWeapon.damage);
        break;
        default:
          console.log("no weapon");
        break;
      }
      this.playerUseEnergy(currentWeapon.energyCost);
    }
    else{
      this.playerUseEnergy(this.energy);
      this.offJet();
    }
  }
  changeWeapon(){
    this.scene.game.anims.resumeAll();

    if(this.weaponCounter == 8){
      this.fireArm.disengageLaser();
    }

    this.fireCounterHold = 0;
    this.weaponCounter = (this.weaponCounter+1)%this.weapons.length;
    this.fireArm.changeCrosshairSpr(this.weapons[this.weaponCounter].chFrame)

    if(this.weaponCounter == 8 && this.firingPointer!== undefined && this.firingPointer.isDown){
      this.fireArm.engageLaser();
    }

    console.log(this.weapons[this.weaponCounter].name);
  }

  setWeapon(num){
    this.scene.game.anims.resumeAll();
    if(this.weaponCounter == 8){
      this.fireArm.disengageLaser();
    }

    this.fireCounterHold = 0;
    this.weaponCounter = num;
    this.fireArm.changeCrosshairSpr(this.weapons[this.weaponCounter].chFrame)

    if(this.weaponCounter == 8 && this.firingPointer!== undefined && this.firingPointer.isDown){
      this.fireArm.engageLaser();
    }

    console.log(this.weapons[this.weaponCounter].name);
  }

  recieveWeapon(id){
    const aux = this.nextButton;
    this.buttons[aux].on('pointerdown', function () {
      this.setWeapon(id);
    }, this);
    this.scene.add.image(this.buttons[aux].x, this.buttons[aux].y, this.weapons[id].wSprite,0).setScrollFactor(0).setDepth(101).setScale(2);

    this.nextButton++;
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

  initPosibleClosestEnemy(){
    var closeseEnemyDistance = Number.MAX_SAFE_INTEGER;
    for(var i=0; i<this.scene.enemyController.enemyBodies.length; i++){
      if(this.scene.enemyController.enemyBodies[i] != undefined){
        const distanceToEnemy = Math.sqrt(Math.pow(this.sprite.x - this.scene.enemyController.enemyBodies[i].gameObject.x,2) + Math.pow(this.sprite.y - this.scene.enemyController.enemyBodies[i].gameObject.y,2));
        if(distanceToEnemy < closeseEnemyDistance){
          this.closestEnemy = this.scene.enemyController.enemyBodies[i].gameObject.parent;
          closeseEnemyDistance = distanceToEnemy;
        }
      }
    }
    /*if(closeseEnemyDistance != Number.MAX_SAFE_INTEGER){
      this.scene.events.once('noEnemy' + this.closestEnemy.currentBodyIndex, function(){
        this.seekPosibleClosestAlive();
      },this);
    }else{
      this.closestEnemy = undefined;
    }*/
  }

  /*seekPosibleClosestAlive(){
    if(this.closestEnemy == undefined || this.closestEnemy.sprite.body == undefined){
      this.initPosibleClosestEnemy();
    }
  }
  */
  getClosestEnemyDistance(){
    if(this.closestEnemy !== undefined && this.closestEnemy.sprite !== undefined && this.closestEnemy.sprite.body !== undefined)
      return Math.sqrt(Math.pow(this.sprite.x - this.closestEnemy.sprite.x,2) + Math.pow(this.sprite.y - this.closestEnemy.sprite.y,2));
    else
      return Number.MAX_SAFE_INTEGER;
  }

  updateBoundry(){
    //console.log(this.closestEnemy.sprite.x);
    let newPlayerPos = false;
    //BOUNDRY
    this.advance32X += (this.sprite.body.position.x - this.earlyPos.x);
    this.advance32Y += (this.sprite.body.position.y - this.earlyPos.y);
    if(this.advance32X > 32){
      const layersX = Math.floor(this.advance32X/32);
      this.updateBoundryCounterX++;
      this.advance32X = this.advance32X - 32*layersX;
      //this.scene.enemyController.updatePlayerPosition();
      newPlayerPos = true
    }else if (this.advance32X < -32) {
      const layersX = Math.floor(Math.abs(this.advance32X/32));
      this.updateBoundryCounterX--;
      this.advance32X = this.advance32X + 32*layersX;
      //this.scene.enemyController.updatePlayerPosition();
      newPlayerPos = true
    }
    if(this.advance32Y > 32){
      const layersY = Math.floor(this.advance32Y/32);
      this.updateBoundryCounterY++;
      this.advance32Y = this.advance32Y - 32*layersY;
      //if(!newPlayerPos)
        //this.scene.enemyController.updatePlayerPosition();
    }else if (this.advance32Y < -32) {
      const layersY = Math.floor(Math.abs(this.advance32Y/32));
      this.updateBoundryCounterY--;
      this.advance32Y = this.advance32Y + 32*layersY;
      //if(!newPlayerPos)
        //this.scene.enemyController.updatePlayerPosition();
    }
    this.earlyPos.x = this.sprite.body.position.x;
    this.earlyPos.y = this.sprite.body.position.y;
    //BOUNDRY
  }
  xFrontiers(dir, boundry){
    const xBoundry = boundry*dir;
    const yBoundry = boundry + 1; //7+2
    const xNormalized = Math.floor(this.sprite.x/32);
    const yNormalized = Math.floor(this.sprite.y/32);
    var bodyWAdd;
    var bodyWRemove;

    const xAdd = xNormalized + xBoundry;
    const xRemove = xNormalized - xBoundry - 2*dir;
    for(var j=-yBoundry; j<yBoundry+1; j++){
      bodyWAdd = this.scene.tileBodyMatrix[xAdd][yNormalized +j];
      bodyWRemove = this.scene.tileBodyMatrix[xRemove][yNormalized +j];
      if(bodyWAdd != undefined && !bodyWAdd.active){ //9-1 bugfix ya que el bounding box que elimina tiles es 2 casillas mas grande
        //this.scene.game.transferBody(this.scene.matter.world.localWorld.bodies, bodyWAdd.body)
        //Phaser.Physics.Matter.Matter.Composite.addBody(this.scene.matter.world.localWorld, bodyWAdd.body);
        this.scene.matter.world.localWorld.bodies.push(bodyWAdd.body);
        bodyWAdd.active = true;
      }
      if(bodyWRemove != undefined && bodyWRemove.active){
        //Phaser.Physics.Matter.Matter.Composite.removeBody(this.scene.matter.world.localWorld, bodyWRemove.body);
        this.scene.matter.world.localWorld.bodies.splice(this.scene.matter.world.localWorld.bodies.indexOf(bodyWRemove.body), 1);
        bodyWRemove.active = false;
      }
    }
    bodyWRemove = this.scene.tileBodyMatrix[xRemove][yNormalized  - yBoundry - 1];
    if(bodyWRemove != undefined && bodyWRemove.active){
      //Phaser.Physics.Matter.Matter.Composite.removeBody(this.scene.matter.world.localWorld, bodyWRemove.body);
      this.scene.matter.world.localWorld.bodies.splice(this.scene.matter.world.localWorld.bodies.indexOf(bodyWRemove.body), 1);
      bodyWRemove.active = false;
    }
    bodyWRemove = this.scene.tileBodyMatrix[xRemove][yNormalized  + yBoundry + 1];
    if(bodyWRemove != undefined && bodyWRemove.active){
      //Phaser.Physics.Matter.Matter.Composite.removeBody(this.scene.matter.world.localWorld, bodyWRemove.body);
      this.scene.matter.world.localWorld.bodies.splice(this.scene.matter.world.localWorld.bodies.indexOf(bodyWRemove.body), 1);
      bodyWRemove.active = false;
    }
    bodyWAdd = undefined;
    bodyWRemove = undefined;
  }
  yFrontiers(dir, boundry, layers = 1){
    const xBoundry = boundry + 1; //7+2
    const yBoundry = boundry*dir;
    const xNormalized = Math.floor(this.sprite.x/32);
    const yNormalized = Math.floor(this.sprite.y/32);
    var bodyWAdd;
    var bodyWRemove;

    for(var i=-xBoundry; i<xBoundry+1; i++){
      const yAdd = yNormalized + yBoundry;
      const yRemove = yNormalized - yBoundry - 2*dir;
      bodyWAdd = this.scene.tileBodyMatrix[xNormalized + i][yAdd];
      bodyWRemove = this.scene.tileBodyMatrix[xNormalized + i][yRemove];
      if(bodyWAdd != null && !bodyWAdd.active){
        //Phaser.Physics.Matter.Matter.Composite.addBody(this.scene.matter.world.localWorld, bodyWAdd.body);
        this.scene.matter.world.localWorld.bodies.push(bodyWAdd.body);
        bodyWAdd.active = true;
      }
      if(bodyWRemove != null && bodyWRemove.active){
        //Phaser.Physics.Matter.Matter.Composite.removeBody(this.scene.matter.world.localWorld, bodyWRemove.body);
        this.scene.matter.world.localWorld.bodies.splice(this.scene.matter.world.localWorld.bodies.indexOf(bodyWRemove.body), 1);
        bodyWRemove.active = false;
      }
      bodyWRemove = this.scene.tileBodyMatrix[xNormalized - xBoundry - 1][yRemove];
      if(bodyWRemove != null && bodyWRemove.active){
        //Phaser.Physics.Matter.Matter.Composite.removeBody(this.scene.matter.world.localWorld, bodyWRemove.body);
        this.scene.matter.world.localWorld.bodies.splice(this.scene.matter.world.localWorld.bodies.indexOf(bodyWRemove.body), 1);
        bodyWRemove.active = false;
      }
      bodyWRemove = this.scene.tileBodyMatrix[xNormalized + xBoundry + 1][yRemove];
      if(bodyWRemove != null && bodyWRemove.active){
        //Phaser.Physics.Matter.Matter.Composite.removeBody(this.scene.matter.world.localWorld, bodyWRemove.body);
        this.scene.matter.world.localWorld.bodies.splice(this.scene.matter.world.localWorld.bodies.indexOf(bodyWRemove.body), 1);
        bodyWRemove.active = false;
      }
    }
    bodyWAdd = undefined;
    bodyWRemove = undefined;
  }

}
