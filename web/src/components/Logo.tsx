import { motion } from "framer-motion";

const jb = { fontFamily: "'JetBrains Mono', monospace" };

export function Logo() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative mb-12 select-none overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800/40 px-10 py-12 sm:px-14 sm:py-16"
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
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="w-px h-3.5 bg-zinc-600" />
          <span
            className="text-[10px] tracking-[0.2em] uppercase text-zinc-600"
            style={jb}
          >
            Clash Proxy Configuration
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="leading-none" style={{ ...jb, letterSpacing: "-0.03em" }}>
            <span
              className="text-white font-extralight"
              style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
            >
              self
            </span>
            <span
              className="text-zinc-700 font-extralight"
              style={{
                fontSize: "clamp(3rem, 8vw, 5.5rem)",
                margin: "0 0.01em",
              }}
            >
              .
            </span>
            <span
              className="text-zinc-500 font-thin"
              style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}
            >
              config
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="origin-left w-12 h-px bg-gradient-to-r from-blue-400/40 to-transparent mb-7"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-sm text-zinc-500 max-w-md leading-7 tracking-wide font-light"
        >
          从 VLESS / Shadowsocks 链接或订阅地址，快速生成 Clash 配置文件
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="flex flex-wrap items-center gap-2.5 mt-8"
        >
          {["vless://", "ss://", "https://", ".yaml"].map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="text-[10px] tracking-wider px-2.5 py-1 rounded-md bg-zinc-900/80 text-zinc-500 border border-zinc-800/50"
              style={jb}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
