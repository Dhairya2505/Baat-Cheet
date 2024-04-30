import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SignUpPage from './components/SignUp.jsx';
import SignInPage from './components/SignIn.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
        <Route path='/' element={<SignUpPage />} />
        <Route path='/signin' element={<SignInPage />} />
    </Routes>
  </BrowserRouter>
)
