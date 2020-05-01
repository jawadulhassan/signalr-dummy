import React, { useState, useEffect } from "react";
import "./App.css";
import * as signalR from "@microsoft/signalr";

const App = () => {
  // Builds the SignalR connection, mapping it to /chat
  const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://167.86.94.72:44385/tickers")
    .configureLogging(signalR.LogLevel.Information)
    .build();

  console.log({hubConnection});
  // Starts the SignalR connection
  hubConnection.start().then((a) => {
    // Once started, invokes the sendConnectionId in our ChatHub inside our ASP.NET Core application.
    if (hubConnection.connectionId) {
      hubConnection.invoke("sendConnectionId", hubConnection.connectionId);
    }
  });

  const SignalRTime = () => {
    // Sets the time from the server
    const [time, setTime] = useState(null);

    useEffect(() => {
      hubConnection.on("setTime", (message) => {
        setTime(message);
      });
    });

    return <p>The time is {time}</p>;
  };

  const SignalRClient = () => {
    // Sets a client message, sent from the server
    const [clientMessage, setClientMessage] = useState(null);

    useEffect(() => {
      hubConnection.on("setClientMessage", (message) => {
        setClientMessage(message);
      });
    });

    return <p>{clientMessage}</p>;
  };

  return (
    <>
      <SignalRTime />
      <SignalRClient />
    </>
  );
};

export default App;
