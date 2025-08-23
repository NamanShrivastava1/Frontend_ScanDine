import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";


export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    const userId = localStorage.getItem("otpUserId");
    if (!userId) return alert("No user ID found");

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "https://backend-7hhj.onrender.com/api/users/verify-otp",
        { userId, otp }
      );
      alert(res.data.message);
      localStorage.removeItem("otpUserId");
      navigate("/signin");
    } catch (err: any) {
      alert(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    const userId = localStorage.getItem("otpUserId");
    if (!userId) return alert("No user ID found");

    try {
      await axios.post(
        "https://backend-7hhj.onrender.com/api/users/resend-otp",
        { userId }
      );
      alert("A new OTP has been sent to your email!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card p-6 rounded-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
        <p className="mb-4">Enter the 6-digit OTP sent to your email.</p>
        <Input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="mb-4"
        />
        <Button onClick={handleVerify} disabled={isSubmitting} className="w-full mb-2">
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </Button>
        <Button variant="ghost" onClick={handleResend} className="w-full">
          Resend OTP
        </Button>
      </div>
    </div>
  );
}
