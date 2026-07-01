export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const passwordRules = [
  {
    key: 'length',
    label: 'At least 8 characters',
    test: (value) => value.length >= 8,
  },
  {
    key: 'uppercase',
    label: 'One uppercase letter',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    key: 'lowercase',
    label: 'One lowercase letter',
    test: (value) => /[a-z]/.test(value),
  },
  {
    key: 'number',
    label: 'One number',
    test: (value) => /[0-9]/.test(value),
  },
  {
    key: 'special',
    label: 'One special character',
    test: (value) => /[!@#$%^&*(),.?"':{}|<>]/.test(value),
  },
]

export const getPasswordValidationErrors = (password) => {
  if (!password) {
    return ['Password is required']
  }

  return passwordRules
    .filter((rule) => !rule.test(password))
    .map((rule) => rule.label)
}

export const validateSignupField = (field, value, values = {}) => {
  const trimmedValue = String(value || '').trim()

  switch (field) {
    case 'email':
      if (!trimmedValue) return 'Email is required'
      if (!EMAIL_REGEX.test(trimmedValue)) return 'Please enter a valid email address'
      return ''
    case 'username':
      return trimmedValue ? '' : 'Full Name is required'
    case 'password':
      if (!trimmedValue) return 'Password is required'
      return ''
    case 'confirmPassword':
      if (!trimmedValue) return 'Confirm Password is required'
      if (trimmedValue !== values.password) return 'Passwords do not match'
      return ''
    case 'contact':
      return trimmedValue ? '' : 'Contact is required'
    case 'role':
      return trimmedValue ? '' : 'Role is required'
    case 'expertise':
      return trimmedValue ? '' : 'Expertise is required'
    default:
      return ''
  }
}

export const validateSignupValues = (values) => {
  return {
    email: validateSignupField('email', values.email, values),
    username: validateSignupField('username', values.username, values),
    password: validateSignupField('password', values.password, values),
    confirmPassword: validateSignupField('confirmPassword', values.confirmPassword, values),
    contact: validateSignupField('contact', values.contact, values),
    role: validateSignupField('role', values.role, values),
    expertise: validateSignupField('expertise', values.expertise, values),
  }
}

export const validateLoginField = (field, value) => {
  const trimmedValue = String(value || '').trim()

  switch (field) {
    case 'email':
      if (!trimmedValue) return 'Email is required'
      if (!EMAIL_REGEX.test(trimmedValue)) return 'Please enter a valid email address'
      return ''
    case 'password':
      return trimmedValue ? '' : 'Password is required'
    default:
      return ''
  }
}

export const validateLoginValues = (values) => {
  return {
    email: validateLoginField('email', values.email),
    password: validateLoginField('password', values.password),
  }
}

export const getFirstErrorKey = (errors) => {
  return Object.keys(errors).find((key) => errors[key])
}
