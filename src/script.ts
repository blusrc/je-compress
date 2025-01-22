import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Define input and output folders
const inputFolder = './input_images';
const outputFolder = './output_images';

// Ensure output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

// Process images
async function processImages() {
  try {
    // Read all files in the input folder
    const files = fs.readdirSync(inputFolder);

    for (const file of files) {
      // Sanitize file name
      const sanitizedFileName = file.replace(/\?/g, '').replace(/\s+/g, '_');
      const inputFilePath = path.join(inputFolder, file);
      const outputFilePath = path.join(outputFolder, `${path.parse(sanitizedFileName).name}.webp`);

      // Check if the file is an image
      if (['.png', '.jpg', '.jpeg'].includes(path.extname(file).toLowerCase())) {
        const image = sharp(inputFilePath);
        const metadata = await image.metadata();

        let transformer = image;

        // Resize if width exceeds 2000px
        if (metadata.width && metadata.width > 2000) {
          transformer = transformer.resize({
            width: 2000,
            withoutEnlargement: true
          });
        }

        // Convert to WebP and compress
        await transformer
          .webp({ quality: 90, effort: 4 }) // High-quality compression
          .toFile(outputFilePath);

        console.log(`Processed: ${file} -> ${outputFilePath}`);
      } else {
        console.log(`Skipped non-image file: ${file}`);
      }
    }

    console.log('Image processing complete!');
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

processImages();
