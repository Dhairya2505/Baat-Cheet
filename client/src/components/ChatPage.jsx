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

    const [chats,setChats] = useState([]);

    const location = useLocation();

    const { ToUsername, FromUsername } = location.state || {};

    const socket = useMemo(() => {
        if(Cookies.get('BCC')){
            return io(`${BACKEND_CHAT_SERVER}`,{
                query : {
                    token : Cookies.get('BCC'),
                    usernameTo : ToUsername
                }
            });
        }else{
            return '';
        }

    },[]);

    useEffect(() => {

        if(ToUsername && FromUsername){
            setUserNameTo(ToUsername);
            setUserNameFrom(FromUsername);
        }else{
            navigate('/main');
        }

        socket.on("recieve-message",({ Message, usernamefrom, usernameto }) => {
            setChats(prevChats => [...prevChats, { usernamefrom, usernameto, Message }]);
        })

        socket.on("recieve-Chats", ({ onlyChats }) => {
            setChats(onlyChats);
            console.log(onlyChats);
        })
        
        return () => {
            socket.disconnect();
        };
        
    },[]);
    
    const sendMessage = () => {
        socket.emit("send-message",{ Message : message, usernamefrom:userNameFrom, usernameto:userNameTo });
        setChats(prevChats => [...prevChats, { usernamefrom:userNameFrom, usernameto:userNameTo, Message:message }]);
        setMessage('');
    }

    return (
        <div className="h-svh">
            <div className="fixed w-full flex text-3xl h-16 items-center justify-center font-serif text-white bg-black z-10 border border-white shadow-md shadow-white">
                {userNameTo}
            </div>

            <div className="fixed pt-20 pb-24 flex flex-col p-5 bg-black/95 w-full h-full overflow-y-auto border border-white">
                
                {
                    chats.map((e,i) => {
                        console.log(chats);
                        if(e.usernamefrom == userNameFrom){
                            return <div className="m-1 self-end bg-gray-400 p-2 rounded-md max-w-sm md:max-w-md lg:max-w-lg" key={i}>
                                {`${e.Message}`}
                            </div>
                        }
                        else{
                            return <div className="m-1 self-start bg-gray-300 p-2 rounded-md max-w-sm md:max-w-md lg:max-w-lg" key={i}>
                                <div className="text- font-bold font-serif">
                                    {e.usernamefrom}
                                </div>
                                <div className="font-serif pl-1">
                                    {e.Message}
                                </div>
                            </div>
                        }
                    })
                }

            </div>
            <div className="fixed bottom-0 w-full flex h-20 items-center justify-center bg-black border border-white">
                <input type="text" value={message} onChange={ (e) => { setMessage(e.target.value) } } className="shadow-sm shadow-white outline-none text-gray-200 w-full p-2 h-12 rounded-lg my-2 ml-2 mr-1 border border-white bg-black" />
                <button className=" h-12 w-20 my-2 mr-2 ml-1 active:shadow-inner active:shadow-white shadow-sm shadow-white rounded-md border border-white text-white select-none cursor-pointer" onClick={ sendMessage }>Send</button>
            </div>
        </div>
    )
}

export default ChatAppPage;