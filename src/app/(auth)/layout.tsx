"use client"

import { ReactNode } from 'react';
import { Shield, User } from 'lucide-react';
import Image from 'next/image';

const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-6">
                            <Image src="/logo.png" alt="HIMS Logo" width={200} height={32} />
                        </div>
                        <h1 className="text-4xl font-bold mb-4">
                            Hospital Information
                            <br />
                            Management System
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Streamlining healthcare operations for better patient care
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 max-w-md">
                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <Shield className="h-8 w-8 text-blue-200" />
                            <div>
                                <h3 className="font-semibold">Secure & Reliable</h3>
                                <p className="text-sm text-blue-100">HIPAA compliant data protection</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <User className="h-8 w-8 text-blue-200" />
                            <div>
                                <h3 className="font-semibold">Role-Based Access</h3>
                                <p className="text-sm text-blue-100">Customized for every healthcare role</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;