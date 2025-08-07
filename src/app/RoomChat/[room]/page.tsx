"use client";
import { useEffect, useState } from "react";
import { Socket,io } from "socket.io-client";

interface Props {
    params:{
        room : string
    }
}

export default function RoomChat({params} : Props){
    const {room} = params;
    const [msg, setMsg] = useState<string>("")
    const [messages, setMessages] = useState<string[]>([])
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(()=>{
    
        const socket = io("http://localhost:3000")
        
        setSocket(socket)

        socket.on("connect", ()=>{

            if (room.trim()) {
                socket.emit("join-room", room);
                console.log("Joining room:", room);
            }

            socket.on("chat-message", (msg)=>{
              console.log("message received: " + msg);
              setMessages((prev)=>[...prev, msg]);

            })

            socket.on("joined", (msg)=>{
                console.log("The user has joined room " + msg)
            })

            socket.on("newUser",(id)=>{
                console.log("A new user has joined the room. User id : "+ id)
            })
        })

        return () => {
          socket.disconnect();
        };
      },[])
    
    const sendMessage = ()=>{
        if(msg.trim()){
            socket.emit("chat-message", {
                roomName: room,
                msg : msg,
            });
            console.log("message sent")
            setMessages((prev)=>[...prev, msg])
        }
    } 

    return(
        <div>
            <h1>send your message</h1>
            <input className= "border border-black" type="text" value={msg} onChange={(e)=>setMsg(e.target.value)}/>
            <button onClick={sendMessage}>Send message</button>
            <h1 className="text-2xl">Messages</h1>
            <div>
                {messages.map((m, i) => (
                  <p key={i}>{m}</p>
                ))}
            </div>
        </div>
    )
}