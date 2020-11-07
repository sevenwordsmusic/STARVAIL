import Audio from "../Audio.js";
import FiniteStateMachine from "../FiniteStateMachine.js"
import Dialog from "../Plugins/Dialog.js"

//Clase padre de todos los enemigos
export default class Mentor extends FiniteStateMachine{
  constructor(scene, x, y){
    super();
    //inicializacion
    this.scene = scene;
    this.sprite = scene.matter.add.sprite(x,y,'playerIdle',0).setScale(2);

    const { Body, Bodies } = Phaser.Physics.Matter.Matter; // Native Matter modules
    const { width: w, height: h } = this.sprite;
    this.mainBody = Bodies.rectangle(0, 6, w * 0.45, h * 0.85, { chamfer: { radius: 5 } });
    this.sensor = Bodies.rectangle(0, 36, w * 0.3, 8, { isSensor: true });

    const compoundBody = Body.create({
      parts: [this.mainBody, this.sensor],
      frictionAir: 0.06,
      friction: 1,
      frictionStatic: 1
    });
    this.sprite.setScale(1.5);
    this.sprite
      .setExistingBody(compoundBody)
      .setFixedRotation()
      .setPosition(x, y)
      .setOrigin(0.5, 0.72)     //0.5, 0.55

    this.touchingGround = false;
    this.sprite.setIgnoreGravity(false);
    this.sprite.body.collisionFilter.group = -1;

    scene.matterCollision.addOnCollideStart({
      objectA: this.sensor,
      callback: this.onSensorCollideStart,
      context: this
    });
    scene.matterCollision.addOnCollideActive({
      objectA: this.sensor,
      callback: this.onSensorCollide,
      context: this
    });

    this.moveTimer = undefined;
    this.speed = 0.3;
    this.objectiveX = this.sprite.x;
    this.objectiveY = this.sprite.y;
    this.speedVector = new Phaser.Math.Vector2(0,0);
    this.reachedX = true;
    this.reachedY = true;

    this.tutorialPositions = [];
    this.tutorialPositions[0] = new Phaser.Math.Vector2(1128,2560);
    this.tutorialPositions[1] = new Phaser.Math.Vector2(1628,2260);

    scene.matter.world.on("beforeupdate", this.resetTouching, this);

    this.isFiring = false;

    this.isTalking = false;
    this.dialogArray = [];
    this.dialogArray[0] = `prueba1`;
    this.dialogArray[1] = `prueba2`;
    this.dialogArray[2] = `prueba3`;
    this.currentDialog = -1;

    //IA
    //this.initializeAI(4);
    this.initializeAI(4);
    this.stateOnStart(0, function(){
      this.currentDialog++;
    });
    this.stateUpdate(0, function(){
      if(Math.sqrt(Math.pow(this.sprite.x - this.scene.game.player.sprite.x,2) + Math.pow(this.sprite.y - this.scene.game.player.sprite.y,2)) < 300 && this.touchingGround){
        this.goTo(1);
      }
    });
    this.stateOnEnd(0, function(){
      this.sprite.setFlipX(this.scene.game.player.sprite.x < this.sprite.x);
      this.isTalking = true;
      this.scene.dialogManager.setCurrentSpeaker(this);
      this.scene.dialogManager.textBox.start(this.dialogArray[this.currentDialog],10);
      this.scene.dialogManager.showDialogBox();
    })
    this.stateOnStart(2, function(){
      this.moveTo(this.tutorialPositions[this.currentDialog]);
    })
    this.stateUpdate(2, function(time, delta){
      if(this.touchingGround){
        if(Math.abs(this.sprite.x - this.objectiveX) <= 5){
          this.reachedX = true;
          this.sprite.setVelocityX(0);
        }
        if(Math.abs(this.sprite.y - this.objectiveY) <= 5){
          this.reachedY = true;
        }
      }else{
        if(Math.abs(this.sprite.x - this.objectiveX) <= 5){
          this.reachedX = true;
        }
        if(Math.abs(this.sprite.y - this.objectiveY) <= 5){
          this.reachedY = true;
        }
      }
      if(!this.reachedX)
        this.sprite.setVelocityX(this.speedVector.x * delta);

      if(!this.reachedY)
        this.sprite.setVelocityY(this.speedVector.y * delta);

      if(this.sprite.body.velocity.x * this.sprite.body.velocity.y == 0)
        this.goTo(0);
    })
    this.startAI();

    this.scene.events.on("update", this.update, this);  //para que el update funcione


  }
  finishedDialog(){
    this.isTalking = false;
    this.goTo(2);
  }

  resetTouching() {
    this.touchingGround = false;
  }

  onSensorCollideStart({ bodyA, bodyB, pair }){
    if (bodyB.isSensor) return;
    this.touchingGround = true;
    if(this.objectiveY - this.sprite.y >= 5){
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityY(0);
      this.reachedY = true;
      this.reachedX = true;
    }
  }

  onSensorCollide({ bodyA, bodyB, pair }){
    if (bodyB.isSensor) return;
    this.touchingGround = true;
  }

  update(time, delta){
    this.updateAI(time, delta);
    this.playAnimation();
  }

  playAnimation(){
    if(!this.touchingGround){
      if(this.sprite.body.velocity.y > 0.1){
        this.sprite.anims.play('airDown', true);
      }else if(Math.abs(this.sprite.body.velocity.x) > 0.1){
        this.sprite.anims.play('airMove', true);
      }else if(this.sprite.body.velocity.y < -0.1){
        this.sprite.anims.play('airUp', true);
      }else{
        this.sprite.anims.play('airIdle', true);
      }
    }else{
      if(Math.abs(this.sprite.body.velocity.x) > 0.1){
        this.sprite.anims.play('wRight', true);
      }else{
        this.sprite.anims.play('idle', true);
      }
    }

    if(this.isFiring){
      this.sprite.setFlipX(this.scene.game.player.sprite.x < this.sprite.x);
    }else{
      if(this.sprite.body.velocity.x > 0.1){
        this.sprite.setFlipX(false);
      }else if(this.sprite.body.velocity.x < -0.1){
        this.sprite.setFlipX(true);
      }
    }
  }

  moveTo(pos){
    this.reachedX = false;
    this.reachedY = false;
    this.objectiveX = pos.x;
    this.objectiveY = pos.y;
    this.speedVector.x = pos.x - this.sprite.x;
    this.speedVector.y = pos.y - this.sprite.y;

    this.speedVector.normalize().scale(this.speed);
  }



}
