import { useRef, useEffect } from "react";

const useRingtone = (isPlaying: boolean) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasInteractedRef = useRef<boolean>(false);

  // add interaction event listener on mount
  // to solve the problem that the audio will not play on the first touch on IOS
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteractedRef.current) {
        // create and immediately pause audio, prepare for subsequent playback
        audioRef.current = new Audio("/audio/call-ringtone.mp3");
        audioRef.current.loop = true;

        // play and immediately pause, unlock audio context
        const initAudio = async () => {
          try {
            await audioRef.current?.play();
            audioRef.current?.pause();
            hasInteractedRef.current = true;
          } catch (error) {
            console.error("Failed to initialize audio:", error);
          }
        };

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        initAudio();
      }
    };

    // add interaction event listeners
    document.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  // handle actual playback/pause logic
  useEffect(() => {
    if (isPlaying && hasInteractedRef.current) {
      if (!audioRef.current) {
        audioRef.current = new Audio("/audio/call-ringtone.mp3");
        audioRef.current.loop = true;
      }

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
