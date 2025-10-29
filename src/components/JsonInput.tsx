import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileJson, AlertCircle, Play } from "lucide-react";

interface JsonInputProps {
  onVisualize: (data: any) => void;
  onClear: () => void;
}

const SAMPLE_JSON = `{
  "user": {
    "id": 12345,
    "name": "Pranjali",
    "email": "pranjali@gmail.com",
    "isActive": true,
    "address": {
      "street": "Ashoka Road",
      "city": "Nagpur",
      "zipCode": "56899",
      "country": "India"
    },
    "preferences": {
      "theme": "dark",
      "notifications": true,
      "language": "en"
    }
  },
  "orders": [
    {
      "orderId": "ORD-001",
      "date": "2025-01-15",
      "total": 149.99,
      "items": [
        {
          "productId": "PROD-101",
          "name": "Laptop",
          "price": 999.99,
          "quantity": 1
        },
        {
          "productId": "PROD-102",
          "name": "Mouse",
          "price": 25.99,
          "quantity": 2
        }
      ],
      "status": "delivered"
    },
    {
      "orderId": "ORD-002",
      "date": "2024-02-10",
      "total": 79.99,
      "items": [
        {
          "productId": "PROD-103",
          "name": "Keyboard",
          "price": 79.99,
          "quantity": 1
        }
      ],
      "status": "processing"
    }
  ],
  "metadata": {
    "createdAt": "2023-06-15T10:30:00Z",
    "lastLogin": "2024-03-01T14:22:00Z",
    "loginCount": 247
  }
}`;

export const JsonInput = ({ onVisualize, onClear }: JsonInputProps) => {
  const [jsonText, setJsonText] = useState(SAMPLE_JSON);
  const [error, setError] = useState<string | null>(null);

  const handleVisualize = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setError(null);
      onVisualize(parsed);
    } catch (err) {
      setError(
        err instanceof Error 
          ? `Invalid JSON: ${err.message}` 
          : "Invalid JSON format. Please check your input."
      );
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border">
        <FileJson className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">JSON Input</h2>
      </div>

      <Textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        placeholder="Paste or type your JSON here..."
        className="flex-1 font-mono text-sm resize-none"
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        <Button 
          onClick={handleVisualize} 
          className="flex-1"
          size="lg"
        >
          <Play className="w-4 h-4 mr-2" />
          Visualize Tree
        </Button>
        <Button 
          variant="outline" 
          onClick={() => {
            setJsonText("");
            setError(null);
            onClear();
          }}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
};
