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
import { useManagerNames } from '@/hooks/useManagerNames';
import { Input } from '@/components/ui/input';

interface ManagerNameComboboxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * Autocomplete combobox for manager names
 * Prevents typos by suggesting existing manager names from the database
 * Allows custom text input for new manager names
 */
export const ManagerNameCombobox: React.FC<ManagerNameComboboxProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: managerNames = [], isLoading } = useManagerNames();

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

  // Filter manager names based on search
  const filteredNames = managerNames.filter((name) =>
    name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="relative" ref={containerRef}>
      <Input
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
        placeholder="Type or select manager name..."
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
      >
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
      </Button>
      
      {open && filteredNames.length > 0 && (
        <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover shadow-md max-h-[300px] overflow-auto">
          <Command>
            <CommandList>
              <CommandGroup heading="Existing Managers">
                {filteredNames.map((name) => (
                  <CommandItem
                    key={name}
                    value={name}
                    onSelect={() => {
                      onChange(name);
                      setSearchValue('');
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === name ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {name}
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
