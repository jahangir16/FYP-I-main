// import React, { FC, useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { Box, Typography } from "@mui/material";

// type Props = {
//   videoUrl: string;
//   title: string;
// };

// const SingleVideoPlayer: FC<Props> = ({ videoUrl, title }) => {
//   const [videoData, setVideoData] = useState({ otp: "", playbackInfo: "" });
//   // const iframeRef = useRef<HTMLIFrameElement>(null);

//   useEffect(() => {
//     if (!videoUrl) {
//       console.error("Invalid videoUrl received:", videoUrl);
//       return;
//     }
//     console.log("Sending videoUrl:", videoUrl); // Log the videoUrl
//     axios
//       .post(`${process.env.NEXT_PUBLIC_SERVER_URI}generateVideoUrl`, {
//         videoId: videoUrl,
//       })
//       .then((res) => {
//         setVideoData(res.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching VdoCipher OTP:", err);
//       });
//   }, [videoUrl]);

// //   useEffect(() => {
// //     const handleVideoTracking = (event: MessageEvent) => {
// //       if (!event.data || event.source !== iframeRef.current?.contentWindow)
// //         return;
// // // Log the entire event object for debugging
// // console.log("Full Event Object:", event);

// //       // Log the entire event data for debugging
// //       console.log("VdoCipher Event Data:", event.type);

// //       const { eventType, type } = event.data;
// //       const currentTime = type?.currentTime ?? 0;
// //       const duration = type?.duration ?? 0;
// //       console.log(currentTime,"and",duration);
// //       // Log the eventType and data for debugging
// //       console.log("VdoCipher Event:", eventType, type);

// //       if (eventType) {
// //         axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}trackVideoProgress`, {
// //           videoId: videoUrl,
// //           eventType,
// //           currentTime: type?.currentTime,
// //         });
// //       }
// //     };

// //     window.addEventListener("message", handleVideoTracking);
// //     return () => {
// //       window.removeEventListener("message", handleVideoTracking);
// //     };
// //   }, [videoUrl]);
// const iframeRef = useRef<HTMLIFrameElement>(null);
// const [percentageWatched, setPercentageWatched] = useState(0);
// const watchedTimestamps = useRef(new Set());

// useEffect(() => {
//   const handlePlayerEvent = (event: MessageEvent) => {
//     const data = event.data;

//     if (!data || typeof data !== "object") return;

//     // Perform handshake
//     if (data.type === "@vdo/readyToHandshake") {
//       iframeRef.current?.contentWindow?.postMessage(
//         { type: "@vdo/handshake", source: "parent" },
//         "*"
//       );
//       return;
//     }
//     console.log(data.event);

//     if (data.event) {
//       switch (data.event) {
//         case "play":
//           console.log("Video started playing");
//           break;
//         case "pause":
//           console.log("Video paused");
//           break;
//         case "seek":
//           console.log("User seeked to", data.seconds);
//           break;
//         case "timeupdate":
//           const { currentTime, duration } = data;
//           const percent = (currentTime / duration) * 100;

//           watchedTimestamps.current.add(Math.floor(currentTime));
//           const watchedPercent =
//             (watchedTimestamps.current.size / duration) * 100;
//           setPercentageWatched(Math.min(watchedPercent, 100));
//           break;
//         case "ended":
//           console.log("Video ended");
//           break;
//         default:
//           break;
//       }
//     }
//   };

//   window.addEventListener("message", handlePlayerEvent);

//   return () => {
//     window.removeEventListener("message", handlePlayerEvent);
//   };
// }, []);


//   return (
//     <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
//       <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
//         {title}
//       </Typography>

//       <Box
//         sx={{
//           position: "relative",
//           width: "100%",
//           paddingTop: "56.25%",
//           overflow: "hidden",
//           borderRadius: 2,
//           boxShadow: 3,
//         }}
//       >
//         {videoData.otp && videoData.playbackInfo ? (
//           <iframe
//             ref={iframeRef}
//             src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=JBVv6JkF1iHV2JAw&api=true`}
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               border: 0,
//               zIndex: 1,
//             }}
//             allowFullScreen
//             allow="encrypted-media"
//           ></iframe>
//         ) : (
//           <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
//             Loading Video...
//           </Typography>
//         )}
//       </Box>
//       <Typography variant="body2" sx={{ mt: 2 }}>
//         Watched: {percentageWatched.toFixed(2)}%
//       </Typography>
//     </Box>
//   );
// };
// export default SingleVideoPlayer;

