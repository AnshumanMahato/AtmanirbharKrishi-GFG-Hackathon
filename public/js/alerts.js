/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
export const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};

export const showPrompt = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">
                    <p>${msg}</p>
                    <button class="btn btn--yellow btn--confirm">Confirm</button>
                    &nbsp;&nbsp;
                    <button class="btn btn--yellow btn--cancel">Cancel</button>
                </div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  // window.setTimeout(hideAlert, time * 1000);
};
