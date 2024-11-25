import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/shadcnUI/dialog";

import { X } from "lucide-react";

type ThumbnailProps = {
  imageUrl: string;
  alt: string;
};

const Thumbnail = ({ imageUrl, alt = "Message thumbnail" }: ThumbnailProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="border border-gray-200 rounded-lg mt-2 mb-1 cursor-zoom-in">
          <Image
            src={imageUrl}
            alt={alt}
            width={360}
            height={0}
            priority
            quality={75}
            sizes="(max-width: 768px) 100vw, 360px"
            className="rounded-lg aspect-auto"
          />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none [&>button]:hidden">
        <div className="relative">
          <Image
            src={imageUrl}
            alt={alt}
            width={800}
            height={0}
            quality={85}
            sizes="(max-width: 1200px) 100vw, 800px"
            className="rounded-lg aspect-auto object-contain max-h-[100dvh]"
          />
          <DialogClose className="absolute top-4 right-4 rounded-full bg-black/40 p-2 hover:bg-black/60 transition-colors">
            <X className="h-4 w-4 text-white" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
