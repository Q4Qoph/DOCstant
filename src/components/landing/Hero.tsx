import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Clock } from "lucide-react";
import heroImage from "@/assets/pharmacy-hero.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {/* <img 
          src={heroImage} 
          alt="Modern AI-powered pharmacy"
          className="w-full h-full object-cover"
        /> */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-600/70 to-[hsl(var(--accent)/0.8)] p-6 rounded-lg text-white"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="glass rounded-full p-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="glass rounded-full p-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
      </div>
      <div className="absolute bottom-40 left-20 animate-float" style={{ animationDelay: '4s' }}>
        <div className="glass rounded-full p-4">
          <Clock className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 text-white/90">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium">Next-Generation Pharmacy SaaS</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Scale Your Pharmacy
            <span className="block bg-gradient-to-r from-white to-[#60a5fa] bg-clip-text text-transparent">
              With AI Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Transform your pharmacy operations with Docstant's AI-powered platform. 
            Automate workflows, reduce costs, and deliver exceptional patient experiences at scale.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-glow hover:shadow-accent transition-all duration-300 px-8 py-6 text-lg font-semibold"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg font-semibold"
            >
              Book Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-white/80">Pharmacies Using</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">40%</div>
              <div className="text-white/80">Cost Reduction</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-white">2.5x</div>
              <div className="text-white/80">Efficiency Boost</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;