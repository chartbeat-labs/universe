/**
 * World Class
 *
 * This acts as the "stage" manager.
 */
var World = function(config) {
  // Set the repel strength to the correct value before anything.
  config['repelStrength'] = config['repelStrength'] * 10;

  /**
   * Config object.
   * @type {Object}
   */
  this.config = config;

  /**
   * @type {Array}
   */
  var params = Utils.getUrlParams();

  /**
   * Host.
   * @type {host}
   */
  this.host = (!!params['host']) ? params['host'] : this.config['host'];

  /**
   * Api Key to use.
   * @type {String}
   */
  this.apikey = (!!params['apikey']) ? params['apikey'] : this.config['apikey'];

  /**
   * Maximum pages to draw.
   * @type {Number}
   */
  this.maxPages = (!!params['maxpages']) ? params['maxpages'] : this.config['maxPages'];

  /**
   * Data object.
   * @type {Object}
   */
  this.data;

  /**
   * The mouse coordinates.
   * @type {Object}
   */
  this.mouseCoordinates = {x: 0, y: 0};

  /**
   * Flag if the mouse is down or not.
   * @type {Boolean}
   */
  this.mouseIsDown = false;

  /**
   * The size (diameter) of the world.
   * @type {Number}
   */
  this.repelStrength = this.config['repelStrength'] || 200;

  /**
   * Canvas element.
   * @type {Element}
   */
  this.canvas = document.createElement('canvas');

  /**
   * Canvas context.
   */
  this.context = this.canvas.getContext('2d');

  /**
   * Particles array.
   * @type {Array}
   */
  this.particles = [];

  this.particles_ = {};

  /**
   * @type {Boolean}
   */
  this.particleIsHovered = false;

  /**
   * @type {number}
   */
  this.particleCount = 0;

  /**
   * Flag to know if fetched once has occurred.
   * @type {boolean}
   */
  this.fetchedOnce = false;


  // Listen for browser resize
  window.addEventListener('resize', this.onBrowserResize.bind(this), false);

  // Listen for mouse events
  document.addEventListener('mousedown', this.onMouseDown.bind(this), false);
  document.addEventListener('mouseup', this.onMouseUp.bind(this), false);
  this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);

  // Initialize the world
  this.init();
};


/**
 * Initialize
 */
World.prototype.init = function() {
  var self = this;

  // Create markup
  var container = document.createElement('div');
  var header = document.createElement('header');
  var heading = document.createElement('h1');
  var count = document.createElement('h2');

  document.body.appendChild(container);
  container.appendChild(this.canvas);
  document.body.appendChild(header);
  header.appendChild(heading);
  header.appendChild(count);

  // Set up canvas
  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;

  // Set the header info
  $('#host').html(this.host);

  // Fetch the data
  this.initialFetch();
  setInterval(function() { self.fetch(self); }, 10000);

  // Let's do some animation, yo!
  this.animate();
};


/**
 * Call the draw loop with requestAnimationFrame
 */
World.prototype.animate = function() {
  requestAnimFrame(this.animate.bind(this));
  this.draw();
};


/**
 * The draw loop
 */
World.prototype.draw = function() {
  var self = this;
  var repelForce = new Vector(0, 0);
  var windowCenterVector = new Vector(window.innerWidth / 2, window.innerHeight / 2);
  var repelStrength = 0;
  var magnitude = 0;


  // Loop through each particle
  for (var i = 0; i < this.particles.length; i++){
    var particle = this.particles[i];

    repelForce.copyFrom(particle.position);
    repelForce.subtract(windowCenterVector);
    magnitude = repelForce.magnitude();
    repelStrength = (magnitude - this.repelStrength) * -particle.getSpringyness();

    // Pull the particle back in towards the middle
    if (repelStrength < 0) {
      repelForce.multiply(repelStrength / magnitude);
      particle.force.add(repelForce);
    }

    // We don't want to go outside of our limits
    if (i >= (this.particles.length - 1)) {
      continue;
    }

    // Loop through each of the next particles
    for (j = i + 1; j < this.particles.length; j++) {
      var nextParticle = this.particles[j];

      // Compare this particle's position to the previous particle's position and store
      // it in a new vector
      repelForce.copyFrom(nextParticle.position);
      repelForce.subtract(particle.position);

      // Find the magnitude of this new vector
      magnitude = repelForce.magnitude();

      // Subtract the magnitude from user defined repel strength. The closer the particles are,
      // the more repel strength we will have
      repelStrength = this.repelStrength - magnitude;

      if ((repelStrength > 0) && (magnitude > 0)) {
        // Normalize this vector.
        // Reminder: This keeps the angle the same, just changes the length to be 1 unit
        repelForce.normalize();

        // This controls the "springyness". The getSpringyness() value should be small as to
        // reduce the intensity of it. If hovered, we want a small amount of animation to happen
        // so we just add a small amount to the springyness multiplier.
        var springyness = particle.getSpringyness();
        if (particle.getMouseHovered()) {
          springyness += 0.01;
        }
        repelForce.multiply(repelStrength * springyness);

        // Add the force to the next particle and subtract the force from the first particle
        // so that it goes in the opposite direction.
        nextParticle.force.add(repelForce);
        particle.force.subtract(repelForce);
      }
    }
  }

  // Clear the canvas
  this.context.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Iteratate through each particle and update/redraw
  for (var i = 0; i < this.particles.length; i++) {
    var particle = this.particles[i];
    particle.updatePhysics();
    particle.draw(this.mouseCoordinates, this.mouseIsDown);
  }
  
  // TODO: Must be a better way to do this?
  for (var i = 0; i < this.particles.length; i++) {
    var particle = this.particles[i];

    // If mouse is hovered, draw the stats
    if (particle.getMouseHovered()) {
      var data = particle.getData();
      var currentHTML = $('#pageTitle').text();
      if (currentHTML !== data['title']) {
        var pageTitle = $('#pageTitle').fadeOut(200, function() {
          $(this).html(data['title']).fadeIn(200);
        });
      }
      self.canvas.style.cursor = 'pointer';
      $('#pageTitle').show();
      break;
    } else {
      self.canvas.style.cursor = 'default';
      $('#pageTitle').hide();
    }
  }
};


