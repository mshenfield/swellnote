const quillButton = document.querySelector(".quill-button");
const bottle = document.querySelector("#bottle");
const messageOverlay = document.querySelector(".message-overlay");
const message = document.querySelector(".scroll__message");
const scroll = document.querySelector(".scroll");
const editor = document.querySelector(".scroll__editor");
const sendButton = document.querySelector(".send-button");

// Display the message overlay for the existing message...
bottle.addEventListener("click", () => {
  messageOverlay.classList.add("message-overlay--visible");
  scroll.classList.add("scroll--read-only");
  scroll.classList.remove("scroll--editable");
});
// ...and when creating new ones
quillButton.addEventListener("click", () => {
  messageOverlay.classList.add("message-overlay--visible");
  scroll.classList.add("scroll--editable");
  scroll.classList.remove("scroll--read-only");
  editor.focus();
});

messageOverlay.addEventListener("click", (event) => {
  if (event.target !== messageOverlay) {
    return;
  }
  event.preventDefault();

  dismissMessageOverlay();
});

function dismissMessageOverlay() {
  // If a user has read the message, send the message away and reset the timer for the next message;
  if (
    scroll.classList.contains("scroll--read-only") &&
    bottle.classList.contains("bottle--visible")
  ) {
    bottle.classList.remove("bottle--visible");
    setTimeout(() => getMessage(), 30000);
  }
  messageOverlay.classList.remove("message-overlay--visible");
}

function getMessage() {
  fetch("/api/message")
    .then(res => res.text())
    .then(content => {
      message.textContent = content;
      bottle.classList.add("bottle--visible");
    });
}

sendButton.addEventListener("click", (event) => {
  event.preventDefault();
  sendMessage();
  setTimeout(() => {
    editor.value = "";
  }, 1000);

  dismissMessageOverlay();
});

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

  fetch("/api/message", {
    method: "POST",
    body: f
  });
}

// Display a bottle 5 seconds after the page loads.
setTimeout(() => getMessage(), 5000);
