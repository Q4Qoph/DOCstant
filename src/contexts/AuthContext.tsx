"use client"

import { User } from '@/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';
import { ParamValue } from 'next/dist/server/request/params';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    forgetPassword: (email: string) => void;
    resetPassword: (token: ParamValue, password: string, confirmPassword: string) => Promise<void>;
    hydrating: boolean;
}
interface DecodedToken {
    name: string;
    email: string;
    role: string;
    companyId: string;
    sub: string;
    exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const queryClient = new QueryClient();

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hydrating, setHydrating] = useState(true);

    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);

                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({ id: decoded.sub, name: decoded.name, email: decoded.email, role: decoded.role, companyId: decoded.companyId });
                }
            } catch (e) {
                logout();
            }
        }
        setHydrating(false)
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await api.post(
                `/api/User/Login`,
                { email, password }
            );

            const user = response.data
            setUser({ id: user.userId, name: user.name, role: user.role, companyId: user.companyId })
            const token = user.token;

            localStorage.setItem("token", token);

            toast.success("Login Successful")
            if (user.role == "6") {
                router.push("/moderator")
            } else {
                router.push("/dashboard");
            }

        } catch (error: any) {
            const message = error.response?.data || error.message || "An unexpected error occurred";
            toast.error(`Login failed: ${message}`);

        } finally {
            setIsLoading(false);
        }
    };

    // Returns a token
    const forgetPassword = async (email: string) => {
        setIsLoading(true);
        try {
            await api.post(
                `/api/User/forgotPassword`,
                { email }
            );

            toast.success("Reset token sent! Please check your email.");
        } catch (error: any) {
            const message = error.response?.data || error.message || "An unexpected error occurred";
            toast.error(`Failed to send reset email: ${message}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    // Actual password reset
    const resetPassword = async (token: ParamValue, password: string, confirmPassword: string) => {
        setIsLoading(true);
        try {
            await api.post(
                `/api/User/resetPassword`,
                { token, password, confirmPassword }
            );
            // Clear the reset token from session storage
            toast.success("Password reset successfully!");
            router.push("/login");
        } catch (error: any) {
            const message = error.response?.data || error.message || "An unexpected error occurred";
            toast.error(`Password reset failed: ${message}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    const logout = () => {
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
        router.replace('/login')
    };

    return (
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider
                value={{ user, login, logout, isLoading, forgetPassword, resetPassword, hydrating }}>
                {children}
            </AuthContext.Provider>
        </QueryClientProvider>
    );
};