'use strict'

var Turret = function (params) {
    if(typeof params == 'undefined')
        params = {};
    this.params = params;

    this.level = 1;
    this.health = 2;
    this.alive = true;

    this.game = game;
    this.target = ship;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;

    Phaser.Sprite.call(this, game, params.x || this.game.world.randomX, params.y || this.game.world.randomY, 'weapon_lvl' + this.level);
    this.scale.setTo(4,4)
    this.anchor.setTo(0.3, 0.5);
    this.smoothed = false;

    this.game.add.existing(this);
};

Turret.prototype = Object.create(Phaser.Sprite.prototype);
Turret.prototype.constructor = Turret;

Turret.prototype.update = function() {
    this.rotation = this.game.physics.arcade.angleBetween(this, this.target);

    if (this.target.alive && this.game.physics.arcade.distanceBetween(this, this.target) < 300)
    {
        if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = this.game.time.now + this.fireRate;

            var bullet = this.bullets.getFirstDead();

            bullet.reset(this.x, this.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.target, 500);
        }
    }
};