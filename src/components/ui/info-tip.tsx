import * as React from "react"
import { Info } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface InfoTipProps {
  content: string
  className?: string
  iconSize?: number
}

const InfoTip = ({ content, className, iconSize = 14 }: InfoTipProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-auto w-auto p-1 text-muted-foreground hover:text-foreground transition-colors",
            className
          )}
        >
          <Info size={iconSize} />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 text-xs p-3 bg-popover border shadow-md"
        side="top"
        align="center"
      >
        {content}
      </PopoverContent>
    </Popover>
  )
}

export { InfoTip }