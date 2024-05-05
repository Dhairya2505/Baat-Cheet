import { useEffect, useMemo, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { io } from 'socket.io-client';
import { BACKEND_CHAT_SERVER } from "../constants.js";
import Cookies from 'js-cookie';

import { useNavigate } from "react-router-dom";

const MainPage = () => {
    
    const navigate = useNavigate();
    const [users,setUsers] = useState([])
    const [username,setUsername] = useState('');
    const [blur,setBlur] = useState(false);
    const [create,setCreate] = useState(false);
    const [join,setJoin] = useState(false);

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

        if(!socket){
            navigate('/signin');   
        }

        socket.on('getUsername' ,({ username }) => {
            setUsername(username);
        })
        socket.on('getUsers',({ arr }) => {
            setUsers(arr);
        })

        return () => {
            socket.disconnect();
        };

    },[])

    const createRoom = () => {
        setBlur(!blur);
        setCreate(!create);
    }

    const joinRoom = () => {
        setBlur(!blur);
        setJoin(!join);
    }
    
    return (
        <div className="flex justify-center items-center h-svh w-svw bg-black font-serif">

            <div className="fixed flex text-white right-0 top-0 m-1">
                <div className="w-20 flex justify-center items-center border border-white rounded-sm text-lg m-3 cursor-pointer" onClick={createRoom}>
                    Create
                </div>
                <div className="w-20 flex justify-center items-center border border-white rounded-sm text-lg m-3 cursor-pointer" onClick={joinRoom}>
                    Join
                </div>
            </div>
            <div className="h-3/4 border border-white rounded-lg p-5 shadow-lg shadow-white">
                <div className="flex shadow-md shadow-white">
                    <div className="text-white">
                        <input type="text" className="h-9 p-3 w-60 outline-none bg-black border border-white rounded-l-md" />
                    </div>
                    <div className="h-9 w-9 flex justify-center border border-white rounded-r-md items-center cursor-pointer">
                        <IoSearchSharp className="invert size-5" />
                    </div>
                </div>
                <div className="h-5/6 overflow-y-auto">
                    

                    {
                        users &&
                        users.map((element,index) => {
                            if(element[0] != username){
                                return (
                                    <div className="flex items-center text-white h-16 border-b p-2 border-white my-2 cursor-pointer" key={element[0]} onClick={() => { navigate('/app',{ state : { ToUsername : element[0], FromUsername : username } }); }}>
                                        <div className="w-4/5">
                                            <div className="text-md">
                                                {element[0]}
                                            </div>
                                            <div className="text-sm pl-2">
                                                Last/new message
                                            </div>
                                        </div>
                                        {
                                            element[1] && 
                                            <div className="flex justify-center items-center left-72 w-1/5">
                                                <div className="text-xs text-black font-bold px-1 rounded-full bg-green-500">
                                                    Online
                                                </div>
                                            </div>
                                        }
                                    </div>
                                )
                            }
                        })  
                    }

                </div>
            </div>
            {
                blur && 
                <div className="fixed min-h-screen min-w-full bg-black/90 z-10">
                </div>
            }

            {
                create && blur && 
                <div className="fixed min-h-full min-w-full z-20 flex justify-center items-center">
                    <form className="flex flex-col justify-center items-center shadow-lg shadow-white border border-white rounded-md w-1/2 bg-black">
                        <input type="text" placeholder="Enter name" className="m-5 mt-10 outline-none rounded-md h-10 w-1/2 px-3 py-2 bg-black border border-white text-gray-300" />
                        <div>
                            <button className="px-2 py-1 m-2 mb-10 rounded-md border border-white hover:bg-gray-900 active:bg-gray-800 text-white select-none cursor-pointer" onClick={ (e) => {
                                e.preventDefault();
                            } }>
                                Create room
                            </button>
                            <button className="px-2 py-1 m-2 mb-10 rounded-md border border-white hover:bg-gray-900 active:bg-gray-800 text-white select-none cursor-pointer" onClick={ (e) => {
                                e.preventDefault();
                                setCreate(!create);
                                setBlur(!blur);
                            } }>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div> 
            }
            {
                join && blur && 
                <div className="fixed min-h-full min-w-full z-20 flex justify-center items-center">
                    <form className="flex flex-col justify-center items-center border border-white rounded-md w-1/2 bg-black">
                        <input type="text" placeholder="Enter room id" className="m-5 mt-10 outline-none rounded-md h-10 w-1/2 px-3 py-2 bg-black border border-white text-gray-300" />
                        <div>
                            <button className="px-2 py-1 m-2 mb-10 rounded-md border border-white hover:bg-gray-900 active:bg-gray-800 text-white select-none cursor-pointer" onClick={ (e) => {
                                e.preventDefault();
                            } }>
                                Join room
                            </button>
                            <button className="px-2 py-1 m-2 mb-10 rounded-md border border-white hover:bg-gray-900 active:bg-gray-800 text-white select-none cursor-pointer" onClick={ (e) => {
                                e.preventDefault();
                                setJoin(!join);
                                setBlur(!blur);
                            } }>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div> 
            }


        </div>
    )
}

export default MainPage;