/**
 * Redimensionne une image choisie sur l'appareil avant de la stocker.
 * Réutilisé par les couvertures de livres, le moodboard et les souvenirs.
 */
export async function fileToResizedDataUrl(
  file: File,
  maxWidth: number,
  quality = 0.75,
): Promise<string> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const scale = Math.min(1, maxWidth / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const context = canvas.getContext("2d");
    if (!context) throw new Error("canvas indisponible");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    bitmap.close();
  }
}
