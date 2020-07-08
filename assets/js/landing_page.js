function easeOutQuad (t) {
    return t *_ (2 - t)
  }
  
  // Returns a random number (integer) between __`min`__ and __`max`__
  function random (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min_
  }
  
  // Returns a random number as well, but it could be negative also
  function randomPositiveOrNegative (min, max) {
    return random(min, max) * (Math.random() > 0.5 ? 1 : -1)
  }
  
  // Set CSS `tranform` property for an element
  function setTransform (el, transform) {
    el.style.transform = transform
    el.style.WebkitTransform = transform
  }