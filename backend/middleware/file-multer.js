const multer = require("multer");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const multerStorageConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let fileError = new Error("Invalid file type");
    if (isValid) {
      fileError = null;
    }
    callback(fileError, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('_');
    const extension = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "_" + Date.now() + '.' + extension);
  }
});

module.exports = multer({ storage: multerStorageConfig }).single("image");
