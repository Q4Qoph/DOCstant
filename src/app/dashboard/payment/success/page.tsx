"use client";

import { useEffect, useState } from "react";
import { Check, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

const fetchPaymentStatus = async (sid: string) => {
  const response = await api.put(`/api/Payment/${sid}`);
  return response.data;
};

const Success = () => {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const sid = localStorage.getItem("sid");
    if (!sid) {
      router.replace("/dashboard/patients");
      return;
    }
    setSessionId(sid);
  }, [router]);

  const { data, isLoading, isError, isSuccess, status } = useQuery({
    queryKey: ["payment", sessionId],
    queryFn: () => fetchPaymentStatus(sessionId!),
    enabled: !!sessionId,
    retry: false,
  });

  // Clean up sid from localStorage once query completes
  useEffect(() => {
    if (status === "success" || status === "error") {
      localStorage.removeItem("sid");
    }
  }, [status]);

  if (!sessionId) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Verifying your payment...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
          <CardContent className="p-8 text-center">
            <h1 className="text-xl font-semibold text-red-600 mb-4">Payment verification failed</h1>
            <p className="text-gray-500 mb-6">Please contact support if you believe this is a mistake.</p>
            <Button
              onClick={() => router.push("/")}
              className="w-fit bg-red-600 hover:bg-red-700 text-white transition-all duration-200 hover:scale-105"
              size="lg"
            >
              Go back home
            </Button>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500">Need help? Contact our support team</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

export default Success;
