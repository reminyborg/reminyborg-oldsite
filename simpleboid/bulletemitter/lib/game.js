'use stict'

// Initialize Phaser
var game = new Phaser.Game(500, 600, Phaser.AUTO, 'game_div', { preload: preload, create: create, update: update, render: render });

function preload() {
	//TODO: Scale up sprites
	game.load.image('ship', 'img/ship.png');
	//game.load.image('weapon_lvl1', 'img/weapon_lvl1.png');
	game.load.image('bullet', 'img/bullet.png');
}

var ships;
var bullets;

function create() {
	//Start physics system
	game.time.advancedTiming = true;

    shipsTotal = 300;
    ships = []

    for (var i = 0; i < shipsTotal; i++) {
        ships.push(new Ship({ rotateSpeed: i/10 }));
    }

    bullets = game.add.emitter(game.world.centerX, game.world.centerY, 50);

    bullets.makeParticles('bullet');

    bullets.minParticleSpeed.setTo(-100, -100);
    bullets.maxParticleSpeed.setTo(100, 100);
    bullets.gravity = 0;
    bullets.start(false, 4000,50);
}
 
function update() {
}

function render() {
	game.debug.text(game.time.fps,6,16);
	//game.debug.quadTree(game.physics.arcade.quadTree);
}

function collisionHandler (ship, bullet) {
	ship.damage(1);
	bullet.kill();
}
