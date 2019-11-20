function assert(condition, message) {
  if(!condition) {
    throw new TypeError(message);
  }
}

export default assert;