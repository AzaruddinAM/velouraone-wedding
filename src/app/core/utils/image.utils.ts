/**
 * Shrinks an uploaded photo so it stays light enough to preview and store.
 * Returns a JPEG data URL with the longest side ≤ `maxSize` pixels.
 */
export async function resizeImageFile(file: File, maxSize = 1000, quality = 0.85): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is not supported in this browser');

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', quality);
}

/** Converts a data URL back into a File (used for sharing the photo). */
export async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const blob = await (await fetch(dataUrl)).blob();
  return new File([blob], fileName, { type: blob.type || 'image/jpeg' });
}
