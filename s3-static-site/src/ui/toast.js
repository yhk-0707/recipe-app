let toastContainer = null;

function ensureContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'cp-toast-container';
    document.body.appendChild(toastContainer);
  }
}

export function showToast(message, options = {}) {
  ensureContainer();
  const div = document.createElement('div');
  div.className = 'cp-toast';
  div.textContent = message;
  toastContainer.appendChild(div);
  const timeout = options.timeout || 5000;

  const undo = options.undo;
  if (undo) {
    const btn = document.createElement('button');
    btn.className = 'cp-toast-undo';
    btn.textContent = '取り消す';
    btn.addEventListener('click', () => {
      undo();
      div.remove();
    });
    div.appendChild(btn);
  }

  setTimeout(() => {
    div.remove();
  }, timeout);
}
