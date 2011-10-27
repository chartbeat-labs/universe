/**
 * Particle Class
 */
var Particle = function (config, data, max, canvas, context, positionX, positionY) {

  /**
   * @type {Object}
   */
  this.config = config;

  /**
   * @type {Object}
   */
  this.data = data;

  /**
   * @type {Object}
   */
  this.max = max;

  /**
   * A reference to the canvas element
   */
  this.canvas = canvas;

  /**
   * A reference to the stage context
   */
  this.context = context;

  /**
   * The position of the particle
   */
  this.position = new Vector(positionX, positionY);

  /**
   * If the mouse is hovered over a particle.
   * @type {Boolean}
   */
  this.mouseIsHovered = false;

  /**
   * If the mouse is down.
   * @type {Boolean}
   */
  this.mouseIsDown = false;

  /**
   * The velocity
   */
  this.velocity = new Vector(0, 0);

  /**
   * The force
   */
  this.force = new Vector(0, 0);

  /**
   * The drag "physics". A number between 0 and 1. The closer to 0, the more drag.
   * @type {Number}
   */
  this.drag = 1;

  /**
   * The "springyness" multiplier.
   * @type {Number}
   */
  this.springyness = 0.03;

  /**
   * The radius (current number of concurrents).
   * @type {Number}
   */
  this.radius = (Math.floor(this.config['repelStrength'] / 3.75)) * (this.data['stats']['people'] / this.max);

  /**
   * The current radius (current number of concurrents).
   * @type {Number}
   */
  this.maxRadius = Math.abs(this.radius + (Math.random() * 13));
};


/**
 *
 */
Particle.prototype.draw = function(mouseCoordinates, mouseIsDown) {
  this.mouseIsDown = mouseIsDown;
  // this.radius = (Math.floor(this.config['repelStrength'] / 3.75)) * (this.data['stats']['people'] / this.max);
  // this.maxRadius = Math.abs(this.radius + (Math.random() * 13));

  // Draw the inner circle (current amount of concurrents)
  this.context.fillStyle = (this.mouseIsHovered) ? '#fff' : '#fdd13e';
  this.context.beginPath();
  this.context.arc(this.position.x, this.position.y, this.radius, 0, (Math.PI * 2), true);
  this.context.closePath();
  this.context.fill();

  // Draw the outer circle (30 day max)
  // this.context.strokeStyle = '#5b5954';
  // this.context.beginPath();
  // this.context.arc(this.position.x, this.position.y, this.maxRadius, 0, (Math.PI * 2), true);
  // this.context.closePath();
  // this.context.stroke();

  // TODO: Super hacky, but this is making a "hit area" for mousing over the bubbles
  this.context.beginPath();
  this.context.arc(this.position.x, this.position.y, 45, 0, (Math.PI * 2), true);
  this.context.closePath();

  // On mouse hover, we should show a tooltip
  if (this.context.isPointInPath(mouseCoordinates.x, mouseCoordinates.y)) {
    this.mouseIsHovered = true;
  } else {
    this.mouseIsHovered = false;
  }

  if (this.mouseIsHovered) {
    this.context.strokeStyle = '#8b887f';
  }
};


Particle.prototype.update = function(data) {
  this.data = data;
  // this.radius = (Math.floor(this.config['repelStrength'] / 3.75)) * (this.data['stats']['people'] / this.max);
  // var finalMaxRadius = Math.abs(this.radius + (Math.random() * 13));
  // setInterval(function() {
  //   if (this.maxRadius != finalMaxRadius) {
      // this.maxRadius = Math.abs(this.radius + (Math.random() * 13));
  //   };
  // }, 30);
};


/**
 * Update Physics
 */
Particle.prototype.updatePhysics = function() {
  // Simulate drag
  this.velocity.multiply(this.drag);
  this.velocity.add(this.force);

  // Add the velocity to the position
  this.position.add(this.velocity);
  this.force.reset(0, 0);
};


Particle.prototype.fadeOutAndRemove = function() {
  console.log('fadeOutAndRemove');
};


Particle.prototype.getData = function() {
  return this.data;
};


/**
 *
 */
Particle.prototype.getRadius = function() {
  return this.radius;
};


/**
 *
 */
Particle.prototype.getMaxRadius = function() {
  return this.maxRadius;
};


/**
 *
 */
Particle.prototype.getMouseHovered = function() {
  return this.mouseIsHovered;
};


/**
 *
 */
Particle.prototype.getMouseDown = function() {
  return this.mouseIsDown;
};



/**
 *
 */
Particle.prototype.getSpringyness = function() {
  return this.springyness;
};


/**
 *
 */
Particle.prototype.setMaxRadius = function(radius) {
  this.maxRadius = radius;
};
