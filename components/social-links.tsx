import { Button } from "@/components/ui/button"
import { TelegramIcon, DiscordIcon } from "@/components/ui/icons"

export default function SocialLinks() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="bg-white bg-opacity-10 backdrop-blur-md hover:bg-opacity-20 transition-all duration-200 rounded-2xl w-12 h-12 p-2.5"
        asChild
      >
        <a href="https://t.me/umtay0" target="_blank" rel="noopener noreferrer" className="rounded-2xl">
          <TelegramIcon className="h-7 w-7 text-white" />
          <span className="sr-only">Join our Telegram</span>
        </a>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="bg-white bg-opacity-10 backdrop-blur-md hover:bg-opacity-20 transition-all duration-200 rounded-2xl w-12 h-12 p-2.5"
        asChild
      >
        <a href="https://discord.gg/8XQBQzHz" target="_blank" rel="noopener noreferrer" className="rounded-2xl">
          <DiscordIcon className="h-7 w-7 text-white" />
          <span className="sr-only">Join our Discord</span>
        </a>
      </Button>
    </div>
  )
}
