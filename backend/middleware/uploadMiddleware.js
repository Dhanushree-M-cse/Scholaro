const multer = require('multer');
const path = require('path');
const fs = require('fs');

// In serverless environments like Vercel, the local filesystem is read-only except /tmp
const uploadDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, '../uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn('Could not ensure upload directory:', e.message);
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const uploadSingle = (fieldName) => {
  return (req, res, next) => {
    const middleware = upload.single(fieldName);
    middleware(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      next();
    });
  };
};

const uploadFields = (fieldsArray) => {
  return (req, res, next) => {
    const middleware = upload.fields(fieldsArray);
    middleware(req, res, (err) => {
      if (err) return res.status(400).json({ success: false, message: err.message });
      next();
    });
  };
};

module.exports = {
  uploadSingle,
  uploadFields
};
