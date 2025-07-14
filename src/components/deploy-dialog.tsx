import Logo from './logo'
import { CopyButton } from './ui/copy-button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { publish } from '@/actions/publish'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Duration } from '@/lib/duration'
import { Globe } from 'lucide-react'
import { useEffect, useState } from 'react'

export function DeployDialog({
  url,
  sbxId,
  teamID,
  accessToken,
}: {
  url: string
  sbxId: string
  teamID: string | undefined
  accessToken: string | undefined
}) {

  const [publishedURL, setPublishedURL] = useState<string | null>(null)
  const [duration, setDuration] = useState<string | null>(null)

  useEffect(() => {
    setPublishedURL(null)
  }, [url])

  async function publishURL(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { url: publishedURL } = await publish(
      url,
      sbxId,
      duration as Duration,
      teamID,
      accessToken,
    )
    setPublishedURL(publishedURL)

  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default">
          {/* <Logo style="e2b" width={16} height={16} className="mr-2" /> */}
          <Globe width={16} height={16} className="mr-2"/>
          Deploy 
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4 w-80 flex flex-col gap-2">
        <div className="text-sm font-semibold">Deploy Global</div>
        <div className="text-sm text-muted-foreground">
          Deploying yout web will make it publicly accessible to others via
          link.
        </div>
        <div className="text-sm text-muted-foreground">
          Your website will be available up until the expiration date you choose
          and you&apos;ll be billed based on our Compute pricing
        </div>
        <form className="flex flex-col gap-2" onSubmit={publishURL}>
          {publishedURL ? (
            <div className="flex items-center gap-2">
              <Input value={publishedURL} readOnly />
              <CopyButton content={publishedURL} />
            </div>
          ) : (
            <Select onValueChange={(value) => setDuration(value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Set expiration" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Expires in</SelectLabel>
                  <SelectItem value="1h">1 Jam</SelectItem>
                  <SelectItem value="3h">3 Jam</SelectItem>
                  <SelectItem value="12h">12 Jam</SelectItem>
                  <SelectItem value="1d">1 Hari</SelectItem>
                  <SelectItem value="3d">3 Hari</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <Button
            type="submit"
            variant="default"
            disabled={publishedURL !== null}
          >
            {publishedURL ? 'Deployed' : 'Accept and deploy'}
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