/**
 * Initial fetch of the data.
 * TODO: This needs to be cleaned up
 */
World.prototype.initialFetch = function() {
  var self = this;

  $.ajax({
    dataType: 'jsonp',
    success: function(data) {
      self.data = data;
      var pages = self.data['pages'];

      // Sort small to big
      self.data['pages'].sort(function(a,b) {
        return a.stats.people - b.stats.people;
      });

      // Keep track of our list of pages
      for (var i = 0, len = pages.length; i < len; i++) {
        var path = pages[i]['path'];
        self.particles_[path] = pages[i];
      }

      var max = Utils.getMaxPeopleInObject(self.data['pages']);
      self.createParticles(self.data['pages'], max);
    },
    type: 'GET',
    url: 'http://api.chartbeat.com/toppages/?host=' + self.host + '&limit=' + self.maxPages + '&apikey=' + self.apikey + '&types=1&v=2&jsonp=?'
  });
};


/**
 * Fetch the data
 */
World.prototype.fetch = function(thisReference) {
  var self = (!!thisReference) ? thisReference : this;

  $.ajax({
    dataType: 'jsonp',
    success: function(data) {
      self.data = data;
      var pages = self.data['pages'];

      var max = Utils.getMaxPeopleInObject(self.data['pages']);
      var newParticles = {};

      // Keep track of our list of pages
      for (var i = 0, len = pages.length; i < len; i++) {
        var path = pages[i]['path'];
        var currentParticle = self.particles_[path];

        // Create a new particle
        if (!currentParticle) {
          currentParticle = self.createParticle(pages[i], max);
          // TODO: This is not correct!!
          Utils.removeFromArray(self.particles, 0, 0);
        }

        newParticles[path] = pages[i];
      }

      self.particles_ = newParticles;
    },
    type: 'GET',
    url: 'http://api.chartbeat.com/toppages/?host=' + self.host + '&limit=' + self.maxPages + '&apikey=' + self.apikey + '&types=1&v=2&jsonp=?'
  });
};


/**
 * Create particles
 */
World.prototype.createParticles = function(data, max, thisReference) {
  var self = (!!thisReference) ? thisReference : this;

  // Make sure we have data
  if (!data[self.particleCount]) {
    return;
  }

  self.createParticle(data[self.particleCount], max);

  // Add other particles with a slight delay...
  if (self.particles.length < data.length) {
    setTimeout(function() {
      self.createParticles(data, max, self);
    }, 45);
  }

  self.particleCount++;
};


/**
 * Create a particle
 */
World.prototype.createParticle = function (data, max) {
  var halfScreenHeight = window.innerHeight / 2;
  var halfScreenWidth = window.innerWidth / 2;

  // Create the new particle
  var particle = new Particle(this.config, data, max, this.canvas, this.context, halfScreenWidth, halfScreenHeight);
  particle.position.reset(halfScreenWidth, halfScreenHeight);
  particle.velocity.reset(1, 0);
  particle.velocity.rotate(Math.random() * 360);
  particle.drag = 0.85;

  // Keep track of our particles
  this.particles.push(particle);

  return particle;
};


/**
 * === Event Handling ============================================================
 */


/**
 * On mousemove event
 */
World.prototype.onMouseMove = function(event) {
  var mouseX = event.pageX - this.canvas.offsetLeft;
  var mouseY = event.pageY - this.canvas.offsetTop;

  this.mouseCoordinates = {x: mouseX, y: mouseY};

  // Handle the title location
  $('#pageTitle').css({left: mouseX, top: mouseY});
};


/**
 * On mouse down event
 */
World.prototype.onMouseDown = function(event) {
  this.mouseIsDown = true;
};


/**
 * On mouse up event
 */
World.prototype.onMouseUp = function(event) {
  this.mouseIsDown = false;
}


/**
 * On browser resizing event
 */
World.prototype.onBrowserResize = function(event) {
  this.canvas.height = window.innerHeight;
  this.canvas.width = window.innerWidth;
};
