'use strict'

var Ship = function (params) {
    if (typeof params == 'undefined')
        params = {};
    this.params = params;

    Phaser.Sprite.call(this, game, params.x || game.world.randomX, params.y || game.world.randomY, 'ship');
    this.scale.setTo(4, 4)
    this.anchor.setTo(0.5, 0.5);
    this.smoothed = false;

    this.health = 10;
    this.alive = true;

    this.target = false;

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.steer = new Steer(this.position,this.body.velocity);

    game.add.existing(this);
};

Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.update = function () {
    if(this.steer.tick()) {
        if(this.target)
        {
            this.steering = this.steer.seek(this.target,300);
            this.body.acceleration = this.steering;
        }
    }

    this.rotation = this.body.angle;
};

