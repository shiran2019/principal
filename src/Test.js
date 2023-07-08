import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "@firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import React, { useRef } from "react";

const firebaseConfig = {
  // Your Firebase configuration object
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage();

export const firebase = {
  firestore: getFirestore(app),
  storage: storage,
};

export const Test = () => {
  const imageRef = useRef();
  const ref = collection(firebase.firestore, "images");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageFile = imageRef.current.files[0];

    try {
      // Create a storage reference for the image file
      const storageRef = ref(storage, imageFile.name);

      // Upload the image file to Firebase Storage
      await uploadBytes(storageRef, imageFile);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      // Save the download URL in the Firestore database
      const docRef = await addDoc(ref, {
        imageUrl: downloadURL,
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error uploading image or adding document: ", e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" ref={imageRef} accept="image/*" />
        <button type="submit">Upload Image</button>
      </form>
    </div>
  );
};
