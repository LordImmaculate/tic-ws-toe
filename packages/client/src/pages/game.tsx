import { useEffect, useRef, useState } from "react";

export default function Game() {
  const socketRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState({
    message: "Disconnected",
    player: 0,
    list: ["", "", "", "", "", "", "", "", ""],
    turn: 1,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000/ws");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to server");
    };

    socket.onmessage = (event) => {
      console.log("Received:", event.data);
      const data = JSON.parse(event.data);
      setStatus((prev) => ({
        ...prev,
        ...data,
      }));
      console.log("Updated status:", status.list);
    };

    socket.onclose = () => {
      console.log("Connection closed");
      if (status.turn != 0)
        setStatus((prev) => ({ ...prev, message: "Disconnected", player: 0 }));
    };

    return () => {
      socket.close();
    };
  }, []);

  const handleClick = (index: number) => {
    if (status.player < 1 || status.turn != status.player) return;
    const currentPlayer = status.player === 1 ? "x" : "o";
    const newList = [...status.list];

    if (newList[index] !== "") return; // Prevent overwriting an existing move
    newList[index] = currentPlayer;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ list: newList }));
      console.log("Sent:", newList);
    }
  };

  return (
    <div className="self-center w-full items-center justify-center flex flex-col h-screen">
      <p className="text-3xl font-light tracking-tighter mb-8">Tic-WS-Toe</p>
      <p className="text-2xl font-light tracking-tighter mb-8">
        {`Player ${status.player}`}
      </p>
      <p className="text-2xl font-light tracking-tighter mb-8">
        {status.message}
      </p>
      <div className="grid grid-cols-3 grid-rows-3">
        {status.list.map((item, index) => (
          <button
            key={index}
            type="button"
            className="border p-4 w-16 h-16 text-2xl"
            onClick={() => handleClick(index)}
          >
            {item}
          </button>
        ))}
      </div>
      {status.turn == 0 ? (
        <a href="/game" className="btn btn-primary mt-5">
          Next game
        </a>
      ) : null}
    </div>
  );
}
