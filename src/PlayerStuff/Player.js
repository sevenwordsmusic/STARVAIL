
import PlayerFireArm from "./PlayerFireArm.js";

export default class Player {
  constructor(scene, x, y, cursors) {
    //inicializacion
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x, y, 'androidIdle', 0);
    this.scene.game.player = this;

    this.mouse = this.scene.input.activePointer;
    this.fireCounter = 0;

    //variables para el movimiento
    this.leftMultiply = 1;
    this.rightMultiply = 1;
    this.velInfluence = 0;

    //generacion del cuerpo del personaje (cuerpo compuesto de 4 partes: una parte principal, 2 a cada lado y uno por debajo)
    //los 3 cuerpos que rodean al principal son sensores que detectan con que collisiona el personaje
    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this.sprite;
    this.mainBody = Bodies.rectangle(0, 6, w * 0.75, h * 0.8, { chamfer: { radius: 5 } });
    this.sensors = {
      bottom: Bodies.rectangle(0, 36, w * 0.6, 8, { isSensor: true }),
      left: Bodies.rectangle(-w * 0.45, 6, 5, h * 0.6, { isSensor: true }),
      right: Bodies.rectangle(w * 0.45, 6, 5, h * 0.6, { isSensor: true })
    };
    const compoundBody = Body.create({
      parts: [this.mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
      frictionAir: 0.01
    });
    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation()
      .setPosition(x, y)
      .setOrigin(0.5, 0.55)
      .body.collisionFilter.group = -1;

    this.cursors = cursors;

    this.scene.events.on("update", this.update, this);  //para que el update funcione

    this.isTouching = { left: false, right: false, ground: false };

    this.canJump = true;
    this.jumpCooldownTimer = null;

    this.aditionalJumpVelocity = -0.25;
    this.cursors.up.on('down', function (event) {
      if (this.canJump && this.isTouching.ground) {
        this.aditionalJumpVelocity = -0.25;
        this.sprite.setVelocityY(-this.scene.game.jumpVelocity);
        //var jumpSound = this.scene.sound.add('jump', {volume: this.scene.game.soundVolume});
        //jumpSound.play();
      }
    }, this);
    this.canJump = false;
    this.cursors.up.on('up', function (event) {
      this.canJump = true
    }, this);

    //DISPARO
    this.cursors.fire.on('down', function(event){
      this.fireArm.fireBomb();
    }, this);

    this.scene.input.on('pointerdown', function(pointer){
      this.fireArm.fireBullet();
      this.fireCounter = 0;
    }, this);

    this.scene.input.on('pointerup', function(pointer){
      this.fireCounter = 0;
    });
    //DISPARO

    scene.matter.world.on("beforeupdate", this.resetTouching, this);

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

    //var
    this.invulnerable = false;
    this.alive = true;

    scene.matterCollision.addOnCollideStart({
      objectA: this.sensors.bottom,
      callback: this.soundFall,
      context: this
    });

    //FIREARM
    this.fireArm = new PlayerFireArm(this.scene, x, y);
  }
  soundFall(bodyB){
    /*if (bodyB.isSensor) return;
    var landSound = this.scene.sound.add('land', {volume: this.scene.game.soundVolume});
    landSound.play();*/
  }
  onSensorCollide({ bodyA, bodyB, pair }) {
    if (bodyB.isSensor) return;
    if (bodyA === this.sensors.bottom && !this.cursors.jet.isDown) {
      this.isTouching.ground = true;
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
  }
  update(time, delta) {
    const isInAir = !this.isTouching.ground;

    if (this.scene.game.lives <= 0) { return; } //CAMBIAR ESPERA ACTIVA

    if (this.alive) {
      if (this.cursors.right.isDown) {
        if (!(isInAir && this.isTouching.right)) {
          this.sprite.setVelocityX(this.scene.game.moveVelocity * delta * this.rightMultiply);
        }
      }
      else if (this.cursors.left.isDown) {
        if (!(isInAir && this.isTouching.left)) {
          this.sprite.setVelocityX(-this.scene.game.moveVelocity * delta * this.leftMultiply);
        }
      } else if (this.cursors.right.isUp && this.cursors.left.isUp){
    	  this.sprite.setVelocityX(0);
      }
      //document.getElementById('info').innerHTML = this.sprite;
      this.sprite.x += this.velInfluence;
      this.playAnimation();

      if (this.cursors.up.isDown && !this.isTouching.ground && this.sprite.body.velocity.y < 0) {
        this.sprite.setVelocityY(this.sprite.body.velocity.y + this.aditionalJumpVelocity);
        if (this.aditionalJumpVelocity < 0) {
          this.aditionalJumpVelocity += 0.01;
        } else {
          this.aditionalJumpVelocity = 0;
        }
      }

      //CAMBIAR ESPERA ACTIVA
      if (this.sprite.y > 640) {
        this.damaged(new Phaser.Math.Vector2(0, -1), 40);
      }

      //BUGFIX
      if (isInAir && !this.cursors.left.isDown && !this.cursors.right.isDown) {
        if (this.sprite.body.velocity.y <= -this.scene.game.jumpVelocity * 0.90) {
          this.sprite.setVelocityX(0);
        } else {
          this.sprite.setVelocityX((this.scene.game.moveVelocity * this.scene.game.airVelocityFraction) * delta * Math.sign(this.sprite.body.velocity.x));
        }
      }
      this.leftMultiply = 1;
      this.rightMultiply = 1;


      //DISPARAR
      if(this.mouse.isDown){
        this.fireCounter++
        if (this.fireCounter >= 4){
            this.fireCounter = 0;
            this.fireArm.fireBullet();
        }
      }

      //jet
      if(this.cursors.jet.isDown){
        if(this.sprite.body.velocity.y > -3){
          this.sprite.setVelocityY(this.sprite.body.velocity.y - 0.6);
        }
      }
      //this.graphics.fillCircle(400, 400, 45);
      //graphics.strokeLineShape(chLine);
    }
  }
  playAnimation(){
    if(this.isTouching.ground){
      if(this.cursors.right.isDown){
        this.sprite.anims.play('wRight', true);
      }else if(this.cursors.left.isDown){
        this.sprite.anims.play('wRight', true);
      }else{
        this.sprite.anims.play('idle', true);
      }
    }else{
      if(this.sprite.body.velocity.y < 0){
        this.sprite.anims.play('jumpUp', true);
      }else if(this.sprite.body.velocity.y > 0){
        this.sprite.anims.play('jumpDown', true);
      }
    }


    if(this.cursors.right.isDown){
      this.sprite.setFlipX(false);
    }else if(this.cursors.left.isDown){
      this.sprite.setFlipX(true);
    }
  }

  damaged(deathVector, deathSpread) {
    if (!this.invulnerable) {
      //var dieSound = this.scene.sound.add('die', {volume: this.scene.game.soundVolume});  SONIDO MUERTE
      //dieSound.play();
      this.sprite.visible = false;
      this.sprite.setVelocityX(0);
      this.deathSpawn(deathVector, deathSpread);
      this.sprite.y = 900;

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

}
