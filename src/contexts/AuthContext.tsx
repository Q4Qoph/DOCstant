"use client"

import { User } from '@/types';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    resetPassword: (password: string) => void;
}
interface DecodedToken {
    name: string;
    email: string;
    role: string;
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
    const [departmentUsers, setDepartmentUsers] = useState<Record<string, User[]>>({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);

                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    console.log(decoded)
                    setUser({ id: decoded.sub, name: decoded.name, email: decoded.email, role: decoded.role });
                }
            } catch (e) {
                logout(); // Invalid token
            }
        }
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await api.post(
                `/api/User/Login`,
                { email, password }
            );

            // const user = response.data.user;
            const token = response.data.token;

            localStorage.setItem("token", token);

            toast.success("Login Successful")
            router.push("/dashboard");

            // if (user.firstTimeLogin) {
            //     router.push(`/auth/reset-password`);
            // } else {
            //     toast.success("Login Successful")
            //     router.push("/dashboard");
            // }
        } catch (error: any) {
            const message = error.response?.data || error.message || "An unexpected error occurred";
            toast.error(`Login failed: ${message}`);

        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (newPassword: string) => {

    }
    const logout = () => {
        setUser(null);
        localStorage.clear();
        router.replace('/login')
    };

    return (
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ user, login, logout, isLoading, resetPassword }}>
                {children}
            </AuthContext.Provider>
        </QueryClientProvider>
    );
};