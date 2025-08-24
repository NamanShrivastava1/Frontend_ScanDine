import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function VerifyOtp() {
  const [otp, setOtp] = useState(Array(6).fill("")); // 6 boxes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const userId = localStorage.getItem("otpUserId");
    if (!userId) return alert("No user ID found");

    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) return alert("Please enter full OTP");

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "https://backend-7hhj.onrender.com/api/users/verify-otp",
        { userId, otp: enteredOtp },
      );
      alert(res.data.message);
      localStorage.removeItem("otpUserId");
      setStatus("success");
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err: any) {
      alert(err.response?.data?.message || "OTP verification failed");
      setStatus("error");
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
        { userId },
      );
      alert("A new OTP has been sent to your email!");
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
      setStatus("idle");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-md bg-card p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-2">Verify Your Email</h2>
        <p className="mb-6 text-muted-foreground">
          Enter the 6-digit OTP sent to your email.
        </p>

        {/* OTP boxes */}
        <div className="flex justify-between mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el!)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`w-12 h-12 text-center text-lg font-semibold rounded-lg border 
                bg-background text-foreground outline-none transition
                focus:ring-2 
                ${
                  status === "success"
                    ? "border-green-500 focus:ring-green-400"
                    : status === "error"
                      ? "border-red-500 focus:ring-red-400"
                      : "border-muted focus:ring-primary"
                }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <Button
          onClick={handleVerify}
          disabled={isSubmitting}
          className="w-full mb-3"
        >
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </Button>
        <Button variant="ghost" onClick={handleResend} className="w-full">
          Resend OTP
        </Button>
      </div>
    </div>
  );
}
