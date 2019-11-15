// Stores a hash of hash of handler functions

function createHandlerHash() {
  const handlerHash = {};
  const setHandler = (name, handler) => handlerHash[name] = handler;
  const getHandlers = () => handlerHash;
  return {setHandler, getHandlers};
}

export default function createHandlerStore() {
  let store = {};
  return handlerType => store[handlerType] || (store[handlerType] = createHandlerHash());
}