/**
 * Utils object
 */
var Utils = function() {

};


/**
 * Returns the number of key-value pairs in the object map.
 *
 * @param {Object} obj The object for which to get the number of key-value pairs.
 * @return {number} The number of key-value pairs in the object map.
 */
Utils.getObjectCount = function(obj) {
  var cnt = 0;
  for (var key in obj) {
    cnt++;
  }

  return cnt;
};


/**
 * Returns the number of key-value pairs in the object map.
 *
 * @param {Object} obj The object for which to get the number of key-value pairs.
 * @return {number} The number of key-value pairs in the object map.
 */
Utils.getMaxPeopleInObject = function(obj) {
  var max = 0;
  for (var key in obj) {
    var currentPeople = obj[key]['stats']['people'];
    var type = obj[key]['stats']['type'];
      if (currentPeople > max) {
        max = currentPeople;
      }
  }

  return max;
};


/**
 * Get URL Params
 * @return {Array} params Query params.
 */
Utils.getUrlParams = function() {
  var params = [];
  var hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    params.push(hash[0]);
    params[hash[0]] = hash[1];
  }

  return params;
};


/*
 * From Google Closure
 */
Utils.forEachObject = function(obj, f, opt_obj) {
  for (var key in obj) {
    f.call(opt_obj, obj[key], key, obj);
  }
};


/**
 * Array Remove - By John Resig (MIT Licensed)
 * http://ejohn.org/blog/javascript-array-remove/
 */
Utils.removeFromArray = function(array, from, to) {
  var rest = array.slice((to || from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;

  return array.push.apply(array, rest);
};
