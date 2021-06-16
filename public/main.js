const socket = io();

const totalClients = document.getElementById("clients-total");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const nameInput = document.getElementById("name-input");
// const button = document.getElementById('button');

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

socket.on("clients-total", (data) => {
  totalClients.innerText = `Total clients: ${data}`;
});

function sendMessage() {
  if (messageInput.value === "") {
    return;
  }

  console.log(messageInput.value);
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    date: new Date(),
  };

  socket.emit("message", data);
  addMessageToUI(true, data);
  messageInput.value = "";
}

socket.on("chat-message", (data) => {
  console.log(data);
  addMessageToUI(false, data);
});

function addMessageToUI(isOwnMessage, data) {
  clearFeedback();
  const element = `
    <li class="box" id="${isOwnMessage ? "message-right" : "message-left"}">
        <p class="message is-white">
            ${data.message}
            <br/>
            <span> <strong>${data.name} ⚪🕐 ${moment(
    data.date
  ).fromNow()} </strong></span>
        </p>
    </li>`;

  messageContainer.innerHTML += element;
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", (e) => {
  socket.emit('feedback', {
    feedback: `🖋 ${nameInput.value} is typing...`,
  });
});
messageInput.addEventListener("keypress", (e) => {
  socket.emit('feedback', {
    feedback: `🖋 ${nameInput.value} is typing...`,
  });
});
messageInput.addEventListener("blur", (e) => {
  socket.emit('feedback', {
    feedback: "",
  });
});

socket.on('feedback', (data) => {
  clearFeedback();
  const elem = `
  <li class="message-feedback" id="message-feedback">
    <p class="feedback"><typing class="type">${data.feedback}</typing></p>
  </li>`;

  messageContainer.innerHTML += elem;
});

function clearFeedback () {
  document.querySelectorAll("li.message-feedback").forEach(element => {
    element.parentNode.removeChild(element);
  })
}
