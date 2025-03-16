import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="p-6 bg-white rounded shadow-lg" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Signup</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input type="text" name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border mb-2" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border mb-2" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full p-2 border mb-2" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Signup</button>
        <Link to="/login">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
        </Link>
       
      </form>
    </div>
  );
};

export default Signup;
