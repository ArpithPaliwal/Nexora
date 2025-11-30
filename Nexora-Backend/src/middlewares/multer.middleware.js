import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// go two levels up from src/middlewares to reach backend_chai
const projectRoot = path.join(__dirname, '..', '..');
const uploadPath = path.join(projectRoot, 'public', 'temp');

// create folder if it doesn't exist
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
        console.log('upload by multer to:', uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + unique + ext);
    }
});
console.log('multer succesfull');
const upload = multer({ storage });
export { upload };
