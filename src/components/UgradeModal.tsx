"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/AuthContext"
import { useTrialModal } from "@/contexts/TrialModalContext"
import api from "@/lib/axios"
import { Check, Clock, Zap, CreditCard, Coins } from "lucide-react"
import { useState } from "react"

export function UpgradeModal() {
  const { user } = useAuth()
  const { isModalOpen, closeModal } = useTrialModal()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpgrade = async () => {
    if (!user?.companyId) return

    setIsProcessing(true)
    try {
      const response = await api.post("/api/Subscription/paySubscription", {
        successURL: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payment/subscription-success`,
        cancelURL: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payment/cancelled`,
        companyId: user.companyId,
      })

      const { url, sessionId } = response.data

      if (url && sessionId) {
        localStorage.setItem("sid", sessionId)
        window.location.href = url
      } else {
        console.error("Invalid response format - missing url or sessionId")
      }
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCryptoPayment = async () => {
    if (!user?.companyId) return

    setIsProcessing(true)
    try {
      const response = await api.post("/api/Coinbase", {
        amount: 15,
        currency: "USD",
        companyId: user.companyId,
        // successURL: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payment/subscription-success`,
        // cancelURL: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/payment/cancelled`,
      })

      const { hosted_url, paymentId } = response.data

      if (hosted_url && paymentId) {
        localStorage.setItem("cryptoPaymentId", paymentId)
        window.location.href = hosted_url
      } else {
        console.error("Invalid crypto payment response")
      }
    } catch (error) {
      console.error("Crypto payment error:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-gradient-to-br from-[#0c9aff]/5 to-blue-50 p-6">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-[#0c9aff]/10 rounded-full flex items-center justify-center">
              <Clock className="h-8 w-8 text-[#0c9aff]" />
            </div>
            <DialogTitle className="text-xl text-center font-bold text-gray-900">
              Your Free Trial Has Expired
            </DialogTitle>
            <DialogDescription className="text-sm text-center text-gray-600 max-w-md mx-auto">
              Thanks for trying our platform! To continue enjoying all features, please upgrade to our monthly plan.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <Card className="border-2 border-[#0c9aff] shadow-lg relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-[#0c9aff] text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Recommended
              </span>
            </div>
            <CardHeader className="text-center pb-6 pt-8">
              <CardTitle className="text-2xl font-bold text-gray-900">Monthly Plan</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Continue with full access and premium support
              </CardDescription>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">$15</span>
                <span className="text-gray-600 ml-2">per month</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-[#0c9aff]" />
                <span className="text-gray-700">Unlimited platform access</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-[#0c9aff]" />
                <span className="text-gray-700">All premium features</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-[#0c9aff]" />
                <span className="text-gray-700">Priority email support</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-[#0c9aff]" />
                <span className="text-gray-700">Cancel anytime</span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-6">
              <div className="flex gap-3 w-full">
              
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={handleCryptoPayment}
                  disabled={isProcessing}
                >
                  <Coins className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Pay with Crypto"}
                </Button>
                  <Button
                  className="flex-1 bg-[#0c9aff] hover:bg-blue-700 text-white"
                  onClick={handleUpgrade}
                  disabled={isProcessing}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Pay with Card"}
                </Button>
              </div>
              {/* <Button
                variant="outline"
                className="w-full border-gray-300 hover:bg-gray-50 bg-transparent shadow-none"
                onClick={closeModal}
                disabled={isProcessing}
              >
                Maybe Later
              </Button> */}
            </CardFooter>
          </Card>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              Questions about upgrading?{" "}
              <a href="/#contact" className="text-[#0c9aff] hover:text-blue-700 font-medium">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UpgradeModal
