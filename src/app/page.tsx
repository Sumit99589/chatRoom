"use client";

import { useEffect, useState } from "react";
import { Socket,io } from "socket.io-client";


export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [msg, setMsg] = useState<string>("")
  const [room, setRoom] = useState<string>("")
  const [newRoom, setNewRoom] = useState<string>("")
  const [isPrivate, setIsPrivate] = useState<Boolean>(false)
  const [password, setPassword] = useState<string>("")

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

  async function joinRoom() {
    try {
      const response = await fetch(`http://localhost:3000/rooms/joinRoom/${room}`);

      if (!response.ok) {
        console.log("Room not found");
        return;
      }

      const data = await response.json();
      console.log(data);

    } catch (error) {
      console.error("Error fetching room:", error);
    }
  }

  async function createRoom(){
    try {
        const res = await fetch(`http://localhost:3000/rooms/createRoom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "name": newRoom,
          "isPrivate": isPrivate,
          "password" : password
        })
      }).then(res=>res.json())
      .then(data => console.log(data))
      console.log("Room Created");

    } catch (error) {
      console.log("Error creating room: ", error)
    }
  }


  return (
    <div>
      <h1>hello</h1>
      <h1>send your message</h1>
      <input className= "border border-black" type="text" value={msg} onChange={(e)=>setMsg(e.target.value)}/>
      <button onClick={sendMessage}>Send message</button>
      <br />
      <div>
        <input className= "border border-black" type="text" value={room} onChange={(e)=>setRoom(e.target.value)}/>
        <button onClick={joinRoom}>Join Room</button>
        <br />
        <div className="flex flex-col">
        <h1>Create a custom Room </h1>
        <h1>Enter Room name</h1>
        <input className= "border border-black" type="text" value={newRoom} onChange={(e)=>setNewRoom(e.target.value)}/>  
        <div className="flex">
          <h1>Want a private Room ?</h1>
        {isPrivate ? 
        (
          <h1>I want a private room</h1>
        ):(
          <h1>I don't want a private room</h1>
        )}
        <button className="p-4 m-3 bg-black text-white rounded-xl" onClick={()=>setIsPrivate(true)}>yes</button>
        <button className="p-4 m-3 bg-black text-white rounded-xl" onClick={()=>setIsPrivate(false)}>no</button>
        </div>
        <h1>Enter the password to ur private room</h1>
        <input className= "border border-black" type="text" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        <button onClick={createRoom}>Create Room</button>
        </div>
      </div>
    </div>
  );
}
