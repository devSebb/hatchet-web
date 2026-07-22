"use client";

import type { CSSProperties } from "react";
import MuxVideo from "@mux/mux-video-react";

type HeroVideoProps = {
  /**
   * Public Mux playback ID — Mux dashboard → Video → Assets → your asset →
   * Playback IDs (policy must be "public"). This is NOT the short asset id.
   */
  playbackId: string;
  /** Still frame shown before playback + while buffering (the old mockup PNG). */
  poster: string;
  title?: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * Ambient, muted, looping hero clip standing in for the static dashboard
 * mockup. `<MuxVideo>` renders a real `<video>` on the server — so the poster
 * shows immediately with no layout shift — then wires up HLS + autoplay on the
 * client.
 */
export function HeroVideo({
  playbackId,
  poster,
  title,
  className,
  style,
}: HeroVideoProps) {
  return (
    <MuxVideo
      autoPlay
      className={className}
      loop
      metadata={{ video_title: title ?? "Hatchet product overview" }}
      muted
      playsInline
      poster={poster}
      playbackId={playbackId}
      preload="auto"
      // Force the muted *property* on mount: the JSX `muted` attribute alone is
      // unreliable in React, and browsers block autoplay on non-muted video.
      ref={(el) => {
        if (el) {
          el.muted = true;
        }
      }}
      streamType="on-demand"
      style={style}
    />
  );
}
