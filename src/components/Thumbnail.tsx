import Image from "next/image";

import {
  Credenza,
  CredenzaContent,
  CredenzaTrigger,
  CredenzaClose,
} from "@/components/shadcnUI/credenza";

import { X } from "lucide-react";

type ThumbnailProps = {
  imageUrl: string;
  alt: string;
};

const Thumbnail = ({ imageUrl, alt = "Message thumbnail" }: ThumbnailProps) => {
  return (
    <Credenza>
      <CredenzaTrigger asChild>
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
      </CredenzaTrigger>

      <CredenzaContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none [&>button]:hidden md:h-auto max-md:h-[100dvh]">
        <div className="relative h-full flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={alt}
            width={800}
            height={0}
            quality={85}
            sizes="(max-width: 1200px) 100vw, 800px"
            className="rounded-lg object-contain w-full h-full max-h-[90dvh]"
          />
          <CredenzaClose asChild>
            <button className="absolute top-4 right-4 rounded-full bg-black/40 p-2 hover:bg-black/60 transition-colors">
              <X className="h-4 w-4 text-white" />
            </button>
          </CredenzaClose>
        </div>
      </CredenzaContent>
    </Credenza>
  );
};

export default Thumbnail;
