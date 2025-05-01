// import { toast } from "sonner";
// import { useTheme } from "../components/hooks/useTheme";
// import { useBackend } from "../components/lib/BackendProvider";
// import { Github } from "lucide-react";
// import { useEffect, useState } from "react";

// export default function Home() {
//   const { theme, setTheme } = useTheme();
//   const { api } = useBackend();
//   const [userName, setUserName] = useState<string>("");

//   const callBackend = async () => {
//     const { data, error } = await api.test.get();
//     if (error) {
//       toast.error(
//         "Backend server seems to not be running. Check it's availability."
//       );
//     } else {
//       toast.success(data);
//     }
//   };

//   useEffect(() => {
//     const userName = window.localStorage.getItem("userName");

//     setUserName(userName || "Default User");
//   }, []);

//   return (
//     <div className="self-center w-full items-center justify-center flex flex-col h-screen">
//       <button
//         onClick={() => {
//           setTheme(theme === "cyberworld" ? "oatmilk" : "cyberworld");
//         }}
//         className="btn btn-square absolute top-4 right-4"
//         type="button"
//       >
//         {theme === "oatmilk" ? "🌑" : "☀️"}
//       </button>
//       <p className="text-3xl font-light tracking-tighter mb-8">Tic-WS-Toe</p>
//       <legend className="fieldset-legend">What is your name?</legend>
//       <input
//         type="text"
//         placeholder="Enter your name"
//         className="input input-bordered w-full max-w-xs mb-4"
//         onChange={(e) => {
//           setUserName(e.target.value);
//         }}
//         value={userName}
//       />
//       <button
//         className="btn btn-primary mb-4"
//         onClick={() => {
//           window.localStorage.setItem("userName", userName || "Default User");
//           callBackend();
//         }}
//       >
//         Start Game
//       </button>

//       <p className="absolute bottom-4 opacity-50">
//         Made with 🎶 by {""}
//         <a target="_blank" rel="noreferrer" href="//crqch.vercel.app/">
//           crqch
//         </a>
//       </p>
//     </div>
//   );
// }
