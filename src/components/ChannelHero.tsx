import { Skeleton } from "@/components/shadcnUI/skeleton";
import { format } from "date-fns";

type ChannelHeroProps = {
  channelName: string;
  createdAt: number;
};

const ChannelHero = ({ channelName, createdAt }: ChannelHeroProps) => {
  return (
    <div className="mt-20 mx-5 mb-4 p-8 rounded-lg bg-gradient-to-r from-[#481349]/5 via-[#5E2C5F]/5 to-[#481349]/5">
      <p className="text-2xl font-bold flex items-center mb-2">
        # {channelName}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        This channel was created on {format(new Date(createdAt), "MMM d, yyyy")}
        . This is the beginning of the{" "}
        <span className="font-bold">#{channelName}</span> channel.
      </p>
    </div>
  );
};

const ChannelHeroSkeleton = () => {
  return (
    <div className="mt-20 mx-5 mb-4 p-8 rounded-lg">
      <Skeleton className="w-48 h-8 mb-2" />
      <Skeleton className="w-96 h-4" />
    </div>
  );
};

ChannelHero.Skeleton = ChannelHeroSkeleton;

export default ChannelHero;
