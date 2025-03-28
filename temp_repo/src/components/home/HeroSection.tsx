import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const HeroSection = ({
  title = "Elevate Your Trading with TradeRiser",
  subtitle = "Connect with top-performing signal providers and copy their trades with customized settings across multiple accounts.",
  ctaText = "Get Started",
  ctaLink = "/auth",
  secondaryCtaText = "Browse Providers",
  secondaryCtaLink = "/providers",
}: HeroSectionProps) => {
  const features = [
    {
      icon: <TrendingUp className="h-6 w-6 text-green-400" />,
      title: "Top Performers",
      description: "Access signal providers with proven track records",
    },
    {
      icon: <Shield className="h-6 w-6 text-blue-400" />,
      title: "Risk Management",
      description: "Customize lot sizes and risk parameters for each account",
    },
    {
      icon: <Users className="h-6 w-6 text-purple-400" />,
      title: "Community",
      description: "Join a growing community of traders and signal providers",
    },
  ];

  return (
    <div className="w-full bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300 mb-8">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold"
            >
              <Link to={ctaLink}>
                {ctaText} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <Link to={secondaryCtaLink}>{secondaryCtaText}</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className="bg-gray-900 p-8 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20"
            >
              <div className="bg-gray-800 p-3 rounded-lg inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-2xl border border-gray-800">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to transform your trading experience?
            </h2>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Start your 7-day free trial today and connect with top-performing
              signal providers.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold"
            >
              <Link to={ctaLink}>Start Free Trial</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
