import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle2, XCircle } from "lucide-react";

interface SearchBarProps {
  onSearch: (path: string) => void;
  searchResult: string | null;
}

export const SearchBar = ({ onSearch, searchResult }: SearchBarProps) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    onSearch(searchValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by JSON path (e.g., $.user.address.city or items[0].name)"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
      {searchResult && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted">
          {searchResult === "Match found!" ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-node-array" />
              <span className="text-sm font-medium text-foreground">
                {searchResult}
              </span>
            </>
          ) : (
            <>
              <XCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-foreground">
                {searchResult}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};
