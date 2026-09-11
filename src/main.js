import { createClient } from '@supabase/supabase-js';
import { createIcons, Mail, Lock, User, Eye, EyeOff, ArrowRight, LogOut, BookOpen, GraduationCap, CheckCircle2, Chrome, ShieldCheck } from 'lucide';
import './auth.css';
import './dashboard.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const app = document.querySelector('#app');

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

let mode = 'signin';
let loading = false;

function esc(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
}

function message(text = '', type = '') {
  const el = document.querySelector('#message');
  if (!el) return;
  el.textContent = text;
  el.className = `message ${type}`;
}

function authView() {
  const signup = mode === 'signup';
  app.innerHTML = `
    <main class="auth-page">
      <section class="auth-card">
        <div class="brand-row">
          <div class="brand-mark">P</div>
          <div>
            <div class="brand-name">Prepvia</div>
            <div class="brand-sub">Education</div>
          </div>
        </div>

        <div class="hero-copy">
          <div class="eyebrow">${signup ? 'START YOUR JOURNEY' : 'WELCOME BACK'} ✨</div>
          <h1>${signup ? 'Create your account' : 'Welcome back'}</h1>
          <p>${signup ? 'Build your personalised JEE & NEET study space.' : 'Sign in to continue your preparation.'}</p>
        </div>

        <div class="tabs">
          <button class="tab ${!signup ? 'active' : ''}" data-mode="signin">Sign in</button>
          <button class="tab ${signup ? 'active' : ''}" data-mode="signup">Sign up</button>
        </div>

        <form id="auth-form" novalidate>
          ${signup ? `
            <label class="field-label">Full name</label>
            <div class="input-wrap"><span class="icon" data-lucide="user"></span><input id="name" type="text" placeholder="Your full name" autocomplete="name" required></div>
          ` : ''}

          <label class="field-label">Email</label>
          <div class="input-wrap"><span class="icon" data-lucide="mail"></span><input id="email" type="email" placeholder="you@example.com" autocomplete="email" required></div>

          <label class="field-label">Password</label>
          <div class="input-wrap"><span class="icon" data-lucide="lock"></span><input id="password" type="password" placeholder="Your password" autocomplete="${signup ? 'new-password' : 'current-password'}" required><button type="button" class="eye" id="toggle-password" aria-label="Show password"><span data-lucide="eye"></span></button></div>

          ${signup ? `
            <label class="field-label">Confirm password</label>
            <div class="input-wrap"><span class="icon" data-lucide="lock"></span><input id="confirm" type="password" placeholder="Repeat password" autocomplete="new-password" required></div>
            <label class="field-label">Preparing for</label>
            <div class="exam-grid">
              <button type="button" class="exam active" data-exam="JEE">🎯 <span>JEE</span></button>
              <button type="button" class="exam" data-exam="NEET">🧬 <span>NEET</span></button>
              <button type="button" class="exam" data-exam="Both">📚 <span>Both</span></button>
            </div>
            <label class="terms"><input id="terms" type="checkbox"> <span>I agree to the terms and privacy policy.</span></label>
          ` : `
            <div class="form-row"><label class="remember"><input id="remember" type="checkbox"> Remember me</label><button type="button" class="text-button" id="forgot">Forgot password?</button></div>
          `}

          <div id="message" class="message"></div>
          <button class="primary-btn" id="submit" type="submit">${signup ? 'Create account' : 'Sign in'} <span data-lucide="arrow-right"></span></button>
        </form>

        <div class="divider"><span>or continue with</span></div>
        <button class="google-btn" id="google"><span data-lucide="chrome"></span> Continue with Google</button>

        <div class="security"><span data-lucide="shield-check"></span> Your account is secured with Supabase Auth</div>
        <p class="switch-text">${signup ? 'Already have an account?' : "Don't have an account?"} <button class="text-button" id="switch">${signup ? 'Sign in' : 'Create one'}</button></p>
      </section>
    </main>`;

  createIcons({ icons: { Mail, Lock, User, Eye, EyeOff, ArrowRight, Chrome, ShieldCheck } });
  bindAuth();
}

