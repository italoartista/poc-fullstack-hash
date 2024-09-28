import { useState } from 'react'

import './App.css'


function App() {


  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (pass !== confirmation) {
      setError('Passwords do not match')
      return
    }
    
    try {
      const response = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, pass })
      })
      if (response.ok) {
        console.log('success')
        setSuccess(true)
        setError('')
      } else {
        setError('Signup failed')
      }

    } catch (error) {
      setError('An error occurred')
    }
  }

  return (
    <>
      <div className='w-full max-w-md mx-auto bg-red-100'>
        <form onSubmit={handleSubmit}  >
          <input 
            type="email" 
            name='email' 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            type="password" 
            name='pass' 
            value={pass} 
            onChange={(e) => setPass(e.target.value)} 
          />
          <input 
            type="password" 
            name='confirmation' 
            value={confirmation} 
            onChange={(e) => setConfirmation(e.target.value)} 
          />
          <button type="submit">Submit</button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">Signup successful!</p>}
      </div>
    </>
  )
}

export default App