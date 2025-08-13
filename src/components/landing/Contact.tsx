"use client";

import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MessageCircle, Send } from "lucide-react";

const API = axios.create({
  baseURL: "https://docstant-cnhrfqh8fnajc6gj.canadacentral-01.azurewebsites.net",
  headers: { "Content-Type": "application/json" },
});

// Zod schema for form validation
const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(5, "Phone number is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const contactMethods = [
    {
       type: "phone",
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      description: "Speak with our healthcare technology specialists",
      detail: "+1 (758) 486-9802",
    },
    {
       type: "email",
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Get detailed responses within 24 hours",
      detail: "contact@intl-coltium.com",
    },
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // clear field error when typing
  };

  const handleSubmit = async () => {
    const validation = contactSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      toast.error("Please correct the highlighted fields.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/api/Contact/sendContactEmail", formData);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2 mb-6">
            <MessageCircle className="h-5 w-5 text-[#0c9aff]" />
            <span className="text-[#0c9aff] font-medium">Get In Touch</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Contact Our
            <span className="block text-[#0c9aff]">Healthcare Experts</span>
          </h2>
          <p className="text-xl text-gray-400">
            Have questions about our AI-powered healthcare technology? Our team is here to help
            you get started with personalized solutions for your practice.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-none border border-blue-100">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <p className="text-gray-400">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="What can we help you with?"
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                  />
                  {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-32"
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                  />
                  {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
                </div>

                <Button
                  disabled={loading}
                  onClick={handleSubmit}
                  className="bg-[#0c9aff] text-white shadow-md hover:brightness-110 transition-all duration-300"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Sending..." : "Send Message"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              {contactMethods.map((method, index) => (
                <Card
                  key={index}
                  onClick={() => {
                    if (method.type === "phone") {
                      window.location.href = `tel:${method.detail.replace(/\s+/g, "")}`;
                    } else if (method.type === "email") {
                      window.location.href = `mailto:${method.detail}`;
                    }
                  }}
                  className="border border-blue-100 shadow-none hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#0c9aff] rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                          {method.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-2">{method.description}</p>
                        <p className="font-medium text-[#0c9aff]">{method.detail}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Emergency Contact */}
            <Card className="bg-[#0c9aff] text-white border-0 shadow-none">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">Priority Support</h3>
                <p className="text-white/90 mb-4">
                  For urgent technical assistance, our support team is available 24/7
                </p>
                <Button className="bg-white text-[#0c9aff] hover:bg-blue-100">
                  Priority Contact
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
