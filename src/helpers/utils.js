const OBJ_FUN = "[object Function]";
const FUN = "function";
function isFunction(value) {
  return value && (FUN == typeof value || Object.prototype.toString.call(value) === OBJ_FUN);
}

function assert(condition, error) {
  if(!condition) {
    throw new TypeError(error);
  }
}

function createType(reducerName, name) {
  var type;
  if(reducerName) {
    type = `${reducerName}_${name}`;
  } else {
    type = name || "";
  }
  type = type + "_XRA";
  return type.toUpperCase();
}

export {
  isFunction,
  assert,
  createType,
};