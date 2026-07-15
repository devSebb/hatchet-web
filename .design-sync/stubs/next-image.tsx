import * as React from "react";
export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
}
export default function Image({ src, alt, width, height, className, style, priority: _p, fill, sizes: _s, quality: _q, placeholder: _pl, blurDataURL: _b, ...rest }: ImageProps) {
  return <img src={typeof src === "string" ? src : undefined} alt={alt} width={width as number} height={height as number} className={className} style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style } : style} {...rest} />;
}
