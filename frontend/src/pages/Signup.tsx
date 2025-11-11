import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store"; // Make sure AppDispatch is exported from store
import { signup } from "../../slice/userSlice";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isSigningUp } = useSelector((state: RootState) => state.user);

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      dispatch(signup({ email, username, password }));
      navigate("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return console.log(error.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center mt-20 mx-3 ">
      <div className="w-full max-w-md p-8 space-y-6 bg-base/60 rounded-lg shadow-md">
        <h1 className="text-center text-white text-2xl font-bold mb-4">
          Sign Up
        </h1>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label htmlFor="email" className="text-sm font-medium block">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 mt-1 border rounded-md bg-transparent focus:outline-none focus:ring"
              placeholder="you@example.com"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-300 block"
            >
              Username
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 mt-1 border rounded-md bg-transparent focus:outline-none focus:ring"
              placeholder="johndoe"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium  block">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 mt-1 border rounded-md bg-transparent text-white focus:outline-none focus:ring"
              placeholder="••••••••"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="w-full py-2 bg-primary text-white font-semibold rounded-md hover:bg-red-700"
            disabled={isSigningUp}
          >
            {isSigningUp ? <Loading /> : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-gray-400">
          Already a member?{" "}
          <Link to="/login" className="text-red-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
