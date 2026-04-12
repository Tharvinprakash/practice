import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  RectangleEllipsis,
} from "lucide-react";
import { useState } from "react";
import { authAPI } from "../../api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state;
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [error, setError] = useState({});

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      error.confirmPassword = "Password and confirm password must be same";
    }

    try {
      const res = await authAPI.resetPassword({
        email: email,
        otp: otp,
        password: formData.confirmPassword,
      });
      if (res.status === 200) {
        toast.success("Password updated")
      }
      console.log(res);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center px-4 py-12 min-h-[calc(100vh - 80px)]">
        <div className="w-full max-w-md">
          <div className="bg-white border-2 border-gray rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-black mb-2">
                Reset Password
              </h1>
              <p className="text-gray-600 mb-2">Set new password</p>
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
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="border-2 border-gray rounded-md p-2 flex justify-center focus-within:border-black">
                  <RectangleEllipsis color="gray" />
                  <input
                    className="w-full pl-3 pr-12 focus:border-black focus:outline-none"
                    type={showPassword.password ? "password" : "text"}
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={onChangeHandler}
                  />
                  {showPassword.password ? (
                    <EyeOff
                      onClick={() => togglePassword("password")}
                      className="cursor-pointer"
                    />
                  ) : (
                    <Eye
                      onClick={() => togglePassword("password")}
                      className="cursor-pointer"
                    />
                  )}
                </div>
                {error.password && (
                  <p className="text-red-600 text-sm mt-1">{error.password}</p>
                )}
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-gray-600 mb-2"
                  htmlFor="cfm_password"
                >
                  Confirm Password
                </label>
                <div className="border-2 border-gray rounded-md p-2 flex justify-center focus-within:border-black">
                  <LockKeyhole color="gray" />
                  <input
                    className="w-full pl-3 pr-12 focus:outline-none transition"
                    type={showPassword.confirmPassword ? "password" : "text"}
                    name="confirmPassword"
                    id="cfm_password"
                    placeholder="Enter your confirm password"
                    value={formData.confirmPassword}
                    onChange={onChangeHandler}
                  />
                  {showPassword.confirmPassword ? (
                    <EyeOff
                      onClick={() => togglePassword("confirmPassword")}
                      className="cursor-pointer"
                    />
                  ) : (
                    <Eye
                      onClick={() => togglePassword("confirmPassword")}
                      className="cursor-pointer"
                    />
                  )}
                </div>
                {error.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">
                    {error.confirmPassword}
                  </p>
                )}
              </div>
              <button className="flex justify-center items-center gap-2 w-full bg-black hover:bg-gray-800 text-lg font-semi-bold text-white py-3.5 rounded-lg">
                Reset Password <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
