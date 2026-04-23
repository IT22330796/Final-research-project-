const multer = require('multer');

// Store files in memory so we can send the buffer to Supabase
const storage = multer.memoryStorage();

const upload = multer({
  storage,
});

module.exports = {
  upload,
};

