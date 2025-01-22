"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
// Define input and output folders
const inputFolder = './input_images';
const outputFolder = './output_images';
// Ensure output folder exists
if (!fs_1.default.existsSync(outputFolder)) {
    fs_1.default.mkdirSync(outputFolder, { recursive: true });
}
// Process images
function processImages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Read all files in the input folder
            const files = fs_1.default.readdirSync(inputFolder);
            for (const file of files) {
                const inputFilePath = path_1.default.join(inputFolder, file);
                const outputFilePath = path_1.default.join(outputFolder, `${path_1.default.parse(file).name}.webp`);
                // Check if the file is an image
                if (['.png', '.jpg', '.jpeg'].includes(path_1.default.extname(file).toLowerCase())) {
                    const image = (0, sharp_1.default)(inputFilePath);
                    const metadata = yield image.metadata();
                    let transformer = image;
                    // Resize if width exceeds 2000px
                    if (metadata.width && metadata.width > 2000) {
                        transformer = transformer.resize({
                            width: 2000,
                            withoutEnlargement: true
                        });
                    }
                    // Convert to WebP and compress
                    yield transformer
                        .webp({ quality: 90, effort: 4 }) // High-quality compression
                        .toFile(outputFilePath);
                    console.log(`Processed: ${file} -> ${outputFilePath}`);
                }
                else {
                    console.log(`Skipped non-image file: ${file}`);
                }
            }
            console.log('Image processing complete!');
        }
        catch (error) {
            console.error('Error processing images:', error);
        }
    });
}
processImages();
