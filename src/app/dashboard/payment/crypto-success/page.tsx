"use client";

import { Check, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const CryptoSuccess = () => {
    const router = useRouter();


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
                <CardContent className="p-8 text-center">
                    <div className="mb-6">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-scale-in">
                            <Check className="w-10 h-10 text-green-600 animate-fade-in" strokeWidth={3} />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2 animate-fade-in">Success!</h1>
                        <p className="text-gray-600 leading-relaxed animate-fade-in">
                            Your payment was successful. You can now proceed with the next steps or return to the homepage.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            onClick={() => router.push("/dashboard")}
                            className="w-fit bg-green-600 hover:bg-green-700 text-white transition-all duration-200 hover:scale-105"
                            size="lg"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Go to dashboard
                        </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Need help? Contact our support team</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CryptoSuccess;
