import multer from 'multer';

const storage = multer.memoryStorage();

function fileFilter(_req, file, cb) {
  if (/^image\/(png|jpe?g|webp|gif|bmp|svg\+xml)$/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
