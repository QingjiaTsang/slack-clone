import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/shadcnUI/dialog";

type ThumbnailProps = {
  imageUrl: string;
  alt: string;
};

const Thumbnail = ({ imageUrl, alt = "Message thumbnail" }: ThumbnailProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="border border-gray-200 rounded-lg my-2 cursor-zoom-in">
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
        <Image
          src={imageUrl}
          alt={alt}
          width={800}
          height={0}
          loading="lazy"
          quality={85}
          sizes="(max-width: 1200px) 100vw, 800px"
          className="rounded-lg aspect-auto"
        />
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
