import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async ({ email, password, username, role, expertise, contact }) => {
    setIsLoading(true)

    const response = await fetch('/api/user/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role, expertise, contact, username }),
    })

    const json = await response.json()
    setIsLoading(false)

    if (!response.ok) {
      throw new Error(json.error || 'Signup failed')
    }

    localStorage.setItem('user', JSON.stringify(json))
    dispatch({ type: 'LOGIN', payload: json })

    return json
  }

  return { signup, isLoading }
}