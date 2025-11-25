import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}

/**
 * Generic autocomplete input component
 * Prevents typos by suggesting existing values from the database
 * Allows custom text input for new values
 */
export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  suggestions = [],
  isLoading = false,
  disabled = false,
  placeholder = 'Type or select...',
  id,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Filter suggestions based on search
  const filteredSuggestions = suggestions.filter((suggestion) =>
    suggestion.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <Input
        id={id}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setSearchValue(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setSearchValue(value);
          setOpen(true);
        }}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        className="pr-10"
      />
      <Button
        variant="ghost"
        size="sm"
        type="button"
        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
        onClick={() => setOpen(!open)}
        disabled={disabled || isLoading}
        tabIndex={-1}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
        ) : (
          <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
      
      {open && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md max-h-[300px] overflow-auto">
          <Command>
            <CommandList>
              <CommandGroup>
                {filteredSuggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion}
                    value={suggestion}
                    onSelect={() => {
                      onChange(suggestion);
                      setSearchValue('');
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === suggestion ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};
