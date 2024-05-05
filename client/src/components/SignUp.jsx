import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { passwordStrength } from 'check-password-strength'
import axios from 'axios';
import { BACKEND_URI } from "../constants";

const SignUpPage = () => {

    const navigate = useNavigate();

    const [email,setEmail] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [confirmPassword,setconfirmPassword] = useState('');
    const [seePassword,setSeePassword] = useState(false);
    const [seeConfirmPassword,setSeeConfirmPassword] = useState(false);
    const [error,setError] = useState('');
    const [loading,setLoading] = useState('');

    const submitDetails = async () => {
        setError('');
        setLoading(true);

        if(!username){
            setError('*Username required');
            setLoading(false);
            return;
        }
        else if(!email){
            setError('*Email required');
            setLoading(false);
            return;
        }
        else if(!password){
            setError('*Password required');
            setLoading(false);
            return;
        }
        else if(password !== confirmPassword){
            setError('*Passwords do not match');
            setLoading(false);
            return;
        }
        else if(! passwordStrength(password).id || passwordStrength(password).id === 1){
            setError('*Weak password');
            setLoading(false);
            return;
        }

        const res = await axios.post(`${BACKEND_URI}/signup`,{
            username : username,
            email : email,
            password : password
        },{
            withCredentials : true
        })
        if(res.data.statusCode == 409){
            setLoading(false);
            setError(`*${res.data.message}`);
            return;
        }
        else{
            setLoading(false);
            navigate(`/main`);
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-black text-white font-serif">
            <div className="container bg-black border-white border rounded-lg shadow-lg shadow-white mt-5 mx-auto px-5 py-10 w-80">
                <h1 className="flex justify-center text-3xl font-bold mb-5 select-none">Sign Up</h1>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-2 select-none ml-3 cursor-pointer">Email Address</label>
                        <input type="email" id="email" value={email} className="rounded-md w-full px-3 py-2 bg-black border border-white text-gray-300" onChange={ e => setEmail(e.target.value) } />
                </div>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium mb-2 select-none ml-3 cursor-pointer">Username</label>
                    <input type="text" id="username" value={username} className="rounded-md w-full px-3 py-2 bg-black border border-white text-gray-300" onChange={ e => setUsername(e.target.value) } />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium mb-2 select-none ml-3 cursor-pointer">Password</label>
                    <div className="flex">
                        <input type={seePassword ? `text` : `password`} id="password" value={password} className="rounded-md w-5/6 px-3 py-2 bg-black border border-white text-gray-300" onChange={ e => setPassword(e.target.value) } />
                        {
                            seePassword ?
                            <FaEyeSlash className="p-2 px-3 size-11 w-1/6 border border-white rounded-md cursor-pointer" onClick={ () => setSeePassword(!seePassword) } /> :
                            <FaEye className="p-2 px-3 size-11 w-1/6 border border-white rounded-md cursor-pointer" onClick={ () => setSeePassword(!seePassword) } />
                        }
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="confirm-password" className="block text-sm font-medium mb-2 select-none ml-3 cursor-pointer">Confirm Password</label>
                    <div className="flex">
                        <input type={seeConfirmPassword ? `text` : `password`} id="confirm-password" value={confirmPassword} className="rounded-md w-5/6 px-3 py-2 bg-black border border-white text-gray-300" onChange={ e => setconfirmPassword(e.target.value) } />
                        {
                            seeConfirmPassword ?
                            <FaEyeSlash className="p-2 px-3 size-11 w-1/6 border border-white rounded-md cursor-pointer" onClick={ () => setSeeConfirmPassword(!seeConfirmPassword) } /> : 
                            <FaEye className="p-2 px-3 size-11 w-1/6 border border-white rounded-md cursor-pointer" onClick={ () => setSeeConfirmPassword(!seeConfirmPassword) } />
                        }
                    </div>
                </div>

                <div className="flex justify-center items-center text-red-500 font-bold select-none">
                    {error}
                    &nbsp;
                </div>

                <div className="flex justify-center mt-6">
                    <button className="w-52 px-4 py-2 rounded-md border border-white hover:bg-gray-900 active:bg-gray-800 text-white select-none cursor-pointer" onClick={submitDetails} >{loading ? `Loading ...` : `Sign Up`}</button>
                </div>
            </div>
            <div className="flex justify-center select-none mt-6">
                Already a user? &nbsp; <span className="text-gray-400 active:text-gray-500 cursor-pointer" onClick={ () => navigate('/signin') }>SignIn</span>
            </div>
        </div>
    )
}

export default SignUpPage;