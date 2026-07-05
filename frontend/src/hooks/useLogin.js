import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { apiUrl } from '../utils/api'

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setIsLoading(true)

    const response = await fetch(apiUrl('/api/user/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const json = await response.json()
    setIsLoading(false)

    if (!response.ok) {
      throw new Error(json.error || 'Login failed')
    }

    localStorage.setItem('user', JSON.stringify(json))
    dispatch({ type: 'LOGIN', payload: json })

    return json
  }

  return { login, isLoading }
}