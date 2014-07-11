'use strict'

function MotherShip(params) {
    if (typeof params == 'undefined')
        params = {};
    this.params = params;

    Phaser.Sprite.call(this, game, params.x || game.world.randomX, params.y || game.world.randomY, 'mothership');
    this.anchor.setTo(0.5, 0.5);

    this.health = 10000;
    this.alive = true;

    this.target = false;


    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.rotation = game.rnd.angle();

    this.steer = new Steer(this.position,this.body.velocity,{ maxAcceleration: 20 });
    this.brain = new StackFSM(this);

    game.add.existing(this);
};

MotherShip.prototype = Object.create(Phaser.Sprite.prototype);
MotherShip.prototype.constructor = MotherShip;

MotherShip.prototype.update = function () {
    this.brain.update();
    this.rotation = this.body.angle;
};

MotherShip.prototype.goToTarget = function($this) {
    if(!$this.target) {
        $this.brain.popState();
    }
    else {
        if($this.game.physics.arcade.distanceBetween($this.target,$this) < 10) {
            $this.body.acceleration.setTo(0,0);
            $this.body.velocity.setTo(0,0)
            $this.brain.popState();
        }
        else {
            //Go to the target
            $this.steering = $this.steer.arrive($this.target,150);
            $this.body.acceleration = $this.steering;
        }
    }
}

