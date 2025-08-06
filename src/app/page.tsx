"use client";

import { useEffect, useState } from "react";
import { Socket,io } from "socket.io-client";



export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [msg, setMsg] = useState<string>("")

  useEffect(()=>{

    const socket = io("http://localhost:3000")
    setSocket(socket)
    socket.on("chat-message", (msg)=>{
      console.log("message received: " + msg);
    })

    return () => {
      socket.disconnect();
    };
  },[])

  const sendMessage = ()=>{
    if(msg.trim()){
      socket.emit("chat-message", msg);
      console.log("message sent")
    }
  }

  return (
    <div>
      <h1>hello</h1>
      <h1>send your message</h1>
      <input type="text" value={msg} onChange={(e)=>setMsg(e.target.value)}/>
      <button onClick={sendMessage}>Send message</button>
    </div>
  );
}
