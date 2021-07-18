const GAME_CONTROLLER_URL = "ws://192.168.1.2:6789";

let onMessage = null;
let ws = null;

export function startClient(onMessageCb) {
  onMessage = onMessageCb;
  if (!ws) {
    ws = new WebSocket(GAME_CONTROLLER_URL);
    ws.onerror = handleError;
    ws.onclose = handleClose;
    ws.onmessage = handleMessage;
  }
  return ws;
}

function handleError(event) {
  console.log("got websocket error", event);
}

function handleClose(event) {
  console.log("ws connection closed.  reestablishing in 5 seconds");
  ws = null;
  setTimeout(() => {
    startClient(onMessage);
  }, 5000);
}

function handleMessage(event) {
  // console.log("got ws message: ", event);
  const data = JSON.parse(event.data);
  onMessage(data);
}
