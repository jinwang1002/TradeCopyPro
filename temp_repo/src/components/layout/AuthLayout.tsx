import React from "react";
import { Link } from "react-router-dom";
import AuthForm from "../auth/AuthForm";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children?: React.ReactNode;
  defaultTab?: "login" | "register";
}

const AuthLayout = ({ children, defaultTab = "login" }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
      {/* Left side - Branding and info */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-900 to-black p-8 flex flex-col justify-between">
        <div>
          <Link to="/" className="inline-block">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-white flex items-center"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-8 w-8 mr-2 text-green-400"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22V2M2 12h20M17 7l-5 5-5-5M7 17l5-5 5 5" />
              </svg>
              TradeRiser
            </motion.div>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-12 max-w-md"
          >
            <h1 className="text-3xl font-bold mb-6">Trade Copy Platform</h1>
            <p className="text-gray-300 mb-8">
              Connect with top-performing traders, copy their strategies, and
              grow your portfolio with our advanced trade copying platform.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-green-500/20 p-2 rounded-full mr-4">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Signal Providers</h3>
                  <p className="text-sm text-gray-400">
                    Share your trading strategies and earn from subscribers
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-500/20 p-2 rounded-full mr-4">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Subscribers</h3>
                  <p className="text-sm text-gray-400">
                    Copy trades with customized settings across multiple
                    accounts
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-500/20 p-2 rounded-full mr-4">
                  <svg
                    className="h-5 w-5 text-green-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Free Trial</h3>
                  <p className="text-sm text-gray-400">
                    Try any signal provider with a 7-day free trial
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-sm text-gray-400 mt-8"
        >
          © {new Date().getFullYear()} TradeRiser. All rights reserved.
        </motion.div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full md:w-1/2 bg-gray-900 p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {children || <AuthForm defaultTab={defaultTab} />}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
