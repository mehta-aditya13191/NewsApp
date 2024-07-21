// import axios from "axios";
// export const uploadImage = async (img) => {
//   let imgUrl = null;

//   await axios
//     .get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
//     .then(async ({ data: { uploadURL } }) => {
//       await axios({
//         method: "PUT",
//         url: uploadURL,
//         headers: { "Content-Type": "mutlipart/form-data" },
//         data: img,
//       }).then(() => {
//         imgUrl = uploadURL.split("?")[0];
//       });
//     });

//   return imgUrl;
// };

import axios from "axios";

export const uploadImage = async (img) => {
  let imgUrl = null;
  try {
    // Get the upload URL from the server
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_DOMAIN}/get-upload-url`
    );
    const { uploadURL } = response.data;

    // Upload the image to the S3 bucket
    await axios.put(uploadURL, img, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Extract and return the image URL
    imgUrl = uploadURL.split("?")[0];
  } catch (error) {
    console.error("Error uploading image:", error.message);
  }

  return imgUrl;
};
