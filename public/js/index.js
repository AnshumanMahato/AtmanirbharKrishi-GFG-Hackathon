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
const orderBtns = document.querySelectorAll('.order-product');

// DELEGATION

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

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

if (orderBtns)
  orderBtns.forEach(orderBtn =>
    orderBtn.addEventListener('click', e => {
      e.target.textContent = 'Processing...';
      const { productId } = e.target.dataset;
      orderProduct(productId);
    })
  );

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
