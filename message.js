
const socket = io('http://localhost:5000');

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const imageInput = document.getElementById('imageInput');
const chatBox = document.getElementById('chatBox');

const token = localStorage.getItem('token');
const urlParams = new URLSearchParams(window.location.search);
const otherUser = urlParams.get('user');
let currentUser = "";

fetch('http://localhost:5000/api/users/me', {
  headers: { 'Authorization': 'Bearer ' + token }
})
.then(res => res.json())
.then(data => {
  currentUser = data._id;
  const room = `chat_${[currentUser, otherUser].sort().join('_')}`;
  socket.emit('joinRoom', room);

  sendButton.addEventListener('click', () => {
    const msg = messageInput.value;
    if (msg.trim() !== '') {
      socket.emit('sendMessage', { room, message: msg });
      addMessage(msg, 'sent');
      messageInput.value = '';
    }
  });

  socket.on('receiveMessage', (msg) => {
    addMessage(msg, 'received');
  });

  imageInput.addEventListener('change', async () => {
    const file = imageInput.files[0];
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('http://localhost:5000/api/messages/upload', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    });

    const data = await res.json();
    const imageTag = `<img src="\${data.imageUrl}" style="max-width:200px;" />`;
    socket.emit('sendMessage', { room, message: imageTag });
    addMessage(imageTag, 'sent');
  });
});

function addMessage(msg, type) {
  const div = document.createElement('div');
  div.className = `message \${type}`;
  div.innerHTML = msg;
  chatBox.appendChild(div);
}
