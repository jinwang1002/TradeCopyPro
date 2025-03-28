import React from "react";
import HeroSection from "@/components/home/HeroSection";
import TopPerformersSection from "@/components/home/TopPerformersSection";
import CommentsSection from "@/components/home/CommentsSection";
import { motion } from "framer-motion";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-12 bg-black text-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <HeroSection />
      </motion.div>

      {/* Top Performers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TopPerformersSection />
      </motion.div>

      {/* Community Comments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-4xl mx-auto w-full mb-16"
      >
        <CommentsSection />
      </motion.div>
    </div>
  );
};

export default HomePage;
