import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import NavigationBar from "../../../components/Navbar";
import { storage } from "../../..//Firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
} from "@firebase/storage";

export default function StdReg() {
  const [classArray, setClassArray] = useState([]);
  const [divContent, setDivContent] = useState();
  const { id } = useParams();
  const [parents, setParents] = useState([]);
  const [newParentid, setNewParentid] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [teacherrId, setTeacherrId] = useState("PDT000001");

  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [pwd3, setPwd3] = useState("");

  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageId, setImageId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");



  const fileChangeHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      uploadFile(selectedFile);
    } else {
      console.log("No file selected.");
      alert("No file selected.");
    }
  };

  const uploadFile = (file) => {
    const imageId = generateImageId(teacherrId);
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
            alert("Image uploaded successfully");
            setSelectedFile(null); // Clear the selected file
            

          })
          .catch((error) => console.log(error));
      }
    );
  };
  

  const generateImageId = (teacherrId) => {
    return teacherrId; // Use the studenttId as the imageId
  };

  const retrieveImage = () => {
    if (teacherrId) {
      const storageRef = ref(storage, `images/${teacherrId}`);
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

  const updateDivContent = (content) => {
    setDivContent(content);
  };

  const initialValues = {
    teacherId: "",
    fName: "",
    lName: "",
    fullname: "",
    teacherNIC: "",
    address: "",
    teacherNo: "",
    teacherEmail: "",
    regDate: "",
    password: "",
    confirmPassword: "",
   
  };

  const onSubmit = (data, { resetForm }) => {


    const { password, confirmPassword } = data;

    if(progress !== 100){ 
      alert("Please upload the image");
      return;}
  
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    } 

    const teacherData = {
      ...data,
      teacherId: teacherrId,
    };
  
    // Check if email, NIC, and contact number already exist
    axios
      .get("http://localhost:3001/teachers", {
        params: {
          teacherEmail: teacherData.teacherEmail,
          teacherNIC: teacherData.teacherNIC,
          teacherNo: teacherData.teacherNo,
        },
      })
      .then((response) => {
        const existingTeachers = response.data;
        const existingEmail = existingTeachers.find(
          (teacher) => teacher.teacherEmail === teacherData.teacherEmail
        );
        const existingNIC = existingTeachers.find(
          (teacher) => teacher.teacherNIC === teacherData.teacherNIC
        );
        const existingContactNo = existingTeachers.find(
          (teacher) => teacher.teacherNo === teacherData.teacherNo
        );
  
        if (existingEmail) {
          alert("Teacher with this email already exists.");
          return;
        }
  
        if (existingNIC) {
          alert("Teacher with this NIC already exists.");
          return;
        }
  
        if (existingContactNo) {
          alert("Teacher with this contact number already exists.");
          return;
        }
  
        // If no existing records found, proceed with submission
        axios
          .post("http://localhost:3001/teachers", teacherData)
          .then((response) => {
      

              const reg = {
                password: password,
                role: "Teacher",
                user: teacherrId,
              };
              return axios.post("http://localhost:3001/users", reg);
            })
              .then(() => {
            setSubmissionStatus("success");
            resetForm();
            onPageRefresh();
            console.log("Teacher details submitted successfully");
            alert("Teacher Id: " + String(teacherrId) + " submitted successfully");
          })
          .catch((error) => {
            setSubmissionStatus("error");
            // console.log(error);
            alert(error);
          });
      })
      .catch((error) => {
        setSubmissionStatus("error");
        console.log(error);
      });
  };
   
  const onPageRefresh = () => {
    axios
      .get("http://localhost:3001/teachers/lastId")
      .then((response) => {
        const lastId = response.data.id;
        const lastIdSuffix = lastId.slice(-6);
        const lastIdNumber = parseInt(lastIdSuffix, 10);
        let newIdNumber;
  
        if (isNaN(lastIdNumber)) {
          // If the table is empty or lastIdNumber is not a number
          newIdNumber = 1;
        } else {
          newIdNumber = lastIdNumber + 1;
        }
  
        const newIdString = "PDT" + String(newIdNumber).padStart(6, "0");
        setTeacherrId(newIdString); // Set the studentId state with the newIdString value
  
        // Additional logic on page refresh
  
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    onPageRefresh();
  }, []);

  const labelStyle = {
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "bold",
  };

  const inputStyle = {
    padding: "10px",
    marginBottom: "20px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
  };

  const buttonStyle = {
    padding: "10px 30px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    align: "right",
  };

  const formStyle = {
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    maxWidth: "60%",
    marginTop: "30px",
    backgroundColor: "#f9f9f9",
  };

  // const validateStudentId = (value) => {
  //   let error;
  //   if (!value) {
  //     error = "Student ID is required";
  //   } else if (value.length !== 6) {
  //     error = "Student ID should be 6 characters long";
  //   }
  //   return error;
  // };

  const validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Invalid email format";
    }
    return error;
  };

  const validateName = (value) => {
    let error;
    if (!value) {
      error = "Field is required";
    } else if (!/^[a-zA-Z\s]+$/.test(value)) {
      error = "Only letters are allowed";
    }
    return error;
  };



  const validateAddress = (value) => {
    let error;
    if (!value) {
      error = "Address is required";
    }
    return error;
  };


  const validatRegDay = (value) => {
    let error;
    if (!value) {
      error = "Birthday is required";
    } else {
      const selectedDate = new Date(value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      if (selectedDate > tomorrow) {
        error = "Registration date cannot be a future date";
      }
    }
    return error;
  };

  const validateParentNIC = (value) => {
    let error;
    if (!value) {
      error = "Parent NIC is required";
    } else if (!/^\d{9}([vV]|\d{3})$/.test(value)) {
      error = "Invalid NIC format";
    }
    return error;
  };

  const validateParentContactNo = (value) => {
    let error;
    if (!value) {
      error = "Contact No is required";
    } else if (!/^[0-9]{10}$/.test(value)) {
      error = "Invalid contact number format";
    }
    return error;
  };

  const validatePwd = (value) => {
    let error;
    if (!value) {
      error = "Password is required";
    } else if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6}$/.test(value)) {
      error =
        "Password should be 6 characters long and should contain numbers and letters";
    }
    return error;
  };

  const checkPwd = (value) => {
    let error;
    if (pwd1 !== pwd2) {
      error = "Wrong password";
    } else {
      setPwd3(pwd2);
    }
    return error;
  };


  return (
    <>
    <div className="App">
        <NavigationBar />
      </div>
    <div>
      <Formik
        initialValues={{
          teacherId: teacherrId,
          inputId: teacherrId,
          ...initialValues,
        }}
        onSubmit={onSubmit}
      >
        <Form style={formStyle}>
          <center>
            {" "}
            <h2 style={{ paddingBottom: "10px" }}>Teacher Registration Form</h2>
          </center>

          <Row>
            <label style={labelStyle}>Teacher ID:</label>
            <Field
              id="inputId"
              name="teacherId"
              placeholder={teacherrId}
              style={inputStyle}
              readOnly={true}
              //validate={validateStudentId}
            />
            <ErrorMessage
              name="teacherId"
              component="div"
              style={{ color: "red" }}
            />
          </Row>
          <Row>
            <label style={labelStyle}>First Name:</label>
            <Field
              id="inputCreatePost"
              name="fName"
             // placeholder="First Name"
              style={inputStyle}
              validate={validateName}
            />
            <ErrorMessage
              name="fName"
              component="div"
              style={{ color: "red" }}
            />
          </Row>

          <Row>
            <label style={labelStyle}>Last Name:</label>
            <Field
              id="inputCreatePost"
              name="lName"
            //  placeholder="Last Name"
              style={inputStyle}
              validate={validateName}
            />
            <ErrorMessage
              name="lName"
              component="div"
              style={{ color: "red" }}
            />
          </Row>
          <Row>
            <label style={labelStyle}>Full Name:</label>
            <Field
              id="inputCreatePost"
              name="fullname"
             // placeholder="Full Name"
              style={inputStyle}
              validate={validateName}
            />
            <ErrorMessage
              name="fullname"
              component="div"
              style={{ color: "red" }}
            />
          </Row>

          <Row>
            <label style={labelStyle}>Address:</label>
            <Field
              id="inputCreatePost"
              name="address"
             // placeholder="Address"
              style={inputStyle}
              validate={validateAddress}
            />
            <ErrorMessage
              name="address"
              component="div"
              style={{ color: "red" }}
            />
          </Row>

          <Row>
           
            <Col xs={12} lg={6}>
              <label style={labelStyle}>Register Date:</label>
              <Field
                type="date"
                id="inputCreatePost"
                name="regDate"
                style={inputStyle}
                validate={validatRegDay}
              />
              <ErrorMessage
                name="regDate"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
            <Col xs={12} lg={6}>
              <label style={labelStyle}>NIC:</label>
              <Field
                id="inputCreatePost"
                name="teacherNIC"
              //  placeholder="NIC number"
                style={inputStyle}
                validate={validateParentNIC}
              />
              <ErrorMessage
                name="teacherNIC"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
          </Row>

        
         

          <Row>
           
            <Col xs={12} lg={6}>
              <label style={labelStyle}>Contact No:</label>
              <Field
                id="inputCreatePost"
                name="teacherNo"
              //  placeholder="Contact No"
                style={inputStyle}
                validate={validateParentContactNo}
              />
              <ErrorMessage
                name="teacherNo"
                component="div"
                style={{ color: "red" }}
              />
            </Col>
            <Col xs={12} lg={6}>
            <label style={labelStyle}>Email:</label>
                <Field
                  id="inputCreatePost"
                  name="teacherEmail"
               //   placeholder="(Enter your full name)"
                  style={inputStyle}
                  validate={validateEmail}
                />
                 <ErrorMessage
                name="teacherEmail"
                component="div"
                style={{ color: "red" }}
              />
                </Col>
            

          </Row>
          <Row>
            <label style={labelStyle}>Password:</label>
            <Field
              type="password"
              id="inputCreatePost"
              name="password"
              placeholder="Password"
              style={inputStyle}
              validate={validatePwd}
            />
            <ErrorMessage
              name="password"
              component="div"
              style={{ color: "red" }}
            />
          </Row>

          <Row>
            <label style={labelStyle}>Confirm Password:</label>
            <Field
              type="password"
              id="inputCreatePost"
              name="confirmPassword"
              placeholder="Confirm Password"
              style={inputStyle}
              validate={checkPwd}
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              style={{ color: "red" }}
            />
          </Row>
          <Row>
            {" "}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button type="submit" style={buttonStyle}>
                Submit
              </button>
            </div>
          </Row>

          <Row>
         
         <Col>
         
        
         <label style={labelStyle}>Upload Profile picture :   </label>
       

      
        <input type="file" className="input" onChange={fileChangeHandler} />
        </Col>

       <button style={buttonStyle} onClick={formSubmitHandler}>Upload</button>

   <hr />
   <h3>Uploaded {progress} %</h3>

   <hr />
   {imageUrl && (
     <img
       src={imageUrl}
       style={{ width: "40%", height: "40%" }}
       alt="Uploaded"
     />
   )} 
         </Row>
        

         <Row>
         {" "}
         <div style={{ textAlign: "center", marginTop: "20px" }}>
           <button type="submit" style={buttonStyle}>
             Submit
           </button>
         </div>
       </Row>
        

        </Form>
      </Formik>
    </div>
    </>
  );
}
