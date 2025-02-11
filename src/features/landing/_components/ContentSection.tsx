"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ContentSection = () => {
  return (
    <div className="py-20 bg-[#350d35]">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need in One Place
          </h2>
          <p className="text-xl text-gray-300">
            A platform designed for modern teams to work better together
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <Image
              src="/images/team-work.avif"
              alt="Team collaboration"
              className="rounded-lg shadow-xl"
              width={500}
              height={300}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-bold">Work Smarter, Not Harder</h3>
              <p className="text-gray-300 text-lg">
                Our platform brings all your team's communication and
                collaboration into one place. With powerful features like
                real-time messaging and integrated tools, you can focus on what
                matters most - getting work done.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
