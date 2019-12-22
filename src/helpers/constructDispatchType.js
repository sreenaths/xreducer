function constructDispatchType(actionClass, reducerName, handlerName) {
  var parts = ["@" + actionClass];

  if(reducerName) {
    parts.push(reducerName);
  }

  parts.push(handlerName);
  return parts.join(".");
}

export default constructDispatchType;