function bindAuth() {
  document.querySelectorAll('[data-mode]').forEach(btn => btn.onclick = () => { mode = btn.dataset.mode; authView(); });
  document.querySelector('#switch').onclick = () => { mode = mode === 'signin' ? 'signup' : 'signin'; authView(); };

  document.querySelector('#toggle-password').onclick = () => {
    const input = document.querySelector('#password');
    input.type = input.type === 'password' ? 'text' : 'password';
    document.querySelector('#toggle-password').innerHTML = `<span data-lucide="${input.type === 'password' ? 'eye' : 'eye-off'}"></span>`;
    createIcons({ icons: { Eye, EyeOff } });
  };

  document.querySelectorAll('.exam').forEach(btn => btn.onclick = () => {
    document.querySelectorAll('.exam').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
  });

  document.querySelector('#google').onclick = googleLogin;
  document.querySelector('#auth-form').onsubmit = submitAuth;
  const forgot = document.querySelector('#forgot');
  if (forgot) forgot.onclick = resetPassword;
}

async function submitAuth(e) {
  e.preventDefault();
  if (!supabase) return message('Add your Supabase environment variables in Vercel first.', 'error');
  if (loading) return;
  loading = true;
  const button = document.querySelector('#submit');
  button.disabled = true;
  button.textContent = mode === 'signup' ? 'Creating account…' : 'Signing in…';

  try {
    const email = document.querySelector('#email').value.trim();
    const password = document.querySelector('#password').value;

    if (mode === 'signup') {
      const name = document.querySelector('#name').value.trim();
      const confirm = document.querySelector('#confirm').value;
      const exam = document.querySelector('.exam.active')?.dataset.exam || 'JEE';
      if (!name) throw new Error('Please enter your full name.');
      if (password.length < 6) throw new Error('Password must be at least 6 characters.');
      if (password !== confirm) throw new Error('Passwords do not match.');
      if (!document.querySelector('#terms').checked) throw new Error('Please accept the terms to continue.');

      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name, exam } } });
      if (error) throw error;
      if (!data.session) message('Account created. Check your email to confirm your account.', 'success');
      else await render();
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      await render();
    }
  } catch (err) {
    message(err.message || 'Something went wrong.', 'error');
  } finally {
    loading = false;
    const b = document.querySelector('#submit');
    if (b) { b.disabled = false; b.innerHTML = `${mode === 'signup' ? 'Create account' : 'Sign in'} <span data-lucide="arrow-right"></span>`; createIcons({ icons: { ArrowRight } }); }
  }
}

async function googleLogin() {
  if (!supabase) return message('Add your Supabase environment variables in Vercel first.', 'error');
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  if (error) message(error.message, 'error');
}

async function resetPassword() {
  if (!supabase) return message('Add your Supabase environment variables in Vercel first.', 'error');
  const email = document.querySelector('#email').value.trim();
  if (!email) return message('Enter your email first, then tap Forgot password.', 'error');
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
  message(error ? error.message : 'Password reset email sent. Check your inbox.', error ? 'error' : 'success');
}

async function dashboard(user) {
  const meta = user.user_metadata || {};
  const name = meta.full_name || meta.name || user.email?.split('@')[0] || 'Student';
  const exam = meta.exam || 'JEE';
  app.innerHTML = `
    <main class="dashboard-page">
      <header class="dash-nav"><div class="brand-row"><div class="brand-mark">P</div><div><div class="brand-name">Prepvia</div><div class="brand-sub">Education</div></div></div><button id="logout" class="logout"><span data-lucide="log-out"></span> Logout</button></header>
      <section class="dash-hero"><div class="welcome-icon">🎓</div><div><div class="eyebrow">STUDENT DASHBOARD</div><h1>Hi, ${esc(name)} 👋</h1><p>Your ${esc(exam)} preparation space is ready.</p></div></section>
      <section class="dash-grid">
        <div class="dash-card"><span class="card-icon">📚</span><h2>Resources</h2><p>Books, notes, PYQs and study material.</p><span class="coming">Coming next</span></div>
        <div class="dash-card"><span class="card-icon">📝</span><h2>Tests</h2><p>Practice tests and performance tracking.</p><span class="coming">Coming next</span></div>
        <div class="dash-card"><span class="card-icon">📊</span><h2>Analytics</h2><p>Understand your strengths and weak areas.</p><span class="coming">Coming next</span></div>
      </section>
      <div class="account-strip"><span data-lucide="check-circle-2"></span><div><strong>Account active</strong><small>${esc(user.email || '')}</small></div></div>
    </main>`;
  createIcons({ icons: { LogOut, CheckCircle2, BookOpen, GraduationCap } });
  document.querySelector('#logout').onclick = async () => { await supabase.auth.signOut(); render(); };
}

async function render() {
  if (!supabase) return authView();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) await dashboard(session.user); else authView();
}

if (supabase) supabase.auth.onAuthStateChange((_event, session) => { if (session?.user) dashboard(session.user); });
render();
