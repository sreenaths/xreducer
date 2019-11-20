function debounce(func, wait) {
  var timerID;

  return function() {
    var args = arguments;

    clearTimeout(timerID);
    timerID = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

export default debounce;