'use strict'

function Harvester(params) {
    if (typeof params == 'undefined')
        params = {};
    this.params = params;

    Phaser.Sprite.call(this, game, params.x || game.world.randomX, params.y || game.world.randomY, 'harvester0');
    this.anchor.setTo(0.5, 0.5);

    this.health = 10;
    this.alive = true;
    this.harvesting = false;
    this.harvestSpeed = 5;
    this.harvestEmptySpeed = 20;

    this.maxHarvestStore = 1000;
    this.harvestStore = 0;
    this.harvestStoreLevel = 0;

    this.waitCount = 0;

    this.target = false;

    this.base = params.base;
    this.maxDistanceFromBase = 400;

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.steer = new Steer(this.position,this.body.velocity);
    this.brain = new StackFSM(this);

    //We want the harvester to find a resource and harvest it
    this.brain.pushState(this.goHarvest);

    //Setup the harvesting animation
    this.harvestingAnimation = game.add.emitter(this.position.x, this.position.y, 30);
    this.harvestingAnimation.gravity = 0;
    this.harvestingAnimation.minParticleSpeed.setTo(-10, -10);
    this.harvestingAnimation.maxParticleSpeed.setTo(10, 10);
    this.harvestingAnimation.makeParticles('bullet');

    game.add.existing(this);
};

Harvester.prototype = Object.create(Phaser.Sprite.prototype);
Harvester.prototype.constructor = Harvester;

Harvester.prototype.update = function () {
    this.brain.update();
    this.rotation = this.body.angle;
};

Harvester.prototype.harvest = function($this) {
    var oneHarvest = $this.target.harvest($this.harvestSpeed);
    $this.harvestStore += oneHarvest;
    if($this.harvestStore >= $this.maxHarvestStore) {
        $this.harvestStore = $this.maxHarvestStore;
        $this.target.harvesting = false;
        $this.target = false;
        $this.brain.popState();
        $this.brain.pushState($this.goBase);
        $this.waitCount = 120;
        $this.brain.pushState($this.wait);
    } else if(oneHarvest < $this.harvestSpeed) {
        $this.target.harvesting = false;
        $this.target = false;
        $this.brain.popState();
        $this.brain.pushState($this.goHarvest);
        $this.waitCount = 120;
        $this.brain.pushState($this.wait);
    }
    $this.harvestingAnimation.start(true, 1000, null,1);
    $this.checkSprite($this);
};

Harvester.prototype.goHarvest = function($this) {
    if(!$this.target) {
        $this.target = $this.findResource($this);
        if($this.target) {
            $this.target.harvesting = true;
        }
    }

    if($this.target) {
        if($this.game.physics.arcade.distanceBetween($this.target,$this) < 10) {
            $this.body.acceleration.setTo(0,0);
            $this.body.velocity.setTo(0,0);
            $this.harvestingAnimation.x = $this.position.x;
            $this.harvestingAnimation.y = $this.position.y;
            $this.brain.popState();
            $this.brain.pushState($this.harvest);
            $this.waitCount = 60;
            $this.brain.pushState($this.wait);
        }
        else {
            //Go to the target
            $this.steering = $this.steer.arrive($this.target.position,150);
            $this.body.acceleration = $this.steering;
        }
    }
};

Harvester.prototype.emptyHarvest = function($this) {
    if($this.harvestStore > 0) {
        $this.harvestStore -= $this.harvestEmptySpeed;
        if($this.harvestStore > 0) {
            resources += $this.harvestEmptySpeed;
        } else {
            resources += $this.harvestEmptySpeed + $this.harvestStore;
            $this.harvestStore = 0;
        }
    } else {
        $this.brain.popState();
        $this.brain.pushState($this.goHarvest);
    }
    $this.checkSprite($this);
};

Harvester.prototype.goBase = function($this) {
    if(!$this.base) {
        $this.brain.popState();
    }
    else {
        if($this.game.physics.arcade.distanceBetween($this.base,$this) < 10) {
            $this.body.acceleration.setTo(0,0);
            $this.body.velocity.setTo(0,0)
            $this.brain.popState();
            $this.brain.pushState($this.emptyHarvest);
        }
        else {
            //Go to the target
            $this.steering = $this.steer.arrive($this.base.position,150);
            $this.body.acceleration = $this.steering;
        }
    }
};

Harvester.prototype.wait = function($this) {
    if($this.waitCount > 0) {
        $this.waitCount -= 1;
    }
    else {
        $this.brain.popState();
    }
};

Harvester.prototype.findResource = function($this) {
    var closest = false;
    var closestDistance = $this.maxDistanceFromBase;
    var distance;
    asteroids.forEach(function(asteroid) {
        distance = $this.game.physics.arcade.distanceBetween(asteroid,$this);
        if(asteroid.resources > 0 && !asteroid.harvesting && distance < closestDistance) {
            closestDistance = distance;
            closest = asteroid;
        }
    });

    return closest;
};

Harvester.prototype.checkSprite = function($this) {
    var newHarvestStoreLevel = Math.floor($this.harvestStore / $this.maxHarvestStore * 2);
    if(newHarvestStoreLevel != $this.harvestStoreLevel) {
        $this.harvestStoreLevel = newHarvestStoreLevel;
        $this.loadTexture('harvester' + $this.harvestStoreLevel);
    }
};

