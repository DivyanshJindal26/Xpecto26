import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

/**
 * OptimizedImage - A component for efficient image loading with:
 * - Lazy loading using Intersection Observer
 * - Blur placeholder effect
 * - Loading skeleton
 * - Error handling
 * - Progressive loading
 */
export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  blurDataURL,
  priority = false,
  skeleton = true,
  onLoad,
  onError,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Skip intersection observer for priority images
    if (priority) return;

    // Create intersection observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Disconnect once image is in view
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before image enters viewport
      },
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    setIsLoaded(true);
    onError?.(e);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Skeleton/Blur Placeholder */}
      {!isLoaded && skeleton && (
        <motion.div
          className="absolute inset-0 bg-white/5 animate-pulse"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {blurDataURL && (
            <img
              src={blurDataURL}
              alt=""
              className="w-full h-full object-cover blur-xl scale-110"
              aria-hidden="true"
            />
          )}
        </motion.div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5">
          <div className="text-white/40 text-sm">Failed to load image</div>
        </div>
      )}

      {/* Actual Image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          className={className}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? "eager" : "lazy"}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded && !hasError ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          {...props}
        />
      )}
    </div>
  );
}
