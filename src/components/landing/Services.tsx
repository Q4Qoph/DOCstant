"use client";

import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  Stethoscope, 
  UserCheck, 
  Clock, 
  Shield, 
  Heart,
  Smartphone,
  FileText,
  AlertCircle
} from "lucide-react";
import aiTechImage from "@/assets/ai-technology.jpg";

export const Services = () => {
  const services = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI-Powered Workflow Automation",
      description: "Automate patient scheduling, record management, and administrative tasks with intelligent AI solutions.",
      features: ["Smart Scheduling", "Auto-Documentation", "Process Optimization"]
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: "Enterprise Patient Management",
      description: "Comprehensive patient database with advanced analytics and compliance tracking for multi-location practices.",
      features: ["Multi-Site Access", "HIPAA Compliance", "Advanced Analytics"]
    },
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: "Clinical Decision Support",
      description: "AI-enhanced clinical workflows with evidence-based recommendations and automated quality checks.",
      features: ["Clinical Alerts", "Evidence-Based Care", "Quality Metrics"]
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Omnichannel Platform",
      description: "Unified platform connecting telehealth, mobile, and in-office experiences with real-time synchronization.",
      features: ["Unified Dashboard", "Real-time Sync", "Cross-platform"]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Advanced Security & Compliance",
      description: "Enterprise-grade security with automated compliance reporting and comprehensive audit trails.",
      features: ["SOC 2 Compliant", "Audit Trails", "Data Encryption"]
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Performance Analytics",
      description: "Real-time practice intelligence with KPI tracking and operational efficiency optimization insights.",
      features: ["ROI Tracking", "Performance KPIs", "Custom Reports"]
    }
  ];

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 mb-6">
            <Heart className="h-5 w-5 text-blue-600" />
            <span className="text-blue-600 font-medium">Our Services</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Enterprise-Grade Healthcare
            <span className="block text-blue-600">Technology Platform</span>
          </h2>
          <p className="text-xl text-blue-900/70">
            Streamline operations, reduce administrative burden, and scale your healthcare practice 
            with Docstant's comprehensive solution built for modern medical enterprises.
          </p>
        </div>

        {/* Featured Service */}
        <div className="mb-16">
          <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative bg-blue-100 min-h-[300px]">
                {/* Optional image here */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/40 to-transparent"></div>
              </div>
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 text-blue-600">
                    <AlertCircle className="h-6 w-6" />
                    <span className="font-semibold">Featured Service</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    Healthcare AI Engine
                  </h3>
                  <p className="text-blue-900/80 text-lg leading-relaxed">
                    Our proprietary AI engine processes millions of healthcare interactions daily, optimizing everything from 
                    appointment scheduling to clinical workflows while ensuring 99.9% accuracy and regulatory compliance.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Machine Learning", "Predictive Analytics", "Real-time Processing", "Scalable Architecture"].map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md hover:brightness-110 transition-all duration-300 w-fit">
                    See ROI Calculator
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border border-blue-100 shadow-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <div>
                  <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-blue-900/70">
                    {service.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-blue-900/80">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-xl">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Transform Your Healthcare Practice?
              </h3>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Join 1000+ healthcare providers already improving efficiency by 45% with Docstant's AI platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-md"
                >
                  Start Free Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Book Enterprise Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;