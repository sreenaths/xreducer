import createHandlerStore from '../src/helpers/createHandlerStore';

test('createHandlerStore', () => {

  let store = createHandlerStore();

  var {setHandler} = store("TYPE-A");
  setHandler("A1", () => {});
  setHandler("A2", () => {});

  var {setHandler} = store("TYPE-B");
  setHandler("B1", () => {});

  var {setHandler} = store("TYPE-A");
  setHandler("A3", () => {});
  setHandler("A4", () => {});

  var {setHandler} = store("TYPE-B");
  setHandler("B2", () => {});
  setHandler("B3", () => {});

  var {getHandlers} = store("TYPE-A");
  expect(Object.keys(getHandlers()).sort()).toEqual(["A1", "A2", "A3", "A4"]);

  var {getHandlers} = store("TYPE-B");
  expect(Object.keys(getHandlers()).sort()).toEqual(["B1", "B2", "B3"]);

});
