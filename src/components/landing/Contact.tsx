"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Calendar,
  Users
} from "lucide-react";

export const Contact = () => {
  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      description: "Speak with our AI-assisted support team",
      detail: "+1 (555) 123-4567",
      action: "Call Now"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Get detailed responses within 24 hours",
      detail: "support@pharmai.com",
      action: "Send Email"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      description: "Instant support with AI chatbot",
      detail: "Available 24/7",
      action: "Start Chat"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Schedule Consultation",
      description: "Book a personal consultation",
      detail: "Available slots",
      action: "Book Now"
    }
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "24/7 AI Support" },
    { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 4:00 PM" },
    { day: "Emergency", hours: "24/7 Available" }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <MessageCircle className="h-5 w-5 text-primary" />
            <span className="text-primary font-medium">Get In Touch</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Contact Our
            <span className="block text-primary">Healthcare Experts</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Have questions about our AI-powered pharmacy services? Our team is here to help 
            you get started with personalized healthcare solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-glow border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input placeholder="Enter your first name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input placeholder="Enter your last name" />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your.email@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input type="tel" placeholder="+1 (555) 123-4567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="What can we help you with?" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-32"
                  />
                </div>

                <Button className="w-full bg-gradient-primary shadow-medium hover:shadow-glow transition-all duration-300">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            
            {/* Contact Methods */}
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <Card 
                  key={index} 
                  className="border-0 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {method.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {method.description}
                        </p>
                        <p className="font-medium text-primary">{method.detail}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Office Hours */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Office Hours</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-muted-foreground">{schedule.day}</span>
                    <span className="font-medium">{schedule.hours}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Our Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  123 Healthcare Avenue<br />
                  Medical District, MD 12345<br />
                  United States
                </p>
                <Button variant="outline" className="w-full">
                  Get Directions
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-gradient-primary text-white border-0 shadow-glow">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Emergency Support</h3>
                <p className="text-white/90 mb-4">
                  For urgent medical assistance, our AI system is available 24/7
                </p>
                <Button className="bg-white text-primary hover:bg-white/90">
                  Emergency Contact
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};