import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';
import InlineToast from './InlineToast';
import {
  validateSignupField,
  validateSignupValues,
  getFirstErrorKey,
  getPasswordValidationErrors,
} from '../utils/validation';

const initialForm = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  contact: '',
  role: '',
  expertise: '',
};

const SignupPage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successToast, setSuccessToast] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { signup, isLoading } = useSignup();

  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const contactRef = useRef(null);
  const roleRef = useRef(null);
  const expertiseRef = useRef(null);

  const fieldRefs = {
    email: emailRef,
    username: usernameRef,
    password: passwordRef,
    confirmPassword: confirmPasswordRef,
    contact: contactRef,
    role: roleRef,
    expertise: expertiseRef,
  };

  const focusField = (field) => {
    fieldRefs[field]?.current?.focus();
  };

  const handleFieldChange = (field) => (event) => {
    const value = event.target.value;
    const nextForm = { ...form, [field]: value };
    const fieldError = validateSignupField(field, value, nextForm);

    setForm(nextForm);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));

    if (field === 'password' && nextForm.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateSignupField('confirmPassword', nextForm.confirmPassword, nextForm),
      }));
    }

    if (field === 'confirmPassword') {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: fieldError,
      }));
    }
  };

  const mapSignupError = (message) => {
    const newErrors = {}
    if (message.includes('Email already in use')) {
      newErrors.email = 'An account with this email already exists.'
    } else if (message.includes('Password not strong enough')) {
      const missing = getPasswordValidationErrors(form.password).filter((m) => m !== 'Password is required')
      newErrors.password = missing.length ? missing.join(', ') : 'Password is not strong enough.'
    } else if (message.includes('Email not valid')) {
      newErrors.email = 'Please enter a valid email address'
    } else if (message.includes('Username already in use')) {
      newErrors.username = 'User name already in use'
    } else if (message.includes('Contact already in use')) {
      newErrors.contact = 'Contact already in use'
    } else if (message.includes('All fields must be filled')) {
      return validateSignupValues(form)
    } else {
      newErrors.email = message
    }
    return newErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const fieldErrors = validateSignupValues(form);
    const passwordMissing = form.password ? getPasswordValidationErrors(form.password).filter((msg) => msg !== 'Password is required') : [];

    if (passwordMissing.length) {
      fieldErrors.password = passwordMissing.join(', ');
    }

    setErrors(fieldErrors);

    const firstError = getFirstErrorKey(fieldErrors);
    if (firstError) {
      focusField(firstError);
      return;
    }

    try {
      await signup(form);
      setSuccessToast('Account created successfully. Redirecting to your dashboard...');
      setForm(initialForm);
      setErrors({});
      setTimeout(() => {
        setSuccessToast('');
        navigate('/');
      }, 1200);
    } catch (error) {
      const backendErrors = mapSignupError(error.message || 'Signup failed');
      setErrors((prev) => ({ ...prev, ...backendErrors }));
      const firstBackendError = getFirstErrorKey(backendErrors)
      if (firstBackendError) {
        focusField(firstBackendError);
      }
    }
  };

  const passwordMissing = form.password ? getPasswordValidationErrors(form.password).filter((msg) => msg !== 'Password is required') : [];

  return (
    <div>
      <InlineToast message={successToast} type='success' onClose={() => setSuccessToast('')} />
      <div className='transition-all w-4/5 m-auto'>
        <div className='transition-all flex justify-center items-center'>
          <div className='transition-all max-w-auto shadow-2xl bg-white flex justify-center rounded-xl lg:rounded-l-xl lg:rounded-r-none'>
            <div>
              <form onSubmit={handleSubmit} className='transition-all w-[400px] min-h-[560px] mx-auto bg-white-400 p-8 px-8'>
                <h2 className='transition-all text-4xl py-0.1 text-greeen font-bold text-center'>
                  <img src='https://i.ibb.co/sbJnjPq/healthconnect-high-resolution-logo-transparent-1.png' alt='LOGO' className='transition-all p-2' />
                </h2>

                <div className='transition-all flex flex-col text-greeen py-1'>
                  <label className='text-sm'>Email</label>
                  <input
                    ref={emailRef}
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={handleFieldChange('email')}
                    className={`transition-all bg-gray mt-1 p-1.5 text-sm border-2 ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                    aria-invalid={!!errors.email}
                    aria-describedby='signup-email-error'
                  />
                  {errors.email && (
                    <p id='signup-email-error' className='mt-1 text-sm text-red-600 transition-all duration-200'>
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className='transition-all flex flex-col text-greeen py-0.1'>
                  <label className='text-sm'>Full Name</label>
                  <input
                    ref={usernameRef}
                    name='username'
                    type='text'
                    value={form.username}
                    onChange={handleFieldChange('username')}
                    className={`transition-all bg-gray mt-1 p-1.5 text-sm border-2 ${errors.username ? 'border-red-500' : 'border-slate-300'}`}
                    aria-invalid={!!errors.username}
                    aria-describedby='signup-username-error'
                  />
                  {errors.username && (
                    <p id='signup-username-error' className='mt-1 text-sm text-red-600 transition-all duration-200'>
                      {errors.username}
                    </p>
                  )}
                </div>

                <div className='transition-all flex flex-col text-greeen py-0.1'>
                  <label className='text-sm'>Password</label>
                  <div className='relative'>
                    <input
                      ref={passwordRef}
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={handleFieldChange('password')}
                      className={`transition-all bg-gray mt-1 p-1.5 pr-10 text-sm border-2 w-full ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
                      aria-invalid={!!errors.password}
                      aria-describedby='signup-password-error signup-password-rules'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword((prev) => !prev)}
                      className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-600'
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && !form.password && (
                    <p id='signup-password-error' className='mt-1 text-sm text-red-600 transition-all duration-200'>
                      {errors.password}
                    </p>
                  )}
                  {passwordMissing.length > 0 && (
                    <ul id='signup-password-rules' className='mt-2 space-y-1 text-sm text-rose-600'>
                      {passwordMissing.map((requirement) => (
                        <li key={requirement} className='before:content-["•"] before:text-rose-600 before:mr-2'>
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className='transition-all flex flex-col text-greeen py-0.1'>
                  <label className='text-sm'>Confirm Password</label>
                  <div className='relative'>
                    <input
                      ref={confirmPasswordRef}
                      name='confirmPassword'
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={form.confirmPassword}
                      onChange={handleFieldChange('confirmPassword')}
                      className={`transition-all bg-gray mt-1 p-1.5 pr-10 text-sm border-2 w-full ${errors.confirmPassword ? 'border-red-500' : 'border-slate-300'}`}
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby='signup-confirm-password-error'
                    />
                    <button
                      type='button'
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-600'
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p id='signup-confirm-password-error' className='mt-1 text-sm text-red-600 transition-all duration-200'>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className='transition-all flex flex-col text-greeen py-0.1'>
                  <label className='text-sm'>Contact</label>
                  <input
                    ref={contactRef}
                    name='contact'
                    type='tel'
                    inputMode='numeric'
                    maxLength={10}
                    value={form.contact}
                    onChange={(event) => {
                      const digitsOnly = event.target.value.replace(/\D/g, '').slice(0, 10);
                      handleFieldChange('contact')({ target: { value: digitsOnly } });
                    }}
                    className={`transition-all bg-gray mt-1 p-1.5 text-sm border-2 ${errors.contact ? 'border-red-500' : 'border-slate-300'}`}
                    aria-invalid={!!errors.contact}
                    aria-describedby='signup-contact-error'
                  />
                  {errors.contact && (
                    <p id='signup-contact-error' className='mt-1 text-sm text-red-600 transition-all duration-200'>
                      {errors.contact}
                    </p>
                  )}
                </div>

                <div className='transition-all flex flex-row justify-between'>
                  <div className='transition-all flex flex-col text-greeen py-0.1 w-[45%]'>
                    <label className='text-sm'>Role</label>
                    <select
                      ref={roleRef}
                      name='role'
                      value={form.role}
                      onChange={handleFieldChange('role')}
                      className={`transition-all bg-gray mt-1 p-1.5 text-sm border-2 ${errors.role ? 'border-red-500' : 'border-slate-300'}`}
                      aria-invalid={!!errors.role}
                      aria-describedby='signup-role-error'
                    >
                      <option value='' disabled>
                        Select Role
                      </option>
                      <option value='Patient'>Patient</option>
                      <option value='Doctor'>Doctor</option>
                    </select>
                    {errors.role && (
                      <p id='signup-role-error' className='mt-1 text-sm text-red-600 transition-all duration-200'>
                        {errors.role}
                      </p>
                    )}
                  </div>
                  <div className='transition-all flex flex-col text-greeen py-0.1 w-[45%]'>
                    <label className='text-sm'>Expertise</label>
                    <select
                      ref={expertiseRef}
                      name='expertise'
                      value={form.expertise}
                      onChange={handleFieldChange('expertise')}
                      className={`transition-all bg-gray mt-1 p-1.5 text-sm border-2 ${errors.expertise ? 'border-red-500' : 'border-slate-300'}`}
                      aria-invalid={!!errors.expertise}
                      aria-describedby='signup-expertise-error'
                    >
                      <option value='' disabled>
                        Select Expertise
                      </option>
                      <option value='Cardiology'>Cardiology</option>
                      <option value='Oncology'>Oncology</option>
                      <option value='Neurology'>Neurology</option>
                      <option value='Orthopedics'>Orthopedics</option>
                      <option value='Pediatrics'>Pediatrics</option>
                      <option value='Physician'>Physician</option>
                      <option value='N/A'>N/A</option>
                    </select>
                    {errors.expertise && (
                      <p id='signup-expertise-error' className='mt-1 text-sm text-red-600 transition-all duration-200'>
                        {errors.expertise}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type='submit'
                  disabled={isLoading}
                  className='transition-all w-full my-5 py-1 bg-greeen shadow-lg rounded-lg shadow-green/50 hover:shadow-green-400/40 text-white font-semibold disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {isLoading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                      Creating account...
                    </span>
                  ) : (
                    'SIGNUP'
                  )}
                </button>

                <div className='lg:hidden flex justify-end'>
                  <div className='flex text-sm'>
                    <p>Already a Member?</p>
                    <Link to='/login' className='ml-4'>LOGIN!</Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className='transition-all image hidden lg:block '>
            <div style={{ backgroundImage: 'url("https://source.unsplash.com/400x500/?health")' }} className='transition-all overflow-hidden max-w-[800px] object-contain rounded-r-xl'>
              <div className='transition-all z-10 w-[400px] h-[500px] flex justify-center items-center'>
                <div className='transition-all w-full h-full m-auto rounded-r-xl'>
                  <div className='transition-all flex flex-col justify-center h-full bg-black bg-opacity-30 p-8 rounded-r-xl'>
                    <div className='transition-all font-extrabold font-body text-5xl my-2 text-white'>Already a member?</div>
                    <div className='transition-all text-white py-1 px-1'>
                      Login now and take the first step towards a healthier and happier you!
                    </div>
                    <Link to='/login' className='transition-all text-center w-[25%] my-2 py-2 bg-greeen shadow-lg rounded-lg shadow-greeen/50 hover:shadow-green-400/40 text-white font-semibold'>LOGIN</Link>
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

export default SignupPage;
