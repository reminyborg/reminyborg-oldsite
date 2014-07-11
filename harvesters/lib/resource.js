'use strict'

function Asteroid(params) {
    if (typeof params == 'undefined')
        params = {};
    this.params = params;

    Phaser.Sprite.call(this, game, params.x || game.world.randomX, params.y || game.world.randomY, 'asteroid2');
    this.anchor.setTo(0.5, 0.5);

    this.health = 2;
    this.alive = true;

    this.resourceLevel = 2;
    this.resources = game.rnd.integerInRange(500,2000);
    this.harvesting = false;

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.rotationSpeed = game.rnd.integerInRange(-1000,1000) / 5000;
    this.body.rotation = game.rnd.angle();

    game.add.existing(this);
};

Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.update = function() {
    this.body.rotation += this.rotationSpeed;
}

Asteroid.prototype.harvest = function(amount) {
    this.resources -= amount;
    if(this.resources < 0)
    {
        amount += this.resources;
        this.resources = 0;
    }
    this.checkSprite();
    return amount;
}

Asteroid.prototype.checkSprite = function() {
    var newResourceLevel = Math.floor(this.resources / 1000 * 3);

    if(newResourceLevel > 2)
        newResourceLevel = 2;
    if(newResourceLevel != this.resourceLevel) {
        this.resourceLevel = newResourceLevel;
        this.loadTexture('asteroid' + this.resourceLevel);
    }
}
