export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file || !file.name || !file.type) {
      reject(new Error('Invalid file type'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string; // FileReader result is string when using readAsDataURL
      const base64 = result.split(',')[1]; // remove data:mimetype;base64,
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
}
``