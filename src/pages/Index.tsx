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
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-primary" strokeWidth={2.5} />
              <span className="font-semibold text-lg tracking-tight">TreeView</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
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
