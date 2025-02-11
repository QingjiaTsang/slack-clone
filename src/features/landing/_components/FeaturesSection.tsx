"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { MessageSquare, Users, Zap } from "lucide-react";
import { useRef } from "react";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay,
  iconColor,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
  iconColor: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
  >
    <Icon className={`w-12 h-12 mb-4`} style={{ color: iconColor }} />
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </motion.div>
);

const FeaturesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="relative h-[120dvh] sm:h-[150dvh] bg-gradient-to-b from-[#541554] to-[#350d35]"
    >
      <div className="sticky top-0 h-dvh flex items-center justify-center">
        <motion.div
          style={{ scale, opacity }}
          className="max-w-6xl mx-auto px-4"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={MessageSquare}
              title="Streamlined Communication"
              description="Keep conversations organized in dedicated channels and threads"
              delay={0.2}
              iconColor="#ecb22e"
            />
            <FeatureCard
              icon={Users}
              title="Team Collaboration"
              description="Bring your team together with powerful collaboration tools"
              delay={0.4}
              iconColor="#2eb67d"
            />
            <FeatureCard
              icon={Zap}
              title="Instant Productivity"
              description="Get work done faster with quick access to tools and information"
              delay={0.6}
              iconColor="#e01e5a"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesSection;
