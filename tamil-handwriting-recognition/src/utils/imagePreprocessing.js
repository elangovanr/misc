/**
 * Image preprocessing utilities to improve OCR accuracy
 */

/**
 * Preprocesses an image to improve OCR accuracy
 * @param {string} imageUrl - URL or path to the image
 * @returns {Promise<string>} - URL of the preprocessed image
 */
export const preprocessImage = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Get image data
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Apply preprocessing steps
        imageData = convertToGrayscale(imageData);
        imageData = increaseContrast(imageData, 50); // Increase contrast by 50%
        imageData = sharpenImage(imageData);
        imageData = binarizeImage(imageData, 128); // Threshold at 128

        // Put processed image back
        ctx.putImageData(imageData, 0, 0);

        // Convert to blob URL
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve(url);
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageUrl;
  });
};

/**
 * Convert image to grayscale
 */
const convertToGrayscale = (imageData) => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = gray;     // Red
    data[i + 1] = gray; // Green
    data[i + 2] = gray; // Blue
  }
  return imageData;
};

/**
 * Increase image contrast
 */
const increaseContrast = (imageData, contrast) => {
  const data = imageData.data;
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;       // Red
    data[i + 1] = factor * (data[i + 1] - 128) + 128; // Green
    data[i + 2] = factor * (data[i + 2] - 128) + 128; // Blue
  }
  return imageData;
};

/**
 * Sharpen image using convolution
 */
const sharpenImage = (imageData) => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const kernel = [
    0, -1, 0,
    -1, 5, -1,
    0, -1, 0
  ];

  const output = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0, g = 0, b = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const kidx = (ky + 1) * 3 + (kx + 1);

          r += data[idx] * kernel[kidx];
          g += data[idx + 1] * kernel[kidx];
          b += data[idx + 2] * kernel[kidx];
        }
      }

      const idx = (y * width + x) * 4;
      output[idx] = Math.min(255, Math.max(0, r));
      output[idx + 1] = Math.min(255, Math.max(0, g));
      output[idx + 2] = Math.min(255, Math.max(0, b));
    }
  }

  for (let i = 0; i < data.length; i++) {
    data[i] = output[i];
  }

  return imageData;
};

/**
 * Binarize image (convert to black and white)
 */
const binarizeImage = (imageData, threshold = 128) => {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i]; // Already grayscale
    const binary = gray > threshold ? 255 : 0;

    data[i] = binary;     // Red
    data[i + 1] = binary; // Green
    data[i + 2] = binary; // Blue
  }

  return imageData;
};

/**
 * Apply Otsu's method for automatic threshold detection
 */
const otsuThreshold = (imageData) => {
  const data = imageData.data;
  const histogram = new Array(256).fill(0);
  const total = data.length / 4;

  // Build histogram
  for (let i = 0; i < data.length; i += 4) {
    histogram[data[i]]++;
  }

  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let maxVariance = 0;
  let threshold = 0;

  for (let i = 0; i < 256; i++) {
    wB += histogram[i];
    if (wB === 0) continue;

    wF = total - wB;
    if (wF === 0) break;

    sumB += i * histogram[i];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const variance = wB * wF * (mB - mF) * (mB - mF);

    if (variance > maxVariance) {
      maxVariance = variance;
      threshold = i;
    }
  }

  return threshold;
};
