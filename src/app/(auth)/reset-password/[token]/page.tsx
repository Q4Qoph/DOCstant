"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader, Lock } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import Link from "next/link";

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { resetPassword, isLoading } = useAuth();

  const { token } = useParams()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (newPassword !== confirmPassword) {
        return toast.error("Passwords do not match");
      }

      if (newPassword.length < 6) {
        return toast.error("Password must be at least 6 characters long");
      }

      resetPassword(token, newPassword, confirmPassword);
      setConfirmPassword("")
      setNewPassword("")
    } catch (error) {

    }
  };

  return (
    <div className="w-full max-w-md p-8">
      <h2 className="text-3xl font-bold text-gray-800  pb-4">
        Reset Password
      </h2>
      <p className="text-gray-600 text-center mb-6">
        Enter your new password below
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-gray-700 font-medium">
            New Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10 pr-10 h-12 bg-blue-50 border-gray-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password" className="text-gray-700 font-medium">
            Confirm Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10 h-12 bg-blue-50 border-gray-200"
              required
            />
          </div>
        </div>
        <div className="mt-2">
          Remembered Password?{" "}
          <Link href="/login" className="text-[#0c9aff] hover:underline text-sm">
            Login
          </Link>
        </div>
        <Button
          type="submit"
          className="w-full h-12 bg-[#0c9aff] hover:bg-blue-500 text-white flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader className="h-5 w-5 animate-spin" />
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </Button>

      </form>
    </div>
  );
};

export default ResetPasswordForm;
