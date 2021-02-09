const quillButton = document.querySelector("#quill-button");
const bottle = document.querySelector("#bottle");
const messageOverlay = document.querySelector("#message-overlay");
const message = document.querySelector("#message");
const scroll = document.querySelector("#scroll");
const editor = document.querySelector("#scroll .editor");
const sendButton = document.querySelector(".send-button");

bottle.addEventListener("click", () => {
  messageOverlay.classList.add("visible");
  scroll.classList.add("read-only");
  scroll.classList.remove("editable");
});

messageOverlay.addEventListener("click", (event) => {
  if (event.target !== messageOverlay) {
    return;
  }
  event.preventDefault();

  dismissMessageOverlay();
});

quillButton.addEventListener("click", () => {
  messageOverlay.classList.add("visible");
  scroll.classList.add("editable");
  scroll.classList.remove("read-only");
  editor.focus();
});

sendButton.addEventListener("click", (event) => {
  event.preventDefault();
  sendMessage();
  setTimeout(() => {
    editor.value = "";
  }, 1000);

  dismissMessageOverlay();
});

function getMessage() {
  fetch("http://localhost:5000/message")
    .then(res => res.text())
    .then(content => {
      message.textContent = content;
      bottle.classList.add("appears");
    });
}

/**
 * Post the user's message to the API.
 *
 * Doesn't perform any validation.
 *
 * TODO: Only allow sending a message very 10 minutes
 */
function sendMessage() {
  f = new FormData();
  f.set("content", editor.value);

  fetch("http://localhost:5000/message", {
    method: "POST",
    body: f
  });
}

function dismissMessageOverlay() {
  // If a user has read the message, send the message away and reset the timer for the next message;
  if (
    scroll.classList.contains("read-only") &&
    bottle.classList.contains("appears")
  ) {
    bottle.classList.remove("appears");
    setTimeout(() => getMessage(), 30000);
  }
  messageOverlay.classList.remove("visible");
}
// TODO: Display character limit for editor.

setTimeout(() => getMessage(), 5000);
