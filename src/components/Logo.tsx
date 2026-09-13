import Image from "next/image";
import { clsx } from "clsx";

type LogoProps = {
  /** "icon" = map/compass/anchor mark only. "full" = mark plus wordmark and tagline. */
  variant?: "icon" | "full";
  className?: string;
  priority?: boolean;
};

// West Coast Marine Training's logo, cropped from the source artwork into
// two transparent-background assets (see public/logo-*.png). Both keep
// their native aspect ratio — size with the `className` height, width
// follows automatically.
export function Logo({ variant = "icon", className, priority }: LogoProps) {
  if (variant === "full") {
    return (
      <Image
        src="/logo-full.png"
        alt="West Coast Marine Training"
        width={526}
        height={598}
        priority={priority}
        className={clsx("h-auto w-auto", className)}
      />
    );
  }
  return (
    <Image
      src="/logo-icon.png"
      alt="West Coast Marine Training"
      width={432}
      height={421}
      priority={priority}
      className={clsx("h-auto w-auto", className)}
    />
  );
}
