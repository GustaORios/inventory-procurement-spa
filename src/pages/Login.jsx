import { useState, useContext } from "react";
import { UserContext } from "../UserContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(UserContext);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password) {
      login(username, password);
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827]">
      <div className="bg-[#1f2937] p-10 rounded-lg shadow-lg w-96 border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-cyan-500 mb-8 tracking-wide">
          SATURN
        </h1>

        <form onSubmit={handleLogin} className="space-y-5 text-gray-200">
          <input
            type="text"
            placeholder="Enter your Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500"
          />
          <input
            type="password"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-500"
          />
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white font-semibold py-3 rounded-md hover:bg-cyan-500 transition"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
