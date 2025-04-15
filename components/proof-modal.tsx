"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { VideoPlayer } from "@/components/video-player"
import Image from "next/image"

interface ProofModalProps {
  isOpen: boolean
  onClose: () => void
  proof: {
    type: "video" | "image"
    url: string
  }
}

export function ProofModal({ isOpen, onClose, proof }: ProofModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] p-0 bg-transparent border-0">
        <div className="rounded-lg overflow-hidden">
          {proof.type === "video" ? (
            <VideoPlayer src={proof.url} className="w-full" />
          ) : (
            <div className="relative w-full aspect-video">
              <Image src={proof.url || "/placeholder.svg"} alt="Proof" fill className="object-contain" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
