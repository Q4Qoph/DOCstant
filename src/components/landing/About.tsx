"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Award, 
  Users, 
  Lightbulb,
  CheckCircle,
  Star,
  Shield
} from "lucide-react";
import patientsImage from "@/assets/happy-patients.jpg";

export const About = () => {
  const stats = [
    { number: "500+", label: "Pharmacy Locations", icon: <Users className="h-6 w-6" /> },
    { number: "40%", label: "Cost Reduction", icon: <Target className="h-6 w-6" /> },
    { number: "99.9%", label: "Platform Uptime", icon: <Award className="h-6 w-6" /> },
    { number: "$50M+", label: "Client Savings", icon: <Star className="h-6 w-6" /> }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Operational Excellence",
      description: "Delivering measurable ROI through intelligent automation and process optimization."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "Bank-grade security with HIPAA compliance ensuring your data and patients are protected."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Continuous Innovation",
      description: "Regular platform updates and new features driven by client feedback and market needs."
    }
  ];

  const achievements = [
    "Serving 500+ pharmacy locations across North America",
    "Achieved 40% average cost reduction for clients",
    "99.9% platform uptime with enterprise-grade infrastructure",
    "SOC 2 Type II certified for security and compliance",
    "Winner of Healthcare Innovation Award 2024"
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main About Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center space-x-2 bg-accent/10 rounded-full px-4 py-2 mb-6">
                <Lightbulb className="h-5 w-5 text-accent" />
                <span className="text-accent font-medium">About Docstant</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Scaling Pharmacy Operations
                <span className="block text-primary">Through Enterprise AI</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Docstant is the leading SaaS platform that empowers pharmacy chains and independent 
                pharmacies to scale efficiently. Our AI-driven automation reduces costs by 40% while 
                improving patient outcomes and operational efficiency.
              </p>
            </div>

            {/* Achievements List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Our Achievements</h3>
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{achievement}</span>
                </div>
              ))}
            </div>

            <Button className="bg-gradient-primary shadow-medium hover:shadow-glow transition-all duration-300">
              Learn More About Our Technology
            </Button>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-glow">
              {/* <img 
                src={patientsImage} 
                alt="Happy patients using AI pharmacy services"
                className="w-full h-[500px] object-cover"
              /> */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            
            {/* Floating Stats Card */}
            <Card className="absolute -bottom-8 -left-8 bg-white shadow-glow border-0">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
                  <div className="text-sm text-muted-foreground mb-3">Patient Rating</div>
                  <div className="flex space-x-1 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, index) => (
            <Card 
              key={index} 
              className="text-center border-0 shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-white mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-6">Our Core Values</h3>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            These principles guide everything we do and shape our commitment to excellence in healthcare.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-soft hover:shadow-glow transition-all duration-300 group cursor-pointer"
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                    {value.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="bg-gradient-hero text-white shadow-glow">
          <CardContent className="p-8 md:p-16 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h3>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
              To empower pharmacy businesses of all sizes with enterprise-grade AI technology that 
              drives operational efficiency, reduces costs, and scales growth. We believe every pharmacy 
              deserves access to cutting-edge technology that enhances both business performance and patient care.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-medium"
            >
              Partner With Us
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default About;