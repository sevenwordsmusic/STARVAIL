import PlayerFireArmPC from "./PlayerFireArmPC.js";
import PlayerFireArmMobile from "./PlayerFireArmMobile.js";
import Bar from "./Bar.js";
import TileController from "../TileController.js"
import Audio from "../Audio.js";

export default class Player {
  constructor(scene, x, y, tutorial = false) {
    //inicializacion
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x, y, 'playerIdle', 0);
    this.scene.game.player = this;
    this.tutorial = tutorial;

    scene.matter.world.on("beforeupdate", this.resetTouching, this);
    this.scene.events.on("update", this.update, this);  //para que el update funcione

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
    this.sprite.body.collisionFilter.group = -2;
    this.sprite.body.collisionFilter.category = 2;
    this.sprite.body.collisionFilter.mask = 1;

    this.isTouching = { left: false, right: false, ground: false };

    //BRAZO
    this.movingArm = this.scene.add.sprite(x, y, 'arm_playerIdle', 0);
    this.movingArm.setOrigin(0.5, 0.75);
    this.movingArm.setScale(this.sprite.scale);
    //BRAZO

    //FUEGO DE VUELO
    this.flyFire = this.scene.add.sprite(x, y, 'fire_fly', 0);
    this.flyFire.setScale(this.sprite.scale).setOrigin(0.5, 0.72);
    this.flyFire.setVisible(false);

    //FUEGO DE VUELO

    //código para boundry box de cuerpos de matter (no se toca)
    this.earlyPos = new Phaser.Math.Vector2(this.sprite.body.position.x, this.sprite.body.position.y);
    this.advance32X = 0;
    this.advance32Y = 0;
    this.updateBoundryCounterX = 0;
    this.updateBoundryCounterY = 0;

    //vida, energía
    this.alive = true;
    this.hp = this.scene.game.currentPlayerHp;
    this.energy = this.scene.game.totalPlayerEnergy;

    //miniinvulnerabilidad al ser dañado
    this.invulTimer = this.scene.time.addEvent({
      delay: 220
    });

    this.adjustedFriction = 1.2/this.scene.matter.world.getDelta();
    this.knockVector = new Phaser.Math.Vector2(0,0);
    this.knockVecNomralized = new Phaser.Math.Vector2(0,0);

    //jet
    this.activatedJet = false;
    this.isTakingOf = false;
    this.jetAumulator = 1;

    //jet mid air
    this.canJetAgain = true;

    //disparo y brazo de disparo
    this.fireCounterTap = 0;
    this.fireCounterHold = 0;
    this.weapons = [];
    this.initializeWeaponsArray();
    //this.weapons[2] = {name: "Ejemplo", fireRate: 10 * this.scene.matter.world.getDelta(), projectileSpeed: 10, expireTime: 1000, energyCost: 10 , chFrame: 1};
    this.weaponCounter = 0;

    this.weaponIcons = [5];
    this.buttons = [5];
    this.buttons[0] = this.scene.add.sprite(885, 465, ('weaponHUD0'),0).setInteractive();
    this.buttons[0].setScrollFactor(0).setDepth(100).setVisible(false);
    this.buttons[0].playerInteractable = true;
    this.buttons[1] = this.scene.add.sprite(781, 465, ('weaponHUD1'),0).setInteractive();
    this.buttons[1].setScrollFactor(0).setDepth(100).setVisible(false);
    this.buttons[1].playerInteractable = true;
    this.buttons[2] = this.scene.add.sprite(885, 358, ('weaponHUD2'),0).setInteractive();
    this.buttons[2].setScrollFactor(0).setDepth(100).setVisible(false);
    this.buttons[2].playerInteractable = true;
    this.buttons[3] = this.scene.add.sprite(726, 465, ('weaponHUD3'),0).setInteractive();
    this.buttons[3].setScrollFactor(0).setDepth(100).setVisible(false);
    this.buttons[3].playerInteractable = true;
    this.buttons[4] = this.scene.add.sprite(885, 301, ('weaponHUD4'),0).setInteractive();
    this.buttons[4].setScrollFactor(0).setDepth(100).setVisible(false);
    this.buttons[4].playerInteractable = true;
    this.nextButton = 0;

