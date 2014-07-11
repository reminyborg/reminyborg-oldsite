'use strict';

/**
 * Stacked Finite State Machine.
 * @constructor
 */
function StackFSM(host) {
    this.host = host;
    this.stack = [];
};

/**
 * Run each iteration to run the current state.
 */
StackFSM.prototype.update = function() {
    if(typeof this.getCurrentState() === 'function') {
        this.getCurrentState()(this.host);
    }
};

/**
 * Pops the last state of the stack and returns it
 * @returns state
 */
StackFSM.prototype.popState = function() {
    return this.stack.pop();
};

/**
 * Pushes a stateFunction onto the stack
 * @param state
 */
StackFSM.prototype.pushState = function(state) {
    if (this.getCurrentState() !== state) {
        this.stack.push(state);
    };
};

/**
 *
 * @returns stateFunction or boolean
 */
StackFSM.prototype.getCurrentState = function() {
    if(this.stack.length > 0) {
        return this.stack[this.stack.length-1];
    }
    else {
        return false;
    }
};
