'use strict'

function Steer(hostPosition, hostVelocity) {
    this.host = {
        velocity : hostVelocity,
        position : hostPosition
    }

    this.steering = Phaser.Point(0,0);
    this.maxAcceleration = 150;

    this.tickCount = 0;
    this.updateEveryNTick = 30;

}

Steer.prototype.seek = function(target,slowingRadius) {

    var desired = target.clone();
    desired.subtract(this.host.position.x,this.host.position.y);

    var distance = desired.getMagnitude();

    desired.normalize();

    if (distance <= slowingRadius) {
        desired.setMagnitude(this.maxAcceleration * distance/slowingRadius);
    } else {
        desired.setMagnitude(this.maxAcceleration);
    }

    desired.subtract(this.host.velocity.x,this.host.velocity.y);
    return desired;
};

Steer.prototype.tick = function() {
    this.tickCount += 1;
    if(this.tickCount >= this.updateEveryNTick) {
        this.tickCount = 0;
        return true;
    }
    return false;
};