import "bootstrap/dist/css/bootstrap.min.css";

import Navibar from "./components/Navbar/Navibar";
import { LandingPage } from "./pages/LandingPage";

import { Route, Routes } from 'react-router-dom'
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import { useContext, useEffect } from "react";
import { AppContext } from "./contexts/AppContext";
import MyTicket from "./pages/MyTickets";
import AddEvent from "./pages/AddEvent";
import Payment from "./pages/Payment";
import Profile from "./pages/Profile";
import DetailEvent from "./pages/DetailEvent";
import Category from "./pages/Category";

function App() {
   const contexts = useContext(AppContext);
   useEffect(() => {
      if (localStorage.token) {
         const token = JSON.parse(localStorage.token);
         if (new Date().getTime() > token.expiry) {
            localStorage.removeItem("token")
         }
      }
   });
   useEffect(() => {
      if (localStorage.token) {
         contexts.checkUserAuth()
      } else {contexts.setNavbarLoading(false)}
   }, []);

   return (
      <>
         <Navibar />
         <Login />
         <Register /> 
         <Routes>
            <Route exact path='/' element={<LandingPage/>} ></Route>
            <Route exact path='/profile' element={<Profile/>} ></Route>
            <Route exact path='/myticket' element={<MyTicket/>} ></Route>
            <Route exact path='/payment' element={<Payment/>} ></Route>
            <Route exact path='/add-event' element={<AddEvent/>} ></Route>
            <Route exact path='/category/:category' element={<Category/>}></Route>
            <Route exact path='/detail-event/:id' element={<DetailEvent/>}></Route>
         </Routes>
      </>
   );
}

export default App;