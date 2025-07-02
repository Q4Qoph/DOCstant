"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

const PaymentCancelled = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
                <CardContent className="p-8 text-center">
                    <div className="mb-6">
                        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 animate-scale-in">
                            <X className="w-10 h-10 text-red-600 animate-fade-in" strokeWidth={3} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in">
                            Action Cancelled
                        </h1>
                        <p className="text-gray-600 leading-relaxed animate-fade-in">
                            Your action has been cancelled. No changes were made and no charges were applied.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={() => router.back()}
                            className="w-fit bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:scale-105"
                            size="lg"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                            Questions? We're here to help
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentCancelled;
