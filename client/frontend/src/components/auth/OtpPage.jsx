import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/auth";

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const onChangeHandler = (digit, index) => {
    if (!/^[0-9]?$/.test(digit)) return;
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    var finalOtp = otp.join("");

    if (!email) {
      navigate("/signup");
    }

    if (finalOtp.length < 6) {
      alert("Enter a 6 digit otp");
    }

    try {
      const res = await authAPI.verify({ email: email, otp: finalOtp });
      if (res.status === 200) {
        navigate("/forgot-password/reset-password", {
          state: { email: email, otp: finalOtp },
        });
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
                OTP Code Verification
              </h1>
              <div>
                <p className="text-gray-600 mb-2 text-left">
                  We have an OTP code to your email and Enter the OTP code below
                  to verify
                </p>
              </div>
            </div>
            <form
              className="space-y-4"
              autoComplete="false"
              action=""
              onSubmit={handleSubmit}
            >
              <div className="flex justify-between">
                {otp.map((digit, index) => (
                  <input
                    type="text"
                    key={index}
                    id={`otp-${index}`}
                    value={digit}
                    maxLength={1}
                    onChange={(e) => onChangeHandler(e.target.value, index)}
                    className="w-13 h-13 text-xl text-center border border-gray-400 rounded-xl focus:border-black focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[index] && index > 0) {
                        document.getElementById(`otp-${index - 1}`).focus();
                      }
                      if (e.key === "ArrowLeft" && index > 0) {
                        document.getElementById(`otp-${index - 1}`).focus();
                      }
                      if (e.key === "ArrowRight" && index < otp.length - 1) {
                        document.getElementById(`otp-${index + 1}`).focus();
                      }
                    }}
                  />
                ))}
              </div>
              <button className="flex justify-center items-center gap-2 w-full bg-black hover:bg-gray-800 text-lg font-semi-bold text-white py-3.5 rounded-lg">
                Verify OTP <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
