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

        if(socket){
            socket.on('getUsername' ,({ username }) => {
                setUsername(username);
            })
            socket.on('getUsers',({ arr }) => {
                setUsers(arr);
            })
        }
        else{
            navigate('/signin');
        }

        return () => {
            socket.disconnect();
        };

    },[])
    
    return (
        <div className="flex justify-center items-center h-svh w-svw bg-black">
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
                                    <div className="flex items-center text-white h-16 border-b p-2 border-white my-2 cursor-pointer" key={element[0]}>
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
                                                <div className="p-2 rounded-full bg-green-500">
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
        </div>
    )
}

export default MainPage;