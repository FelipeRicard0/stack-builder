"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

export type CommandStepData = {
  label: string;
  command: string;
  description?: string;
};

interface CommandStepProps {
  step: CommandStepData;
  index: number;
}

export default function CommandStep({ step, index }: CommandStepProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(step.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-border bg-card border p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-secondary text-secondary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
            {index + 1}
          </div>
          <span className="text-card-foreground text-sm font-medium">
            {step.label}
          </span>
        </div>
        <Button variant="ghost" size={"icon-sm"} onClick={handleCopy}>
          {copied ? (
            <Check className="text-foreground size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </div>
      {step.description && (
        <p className="text-muted-foreground mb-3 text-xs">{step.description}</p>
      )}
      <div className="bg-background p-3">
        <code className="text-foreground block font-mono text-xs break-all">
          <span className="text-muted-foreground">$ </span>
          {step.command}
        </code>
      </div>
    </div>
  );
}
