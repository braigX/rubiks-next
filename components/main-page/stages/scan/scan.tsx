"use client";

import { useScanRefresh } from "@/lib/use-scan-refresh";
import React, { useEffect, useRef, useState } from "react";
import { useGetScannedColors } from "../../../../lib/use-get-scanned-colors";
import { useAppStore } from "@/lib/store/store";
import { motion } from "framer-motion";
import ScanCard from "./card";

const ScanCubeStage = () => {
  const [video, setVideo] = useState<HTMLVideoElement>();
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [streamStared, setStreamStarted] = useState(false);

  const { scanReversed, previewReversed, scanSize, deviceId, updateCubeScan, updateStore } = useAppStore();

  const getScannedColors = useGetScannedColors({ video, canvas });
  useScanRefresh({ getScannedColors });

  const inited = useRef(false);

  useEffect(() => {
    if (inited.current) return;
    inited.current = true;
    const videoEl = document.querySelector("video") as HTMLVideoElement;
    const canvasEl = document.querySelector("#canvas-scan") as HTMLCanvasElement;
  
    setVideo(videoEl);
    setCanvas(canvasEl);
  
    const fn = async () => {
      if (streamStared) {
        videoEl.play();
      }
  
      try {
        const constraints = {
          video: {
            deviceId: deviceId ? { exact: deviceId } : undefined,
            aspectRatio: { ideal: 9 / 16 },
            height: { ideal: 1280 },
          },
        };
  
        console.log("Using constraints:", constraints);
  
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
  
        videoEl.srcObject = stream;
        videoEl.play();
      } catch (error) {
        console.error("Error accessing media devices.", error);
        // Handle error appropriately
      }
    };
  
    fn();
  }, []);
  

  const onVideoCanPlay = () => {
    setStreamStarted(true);
    if (!streamStared) {
      updateStore({ isScanRefreshing: true });
      updateCubeScan([]);
    }
  };

  return (
    <div>
      <motion.div
        className="flex w-screen h-screen relative  items-center justify-center"
        initial={{ opacity: 0 }}
        animate={streamStared ? { opacity: 1, transition: { delay: 0.5 } } : { opacity: 0 }}
        exit={{ opacity: 0 }}
      >
        <motion.video
          autoPlay
          className={scanReversed || previewReversed ? "-scale-x-100" : undefined}
          onCanPlay={onVideoCanPlay}
          playsInline
        />
        <ScanCard />
        {streamStared && (
          <div
            className="absolute grid grid-cols-3 grid-rows-3 [&_div]:border-2 [&_div]:border-zinc-900 rounded-lg border-2 border-zinc-900 border-collapse overflow-hidden opacity-70"
            style={{ width: `${scanSize}px`, height: `${scanSize}px` }}
          >
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        )}
      </motion.div>

      <canvas id="canvas-scan" className={`hidden ${scanReversed ? "-scale-x-100" : ""}`} />
    </div>
  );
};

ScanCubeStage.displayName = "ScanCubeStage";

export default ScanCubeStage;

// git remote add origin https://github.com/braigX/rubiks-next.git
// git branch -M main
// git push -u origin main