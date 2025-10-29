import { useState } from "react";
import { JsonInput } from "@/components/JsonInput";
import { TreeVisualizer } from "@/components/TreeVisualizer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FileJson } from "lucide-react";

const Index = () => {
  const [jsonData, setJsonData] = useState<any>(null);

  const handleVisualize = (data: any) => {
    setJsonData(data);
  };

  const handleClear = () => {
    setJsonData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <nav className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full" />
                <div className="relative bg-gradient-to-br from-primary to-primary/70 p-2.5 rounded-xl shadow-lg">
                  <FileJson className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  TreeView
                </span>
                <span className="text-xs text-muted-foreground font-medium tracking-wide">
                  JSON Visualizer
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - JSON Input */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <JsonInput onVisualize={handleVisualize} onClear={handleClear} />
          </div>

          {/* Right Panel - Tree Visualization */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            {jsonData ? (
              <TreeVisualizer jsonData={jsonData} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-3">
                  <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                    <FileJson className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    No Data to Visualize
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Paste or type your JSON data in the input panel and click
                    "Visualize Tree" to see the hierarchical structure.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
