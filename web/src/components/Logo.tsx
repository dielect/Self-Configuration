import { motion } from "framer-motion";

export function Logo() {
  return (
    <div className="mb-10 select-none">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-baseline gap-1"
      >
        <motion.div
          className="relative"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-[#ff9966] via-[#ff5e62] to-[#ffa34e] bg-clip-text text-transparent">
            Self
          </span>
          <motion.div
            className="absolute -bottom-1 left-0 h-[3px] rounded-full bg-gradient-to-r from-[#ff9966] via-[#ff5e62] to-[#ffa34e]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>

        <motion.span
          className="text-lg sm:text-xl font-light tracking-[0.3em] text-zinc-500 ml-2 pb-0.5"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          config
        </motion.span>
      </motion.div>

      <motion.p
        className="text-xs text-zinc-600 mt-3 tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        Clash 配置生成工具
      </motion.p>
    </div>
  );
}
