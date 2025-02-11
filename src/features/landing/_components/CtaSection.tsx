"use client";

import { Button } from "@/components/shadcnUI/button";
import { motion } from "framer-motion";
import Link from "next/link";

const CTASection = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="py-20 bg-[#541554]"
    >
      <div className="max-w-4xl mx-auto text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Transform Your Workspace?
        </h2>
        <p className="text-xl text-gray-200 mb-8">
          Join thousands of teams already using our platform to work better
          together
        </p>
        <div className="space-x-4">
          <Button
            size="lg"
            className="bg-white text-[#541554] hover:bg-gray-100 px-8 py-0.5  border-2 border-black dark:border-white uppercase transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)] "
          >
            <Link href={"/workspace"}>Get Started Free</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CTASection;
