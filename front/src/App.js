import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:4001";
const socket = socketIOClient(ENDPOINT);

const Messages = props => props.data.map(m => {
  
  console.log('m', m);
  return (<li key={m}>{m}</li>)
});

const App = (props) => {
  const [response, setResponse] = useState([]);

  const handlechange = (data) => {
    setResponse(response => {
      response.push(data);
      return response;
    });
  };

  useEffect(() => {
    socket.on("chat", handlechange);
    return () => socket.disconnect();
  }, []);

  return (
    <ul>
      <Messages data={response} />
    </ul>
  );
}

export default App;