'use stict'

// Initialize Phaser
var game = new Phaser.Game(500, 600, Phaser.AUTO, 'game_div', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('mothership', 'img/mothership.png');
    game.load.image('harvester2', 'img/harvester2.png');
    game.load.image('harvester1', 'img/harvester1.png');
	game.load.image('harvester0', 'img/harvester0.png');
	game.load.image('asteroid2', 'img/asteroid2.png');
    game.load.image('asteroid1', 'img/asteroid1.png');
    game.load.image('asteroid0', 'img/asteroid0.png');
    game.load.image('bullet', 'img/bullet.png');
}

var ships = [];
var asteroids = [];
var motherships = [];

var resources = 0;

function create() {
	//Start physics system
	game.time.advancedTiming = true;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    for(var i=0; i<30; i++){
        asteroids.push(new Asteroid());
    }

    var index = motherships.push(new MotherShip({x : game.world.centerX, y: game.world.centerY}))

    for(var i=0; i<7; i++){
        ships.push(new Harvester({ index: i, base: motherships[index - 1]}));
    }

    game.input.onDown.add(setTarget, this);
}
 
function update() {
}

function render() {
	game.debug.text(game.time.fps,6,18);
    game.debug.text('Resources: ' + resources,300,18);
}

function setTarget() {
    ships.forEach(function(ship) {
        motherships[0].target = game.input.activePointer.position.clone();
        motherships[0].brain.pushState(motherships[0].goToTarget);
    });
}