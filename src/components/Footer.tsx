import { Brain, Heart, Mail, MapPin, Phone, AlertTriangle, MessageCircle, BookOpen, Users, BarChart3, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-border transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        {/* Emergency Contact Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-xl font-bold">Crisis Support Available 24/7</h3>
                <p className="text-red-100">If you're in immediate distress, please reach out</p>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-lg font-semibold">Emergency Helpline</p>
                <p className="text-2xl font-bold">1800-599-0019</p>
                <p className="text-sm text-red-100">KIRAN Mental Health Helpline</p>
              </div>
            </div>
          </div>
          <div className="md:hidden mt-4 text-center">
            <p className="text-lg font-semibold">Emergency Helpline</p>
            <p className="text-2xl font-bold">1800-599-0019</p>
            <p className="text-sm text-red-100">KIRAN Mental Health Helpline</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">mitर</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Providing anonymous, accessible mental health support for higher education students across India. 
              Your wellbeing matters, and we're here to help.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Made with care for student wellbeing</span>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Stay Updated</h4>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-3 py-2 bg-card border border-card-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/assessment" className="hover:text-white transition-colors flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Mental Health Assessment</span>
              </a></li>
              <li><a href="/chatbot" className="hover:text-white transition-colors flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>AI Chatbot Support</span>
              </a></li>
              <li><a href="/resources" className="hover:text-white transition-colors flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Resources & Articles</span>
              </a></li>
              <li><a href="/groups" className="hover:text-white transition-colors flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Support Groups</span>
              </a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Crisis Resources</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Report Issue</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact & Legal</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@mitर.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>+91-XXX-XXX-XXXX</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>India</span>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Accessibility</a>
              <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 mitर. All rights reserved. Confidentiality guaranteed.
            </p>
            
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Follow us:</span>
              <div className="flex space-x-3">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 

export default Footer;