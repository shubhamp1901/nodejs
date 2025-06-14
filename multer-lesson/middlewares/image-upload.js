const multer = require('multer')

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

// const filter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) {
//         cb(null, true);
//     } else {
//         cb(false);
//     }
// }

// Create the multer instance
const upload = multer({ storage: storage });

module.exports = upload