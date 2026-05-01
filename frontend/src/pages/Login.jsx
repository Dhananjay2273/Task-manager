import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      login(res.data.token, res.data.user); // ✅ IMPORTANT

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-64 h-64 bg-purple-500 blur-3xl opacity-30 top-10 left-10 rounded-full"></div>
      <div className="absolute w-72 h-72 bg-blue-400 blur-3xl opacity-30 bottom-10 left-20 rounded-full"></div>
      <div className="absolute w-80 h-80 bg-pink-400 blur-3xl opacity-30 right-10 top-20 rounded-full"></div>

      {/* CARD */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-[380px] p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl text-white"
      >
        <h2 className="text-center text-2xl font-semibold mb-6">
          Sign In
        </h2>

        <input
          type="email"
          required
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 outline-none"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          required
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/20 outline-none"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl">
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;