"use client";

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
    { number: "1000+", label: "Healthcare Providers", icon: <Users className="h-6 w-6" /> },
    { number: "45%", label: "Efficiency Improvement", icon: <Target className="h-6 w-6" /> },
    { number: "99.9%", label: "Platform Uptime", icon: <Award className="h-6 w-6" /> },
    { number: "$75M+", label: "Cost Savings Generated", icon: <Star className="h-6 w-6" /> }
  ];

  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: "Operational Excellence",
      description: "Delivering measurable improvements through intelligent automation and streamlined workflows."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Data Security",
      description: "Enterprise-grade security with HIPAA compliance ensuring your practice and patient data are protected."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Continuous Innovation",
      description: "Regular platform updates and cutting-edge features driven by practitioner feedback and industry needs."
    }
  ];

  const achievements = [
    "Serving 1000+ healthcare providers across multiple specialties",
    "Achieved 45% average efficiency improvement for medical practices",
    "99.9% platform uptime with enterprise-grade infrastructure",
    "SOC 2 Type II certified for security and compliance",
    "Winner of Healthcare Innovation Award 2024"
  ];

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main About Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 mb-6">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <span className="text-blue-600 font-medium">About Docstant</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Transforming Healthcare
                <span className="block text-blue-500">Through Smart Technology</span>
              </h2>
              <p className="text-xl text-black/60 leading-relaxed">
                Docstant is the leading technology platform that empowers healthcare practices to
                overcome daily operational challenges. Our advanced solutions reduce inefficiencies by 45% while
                improving patient outcomes and practitioner satisfaction.
              </p>
            </div>

            {/* Achievements List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Our Achievements</h3>
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-black/60">{achievement}</span>
                </div>
              ))}
            </div>

            <Button className="bg-blue-500 text-white hover:bg-blue-600 shadow-md transition-all duration-300">
              Learn More About Our Technology
            </Button>
          </div>

          {/* Image with Overlay */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              {/* <img 
                src={patientsImage} 
                alt="Healthcare professionals using smart technology solutions"
                className="w-full h-[500px] object-cover"
              /> */}
              <div className="absolute inset-0 bg-[linear-gradient(135deg,_#2563eb,_#60a5fa)]"></div>
            </div>

            {/* Floating Stats Card */}
            <Card className="absolute -bottom-8 -left-8 bg-white shadow-lg border border-blue-100">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">4.9/5</div>
                  <div className="text-sm text-black/60 mb-3">Practitioner Rating</div>
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
              className="text-center border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-blue-500 mb-2">{stat.number}</div>
                <div className="text-blue-900/70">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-6 text-blue-800">Our Core Values</h3>
          <p className="text-xl text-blue-900/70 max-w-2xl mx-auto mb-12">
            These principles guide everything we do and shape our commitment to excellence in healthcare technology.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border border-blue-100 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">
                    {value.title}
                  </h4>
                  <p className="text-blue-900/70 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-xl">
          <CardContent className="p-8 md:p-16 text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h3>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
              To revolutionize healthcare operations by addressing everyday medical inconveniences for practitioners.
              We believe every healthcare practice deserves access to cutting-edge technology that enhances both operational
              efficiency and patient care outcomes through innovative, reliable solutions.
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-md"
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