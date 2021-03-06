var cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dmcbeyvr4",
  api_key: "641921374166998",
  api_secret: "q4zM2BjtuVSux3hKkXpG_SqqcnY",
  secure: true,
});
const upload = async(filename) => {
  await cloudinary.uploader.upload(
    `uploaded_imgs/ques/${filename}`,
    (use_filename) => true,
    (folder) => "iitgstackoverflow/questions",
    { tags: "basic_sample" },
    function (err, image) {
      console.log();
      console.log("** File Upload");
      if (err) {
        console.warn(err);
      }
      console.log(
        "* public_id for the uploaded image is generated by Cloudinary's service."
      );
      console.log("* " + image.public_id);
      console.log("* " + image.url);
    }
  );
};
module.exports = upload;
