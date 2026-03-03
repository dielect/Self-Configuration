import { motion } from "framer-motion";

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative mb-12 select-none overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800/40 px-8 py-10 sm:px-12 sm:py-14"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(120,119,198,0.08),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(59,130,246,0.06),_transparent_60%)]" />
        <motion.div
          className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-500/[0.03] blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-700/30 to-transparent" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-px h-4 bg-zinc-600" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-zinc-600">
            Clash Proxy Configuration
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-none">
            <span className="text-white">self</span>
            <span className="text-zinc-600 font-light">.</span>
            <span className="text-zinc-400 font-light">config</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="origin-left w-16 h-[2px] bg-gradient-to-r from-blue-500/50 to-transparent mb-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-[13px] text-zinc-500 max-w-sm leading-relaxed font-light"
        >
          从 VLESS / Shadowsocks 链接或订阅地址
          <br />
          快速生成 Clash 配置文件
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex flex-wrap items-center gap-2 mt-7"
        >
          {["vless://", "ss://", "https://", ".yaml"].map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-500 border border-zinc-800/60"
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
