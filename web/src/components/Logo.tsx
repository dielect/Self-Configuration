import { motion } from "framer-motion";

const LETTERS = [
  { char: "S", delay: 0.08 },
  { char: "E", delay: 0.13 },
  { char: "L", delay: 0.18 },
  { char: "F", delay: 0.23 },
];

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative mb-12 select-none overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-800/60 px-8 py-10 sm:px-12 sm:py-14"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#ff5e62]/8 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#ff9966]/8 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-40 rounded-full bg-[#ffa34e]/5 blur-3xl"
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff9966]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ff5e62]/20 to-transparent" />

      <div className="relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="inline-block text-[11px] font-medium tracking-widest uppercase text-zinc-500 mb-5"
        >
          Proxy Configuration Tool
        </motion.span>

        <div className="flex items-end gap-1 mb-5">
          <div className="flex">
            {LETTERS.map(({ char, delay }) => (
              <motion.span
                key={char}
                initial={{ opacity: 0, y: 30, rotateX: -60 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay, duration: 0.45, ease: "easeOut" }}
                className="text-6xl sm:text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-[#ff9966] to-[#ff5e62] bg-clip-text text-transparent leading-none"
                style={{ display: "inline-block" }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.35, duration: 0.4, ease: "easeOut" }}
            className="origin-left flex items-center gap-2 pb-2 sm:pb-3 ml-3"
          >
            <div className="w-6 h-px bg-gradient-to-r from-[#ff9966]/60 to-transparent" />
            <span className="text-base sm:text-lg font-light tracking-[0.3em] text-zinc-500">
              config
            </span>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-sm sm:text-base text-zinc-500 max-w-md leading-relaxed"
        >
          从 VLESS / Shadowsocks 链接或订阅地址，快速生成 Clash 配置文件
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap items-center gap-2 mt-6"
        >
          {["VLESS", "Shadowsocks", "订阅链接", "YAML"].map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.06 }}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-zinc-800/80 text-zinc-400 border border-zinc-700/50"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
