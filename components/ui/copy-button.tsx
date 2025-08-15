import * as React from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CopyButtonProps { value: string; label?: string; size?: "sm" | "default" | "icon"; className?: string; onCopy?: () => void }
export const CopyButton: React.FC<CopyButtonProps> = ({ value, label = "Copy", size = "icon", className, onCopy }) => {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => { try { await navigator.clipboard.writeText(value); onCopy?.(); setCopied(true); setTimeout(()=>setCopied(false), 1600);} catch(e){ console.warn("Clipboard write failed", e);} };
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size={size} aria-label={label} className={className} onClick={copy} type="button">
          {copied ? <IconCheck className="size-4 text-green-500" /> : <IconCopy className="size-4" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied" : label}</TooltipContent>
    </Tooltip>
  );
};
