// Middleware for profile images-

// Modules-
const multer = require('multer');

const storage_group_img = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(file);

    if (file.mimetype == 'image/jpeg') {

      cb(null, '/MasherStorage/group_icons');
    }
    else if (file.mimetype == 'image/png') {

      cb(null, '/MasherStorage/group_icons');
    }
    else if (file.mimetype == 'image/webp') {

      cb(null, '/MasherStorage/group_icons');
    }

  },
  filename: function (req, file, cb) {
    // console.log(file);

    if (file.mimetype == 'image/jpeg') {

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'masherGroupImg' + '-' + uniqueSuffix + '.jpg');
    }
    else if (file.mimetype == 'image/png') {

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'masherGroupImg' + '-' + uniqueSuffix + '.png');
    }
    else if (file.mimetype == 'image/webp') {

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, 'masherGroupImg' + '-' + uniqueSuffix + '.webp');
    }
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});

const upload_group_img = multer({ storage: storage_group_img });

module.exports = {
  upload_group_img: upload_group_img
};