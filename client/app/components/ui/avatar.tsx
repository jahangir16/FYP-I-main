import type React from "react";
import Image from "next/image";

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  className?: string;
}

export const Avatar: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
> = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const AvatarImage: React.FC<AvatarProps & { className?: string }> = ({
  src,
  alt = "",
  className = "",
  ...props
}) => {
  return src ? (
    <div className={`aspect-square h-full w-full ${className}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover"
        {...props}
      />
    </div>
  ) : null;
};

export const AvatarFallback: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { className?: string }
> = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