    if(this.scene.game.onPC){
      console.log(this.cursors);
      this.cursors = this.scene.input.keyboard.addKeys({
      'up': Phaser.Input.Keyboard.KeyCodes.W,
      'left': Phaser.Input.Keyboard.KeyCodes.A,
      'right': Phaser.Input.Keyboard.KeyCodes.D,
      'down': Phaser.Input.Keyboard.KeyCodes.S});

      this.fireArm = new PlayerFireArmPC(this.scene, x, y);
      this.firingPointer = this.scene.input.activePointer;
      this.movingPointer = undefined;

      if(this.scene.game.playerName.localeCompare("proplayer", undefined, { sensitivity: 'base' }) === 0){
        console.log("Cheat Mode Enabled");

        this.weaponChange = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.weaponChange.on('down', function(event){
          this.changeWeapon();
        }, this);
        this.testMemory = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        this.testMemory.on('down', function(event){
          //console.log("Used Memory: " + (Math.round((performance.memory.usedJSHeapSize/1024/1024))) + " Mb");
          this.scene.startDebugLoop(true,false);
        }, this);
        this.skipLevel = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
        this.skipLevel.on('down', function(event){
          this.scene.game.nextLevel();
        }, this);
      }

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

      //barras vida, energía
      this.hpBar = new Bar(this.scene, 23,454, 312, 12, 0x00ff00, this.scene.game.totalPlayerHp);
      const hpBarHUD = this.scene.add.image(180, 458, 'hpBarHUD').setScrollFactor(0).setDepth(100);
      const hpBarFillHUD = this.scene.add.image(180, 458, 'hpBarFillHUD').setScrollFactor(0).setDepth(90);//12 312
      this.energyBar = new Bar(this.scene, 23, 496, 312, 12, 0x0000ff, this.scene.game.totalPlayerEnergy);
      const energyBarHUD = this.scene.add.image(180, 507, 'energyBarHUD').setScrollFactor(0).setDepth(100);
      const energyBarFillHUD = this.scene.add.image(180, 507, 'energyBarFillHUD').setScrollFactor(0).setDepth(90);
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

      //barras vida, energía
      this.energy = this.scene.game.totalPlayerEnergy;
      this.hpBar = new Bar(this.scene, 23, 34, 312, 12, 0x00ff00, this.scene.game.totalPlayerHp);
      const hpBarHUD = this.scene.add.image(180, 38, 'hpBarHUD').setScrollFactor(0).setDepth(100);
      const hpBarFillHUD = this.scene.add.image(180, 38, 'hpBarFillHUD').setScrollFactor(0).setDepth(90);//12 312
      this.energyBar = new Bar(this.scene, 23, 76, 312, 12, 0x0000ff, this.scene.game.totalPlayerEnergy);
      const energyBarHUD = this.scene.add.image(180, 87, 'energyBarHUD').setScrollFactor(0).setDepth(100);
      const energyBarFillHUD = this.scene.add.image(180, 87, 'energyBarFillHUD').setScrollFactor(0).setDepth(90);
    }

    this.collideFunc1 = scene.matterCollision.addOnCollideStart({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });
    this.collideFunc2 = scene.matterCollision.addOnCollideActive({
      objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
      callback: this.onSensorCollide,
      context: this
    });
    this.collideFunc3 = scene.matterCollision.addOnCollideStart({
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
      //alpha: {from: 1, to: 0.2},
      tint: {from: 0xffffff, to: 0xff0000},
      duration: 220,
      repeat: 0,
      yoyo: true
    })

    this.recieveWeapon(0, false);
    for(var i=0; i<this.scene.game.obtainedWeapons.length; i++){
      this.recieveWeapon(this.scene.game.obtainedWeapons[i], false);
    }
    this.darkener(0);

