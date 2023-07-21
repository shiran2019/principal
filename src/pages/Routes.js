import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Artgal from "./Main pages/Student/Artgal";
import TalentPage from "./Talentpage";

import Today from "./Today";
import News from "./Main pages/Others/News";
import Ourteachers from "./Ourteachers";
import Contact from "./Main pages/Others/contact";

import Std from "./Main pages/Student/Student";
import StdReg from "./Main pages/Student/Registr";
import Teacher from "./Main pages/Teacher/Teacher";
import TchReg from "./Main pages/Teacher/TchReg";
import ClsAdd from "./Main pages/Others/ClassRoom";
import StdTable from "./Main pages/Student/Student";
import TchTable from "./Main pages/Teacher/Teacher";
import TermEvos from "./Main pages/Student/TermEvoluations/TermEvos";
import Login from "./Login";
import { AuthContext } from "../helpers/AuthContext";
import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentAttendance from "./Main pages/Student/Attendance/StudentAttendance";
import TeacherAttendance from "./Main pages/Teacher/Attendance/TeacherAttendance";
import Paymnt from "./Main pages/Student/Payments/Paymnt";
import Salary from "./Main pages/Teacher/Salary";
import ApointmentDetails from "./Main pages/Appointments/ApointmentDetails";
import TeacherApp from "./Main pages/Appointments/TeacherApp";
import Appointments from "./Main pages/Appointments/Appointments";
import Profile from "./Main pages/Student/Profile/Profile";
import TchProfile from "./Main pages/Teacher/Profile/Profile";
import { AdminProf } from "./Main pages/Admin/AdminProf";
import { EvoResult } from "./Main pages/Student/Other/EvoResult";
import { MyArts } from "./Main pages/Student/Other/MyArts";
import { Payments } from "./Main pages/Student/Other/Payments";
import { BestKid } from "./Main pages/Teacher/BestKid";

export default function Paths() {
  const [authState, setAuthState] = useState({
    user: "",
    status: false,
    id: 0,
    role: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/users/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log(response.data.role);
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else if (response.data.role == "Student") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 1,
            role: response.data.role,
          });
        } else if (response.data.role == "Admin") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 2,
            role: response.data.role,
          });
        } else if (response.data.role == "Teacher") {
          setAuthState({
            user: response.data.user,
            status: true,
            id: 3,
            role: response.data.role,
          });
        } else console.log("fsgfgfg");
      });
  }, []);

  return (
    <>
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <div>
          <Router>
            <Routes>

              <Route path="/login" element={<Login />}></Route>
             

              <Route path="/talent-page" element={<TalentPage />}></Route>
              <Route path="/today" element={<Today />}></Route>

              {authState.role === "Admin" && (
                <>
                  <Route
                    path="/adminAppointments"
                    element={<Appointments />}
                  ></Route>
                  <Route path="/teacherSalary" element={<Salary />}></Route>
                  <Route path="/teacherReg" element={<TchReg />}></Route>
                  <Route path="/teacherDetails" element={<TchTable />}></Route>
                  <Route
                    path="/teacherattendance"
                    element={<TeacherAttendance />}
                  ></Route>
                  <Route path="/art-gallery" element={<Artgal />}></Route>

                  <Route path="/payments" element={<Paymnt />}></Route>

                  <Route path="/studentReg" element={<StdReg />}></Route>

                  <Route path="/classAdd" element={<ClsAdd />}></Route>
                  <Route path="/our-teachers" element={<Ourteachers />}></Route>
                  <Route path="/teacherDet" element={<Teacher />}></Route>
                  <Route path="/studentDetails" element={<StdTable />}></Route>

                  <Route path="/termEvoluations" element={<TermEvos />}></Route>
                  <Route path="/" element={<AdminProf/>}></Route>
                  <Route path="/bestKids" element={<BestKid/>}></Route>
                </>
              )}

              {authState.role === "Teacher" && (
                <>
                  <Route
                    path="/appointmentsTeacher"
                    element={<TeacherApp />}
                  ></Route>

                  <Route path="/art-gallery" element={<Artgal />}></Route>

                  <Route path="/studentDetails" element={<StdTable />}></Route>

                  <Route path="/termEvoluations" element={<TermEvos />}></Route>
                  <Route path="/" element={<TchProfile/>}></Route>
                  <Route path="/bestKids" element={<BestKid/>}></Route>
                </>
              )}

              {authState.role == "Student" ? (
                <>
                <Route exact path="/" element={<Profile/>}></Route>
                  <Route
                    path="/appointments"
                    element={<ApointmentDetails />}
                  ></Route>
                  <Route path="/contact" element={<Contact />}></Route>
                  <Route path="/myResults" element={<EvoResult />}></Route>
                  <Route path="/myArts" element={<MyArts />}></Route>
                  <Route path="/myPayments" element={<Payments />}></Route>
                  
                </>
              ) : (
                <>Loading</>
              )}


              <Route path="/news" element={<News />}></Route>

              <Route path="/studentDet" element={<Std />}></Route>

              <Route
                path="/Studentattendance"
                element={<StudentAttendance />}
              ></Route>
              <Route path="*" element={"FUCK OFF"}></Route>
            </Routes>
          </Router>
        </div>
      </AuthContext.Provider>
    </>
  );
}
