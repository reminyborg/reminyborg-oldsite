'use stict'

// Initialize Phaser
var game = new Phaser.Game(500, 600, Phaser.AUTO, 'game_div', { preload: preload, create: create, update: update, render: render });

function preload() {
	//TODO: Scale up sprites
	game.load.image('ship', 'img/ship.png');
	game.load.image('weapon_lvl1', 'img/weapon_lvl1.png');
	game.load.image('bullet', 'img/bullet.png');
}

var bullets;
var ship;
var turret;

function create() {
	//Start physics system
	game.time.advancedTiming = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(100, 'bullet', 0, false);
    bullets.setAll('scale.x', 2);
    bullets.setAll('scale.y', 2);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);

    ship = new Ship();
    turret = new Turret({x: game.world.centerX, y: game.world.centerY });

    game.camera.follow(ship);

    game.input.onDown.add(setTarget, this);
}
 
function update() {
    game.physics.arcade.overlap(bullets, ship, bulletHit, null, this);
}

function render() {
	game.debug.text(game.time.fps,6,16);
    game.debug.bodyInfo(ship,32,32);
}

function bulletHit(ship,bullet) {
    ship.damage(1);
    bullet.kill();
}

function setTarget() {
    ship.target = game.input.activePointer.position.clone();
}
