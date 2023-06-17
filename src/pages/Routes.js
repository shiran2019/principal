import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Artgal from "./Artgal";
import TalentPage from "./Talentpage";
import TermEvaluations from "./TermEvaluations";
import Appointments from "./Main pages/Appointments/Appointments";
import Today from "./Today";
import News from "./Main pages/Others/News";
import Ourteachers from "./Ourteachers";
import Contact from "./Main pages/Others/contact";
import Profile from "./Main pages/Profile/Profile";
import Paymnt from "./Paymnt";
import Std from "./Main pages/Student/Student";
import StdReg from "./Main pages/Student/Registr";
import Teacher from "./Main pages/Teacher/Teacher";
import TchReg from "./Main pages/Teacher/TchReg";
import ClsAdd from "./Main pages/Others/ClassRoom";

export default function Paths() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route exact path="/" element={<Profile />}></Route>
            <Route path="/art-gallery" element={<Artgal />}></Route>
            <Route path="/talent-page" element={<TalentPage />}></Route>
            <Route path="/today" element={<Today />}></Route>
            <Route
              path="/term-evaluations"
              element={<TermEvaluations />}
            ></Route>
            <Route path="/appointments" element={<Appointments />}></Route>

            <Route path="/news" element={<News />}></Route>
            <Route path="/our-teachers" element={<Ourteachers />}></Route>
            <Route path="/contact" element={<Contact />}></Route>
            <Route path="/payments" element={<Paymnt />}></Route>
            <Route path="/studentDet" element={<Std />}></Route>
            <Route path="/studentReg" element={<StdReg />}></Route>
            <Route path="/teacherDet" element={<Teacher />}></Route>
            <Route path="/teacherReg" element={<TchReg />}></Route>
            <Route path="/classAdd" element={<ClsAdd />}></Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}
