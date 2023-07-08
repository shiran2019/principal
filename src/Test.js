import React, { useRef } from "react";
import { addDoc, collection } from "@firebase/firestore"; // import {addDoc , collection} from "firebase/firestore";
import { firebase } from "./Firebase";

export const Test = () => {
  const messageRef = useRef();
  const ref = collection(firebase, "messages");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = messageRef.current.value;
    console.log(message);

    try {
      const docRef = await addDoc(ref, {
        message: message,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" ref={messageRef} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
