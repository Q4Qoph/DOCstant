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
            <Heart className="h-5 w-5 text-[#0c9aff]" />
            <span className="text-[#0c9aff] font-medium">Our Services</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Enterprise-Grade Healthcare
            <span className="block text-[#0c9aff]">Technology Platform</span>
          </h2>
          <p className="text-xl text-gray-400">
            Streamline operations, reduce administrative burden, and scale your healthcare practice 
            with Docstant's comprehensive solution built for modern medical enterprises.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="border-none shadow-none group hover:shadow-xl transition-all duration-300 cursor-pointer border border-blue-100"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <div>
                  <CardTitle className="text-xl mb-2 transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="">
                    {service.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm">
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
          <Card className="bg-[#0c9aff] text-white shadow-xl">
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
                  className="bg-white text-[#0c9aff] hover:bg-blue-50 shadow-md"
                >
                  Start Free Trial
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