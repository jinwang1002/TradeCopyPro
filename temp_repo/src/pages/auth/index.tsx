import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import AuthForm from "@/components/auth/AuthForm";
import { cn } from "@/lib/utils";

const AuthPage = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <Helmet>
        <title>TradeRiser - Authentication</title>
        <meta
          name="description"
          content="Sign in or register for TradeRiser - The Trade Copy Platform"
        />
      </Helmet>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left side - Platform info */}
        <motion.div
          className="flex-1 text-white space-y-6 max-w-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              <span className="text-primary">Trade</span>Riser
            </h1>
            <p className="text-xl text-muted-foreground">
              The Ultimate Trade Copy Platform
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-lg">
              Connect with top-performing traders, copy their strategies, and
              maximize your trading potential.
            </p>

            <ul className="space-y-3">
              {[
                "Copy trades from expert signal providers",
                "Manage multiple trading accounts in one place",
                "Customize your copy settings for optimal results",
                "Share your strategies and earn as a provider",
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  className={cn(
                    "flex items-center space-x-2 text-muted-foreground",
                  )}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                >
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Right side - Auth form */}
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AuthForm />
        </motion.div>
      </div>

      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-black to-black opacity-80" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>
    </div>
  );
};

export default AuthPage;