    this.hpBar.draw(this.hp);
    this.energyBar.draw(this.energy);

    console.log(this);
  }
  soundFall(bodyB){
    /*if (bodyB.isSensor) return;
*/
  }
  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor || this.sprite == undefined || this.sprite.body == undefined) return;
    if (bodyA === this.sensors.bottom) {
      this.isTouching.ground = true;
      this.canJetAgain = true;
      if(this.activatedJet && this.cursors.down.isDown){
          this.flyFire.setVisible(false);
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
    if (!gameObjectB || !(gameObjectB instanceof Phaser.Tilemaps.Tile) || this.sprite == undefined || this.sprite.body == undefined) return;
    const tile = gameObjectB;
    if (tile.properties.Lethal) {
      this.playerDamageKnockback(50, 0.8, new Phaser.Math.Vector2(-this.sprite.body.velocity.x, -this.sprite.body.velocity.y));
    }
  }

  resetTouching() {
    if(this.sprite == undefined || this.sprite.body == undefined) return;
    this.scene.graphics.clear();
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
    //console.log(this.scene.matter.world.engine.pairs.list.length);
    //console.log(this.scene.matter.world.engine.pairs.table);
    if (this.sprite == undefined || this.sprite.body == undefined) { return; }

    this.updateKnockback(time, delta);
    TileController.playerTouchBoundry(this.scene, this.sprite);
    if (!this.alive) { return; }

    //this.updateBoundry();
    if(!this.tutorial){
      if(this.sprite.body.position.x - this.earlyPos.x > 0.005)
        TileController.xFrontiers(this.scene, 1, 29, Math.floor(this.sprite.x/32), Math.floor(this.sprite.y/32));
      else if(this.sprite.body.position.x - this.earlyPos.x < -0.005)
        TileController.xFrontiers(this.scene, -1, 29, Math.floor(this.sprite.x/32), Math.floor(this.sprite.y/32))
      if(this.sprite.body.position.y - this.earlyPos.y > 0.005)
        TileController.yFrontiers(this.scene, 1, 29, Math.floor(this.sprite.x/32), Math.floor(this.sprite.y/32))
      else if(this.sprite.body.position.y - this.earlyPos.y < -0.005)
        TileController.yFrontiers(this.scene, -1, 29, Math.floor(this.sprite.x/32), Math.floor(this.sprite.y/32))
    }

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
        if(!this.activatedJet && this.energy >= this.scene.game.energyCostJetPropulsion && this.canJetAgain){
          this.isTakingOf = true;
          this.sprite.anims.play('propulsion', true);
          this.movingArm.anims.play('arm_airUp', true);
          this.fireArm.adjustOffset(-5, -22);

          this.sprite.once('animationcomplete', function(){
            this.flyFire.x = this.sprite.x;
            this.flyFire.y = this.sprite.y;
            this.flyFire.setVisible(true);
            this.flyFire.anims.play('fire_moveup', true);

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
        /*if(this.sprite.body.velocity.y >= this.braceVelocity){
          this.sprite.setVelocityY((this.sprite.body.velocity.y/this.scene.matter.world.getDelta() - this.braceVelocity) * Math.min(50,delta) * this.playerMoveForceY());
        }else {
           this.sprite.setVelocityY(-this.scene.game.jetVelocity * delta * this.playerMoveForceY());
        }*/
        this.sprite.setVelocityY(-this.scene.game.jetVelocity * delta * this.playerMoveForceY());
      }
      if(this.energy > 0){
        this.playerUseEnergy(this.scene.game.energyCostJetBeginning + this.jetAumulator - 1);
        this.jetAumulator = this.jetAumulator * (1+((this.scene.game.energyJetIncrease-1) * delta/this.scene.matter.world.getDelta()));  //posiblemente cambiar coste con descenso para ofrecer al jugador posibilidades si se equivoca y activa sin querer el jet
      }else{
        this.playerUseEnergy(this.energy);
        this.offJet();
        this.jetAumulator = 1;
        this.canJetAgain = false;
      }
      this.flyFire.x = this.sprite.x;
      this.flyFire.y = this.sprite.y;
    }else{
      if(this.energy < this.scene.game.totalPlayerEnergy){
        if(this.fireCounterTap >= this.weapons[this.weaponCounter].fireRate + 60)
          this.playerGainEnergy(this.scene.game.energyRecoveryRate + ((this.activatedJet)?0:this.scene.game.extraRecoveryOnGround));
        else
          this.playerGainEnergy((this.scene.game.energyRecoveryRate)*this.weapons[this.weaponCounter].energyRecoverProportion);
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
          this.flyFire.anims.play('fire_movedown', true);
        }else if(this.cursors.right.isDown || this.cursors.left.isDown){
          this.sprite.anims.play('airMove', true);
          this.movingArm.anims.play('arm_airMove', true);
          this.fireArm.adjustOffset(1, -19);
          this.flyFire.anims.play('fire_fly', true);
        }else if(this.cursors.up.isDown){
          this.sprite.anims.play('airUp', true);
          this.movingArm.anims.play('arm_airUp', true);
          this.fireArm.adjustOffset(-5, -25);
          this.flyFire.anims.play('fire_moveup', true);
        }else{
          this.sprite.anims.play('airIdle', true);
          this.movingArm.anims.play('arm_airIdle', true);
          this.fireArm.adjustOffset(-5, -25);
          this.flyFire.anims.play('fire_idle', true);
        }
      }
    }else{
      if(this.sprite.body.velocity.y < 2){
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
      }else{
        this.sprite.anims.setTimeScale(1);
        this.movingArm.anims.setTimeScale(1);
        this.sprite.anims.play('airDown', true);
        this.movingArm.anims.play('arm_airDown', true);
        this.fireArm.adjustOffset(-7, -19);
      }
    }

    if(isFiring){
      this.scene.game.isFiring=true;
      this.sprite.setFlipX(this.fireArm.armDir.x < 0);
      this.movingArm.setFlipX(this.fireArm.armDir.x < 0);
      this.flyFire.setFlipX(this.fireArm.armDir.x < 0);
      this.fireArm.flipOffset((this.fireArm.armDir.x < 0)?-1:1);
    }else{
        this.scene.game.isFiring=false;
      if(this.cursors.right.isDown){
        this.sprite.setFlipX(false);
        this.movingArm.setFlipX(false);
        this.flyFire.setFlipX(false);
      }else if(this.cursors.left.isDown){
        this.sprite.setFlipX(true);
        this.movingArm.setFlipX(true);
        this.flyFire.setFlipX(true);
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
    const delayT = 220;
    if (this.invulTimer.elapsed == delayT || ignoreInvul) {
      //AUDIO
        Audio.play2DinstanceRnd(72);
      //
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
      }else{
      //AUDIO
        Audio.chat(1,this.scene,this.scene.game.playerName);
      //
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
    if(this.alive){
      //AUDIO
        Audio.play2Dinstance(73);
      //
      this.offJet();
      this.sprite.anims.play('death', true);

      if(this.scene.boss != undefined)
        this.scene.boss.goTo(5);

      this.destroy(false);

      console.log("Te has Muerto...");

      this.scene.game.initializeVariables(false);
      this.scene.game.changeScene(this.scene, "SceneGameOver");
    }
  }

  playerVictory(){
    this.destroy(false);

    this.scene.game.initializeVariables(false);
    this.scene.game.changeScene(this.scene, "SceneScore");
  }

  destroy(fullDestroy = true){
    this.alive = false;
    this.scene.matter.world.off("beforeupdate", this.resetTouching);
    this.scene.events.off("update", this.update);
    this.scene.input.off('pointerdown');
    this.scene.input.off('pointerup');
    if(this.weaponChange != undefined) {this.weaponChange.destroy(); this.weaponChange = undefined;}
    if(this.skipLevel != undefined) {this.skipLevel.destroy(); this.skipLevel = undefined;}
    if(this.testMemory != undefined) {this.testMemory.destroy(); this.testMemory = undefined;}
    if(this.joyStick != undefined) {this.joyStick.destroy(); this.joyStick = undefined;}
    if(this.cursors != undefined) {this.cursors.destroy(); this.cursors = undefined;}
    if(this.fireArm != undefined) {this.fireArm.destroyFireArm(); this.fireArm = undefined;}
    if(this.movingArm != undefined) {this.movingArm.destroy(); this.movingArm = undefined;}

    if(fullDestroy){
      this.scene.cameras.main.stopFollow();
      if(this.collideFunc1 != undefined)
        this.collideFunc1();
      if(this.collideFunc2 != undefined)
        this.collideFunc2();
      if(this.collideFunc3 != undefined)
        this.collideFunc3();
      if(this.sprite != undefined)
        this.sprite.destroy();
      this.mainBody = undefined;
      this.sensors = undefined
    }
  }

  playerGainHealth(num){
    console.log(num);
    this.hp += num;
    this.hpBar.draw(this.hp);
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
      this.flyFire.setVisible(false);
      this.activatedJet = false;
    }
  }

  initializeWeaponsArray(){
    //creacion de armas con nombre, "rate" de ataque (cuanto más grande más lento), velocidad de proyectil, tiempo de vida de proyectil, coste de energia por disparo,
    //cuanta proporción de "recovery de energía" hay al disparar (por ej: si es 0.5 recuperamos la mitad de energía que de normal cada update), el sprite del proyectil, el frame del crosshair.png que se usa
    this.weapons[0] = {name: "BulletNormal", damage: 6, spread: 0.05, fireRate: 6 * this.scene.matter.world.getDelta(), projectileSpeed: 30, expireTime: 800, energyCost: 0, energyRecoverProportion: 1.33, wSprite: 6, chFrame: 0};
    this.weapons[1] = {name: "BulletSuperSonic", damage: 4, spread: 0.05, fireRate: 3 * this.scene.matter.world.getDelta(), projectileSpeed: 40, expireTime: 800, energyCost: 1, energyRecoverProportion: 0, wSprite: 0, chFrame: 0};
    this.weapons[2] = {name: "BulletExplosive", damage: 14, knockback: 2 / this.scene.matter.world.getDelta(),  spread: 0.1, fireRate: 8 * this.scene.matter.world.getDelta(), projectileSpeed: 25, expireTime: 800, energyCost: 2, energyRecoverProportion: 0, wSprite: 3, chFrame: 0};
    this.weapons[3] = {name: "BulletBounce", damage: 10, bounce: 3, spread: 0.075, fireRate: 8 * this.scene.matter.world.getDelta(), projectileSpeed: 25, expireTime: 800, energyCost: 1, energyRecoverProportion: 0, wSprite: 1, chFrame: 0};
    this.weapons[4] = {name: "BombNormal", damage: 25, area: 45, knockback:  2 / this.scene.matter.world.getDelta(), fireRate: 25 * this.scene.matter.world.getDelta(), projectileSpeed: 10, expireTime: 2000, energyCost: 20, energyRecoverProportion: 0.8, wSprite: 7, chFrame: 1};
    this.weapons[5] = {name: "BombMegaton", damage: 150, area: 80, knockback: 3.5 / this.scene.matter.world.getDelta(), extraEffect: 1.5, fireRate: 30 * this.scene.matter.world.getDelta(), projectileSpeed: 8, expireTime: 2000, energyCost: 100, energyRecoverProportion: 0.2, wSprite: 4, chFrame: 1};
    this.weapons[6] = {name: "Misil", damage: 40, area: 30, knockback: 1 / this.scene.matter.world.getDelta(), autoAim: 0.08 / this.scene.matter.world.getDelta(), fireRate: 20 * this.scene.matter.world.getDelta(), projectileSpeed: 15, expireTime: 4000, energyCost: 60, energyRecoverProportion: 0.2, wSprite: 2, chFrame: 2};
    this.weapons[7] = {name: "MissileMulti", damage: 5, area: 25, knockback: 1 / this.scene.matter.world.getDelta(), offsprings: 7, offspringScale: 0.9, fireRate: 30 * this.scene.matter.world.getDelta(), projectileSpeed: 12, expireTime: 4000, energyCost: 60, energyRecoverProportion: 0.2, wSprite: 5, chFrame: 2};
    this.weapons[8] = {name: "Lasser", damage: 1.5, spread: 0, fireRate: 0, projectileSpeed: 0, expireTime: 0, energyCost: 1.4, energyRecoverProportion: 0, wSprite: 8, chFrame: 3};
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

  recieveWeapon(id, playSound = true){
    if(playSound){
      //AUDIO
        Audio.play2DinstanceRate(90, 0.8 + id * 0.05);
      //
    }
    const aux = this.nextButton;
    this.buttons[aux].setVisible(true)
    this.buttons[aux].on('pointerdown', function () {
      this.setWeapon(id);
      this.darkener(aux);
    }, this);
    if(aux == 0){
     this.weaponIcons[aux] = this.scene.add.sprite(this.buttons[aux].x, this.buttons[aux].y, "bullets" ,this.weapons[id].wSprite).setScrollFactor(0).setDepth(101).setScale(4);
    }
    else if(aux == 1){
      this.weaponIcons[aux] = this.scene.add.sprite(this.buttons[aux].x + 10, this.buttons[aux].y, "bullets" ,this.weapons[id].wSprite).setScrollFactor(0).setDepth(101).setScale(3);
    }
    else if(aux == 2){
      this.weaponIcons[aux] = this.scene.add.sprite(this.buttons[aux].x, this.buttons[aux].y + 10, "bullets" ,this.weapons[id].wSprite).setScrollFactor(0).setDepth(101).setScale(3);
    }
    else if(aux == 3){
      this.weaponIcons[aux] = this.scene.add.sprite(this.buttons[aux].x - 10, this.buttons[aux].y, "bullets" ,this.weapons[id].wSprite).setScrollFactor(0).setDepth(101).setScale(3);
      this.scene.add.image(this.buttons[aux].x + 10, this.buttons[aux].y + 61, "decoHUD1" ).setScrollFactor(0).setDepth(101);
    }
    else if(aux == 4){
      this.weaponIcons[aux] = this.scene.add.sprite(this.buttons[aux].x, this.buttons[aux].y - 5, "bullets" ,this.weapons[id].wSprite).setScrollFactor(0).setDepth(101).setScale(3);
      this.scene.add.image(this.buttons[aux].x-116, this.buttons[aux].y+50, "decoHUD2" ).setScrollFactor(0).setDepth(101);
    }
    this.nextButton++;
  }

  darkener(n) {
    for (var i = 0; i<this.buttons.length; i++) {
      if (i == n) {
        this.buttons[i].tint = 0x545454;
        if(this.weaponIcons[i] != undefined)
        this.weaponIcons[i].tint = 0x545454;
      } else {
        this.buttons[i].tint = 0xFFFFFF;
        if(this.weaponIcons[i] != undefined)
        this.weaponIcons[i].tint = 0xFFFFFF;
      }
    }
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

  inRoom(){
    if(this.scene.encounterNPC == undefined || this.scene.encounterNPC.sprite == undefined || this.scene.encounterNPC.sprite.body == undefined || this.sprite == undefined || this.sprite.body == undefined) return false;
    if(Math.sqrt(Math.pow(this.scene.encounterNPC.sprite.x - this.sprite.x,2) + Math.pow(this.scene.encounterNPC.sprite.x - this.sprite.x,2)) < 500) //ajustate la distancia si quieres
      return true;
    else
      return false;
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

}
