import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '../lib/utils';

interface GradualBlurProps {
  text: string;
  className?: string;
}

export const GradualBlur: React.FC<GradualBlurProps> = ({ text, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const words = text.split(" ");

  return (
    <div ref={ref} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block mr-[0.25em] whitespace-nowrap">
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              initial={{ filter: "blur(10px)", opacity: 0 }}
              animate={isInView ? { filter: "blur(0px)", opacity: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: i * 0.1 + j * 0.03,
                ease: "circOut",
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </div>
  );
};
