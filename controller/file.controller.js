const uploadFile = require("../middleware/file-uploader");
const fs = require("fs");
const baseUrl = "http://localhost:42001/files/";
const fileController = {};
const expres = require("express");
const path = require("path");

const app = expres();

app.use("/images", expres.static("assets/uploadImages"));

fileController.upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

fileController.getListFiles = (req, res) => {
  let id = req.params.id;
  if (id) {
    res.status(200).send({
      file_url: `http://localhost:42001/images/${id}`,
      name: id,
    });
  } else {
    res.status(200).send({
       message:'not found',
       success:true,
    });
  }


  // const directoryPath = __basedir + "/assets/uploadImages/";
  // const action =   "/assets/uploadImages/";
  // const filePath = path.join(__dirname,
  //   action).split("%20").join(" ");
  //   let fileInfos = [];
  //   console.log(filePath);

  // fs.readdir(directoryPath, function (err, files) {
  //   if (err) {
  //     res.status(500).send({
  //       message: "Unable to scan files!",
  //     });
  //   }

  //   files.forEach((file) => {
  //     fileInfos.push({
  //       name: file,
  //       url: directoryPath + file,

  //     });
  //   });

  //   res.status(200).send(fileInfos);
  // });
};

fileController.download = async (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/assets/uploadImages/";

  await res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

fileController.remove = async (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/assets/uploadImages/";

  await fs.unlink(directoryPath + fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    }

    res.status(200).send({
      message: "File is deleted.",
    });
  });
};

fileController.removeSync = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = __basedir + "/assets/uploadImages/";

  try {
    fs.unlinkSync(directoryPath + fileName);

    res.status(200).send({
      message: "File is deleted.",
    });
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err,
    });
  }
};

module.exports = fileController;
