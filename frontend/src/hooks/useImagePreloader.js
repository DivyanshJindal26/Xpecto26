import { useState, useEffect } from "react";

/**
 * Preloads a single image and returns a promise
 */
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

/**
 * Hook to preload multiple images and track loading state
 * @param {string[]} images - Array of image URLs to preload
 * @param {boolean} enabled - Whether to start preloading
 * @returns {Object} - { isLoading, isLoaded, progress, error }
 */
export function useImagePreloader(images = [], enabled = true) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled || images.length === 0) {
      setIsLoading(false);
      setIsLoaded(true);
      return;
    }

    let isCancelled = false;
    let loadedCount = 0;

    const loadImages = async () => {
      setIsLoading(true);
      setIsLoaded(false);
      setProgress(0);
      setError(null);

      try {
        // Load images with progress tracking
        const promises = images.map((src) =>
          preloadImage(src)
            .then(() => {
              if (!isCancelled) {
                loadedCount++;
                setProgress((loadedCount / images.length) * 100);
              }
            })
            .catch((err) => {
              console.warn(`Failed to preload image: ${src}`, err);
              // Don't fail the whole batch if one image fails
              if (!isCancelled) {
                loadedCount++;
                setProgress((loadedCount / images.length) * 100);
              }
            }),
        );

        await Promise.all(promises);

        if (!isCancelled) {
          setIsLoaded(true);
          setIsLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };

    loadImages();

    return () => {
      isCancelled = true;
    };
  }, [images.join(","), enabled]);

  return { isLoading, isLoaded, progress, error };
}

/**
 * Preloads critical images before app renders
 * Use this for images that are essential for the initial view
 */
export async function preloadCriticalImages(imageUrls) {
  try {
    await Promise.all(imageUrls.map(preloadImage));
    return true;
  } catch (error) {
    console.error("Error preloading critical images:", error);
    return false;
  }
}

export default useImagePreloader;
