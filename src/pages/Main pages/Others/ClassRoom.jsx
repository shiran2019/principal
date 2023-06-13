import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function ClassRoom() {
  const navigate = useNavigate();
    const initialValues ={
        className:"",
        postText:"",
        username:"",
    }
    const onSubmit =(data) =>{
        //console.log(data);
        axios.post("http://localhost:3001/classes", data).then((response) => {
          navigate('/');
    });

    }
  return (
    <div className="createPostPage">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
            <label>Title: </label>
          <Field id="inputCreatePost" name="title" placeholder="(Ex. Title)" />
          <label>postText: </label>
          <Field id="inputCreatePost" name="postText" placeholder="(Ex. postText)" />
          <label>username: </label>
          <Field id="inputCreatePost" name="username" placeholder="(Ex. uname)" />
          <button type="submit"> Create Posts</button>
        </Form>
      </Formik>
    </div>
  );
}
