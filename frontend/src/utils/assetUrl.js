export function assetUrl(path) {
  return new URL(path, import.meta.url).href;
}
