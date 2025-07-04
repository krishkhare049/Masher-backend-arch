// Middleware for profile images-

// Modules-
const multer = require('multer');

const storage_profile_img = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(file);

    if (file.mimetype == 'image/jpeg') {

      cb(null, '/MasherStorage/profile_images');
    }
    else if (file.mimetype == 'image/png') {

      cb(null, '/MasherStorage/profile_images');
    }
    else if (file.mimetype == 'image/webp') {

      cb(null, '/MasherStorage/profile_images');
    }

  },
  filename: function (req, file, cb) {
    // console.log(file);

    if (file.mimetype == 'image/jpeg') {

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'masherProfileImg' + '-' + uniqueSuffix + '.jpg');
    }
    else if (file.mimetype == 'image/png') {

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'masherProfileImg' + '-' + uniqueSuffix + '.png');
    }
    else if (file.mimetype == 'image/webp') {

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'masherProfileImg' + '-' + uniqueSuffix + '.webp');
    }
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload_profile_img = multer({ storage: storage_profile_img });

module.exports = {
  upload_profile_img: upload_profile_img
};