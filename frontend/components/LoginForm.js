import React, { useState } from 'react'
import PT from 'prop-types'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const initialFormValues = {
  username: '',
  password: '',
}
export default function LoginForm({login}) {
  const [values, setValues] = useState(initialFormValues)
  


  // ✨ where are my props? Destructure them here

  const navigate = useNavigate()

  const onChange = evt => {
    const { id, value } = evt.target
    setValues({ ...values, [id]: value });
  }

  const onFormSubmit = evt => { 
    evt.preventDefault();
    login(values)

}

  const isDisabled = (username,password) => {
    const trimmedUserName = username.trim();
    const trimmedPassword = password.trim ();
    
    return trimmedUserName.length < 3 || trimmedPassword < 8;
    // ✨ implement
    // Trimmed username must be >= 3, and
    // trimmed password must be >= 8 for
    // the button to become enabled
  }
 
  return (
    <form id="loginForm" onSubmit={onFormSubmit}>
      <h2>Login</h2>
      <input
        maxLength={20}
        value={values.username}
        onChange={onChange}
        placeholder="Enter username"
        id="username"
      />
      <input
        maxLength={20}
        value={values.password}
        onChange={onChange}
        placeholder="Enter password"
        id="password"
      />


      <button disabled={isDisabled(values.username,values.password)} id="submitCredentials">Submit credentials</button>
    </form>
  )
}

// 🔥 No touchy: LoginForm expects the following props exactly:
LoginForm.propTypes = {
  login: PT.func.isRequired
}
