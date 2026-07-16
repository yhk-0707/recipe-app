export function createConfirmModal() {
  // create container
  const modal = document.createElement('div');
  modal.className = 'cp-modal';
  modal.innerHTML = `
    <div class="cp-modal-backdrop" tabindex="-1"></div>
    <div class="cp-modal-panel" role="dialog" aria-modal="true" aria-labelledby="cp-modal-title">
      <h3 id="cp-modal-title">確認</h3>
      <div class="cp-modal-body"></div>
      <div class="cp-modal-actions">
        <button class="cp-btn cp-cancel">キャンセル</button>
        <button class="cp-btn cp-confirm">削除する</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const body = modal.querySelector('.cp-modal-body');
  const confirm = modal.querySelector('.cp-confirm');
  const cancel = modal.querySelector('.cp-cancel');
  const backdrop = modal.querySelector('.cp-modal-backdrop');

  function show(message) {
    body.textContent = message;
    modal.classList.add('open');
    // focus trap minimal
    cancel.focus();
    return new Promise((resolve) => {
      function cleanup() {
        modal.classList.remove('open');
        confirm.removeEventListener('click', onConfirm);
        cancel.removeEventListener('click', onCancel);
        backdrop.removeEventListener('click', onCancel);
      }
      function onConfirm() { cleanup(); resolve(true); }
      function onCancel() { cleanup(); resolve(false); }
      confirm.addEventListener('click', onConfirm);
      cancel.addEventListener('click', onCancel);
      backdrop.addEventListener('click', onCancel);
    });
  }

  function destroy() {
    modal.remove();
  }

  return { show, destroy };
}
