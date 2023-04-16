/* eslint-disable */
import '@babel/polyfill';
import { signup } from './signup';
import { login, logout } from './login';
import { orderProduct } from './stripe';
import { hideAlert, showAlert, showPrompt } from './alerts';

// DOM ELEMENTS
const signupForm = document.querySelector('.form--signup');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const modalClose = document.querySelector('.link-2');
const buyBtns = document.querySelectorAll('.buy-now>button');
const orderBtns = document.querySelectorAll('.order-product');

// DELEGATION

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    document.querySelector('.sign').textContent = 'Processing...';
    signup(name, email, password, passwordConfirm);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 10);

function net_price() {
  let x = document.getElementById('amount').innerText;
  let tp = document.getElementById('quan').value;
  document.getElementById('net_a').innerText = ` ${parseInt(x * tp * 100) /
    100} /-`;
}

if (orderBtns.length) {
  orderBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      document.querySelector('.container_top').classList.toggle('flex');
      const { productId, price } = e.target.closest('button').dataset;
      const quantity = document.getElementById('quan');
      quantity.value = 1;
      document.getElementById('amount').innerText = price;
      document.getElementById('net_a').innerText = ` ${price} /-`;
      quantity.addEventListener('change', net_price);
      document.querySelector('.checkout').addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        orderProduct(productId, quantity.value);
      });
    });
  });
}

if (modalClose)
  modalClose.addEventListener('click', () =>
    document.querySelector('.container_top').classList.toggle('flex')
  );
