import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import bgImage from '../images/bg.png';
import {
  validateLoginField,
  validateLoginValues,
  getFirstErrorKey,
} from '../utils/validation';

const initialForm = {
  email: '',
  password: '',
};

const LoginPage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login, isLoading } = useLogin();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const focusField = (field) => {
    if (field === 'email') emailRef.current?.focus();
    if (field === 'password') passwordRef.current?.focus();
  };

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: validateLoginField(field, value) }));
  };

  const mapLoginError = (message) => {
    const loginErrors = {}
    if (message.includes('Incorrect password')) {
      loginErrors.password = 'Incorrect password.'
    } else if (message.includes('Incorrect email')) {
      loginErrors.email = 'Email not registered.'
    } else if (message.includes('User not found')) {
      loginErrors.email = 'Account not found.'
    } else if (message.includes('Invalid Details!')) {
      loginErrors.email = 'Email not registered.'
    } else {
      loginErrors.email = message
    }
    return loginErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fieldErrors = validateLoginValues(form);
    setErrors(fieldErrors);

    const firstError = getFirstErrorKey(fieldErrors);
    if (firstError) {
      focusField(firstError);
      return;
    }

    try {
      await login(form.email.trim(), form.password);
      setForm(initialForm);
      setErrors({});
      navigate('/');
    } catch (error) {
      const backendErrors = mapLoginError(error.message || 'Login failed');
      setErrors((prev) => ({ ...prev, ...backendErrors }));
      const firstBackendError = getFirstErrorKey(backendErrors);
      if (firstBackendError) {
        focusField(firstBackendError);
      }
    }
  };

  return (
    <div className='min-h-screen bg-cover bg-center' style={{ backgroundImage: `linear-gradient(rgba(8, 38, 29, 0.55), rgba(8, 38, 29, 0.55)), url(${bgImage})` }}>
      <div className='min-h-screen bg-black/20 px-4 py-8 flex items-center justify-center'>
        <div className='transition-all w-4/5 m-auto'>
          <div className='transition-all flex justify-center items-center'>
          <div className='transition-all max-w-auto shadow-2xl bg-white flex justify-center rounded-xl lg:rounded-l-xl lg:rounded-r-none'>
            <div>
              <form onSubmit={handleSubmit} className='transition-all w-[400px] min-h-[500px] mx-auto bg-white-400 p-8 px-8'>
                <h2 className='transition-all text-4xl text-greeen font-bold text-center'>
                  <img src='https://i.ibb.co/sbJnjPq/healthconnect-high-resolution-logo-transparent-1.png' alt='LOGO' className='transition-all p-8' />
                </h2>
                <div className='transition-all flex flex-col text-greeen py-2'>
                  <label>Email</label>
                  <input
                    ref={emailRef}
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={handleFieldChange('email')}
                    className={`transition-all bg-gray mt-2 p-2 border-2 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                    aria-invalid={!!errors.email}
                    aria-describedby='login-email-error'
                  />
                  {errors.email && (
                    <p id='login-email-error' className='mt-1 text-sm text-red-600 transition-all duration-200'>
                      {errors.email}
                    </p>
                  )}
                </div>
                <div className='transition-all flex flex-col text-greeen py-2'>
                  <label>Password</label>
                  <input
                    ref={passwordRef}
                    name='password'
                    type='password'
                    value={form.password}
                    onChange={handleFieldChange('password')}
                    className={`transition-all bg-gray mt-2 p-2 border-2 ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
                    aria-invalid={!!errors.password}
                    aria-describedby='login-password-error'
                  />
                  {errors.password && (
                    <p id='login-password-error' className='mt-1 text-sm text-red-600 transition-all duration-200'>
                      {errors.password}
                    </p>
                  )}
                </div>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='transition-all w-full my-5 py-2 bg-greeen shadow-lg rounded-lg shadow-green/50 hover:shadow-green-400/40 text-white font-semibold disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {isLoading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                      Logging in...
                    </span>
                  ) : (
                    'Login'
                  )}
                </button>
                <div className='lg:hidden flex justify-end'>
                  <div className='flex text-sm'>
                    <p>New Here?</p>
                    <Link to='/signup' className='ml-4'>Signup Now!</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className='transition-all image hidden lg:block '>
            <div style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${bgImage})` }} className='transition-all overflow-hidden max-w-[800px] object-contain rounded-r-xl'>
              <div className='transition-all z-10 w-[400px] h-[500px] flex justify-center items-center'>
                <div className='transition-all w-full h-full m-auto rounded-r-xl'>
                  <div className='transition-all flex flex-col justify-center h-full bg-black bg-opacity-30 p-8 rounded-r-xl'>
                    <div className='transition-all font-extrabold text-5xl font-body my-2  text-white'>New Here?</div>
                    <div className='transition-all  text-white py-1 px-1'>
                      Signup now and take the first step towards a healthier and happier you!
                    </div>
                    <Link to='/signup' className='transition-all text-center w-[25%] my-2 py-2 bg-greeen shadow-lg rounded-lg shadow-greeen/50 hover:shadow-green-400/40 text-white font-semibold'>Signup</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
