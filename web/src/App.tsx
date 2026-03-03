import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./components/Logo";
import { StepIndicator } from "./components/StepIndicator";
import { StepConfig } from "./pages/StepConfig";
import { StepInput } from "./pages/StepInput";
import { StepGroups } from "./pages/StepGroups";
import { StepResult } from "./pages/StepResult";

export type WizardState = {
  configFile: string;
  configDisplayName: string;
  input: string;
  inputKind: "proxy-node" | "provider-url" | null;
  parsedProxy: Record<string, unknown> | null;
  parsedUrl: string | null;
  groups: string[];
  providers: string[];
  selectedGroups: string[];
  selectedProvider: string;
  outputName: string;
  result: { outputPath: string; summary: string } | null;
};

const STEPS = ["基础配置", "节点输入", "分组选择", "完成"];

const initialState: WizardState = {
  configFile: "",
  configDisplayName: "",
  input: "",
  inputKind: null,
  parsedProxy: null,
  parsedUrl: null,
  groups: [],
  providers: [],
  selectedGroups: [],
  selectedProvider: "",
  outputName: "output.yaml",
  result: null,
};

const pageVariants = {
  enter: { opacity: 0, y: 24 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

export default function App() {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(initialState);

  const update = (partial: Partial<WizardState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  const reset = () => {
    setStep(0);
    setState(initialState);
  };

  return (
    <div className="min-h-screen bg-background flex items-start justify-center px-4 py-8 sm:py-16">
      <div className="w-full max-w-2xl">
        <Logo />
        <StepIndicator steps={STEPS} current={step} />

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {step === 0 && (
              <StepConfig state={state} update={update} onNext={() => setStep(1)} />
            )}
            {step === 1 && (
              <StepInput
                state={state}
                update={update}
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <StepGroups
                state={state}
                update={update}
                onNext={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && <StepResult state={state} onReset={reset} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
