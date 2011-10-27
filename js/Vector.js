/**
 * Generic 2d vector class.
 * @param {?number=} x The x coordinate for this vector.
 * @param {?number=} y The y coordinate for this vector.
 * @constructor
 */
var Vector = function (x, y) {
  /**
   * Constant to convert to degrees.
   * @type {number}
   * @const
   */
  this.TO_DEGREES = 180 / Math.PI;

  /**
   * Constant to convert to radians.
   * @type {number}
   * @const
   */
  this.TO_RADIANS = Math.PI / 180;

  /**
   * X coordinate.
   * @type {number}
   */
  this.x = x || 0;

  /**
   * Y coordinate.
   * @type {number}
   */
  this.y = y || 0;
};


var TempVector = new Vector();


/**
 * Add two vectors.
 *
 * @param {Vector} v Vector to add to this vector.
 * @return {Vector}
 */
Vector.prototype.add = function (v) {
  this.x = this.x + v.x;
  this.y = this.y + v.y;

  return this;
};


/**
 * Subtract two vectors.
 *
 * @param {Vector} v Vector to add to this vector.
 * @return {Vector}
 */
Vector.prototype.subtract = function (v) {
  this.x = this.x - v.x;
  this.y = this.y - v.y;

  return this;
};


/**
 * Multiply a vector by a scalar (basically scaling up a vector).
 *
 * @param {number} scalar A scalar to multiply this vector by.
 * @return {Vector}
 */
Vector.prototype.multiply = function (scalar) {
  this.x = this.x * scalar;
  this.y = this.y * scalar;

  return this;
};


/**
 * Divide a vector by a scalar (basically scaling down a vector).
 *
 * @param {number} scalar A scalar to divide this vector by.
 * @return {Vector}
 */
Vector.prototype.divide = function (scalar) {
  this.x = this.x / scalar;
  this.y = this.y / scalar;

  return this;
};


/**
 * Magnitude of this vector.
 * This is basically used to calculate the length of a vector.
 * The formula used is simple - the Pythagorean theorem.
 *
 * @return {number}
 */
Vector.prototype.magnitude = function () {
  return Math.sqrt((this.x * this.x) + (this.y * this.y));
};


/**
 * Normalize the vector to length 1 (make it a unit vector).
 */
Vector.prototype.normalize = function() {
  var mag = this.magnitude();
  if (mag !== 0) {
    this.divide(mag);
  }
};


/**
 * Copy a vector onto this vector. Reset this vector's x and y with the passed in vector's x and y.
 *
 * @param {Vector} v Vector to set this vector's x and y to.
 */
Vector.prototype.copyFrom = function (v) {
  this.x = v.x;
  this.y = v.y;
};


/**
 * Reset
 */
Vector.prototype.reset = function(x, y) {
  this.x = x;
  this.y = y;

  return this;
};


/**
 * Rotate
 */
Vector.prototype.rotate = function (angle, useRadians) {
  var cosRY = Math.cos(angle * (useRadians ? 1 : this.TO_RADIANS));
  var sinRY = Math.sin(angle * (useRadians ? 1 : this.TO_RADIANS));

  TempVector.copyFrom(this);

  this.x = (TempVector.x * cosRY) - (TempVector.y * sinRY);
  this.y = (TempVector.x * sinRY) + (TempVector.y * cosRY);

  return this;
};
