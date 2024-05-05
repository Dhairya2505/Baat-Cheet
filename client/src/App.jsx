import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SignUpPage from './components/SignUp.jsx';
import SignInPage from './components/SignIn.jsx';
import MainPage from './components/MainPage.jsx';
import ChatAppPage from './components/ChatPage.jsx';

export default function App(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<SignUpPage />} />
                <Route path='/signin' element={<SignInPage />} />
                <Route path='/main' element={<MainPage />} />
                <Route path='/app' element={<ChatAppPage />} />
            </Routes>
        </BrowserRouter>
    )
}