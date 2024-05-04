import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import { BACKEND_CHAT_SERVER } from "../constants.js";
import Cookies from 'js-cookie';

const ChatAppPage = () => {

    const navigate = useNavigate();
    const [message,setMessage] = useState('');
    const [userNameTo,setUserNameTo] = useState('');
    const [userNameFrom,setUserNameFrom] = useState('');
    const location = useLocation();


    const socket = useMemo(() => {
        if(Cookies.get('BCC')){
            return io(`${BACKEND_CHAT_SERVER}`,{
                query : {
                    token : Cookies.get('BCC')
                }
            });
        }else{
            return '';
        }

    },[]);

    useEffect(() => {
        const { ToUsername, FromUsername } = location.state || {};
        if(ToUsername && FromUsername){
            console.log(ToUsername, FromUsername);
            setUserNameTo(ToUsername);
            setUserNameFrom(FromUsername);
        }
        else{
            navigate('/main');
        }

    })

    const sendMessage = () => {
        setMessage('');
    }

    return (
        <div className="h-svh">
            <div className="fixed w-full flex text-3xl h-16 items-center justify-center font-serif text-white bg-black z-10 border border-white shadow-md shadow-white">
                Name
            </div>

            <div className="fixed pt-20 pb-24 flex flex-col p-5 bg-black/95 w-full h-full overflow-y-auto border border-white">
                
                {/* <div className="m-1 self-end bg-gray-400 p-2 rounded-md max-w-sm md:max-w-md lg:max-w-lg" >
                    message
                </div>
                <div className="m-1 self-start bg-gray-400 p-2 rounded-md max-w-sm md:max-w-md lg:max-w-lg">
                    <div className="text- font-bold font-serif">
                        Dhairya    
                    </div>
                    <div className="font-serif pl-1">
                        Hello
                    </div>
                </div> */}
                
            </div>

            <div className="fixed bottom-0 w-full flex h-20 items-center justify-center bg-black border border-white">
                <input type="text" value={message} onChange={ e => setMessage(e.target.value) } className="shadow-sm shadow-white outline-none text-gray-200 w-full p-2 h-12 rounded-lg my-2 ml-2 mr-1 border border-white bg-black" />
                <button className=" h-12 w-20 my-2 mr-2 ml-1 active:shadow-inner active:shadow-white shadow-sm shadow-white rounded-md border border-white text-white select-none cursor-pointer" onClick={ sendMessage }>Send</button>
            </div>
        </div>
    )
}

export default ChatAppPage;