// good test

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { Box, Typography } from "@mui/material";
// import { loadVdoCipherAPI } from "../utils/loadVdoCipher";

// type Props = {
//   videoUrl: string;
//   title: string;
// };

// const SingleVideoPlayer: React.FC<Props> = ({ videoUrl, title }) => {
//   const [videoData, setVideoData] = useState({ otp: "", playbackInfo: "" });
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const [percentageWatched, setPercentageWatched] = useState(0);
//   const watchedTimestamps = useRef(new Set<number>());

//   useEffect(() => {
//     if (!videoUrl) return;
//     axios
//       .post(`${process.env.NEXT_PUBLIC_SERVER_URI}generateVideoUrl`, {
//         videoId: videoUrl,
//       })
//       .then((res) => setVideoData(res.data))
//       .catch(console.error);
//   }, [videoUrl]);

//   useEffect(() => {
//     if (!videoData.otp || !videoData.playbackInfo || !iframeRef.current) return;

//     loadVdoCipherAPI().then((VdoPlayer: any) => {
//       const player = VdoPlayer.getInstance(iframeRef.current);

//       player.video.addEventListener("play", () => {
//         console.log("Video started playing");
//       });

//       player.video.addEventListener("pause", () => {
//         console.log("Video paused");
//       });

//       player.video.addEventListener("seeked", () => {
//         console.log("User seeked to", player.video.currentTime);
//       });

//       player.video.addEventListener("ended", () => {
//         console.log("Video ended");
//       });

//       player.video.addEventListener("timeupdate", () => {
//         const currentTime = Math.floor(player.video.currentTime);
//         const duration = player.video.duration;

//         watchedTimestamps.current.add(currentTime);
//         const watchedPercent =
//           (watchedTimestamps.current.size / duration) * 100;
//         setPercentageWatched(Math.min(watchedPercent, 100));
//       });
//     });
//   }, [videoData]);

//   return (
//     <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
//       <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
//         {title}
//       </Typography>

//       <Box
//         sx={{
//           position: "relative",
//           width: "100%",
//           paddingTop: "56.25%",
//           overflow: "hidden",
//           borderRadius: 2,
//           boxShadow: 3,
//         }}
//       >
//         {videoData.otp && videoData.playbackInfo ? (
//           <iframe
//             ref={iframeRef}
//             src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=JBVv6JkF1iHV2JAw`}
//             style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               width: "100%",
//               height: "100%",
//               border: 0,
//               zIndex: 1,
//             }}
//             allowFullScreen
//             allow="encrypted-media"
//           ></iframe>
//         ) : (
//           <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
//             Loading Video...
//           </Typography>
//         )}
//       </Box>

//       <Typography variant="body2" sx={{ mt: 2 }}>
//         Watched: {percentageWatched.toFixed(2)}%
//       </Typography>
//     </Box>
//   );
// };

// export default SingleVideoPlayer;



import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import { loadVdoCipherAPI } from "../utils/loadVdoCipher";
import { useTrackVideoProgressMutation } from "@/redux/features/videoprogress/videoprogressApi";
import { useSelector } from "react-redux";

type Props = {
  videoUrl: string; // VdoCipher video ID
  title: string;
  // userId: string; // Pass the logged-in user's ID here
};

