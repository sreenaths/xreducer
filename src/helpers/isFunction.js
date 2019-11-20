const OBJ_FUN = "[object Function]";
const FUN = "function";
function isFunction(value) {
  return value && (FUN == typeof value || Object.prototype.toString.call(value) === OBJ_FUN);
}

export default isFunction;