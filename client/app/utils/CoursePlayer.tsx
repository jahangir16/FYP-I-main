import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Box, Typography, List, ListItem } from "@mui/material";

type Video = {
  videoId: string;
  title: string;
  otp: string;
  playbackInfo: string;
};

type Props = {
  videos: { title: string; videoUrl: string }[]; // Updated to array of objects
};

const CoursePlayer: React.FC<Props> = ({ videos }) => {
  const [videoData, setVideoData] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const playerRef = useRef<HTMLIFrameElement | null>(null);
  const playerInstance = useRef<any>(null);

  useEffect(() => {
    if (!videos || videos.length === 0) {
      return;
    }

    const fetchVideos = async () => {
      try {
        const videoUrls = videos.map((video) => video.videoUrl);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}getVdoCipherOTP`,
          { videoIds: videoUrls }
        );

        if (!response.data.videos) {
          console.error("Invalid response structure:", response.data);
          return;
        }

        setVideoData(
          response.data.videos.map((video: any, index: number) => ({
            videoId: videoUrls[index],
            title: videos[index].title, // Use the title from props
            otp: video.otp,
            playbackInfo: video.playbackInfo,
          }))
        );
      } catch (error) {
        console.error("Error fetching video OTPs:", error);
      }
    };

    fetchVideos();
  }, [videos]);

  useEffect(() => {
    if (videoData.length > 0 && playerRef.current) {
      const { otp, playbackInfo } = videoData[currentIndex];

      // Set initial video source
      playerRef.current.src = `https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`;

      const initializePlayer = () => {
        if (!playerInstance.current) {
          playerInstance.current = (window as any).VdoPlayer.getInstance(
            playerRef.current
          );

          // Auto-play next video when the current video ends
          playerInstance.current?.video.addEventListener("ended", () => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % videoData.length);
          });
        }
      };

      playerRef.current.onload = initializePlayer;
    }
  }, [videoData, currentIndex]);

  const handleVideoChange = (index: number) => {
    setCurrentIndex(index);
    if (playerInstance.current) {
      const { otp, playbackInfo } = videoData[index];
      playerInstance.current.api.loadVideo({ otp, playbackInfo });
    }
  };

  return (
    <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
      {videoData.length > 0 ? (
        <>
          {/* Video Player */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              maxWidth: "640px",
              margin: "auto",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            <iframe
              ref={playerRef}
              id="vdo-ifr"
              allow="encrypted-media"
              allowFullScreen
              title={videoData[currentIndex].title}
              width="100%"
              height="360"
            />
          </Box>

          {/* Playlist */}
          <Typography variant="h6" sx={{ mt: 3 }}>
            Playlist
          </Typography>
          <List sx={{ maxWidth: "400px", margin: "auto", textAlign: "left" }}>
            {videoData.map((video, index) => (
              <ListItem
                key={video.videoId}
                onClick={() => handleVideoChange(index)}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    index === currentIndex ? "#f1f1f1" : "transparent",
                  padding: "10px",
                  borderRadius: "4px",
                  "&:hover": { backgroundColor: "#f9f9f9" },
                  fontWeight: index === currentIndex ? "bold" : "normal",
                }}
              >
                {video.title}
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          Loading videos...
        </Typography>
      )}
    </Box>
  );
};

export default CoursePlayer;
