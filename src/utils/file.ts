export const getFilenameWithoutExtension = (filename: string): string => {
  const idx = filename.lastIndexOf(".");
  return idx !== -1 ? filename.slice(0, idx) : filename;
};
