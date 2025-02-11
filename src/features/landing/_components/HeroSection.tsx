"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { SiGithub, SiX } from "react-icons/si";
import { ColourfulText } from "./ColourfulText";
import { ContainerScroll } from "./ContainerScrollAnimation";
import { MacbookScroll } from "./macbook-scroll";

const HeroSection = () => {
  return (
    <div className="w-dvh">
      <MacbookScroll
        title={
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "flex flex-col font-semibold text-black",
              "whitespace-nowrap"
            )}
          >
            <span className="text-[3rem] md:text-[3.5rem] lg:text-[4rem] [text-shadow:2px_2px_4px_rgba(0,0,0,0.3)]">
              Experience the future of
            </span>
            <br />
            <span className="text-[4.5rem] md:text-[5rem] lg:text-[6rem] font-bold mt-1 leading-none">
              <ColourfulText text="Team Collaboration" />
            </span>
          </motion.div>
        }
        src={`/images/inner-img-desktop.png`}
        badge={
          <div className="flex gap-2">
            <Link href="https://github.com/QingjiaTsang" target="_blank">
              <SiGithub className="size-10 -rotate-12 bg-black rounded-full p-1" />
            </Link>
            <Link href="https://x.com/JohnLocke72__" target="_blank">
              <SiX className="size-10 -rotate-12 bg-black rounded-full p-1" />
            </Link>
          </div>
        }
      />

      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <h1
              className={cn(
                "text-4xl md:text-[6rem] font-bold mt-1 leading-none",
                "bg-clip-text text-white/60",
                "bg-gradient-to-b from-gray-100 via-gray-300 to-gray-500",
                "[text-shadow:3px_3px_0_#3a3a3a,5px_5px_0_#4a4a4a,7px_7px_0_#5a5a5a]"
              )}
            >
              Connect Beyond Messages
            </h1>
          }
        >
          <div className="relative h-full w-full">
            <Image
              src={`/images/call-desktop.png`}
              alt="hero"
              fill
              className="mx-auto rounded-2xl h-full object-left-top"
              draggable={false}
            />
          </div>
        </ContainerScroll>
      </div>
    </div>
  );
};

export default HeroSection;
