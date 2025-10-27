import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Braces, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ObjectNodeData extends Record<string, unknown> {
  label: string;
  path: string;
  isHighlighted?: boolean;
}

export const ObjectNode = memo(({ data }: { data: ObjectNodeData }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPath = () => {
    navigator.clipboard.writeText(data.path as string);
    setCopied(true);
    toast.success("Path copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative px-4 py-3 rounded-lg border-2 shadow-md transition-all duration-200 min-w-[200px] group hover:shadow-lg ${
        data.isHighlighted
          ? "bg-node-highlight-bg border-node-highlight"
          : "bg-node-object-bg border-node-object-border"
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-node-object"
      />
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Braces className="w-4 h-4 text-node-object flex-shrink-0" />
          <span className="font-medium text-sm text-foreground truncate">
            {data.label}
          </span>
        </div>
        <button
          onClick={handleCopyPath}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-background/50 rounded"
          title={`Copy path: ${data.path}`}
        >
          {copied ? (
            <Check className="w-3 h-3 text-node-array" />
          ) : (
            <Copy className="w-3 h-3 text-muted-foreground" />
          )}
        </button>
      </div>

      <div className="mt-1 text-xs text-muted-foreground font-mono truncate">
        {data.path}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-node-object"
      />
    </div>
  );
});

ObjectNode.displayName = "ObjectNode";
