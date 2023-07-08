import React, { useState } from "react";
import { storage } from "./Firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "@firebase/storage";

export const Testimg = () => {
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageId, setImageId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const fileChangeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      uploadFile(selectedFile);
    } else {
      console.log("No file selected.");
    }
  };

  const uploadFile = (file) => {
    const imageId = generateImageId();
    setImageId(imageId);

    const storageRef = ref(storage, `images/${imageId}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (error) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            setImageUrl(url);
            console.log(url);
          })
          .catch((error) => console.log(error));
      }
    );
  };

  const generateImageId = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `${timestamp}-${random}`;
  };

  const retrieveImage = () => {
    if (imageId) {
      const storageRef = ref(storage, `images/${imageId}`);
      listAll(storageRef)
        .then((res) => {
          res.items.forEach((itemRef) => {
            getDownloadURL(itemRef)
              .then((url) => {
                setImageUrl(url);
                console.log(url);
              })
              .catch((error) => console.log(error));
          });
        })
        .catch((error) => console.log(error));
    } else {
      console.log("No image ID found.");
    }
  };

  return (
    <div>
      <form onSubmit={formSubmitHandler}>
        <input type="file" className="input" onChange={fileChangeHandler} />
        <button type="submit">Upload</button>
      </form>
      <hr />
      <h3>Uploaded {progress} %</h3>
      {imageUrl && (
        <img
          src={imageUrl}
          style={{ width: "500px", height: "500px" }}
          alt="Uploaded"
        />
      )}
      <button onClick={retrieveImage}>Retrieve Image</button>
    </div>
  );
};