const SingleVideoPlayer: React.FC<Props> = ({ videoUrl, title }) => {
  const userId = useSelector((state: any) => state.auth.user?._id);
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // const sessionId = useSelector((state: any) => state.session?.sessionId);
  console.log(sessionId.current);
  const [videoData, setVideoData] = useState({ otp: "", playbackInfo: "" });
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const watchedTimestamps = useRef(new Set<number>());
  const [percentageWatched, setPercentageWatched] = useState(0);

  const seekCount = useRef(0);
  const pauseCount = useRef(0);
  const skipped = useRef(false);
  const completed = useRef(false);

  const watchStart = useRef<number | null>(null);
  const lastPauseTime = useRef<number | null>(null);
  const watchDuration = useRef<number>(0);

  const [trackVideoProgress] = useTrackVideoProgressMutation();

  // Fetch secure OTP + playbackInfo
  useEffect(() => {
        if (!videoUrl) {
          console.error("Invalid videoUrl received:", videoUrl);
          return;
        }
        console.log("Sending videoUrl:", videoUrl); // Log the videoUrl
        axios
          .post(`${process.env.NEXT_PUBLIC_SERVER_URI}generateVideoUrl`, {
            videoId: videoUrl,
          })
          .then((res) => {
            setVideoData(res.data);
          })
          .catch((err) => {
            console.error("Error fetching VdoCipher OTP:", err);
          });
      }, [videoUrl]);
      
  useEffect(() => {
    if (!videoData.otp || !videoData.playbackInfo || !iframeRef.current) return;

    let intervalId: any;

    loadVdoCipherAPI().then((VdoPlayer: any) => {
      const player = VdoPlayer.getInstance(iframeRef.current);

      // START TRACK
      player.video.addEventListener("play", () => {
        console.log("Video started playing");
        watchStart.current = Date.now();

        if (
          lastPauseTime.current &&
          player.video.currentTime - (lastPauseTime.current / 1000) > 5
        ) {
          skipped.current = true;
        }

        
      });

      // PAUSE TRACK
      player.video.addEventListener("pause", () => {
        pauseCount.current += 1;
        lastPauseTime.current = Date.now();

        if (watchStart.current) {
          watchDuration.current += (Date.now() - watchStart.current) / 1000;
          watchStart.current = null;
        }

        sendProgress(player, false);
      });

      // SEEK TRACK
      player.video.addEventListener("seeked", () => {
        console.log("User seeked to", player.video.currentTime);
        seekCount.current += 1;
      });

      // END TRACK
      player.video.addEventListener("ended", () => {
        completed.current = true;

        if (watchStart.current) {
          watchDuration.current += (Date.now() - watchStart.current) / 1000;
          watchStart.current = null;
        }

        sendProgress(player, true);
      });

      // TIMEUPDATE for watch %
      player.video.addEventListener("timeupdate", () => {
        const currentTime = Math.floor(player.video.currentTime);
        const duration = player.video.duration;

        watchedTimestamps.current.add(currentTime);
        const watchedPercent =
          (watchedTimestamps.current.size / duration) * 100;
        setPercentageWatched(Math.min(watchedPercent, 100));

       
      });

      // Periodic send every 30s
      intervalId = setInterval(() => {
        sendProgress(player, false);
      }, 30000);
    });

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [videoData]);

  // Send progress to backend
  const sendProgress = (player: any, isCompleted: boolean) => {
    const currentDuration = player.video.duration;
  
    // Update current watchDuration if watching
    if (watchStart.current) {
      watchDuration.current += (Date.now() - watchStart.current) / 1000;
      watchStart.current = Date.now();
    }
  
    const totalPercentWatched =
      (watchedTimestamps.current.size / currentDuration) * 100;
  
    console.log("Total Percent Watched:", totalPercentWatched);
    console.log("Seek Count:", seekCount.current);
    console.log("Is Completed:", isCompleted);
  
    const likelySkipped =
      totalPercentWatched < 60 && seekCount.current > 0 && !isCompleted;
  
    console.log("Likely Skipped:", likelySkipped);
  
    trackVideoProgress({
      userId,
      sessionId: sessionId.current,
      videoId: videoUrl,
      watchDuration: watchDuration.current,
      totalDuration: currentDuration,
      seekCount: seekCount.current,
      pauseCount: pauseCount.current,
      totalPercentWatched: Math.min(totalPercentWatched, 100),
      skipped: likelySkipped,
      completed: isCompleted,
    });
  };

  return (
    <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        {title}
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%",
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {videoData.otp && videoData.playbackInfo ? (
          <iframe
            ref={iframeRef}
            src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}&player=JBVv6JkF1iHV2JAw`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
              zIndex: 1,
            }}
            allowFullScreen
            allow="encrypted-media"
          ></iframe>
        ) : (
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
            Loading Video...
          </Typography>
        )}
      </Box>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Watched: {percentageWatched.toFixed(2)}%
      </Typography>
    </Box>
  );
};

export default SingleVideoPlayer;
