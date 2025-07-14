"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

const ResetPasswordForm = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState<'email' | 'password'>('email');
    const [resetToken, setResetToken] = useState('');
    const { forgetPassword, resetPassword, isLoading } = useAuth();

    useEffect(() => {
        // Check if there's already a reset token in session storage
        const token = sessionStorage.getItem("resetToken");
        if (token) {
            setResetToken(token);
            setStep('password');
        }
    }, []);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            return toast.error("Please enter your email address");
        }

        try {
            // await forgetPassword(email);
            // // Get the token from session storage after successful email submission
            // const token = sessionStorage.getItem("resetToken");
            // if (token) {
            //     setResetToken(token);
            //     setStep('password');
            // }

            const response = await forgetPassword(email);
            if (response.data && response.data.length > 0) {
                const resetToken = response.data[0].passwordResetToken;
                if (resetToken) {
                    sessionStorage.setItem("resetToken", resetToken);
                    toast.success("Reset token sent! Please check your email.");
                } else {
                    toast.error("No reset token received. Please try again.");
                }
            }
        } catch (error) {
            // Error is handled in the forgetPassword function
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (newPassword.length < 6) {
            return toast.error("Password must be at least 6 characters long");
        }

        try {
            await resetPassword(resetToken, newPassword, confirmPassword);
            // Navigation to login is handled in the resetPassword function
        } catch (error) {
            // Error is handled in the resetPassword function
        }
    };

    const handleBackToEmail = () => {
        setStep('email');
        setNewPassword('');
        setConfirmPassword('');
        setResetToken('');
        sessionStorage.removeItem("resetToken");
    };

    return (
        <div className="w-full max-w-md">
            <div className="w-full max-w-md p-8">
                <div className="text-center pb-8 pt-8">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {step === 'email' ? 'Forgot Password' : 'Reset Password'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {step === 'email' 
                            ? 'Enter your email address to receive a reset link'
                            : 'Enter your new password below'
                        }
                    </p>
                </div>

                {step === 'email' ? (
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-medium">
                                Email Address
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handlePasswordSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="new-password" className="text-gray-700 font-medium">
                                New Password
                            </Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="new-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    id="confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                type="submit"
                                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBackToEmail}
                                className="w-full h-12 text-gray-600 border-gray-300 hover:bg-gray-50"
                                disabled={isLoading}
                            >
                                Back to Email
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordForm;