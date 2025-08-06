"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  Pill, 
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
      description: "Automate prescription processing, inventory management, and customer interactions with intelligent AI.",
      features: ["Auto-Processing", "Smart Routing", "Error Reduction"]
    },
    {
      icon: <UserCheck className="h-8 w-8" />,
      title: "Enterprise Patient Management",
      description: "Scalable patient database with advanced analytics and compliance tracking for multi-location operations.",
      features: ["Multi-Site Access", "HIPAA Compliance", "Advanced Analytics"]
    },
    {
      icon: <Pill className="h-8 w-8" />,
      title: "Intelligent Inventory Control",
      description: "Predictive inventory management with automated ordering and supplier integration.",
      features: ["Demand Forecasting", "Auto-Ordering", "Supplier Integration"]
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Omnichannel Platform",
      description: "Unified platform connecting web, mobile, and in-store experiences with real-time synchronization.",
      features: ["Unified Dashboard", "Real-time Sync", "Cross-platform"]
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Advanced Security & Compliance",
      description: "Enterprise-grade security with automated compliance reporting and audit trails.",
      features: ["SOC 2 Compliant", "Audit Trails", "Data Encryption"]
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Performance Analytics",
      description: "Real-time business intelligence with KPI tracking and performance optimization insights.",
      features: ["ROI Tracking", "Performance KPIs", "Custom Reports"]
    }
  ];

  return (
    <section id="services" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Heart className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Our Services</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Enterprise-Grade Pharmacy
            <span className="block text-primary">Automation Platform</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Streamline operations, reduce overhead costs, and scale your pharmacy business 
            with Docstant's comprehensive SaaS solution built for modern healthcare enterprises.
          </p>
        </div>

        {/* Featured Service */}
        <div className="mb-16">
          <Card className="overflow-hidden shadow-medium hover:shadow-glow transition-all duration-300">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative">
                {/* <img 
                  src={aiTechImage} 
                  alt="AI Technology in Healthcare"
                  className="w-full h-full object-cover min-h-[300px]"
                /> */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
              </div>
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 text-accent">
                    <AlertCircle className="h-6 w-6" />
                    <span className="font-semibold">Featured Service</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">
                    Enterprise AI Engine
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Our proprietary AI engine processes millions of prescriptions daily, optimizing everything from 
                    inventory levels to patient workflows while ensuring 99.9% accuracy and regulatory compliance.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Machine Learning", "Predictive Analytics", "Real-time Processing", "Scalable Architecture"].map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Button className="bg-gradient-primary shadow-medium hover:shadow-glow transition-all duration-300 w-fit">
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
              className="group hover:shadow-glow transition-all duration-300 cursor-pointer border-0 shadow-soft"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-white group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <div>
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
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
          <Card className="bg-gradient-primary text-white shadow-glow">
            <CardContent className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Transform Your Pharmacy Operations?
              </h3>
              <p className="text-white/90 mb-8 max-w-2xl mx-auto">
                Join 500+ pharmacies already saving 40% on operational costs with Docstant's AI platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 shadow-medium"
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