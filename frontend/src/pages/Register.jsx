import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);
      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Register failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900">

      <form
        onSubmit={handleSubmit}
        className="w-[380px] p-8 bg-white rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl text-center mb-6">Register</h2>

        <input
          placeholder="Name"
          className="w-full mb-4 p-3 border rounded"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>

        <p className="text-center mt-4">
          Already have account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;