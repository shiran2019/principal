import axios from "axios";
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import NavigationBar from "../../../../components/Navbar";
import { AuthContext } from "../../../../helpers/AuthContext";


const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'EvoType',
    headerName: 'Term Evaluation Type',
    width: 200,
    editable: true,
  },
   {
    field: 'Activity',
    headerName: 'Activity',
    width: 200,
    editable: true,
  },
  {
    field: 'Mark',
    headerName: 'Mark',
    width: 150,
    editable: true,
  },
 
];

  export const EvoResult = () => {

    const [authState, setAuthState] = useState({
      user: "",
      status: false,
      id: 0,
      role: "",
    });
  
  const [stdArray, setStdArray] = useState([]);


  useEffect(() => {

    const fetchAuthData = async () => {
      
      try {
        const response = await axios.get("http://localhost:3001/users/auth", {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        });

        localStorage.setItem("user", response.data.user);
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else if (response.data.role === "Student") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 1,
            role: response.data.role,
          });
        } else if (response.data.role === "Admin") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 2,
            role: response.data.role,
          });
        } else if (response.data.role === "Teacher") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 3,
            role: response.data.role,
          });
        } else {
          console.log("Invalid role:", response.data.role);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }



   fetchAuthData();
    Table();
   
    
  }, []);

useEffect(() => {
  Table();
}, [authState.user]);

  const Table = () => {

    console.log(authState.user)
    axios
    .get(`http://localhost:3001/termEvoluations/student/${authState.user}`)
    .then((response) => {
      setStdArray(response.data);
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });
  };



  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
      <div className="App">
        <NavigationBar/>
      </div>
    <div>
     <Row>
    
     <center> <Col lg={10}>

     <h1>My Results</h1>
      <Box sx={{ height: 400, width: '60%' }}>
      <DataGrid
        rows={stdArray}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
      </Col></center>
     </Row>
     </div>
     </AuthContext.Provider>
     </>
   
  );
}