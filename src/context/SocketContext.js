import React, { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";
import { SERVER_URI } from "../theme/ServerConection";

const SocketContext = React.createContext();

export const SocketProvider = (props) => {
  const [socket,setSocket]=useState(null)
  useEffect(()=>{
    try {
      const socket = io(SERVER_URI)
      setSocket(socket)
    }catch (e){
      console.log("ERRRO DE CONEXION CON SOCKET.IO")
      console.log(e)
    }

  },[])

  const value = useMemo(() => ({
    socket
  }), [socket]);

  return <SocketContext.Provider value={value} {...props} />
}

export const useSocketContext = () => {
  const context = React.useContext(SocketContext);

  if (!context) {
    throw new Error("useNotificationContext() must be inside of NotificationProvider")
  }

  return context;
}
