import { ArrowRight, Mail } from "lucide-react";
import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { authAPI } from "../../api/auth";

const VerifyPage = () => {
  const navigate = useNavigate();
  const { forgotPassword } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
  });
  const [error, setError] = useState({});

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email";
    }
    setError(newErrors);

    if (Object.keys(newErrors).length > 0) return;


    try {
      const res = await authAPI.forgotPassword(formData);
      console.log(res)
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
                Forgot Password ?
              </h1>
              <div>
                <p className="text-gray-600 mb-2 text-left">
                  please enter your email and we will send an OTP code in the
                  next step to reset your password
                </p>
              </div>
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
              </div>
              <button
                className="flex justify-center items-center gap-2 w-full bg-black hover:bg-gray-800 text-lg font-semi-bold text-white py-3.5 rounded-lg"
                onClick={() => navigate("/forgot-password/otp",{state: {email: formData.email}})}
              >
                Continue <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
