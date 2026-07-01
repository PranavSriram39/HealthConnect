import { useState } from 'react'

export const useDelete = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
//   const user = localStorage.getItem('email')

  const Delete = async (email) => {
    setIsLoading(true)
    setError(null)
    console.log(email)

    const response = await fetch('/api/user/delete', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ email })
    })
    const json = await response.json()

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      // update loading state
      setIsLoading(false)
    }
  }

  return { Delete, isLoading, error }
}