"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const { forgetPassword, isLoading } = useAuth();
    const [isSent, setIsSent] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            return toast.error("Please enter your email address");
        }

        try {
            await forgetPassword(email);
            setEmail("")
            setIsSent(true);
        } catch (error) {
            // Error handled in context
        }
    };

    return (
        <div className="w-full max-w-md p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center pb-4">
                Forgot Password
            </h2>
            <p className="text-gray-600 text-center mb-6">
                Enter your email address to receive a reset link
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email Address
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 border-gray-200"
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className={`w-full h-12 text-white flex items-center justify-center gap-2 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 ${isSent
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    disabled={isLoading || isSent}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Sending...
                        </>
                    ) : isSent ? (
                        <>
                            <Check className="h-5 w-5" />
                            Link Sent
                        </>
                    ) : (
                        "Send Reset Link"
                    )}
                </Button>

                <div className="mt-2">
                    Remembered Password?{" "}
                    <Link href="/login" className="text-blue-600 hover:underline text-sm">
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
