import React, { useEffect } from 'react'

const InlineToast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  const bgClass = type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-rose-50 border-rose-300 text-rose-800'

  return (
    <div className={`fixed bottom-6 left-1/2 z-50 w-[min(400px,calc(100%-2rem))] -translate-x-1/2 rounded-xl border px-4 py-3 shadow-lg transition-all duration-300 ${bgClass}`}>
      <span className='text-sm font-medium'>{message}</span>
    </div>
  )
}

export default InlineToast
