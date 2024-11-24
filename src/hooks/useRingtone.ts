import { useRef, useEffect } from "react";

const useRingtone = (isPlaying: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current = new Audio("/audio/call-ringtone.mp3");
      audioRef.current.loop = true;

      const playAudio = async () => {
        try {
          await audioRef.current?.play();
        } catch (error) {
          console.error("Failed to play ringtone:", error);
        }
      };

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      playAudio();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isPlaying]);
};

export default useRingtone;
