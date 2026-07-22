"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "@phosphor-icons/react/ssr";
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
 * mockup. It does NOT autoplay on load — an IntersectionObserver starts it only
 * once the container is at least half on-screen (the viewport's lower edge has
 * crossed the container's midpoint), and pauses it again when it scrolls away.
 * A corner button lets the visitor pause/resume manually; a manual pause sticks
 * (scrolling won't override it) until they press play again.
 */
export function HeroVideo({
  playbackId,
  poster,
  title,
  className,
  style,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  // When the visitor pauses by hand, don't let scrolling auto-resume until they
  // press play. A ref (not state) so the observer callback reads it live.
  const manuallyPausedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Force the muted *property* on mount: the JSX `muted` attribute alone is
  // unreliable in React, and browsers only allow programmatic play() (which the
  // observer triggers without a click) on a muted video.
  const setVideoRef = useCallback(
    (el: HTMLVideoElement | null | undefined) => {
      videoRef.current = el ?? null;
      if (el) {
        el.muted = true;
      }
    },
    [],
  );

  // Keep the button icon in sync with the real play state.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  // Scroll-driven playback. The first callback fires synchronously on observe
  // with the load-time position; we swallow it so nothing autoplays on a fresh
  // page load, then act on every subsequent crossing.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    let initialized = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!initialized) {
          initialized = true;
          return;
        }
        const video = videoRef.current;
        if (!video) {
          return;
        }
        // ≥ 50% visible ⇒ the container's midpoint is inside the viewport.
        if (entry.intersectionRatio >= 0.5) {
          if (!manuallyPausedRef.current) {
            void video.play().catch(() => {});
          }
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.5, 1] },
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (video.paused) {
      manuallyPausedRef.current = false;
      void video.play().catch(() => {});
    } else {
      manuallyPausedRef.current = true;
      video.pause();
    }
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <MuxVideo
        className={className}
        loop
        metadata={{ video_title: title ?? "Hatchet product overview" }}
        muted
        playsInline
        poster={poster}
        playbackId={playbackId}
        preload="metadata"
        ref={setVideoRef}
        streamType="on-demand"
        style={style}
      />
      <button
        aria-label={isPlaying ? "Pause video" : "Play video"}
        className="absolute bottom-[14px] left-[14px] z-10 flex size-[38px] items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:outline-none"
        onClick={togglePlay}
        type="button"
      >
        {isPlaying ? (
          <Pause aria-hidden="true" className="size-[18px]" weight="fill" />
        ) : (
          <Play aria-hidden="true" className="size-[18px]" weight="fill" />
        )}
      </button>
    </div>
  );
}
