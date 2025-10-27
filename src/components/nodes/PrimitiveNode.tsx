import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Hash, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface PrimitiveNodeData extends Record<string, unknown> {
  label: string;
  path: string;
  value?: any;
  isHighlighted?: boolean;
}

export const PrimitiveNode = memo(({ data }: { data: PrimitiveNodeData }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(data.path as string);
    setCopied(true);
    toast.success("Path copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine value type and color
  const getValueType = () => {
    if (data.value === null) return "null";
    if (typeof data.value === "boolean") return "boolean";
    if (typeof data.value === "number") return "number";
    if (typeof data.value === "string") return "string";
    return "unknown";
  };

  const valueType = getValueType();

  return (
    <div
      className={`relative px-4 py-3 rounded-lg border-2 shadow-md transition-all duration-200 min-w-[200px] group hover:shadow-lg ${
        data.isHighlighted
          ? "bg-node-highlight-bg border-node-highlight"
          : "bg-node-primitive-bg border-node-primitive-border"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-node-primitive"
      />
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Hash className="w-4 h-4 text-node-primitive flex-shrink-0" />
          <span className="font-medium text-sm text-foreground truncate">
            {data.label}
          </span>
        </div>
        <button
          onClick={handleCopyPath}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-background/50 rounded flex-shrink-0"
          title={`Copy path: ${data.path}`}
        >
          {copied ? (
            <Check className="w-3 h-3 text-node-array" />
          ) : (
            <Copy className="w-3 h-3 text-muted-foreground" />
          )}
        </button>
      </div>

      <div className="mt-1 flex items-center gap-2">
        <span className="text-xs px-1.5 py-0.5 rounded bg-background/50 text-muted-foreground font-mono">
          {valueType}
        </span>
        <span className="text-xs text-muted-foreground font-mono truncate">
          {data.path}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-node-primitive"
      />
    </div>
  );
});

PrimitiveNode.displayName = "PrimitiveNode";
