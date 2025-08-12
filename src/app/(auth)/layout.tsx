"use client"

import type { ReactNode } from "react"
import { Shield, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const AuthLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-bl from-blue-50 via-blue-50 to-blue-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/20"></div>
                <div className="relative z-10 flex flex-col justify-center items-center p-12 text-slate-800">
                    <div className="text-center mb-8">
                        <Link href="/">
                        <div className="flex items-center justify-center mb-6">
                            <Image src="/logo.png" alt="HIMS Logo" width={200} height={32} />
                        </div>
                        </Link>
                        <h1 className="text-4xl font-bold mb-4 text-slate-900">
                            Hospital Information
                            <br />
                            Management System
                        </h1>
                        <p className="text-xl text-slate-600 mb-8">Streamlining healthcare operations for better patient care</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 max-w-md">
                        <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-blue-100">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Secure & Reliable</h3>
                                <p className="text-sm text-slate-600">HIPAA compliant data protection</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-blue-100">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Role-Based Access</h3>
                                <p className="text-sm text-slate-600">Customized for every healthcare role</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subtle decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full -translate-y-48 translate-x-48"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200/20 rounded-full translate-y-32 -translate-x-32"></div>
                <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-300/10 rounded-full"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">{children}</div>
        </div>
    )
}

export default AuthLayout
