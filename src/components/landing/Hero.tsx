import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Shield, Clock, CheckCircle, Users, TrendingUp } from "lucide-react"
import Image from "next/image"

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-indigo-100/50 to-transparent rounded-full blur-3xl -z-10" />

      {/* Main Content */}
      <div className="relative z-10 w-full pt-4">
        <div className="container mx-auto px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-12 gap-12 items-center min-h-[80vh]">
            {/* Left Content - Takes up more space */}
            <div className="lg:col-span-7 space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200">
                <Sparkles className="h-4 w-4" />
                Trusted by 1000+ Healthcare Providers
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl xl:text-8xl font-bold text-slate-900 leading-[0.9] tracking-tight">
                  Transform
                  <span className="block text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text">
                    Healthcare
                  </span>
                  <span className="block text-slate-700 text-4xl lg:text-5xl xl:text-6xl font-semibold mt-2">
                    With Smart Solutions
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-2xl font-light">
                  Revolutionize your medical practice with Docstant's advanced technology platform.
                  <span className="font-medium text-slate-700">
                    {" "}
                    Streamline operations, reduce daily inconveniences, and deliver exceptional patient care at scale.
                  </span>
                </p>
              </div>

              {/* Key Benefits */}
              <div className="grid sm:grid-cols-3 gap-6 py-6">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">45% Faster</div>
                    <div className="text-sm text-slate-600">Operations</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">HIPAA</div>
                    <div className="text-sm text-slate-600">Compliant</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">24/7</div>
                    <div className="text-sm text-slate-600">Support</div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg font-semibold rounded-xl"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:bg-slate-50 px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 bg-transparent"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Social Proof */}
              <div className="pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-500 mb-4">Trusted by leading healthcare organizations</p>
                {/* <div className="flex items-center gap-8 opacity-60">
                  <div className="text-lg font-bold text-slate-400">Mayo Clinic</div>
                  <div className="text-lg font-bold text-slate-400">Johns Hopkins</div>
                  <div className="text-lg font-bold text-slate-400">Cleveland Clinic</div>
                </div> */}
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="lg:col-span-5">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl opacity-20 blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-2xl opacity-20 blur-xl" />

                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-200/50 bg-white/50 backdrop-blur-sm">
                  <Image
                    src="/site.png"
                    alt="Healthcare platform interface showcasing modern medical technology"
                    width={1200}
                    height={800}
                    className="w-full h-auto object-cover"
                    priority
                  />

                  {/* Overlay stats */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">98%</div>
                        <div className="text-sm text-slate-600">Patient Satisfaction</div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900">50K+</div>
                        <div className="text-sm text-slate-600">Active Users</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Section - Full Width */}
        <div className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 lg:px-8 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold text-slate-900">1000+</div>
                <div className="text-slate-600 font-medium">Healthcare Providers</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold text-slate-900">45%</div>
                <div className="text-slate-600 font-medium">Efficiency Improvement</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold text-slate-900">3x</div>
                <div className="text-slate-600 font-medium">Faster Operations</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl lg:text-5xl font-bold text-slate-900">99.9%</div>
                <div className="text-slate-600 font-medium">Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
