const container = document.getElementById('inboxContainer');
const token = localStorage.getItem('token');

if (!token) {
  container.innerHTML = '<p>Please log in to see your inbox.</p>';
}

function loadInbox() {
  fetch('https://e-swapper-backend.onrender.com/api/messages/conversations', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(res => res.json())
  .then(conversations => {
    container.innerHTML = '';
    if (!conversations.length) {
      container.innerHTML = '<p>No conversations found.</p>';
      return;
    }

    conversations.forEach(user => {
      const div = document.createElement('div');
      div.className = 'conversation';
      div.innerHTML = `
        <span>💬 Chat with ${user.email || user._id}</span>
        <div>
          <a href="message.html?user=${user._id}">Open Chat</a>
          ${user.unreadCount ? `<span style="color: red; margin-left: 10px;">(${user.unreadCount} new)</span>` : ''}
        </div>
      `;
      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error(err);
    container.innerHTML = '<p>Failed to load inbox.</p>';
  });
}

function markAllAsRead() {
  fetch('https://e-swapper-backend.onrender.com/api/messages/markAllRead', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  })
  .then(() => {
    loadInbox();
  })
  .catch(err => {
    console.error(err);
    alert('Failed to mark messages as read.');
  });
}

loadInbox();
