import { ChatBubble } from "hatchet-web";

export function Small() {
  return <ChatBubble className="size-8" />;
}

export function Medium() {
  return <ChatBubble className="size-16" />;
}

export function Large() {
  return <ChatBubble className="size-24" />;
}
