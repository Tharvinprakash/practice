import { ArrowRight, Eye, EyeOff, Mail, RectangleEllipsis } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate();
  const { login,user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error,setError] = useState({});

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError((prev) => ({
      ...prev,
      [name] : ""
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if(!formData.email.trim()){
      newErrors.email = "Email is required";
    }
    else if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email"
    }

    if(!formData.password){
      newErrors.password = "Password is required";
    }
    else if(formData.password.length < 8){
      newErrors.password = "Password must be 8 characters";
    }
    console.log(error)
    setError(newErrors)

    if(Object.keys(newErrors).length > 0) return;

    try {
      const res = await login(formData);
      if(res.status === 200){
        toast.success("Login success")
      }
    } catch (error) {
      toast.error("Login Failed")
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh - 80px)]">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-gray rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-black mb-2">Login</h1>
              <p className="text-gray-600 mb-2">Login to your account</p>
            </div>
            <form
              className="space-y-4"
              autoComplete="false"
              action=""
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  className="block text-sm font-medium text-gray-600 mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="border-2 border-gray rounded-md p-2 flex justify-center focus-within:border-black">
                  <Mail color="gray" />
                  <input
                    className="w-full pl-3 pr-12 focus:border-black focus:outline-none"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="johndoe@gmail.com"
                    value={formData.email}
                    onChange={onChangeHandler}
                  />
                </div>
                  {
                    error.email && 
                    <p className="text-red-600 text-sm mt-1">{error.email}</p>
                  }
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-600 mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="border-2 border-gray rounded-md p-2 flex justify-center focus-within:border-black">
                  <RectangleEllipsis color="gray" />
                  <input
                    className="w-full pl-3 pr-12 focus:outline-none transition"
                    type={showPassword ? "password" : "text"}
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={onChangeHandler}
                  />
                  {showPassword ? (
                    <EyeOff onClick={togglePassword} className="cursor-pointer" />
                  ) : (
                    <Eye onClick={togglePassword} className="cursor-pointer" />
                  )}
                </div>
                  {
                    error.password && 
                    <p className="text-red-600 text-sm mt-1">{error.password}</p>
                  }
              </div>
              <div className="w-full h-full flex justify-end">
                <button className="text-black-600 mb-2" onClick={() => navigate("/forgot-password/verify")}>forgot password ?</button>
              </div>
              <button className="flex justify-center items-center gap-2 w-full bg-black hover:bg-gray-800 text-lg font-semi-bold text-white py-3.5 rounded-lg">
                Login <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
