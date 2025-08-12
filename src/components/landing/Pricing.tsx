import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-gray-50" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose the plan that works best for you. Start with our free trial and upgrade when you're ready.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Trial */}
                    <Card className="relative border-2 border-gray-200 hover:border-blue-300 transition-colors">
                        <CardHeader className="text-center pb-8">
                            <CardTitle className="text-2xl font-bold text-gray-900">Free Trial</CardTitle>
                            <CardDescription className="text-gray-600 mt-2">Perfect for trying out our platform</CardDescription>
                            <div className="mt-6">
                                <span className="text-4xl font-bold text-gray-900">Free</span>
                                <span className="text-gray-600 ml-2">for 48 hours</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-700">Full platform access</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-700">All core features</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-700">Email support</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-700">No credit card required</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-gray-100 hover:bg-gray-200 text-black">Start Free Trial</Button>
                        </CardFooter>
                    </Card>

                    {/* Monthly Plan */}
                    <Card className="relative border-2 border-blue-500 hover:border-blue-600 transition-colors">
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                        </div>
                        <CardHeader className="text-center pb-8">
                            <CardTitle className="text-2xl font-bold text-gray-900">Monthly Plan</CardTitle>
                            <CardDescription className="text-gray-600 mt-2">Full access with premium support</CardDescription>
                            <div className="mt-6">
                                <span className="text-4xl font-bold text-gray-900">$15</span>
                                <span className="text-gray-600 ml-2">per month</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-700">Everything in Free Trial</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-700">Unlimited usage</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-700">Priority support</span>
                            </div>
                           
                            <div className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-blue-600" />
                                <span className="text-gray-700">Cancel anytime</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="text-center mt-12">
                    <p className="text-gray-600">
                        Questions about our pricing?{" "}
                        <a href="#contact" className="text-blue-600 hover:text-blue-700 font-medium">
                            Contact us
                        </a>
                    </p>
                </div>
            </div>
        </section>
    )
}
