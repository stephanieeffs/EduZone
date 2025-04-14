import { useState } from "react";

/**
 * Custom hook to handle image loading errors and provide a placeholder image
 * @param src The source URL of the image
 * @param placeholderSrc The placeholder image URL to use if the main image fails to load
 * @returns An object with the current image source and an error handler function
 */
export const useImageWithFallback = (
  src: string,
  placeholderSrc: string = "/placeholder.svg"
) => {
  const [imgSrc, setImgSrc] = useState<string>(src);

  const handleError = () => {
    setImgSrc(placeholderSrc);
  };

  return { imgSrc, handleError };
};

/**
 * Image component with built-in error handling and placeholder fallback
 */
export const ImageWithFallback = ({
  src,
  alt,
  placeholderSrc = "/placeholder.svg",
  className = "",
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement> & { placeholderSrc?: string }) => {
  const { imgSrc, handleError } = useImageWithFallback(src, placeholderSrc);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};
