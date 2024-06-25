var multer = require('multer');
const uploadPic = (req, res) => {
    const upload = multer({ dest: "../assets/images/uploads" });
    upload.single("file");
    console.log(req.body);
    console.log(req.file);
    res.json(req.file);
};
module.exports = {
    uploadPic
};
//# sourceMappingURL=FileController.js.map