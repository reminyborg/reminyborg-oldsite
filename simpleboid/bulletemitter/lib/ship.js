
 'use strict'

 var Ship = function (params) {
    if(typeof params == 'undefined')
        params = {};
    this.params = params;

    Phaser.Sprite.call(this, game, params.x || game.world.randomX, params.y || game.world.randomY, 'ship');
    this.scale.setTo(4,4)
    this.anchor.setTo(0.5, 0.5);
    this.smoothed = false;

    this.health = 2;
    this.alive = true;

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.rotation = game.rnd.angle();

    game.add.existing(this);
};

Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;

Ship.prototype.update = function() {
    //this.body.rotation += this.params.rotateSpeed;
    game.physics.arcade.collide(this, bullets, collisionHandler, null, this);
};