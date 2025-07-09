import { Button } from './button'
import { Check, Copy } from 'lucide-react'
import { useState, forwardRef } from 'react'

type CopyButtonProps = {
  variant?: string
  content: string
  onCopy?: () => void
  className?: string
  [key: string]: any
}

export const CopyButton = forwardRef<
  HTMLButtonElement,
  CopyButtonProps
>(({ variant = 'ghost', content, onCopy, className, ...props }, ref) => {
  const [copied, setCopied] = useState(false)

  function copy(content: string) {
    setCopied(true)
    navigator.clipboard.writeText(content)
    setTimeout(() => setCopied(false), 1000)
    onCopy?.()
  }

  return (
    <Button
      {...props}
      ref={ref}
      variant={variant}
      size="icon"
      className={className}
      onClick={() => copy(content)}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
})

CopyButton.displayName = 'CopyButton'
