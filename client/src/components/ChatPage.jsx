import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';
import { BACKEND_CHAT_SERVER } from "../constants.js";
import Cookies from 'js-cookie';
import { IoIosArrowBack } from "react-icons/io";

const ChatAppPage = () => {

    const navigate = useNavigate();
    const [message,setMessage] = useState('');

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

        if(!(ToUsername && FromUsername)){
            navigate('/main');
        }

        socket.on("recieve-message",({ Message, usernamefrom, usernameto }) => {
            if(usernamefrom == ToUsername && usernameto == FromUsername){
                setChats(prevChats => [...prevChats, { usernamefrom, usernameto, Message }]);
            }
        })

        socket.on("recieve-Chats", ({ onlyChats }) => {
            setChats(onlyChats);
        })
        
        return () => {
            socket.disconnect();
        };
        
    },[]);

    return (
        <div className="h-svh font-serif">
            <div className="fixed w-full flex text-3xl h-16 items-center font-serif text-white bg-black z-10 border border-white shadow-md shadow-white">
                <div className="p-5 mr-9">
                    <IoIosArrowBack className="cursor-pointer" onClick={ () => { navigate('/main') } } />
                </div>
                {ToUsername}
            </div>

            <div className="fixed pt-20 pb-24 flex flex-col p-5 bg-black/95 w-full h-full overflow-y-auto border border-white">
                {
                    
                    chats.map((e,i) => {
                        if(e.usernamefrom == FromUsername){
                             return (<div className="m-1 self-end bg-gray-400 p-2 rounded-md max-w-sm md:max-w-md lg:max-w-lg" key={i}>
                                {`${e.Message}`}
                            </div>)
                        }
                        else{
                            return (<div className="m-1 self-start bg-gray-300 p-2 rounded-md max-w-sm md:max-w-md lg:max-w-lg" key={i}>
                                <div className="text- font-bold font-serif">
                                    {e.usernamefrom}
                                </div>
                                <div className="font-serif pl-1">
                                    {e.Message}
                                </div>
                            </div>)
                        }
                    })
                }

            </div>
            <form onSubmit={ (e) => {
                e.preventDefault();
                if(message){
                    io.emit("send-message",{ Message : message, usernamefrom:FromUsername, usernameto:ToUsername });
                    setChats(prevChats => [...prevChats, { usernamefrom:FromUsername, usernameto:ToUsername, Message:message }]);
                    setMessage('');
                }
            } } className="fixed bottom-0 w-full flex h-20 items-center justify-center bg-black border border-white">
                <input type="text" value={message} onChange={ (e) => { setMessage(e.target.value) } } className="shadow-sm shadow-white outline-none text-gray-200 w-full p-2 h-12 rounded-lg my-2 ml-2 mr-1 border border-white bg-black" />
                <button type="submit" className=" h-12 w-20 my-2 mr-2 ml-1 active:shadow-inner active:shadow-white shadow-sm shadow-white rounded-md border border-white text-white select-none cursor-pointer">Send</button>
            </form>
        </div>
    )
}

export default ChatAppPage;