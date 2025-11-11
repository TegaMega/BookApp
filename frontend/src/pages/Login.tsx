import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../store"; // Make sure AppDispatch is exported from store
import { login } from "../../slice/userSlice";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoggingIn } = useSelector((state: RootState) => state.user);

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(login({ email, password }));
    if (!isLoggingIn) {
      navigate("/");
    }
  };

  return (
    <div className="flex justify-center items-center mt-20 mx-3 ">
      <div className="w-full max-w-md p-8 space-y-6 bg-base/60 rounded-lg shadow-md">
        <h1 className="text-center  text-2xl font-bold mb-4">Login</h1>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300 block"
            >
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 mt-1 border rounded-md bg-transparent text-white focus:outline-none focus:ring"
              placeholder="you@example.com"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            disabled={isLoggingIn}
          >
            {isLoggingIn ? <Loading /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
