import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SignUpPage from './components/SignUp.jsx';
import SignInPage from './components/SignIn.jsx';
import MainPage from './components/MainPage.jsx';
import ChatAppPage from './components/ChatPage.jsx';
import RoomChatPage from './components/RoomChatPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
          <Route path='/' element={<SignUpPage />} />
          <Route path='/signin' element={<SignInPage />} />
          <Route path='/main' element={<MainPage />} />
          <Route path='/app' element={<ChatAppPage />} />
          <Route path='/room' element={<RoomChatPage />} />
      </Routes>
  </BrowserRouter>
)