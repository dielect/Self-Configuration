import { motion } from "framer-motion";

const LOGO_LINES = [
  " ███████╗ ███████╗ ██╗      ███████╗",
  " ██╔════╝ ██╔════╝ ██║      ██╔════╝",
  " ███████╗ █████╗   ██║      █████╗  ",
  " ╚════██║ ██╔══╝   ██║      ██╔══╝  ",
  " ███████║ ███████╗ ███████╗ ██║     ",
  " ╚══════╝ ╚══════╝ ╚══════╝ ╚═╝  c o n f i g",
];

export function Logo() {
  return (
    <div className="mb-8 select-none">
      <pre className="text-xs sm:text-sm md:text-base leading-tight font-mono">
        {LOGO_LINES.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
            className="bg-gradient-to-r from-[#ff9966] via-[#ff5e62] to-[#ffa34e] bg-clip-text text-transparent"
          >
            {line}
          </motion.div>
        ))}
      </pre>
    </div>
  );
}
