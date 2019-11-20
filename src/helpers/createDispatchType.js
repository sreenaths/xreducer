function createDispatchType(handlerType, reducerName, handlerName) {
  var parts = [`@${handlerType}`];
  if(reducerName) {
    parts.push(reducerName);
  }
  parts.push(handlerName);
  return parts.join(".");
}

export default createDispatchType;