import React, { useContext, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom"
import { AppContext } from '../contexts/AppContext';
import { UserContext } from '../contexts/UserContext';
import reduceIcon from '../assets/reduce.png';
import addIcon from '../assets/add.png';
import buyIcon from '../assets/buy.png';
import juniConcert from '../assets/juniconcert.png';
import dateIcon from '../assets/date.png';
import timeIcon from '../assets/time.png';
import nameTagIcon from '../assets/nametag.png';
import phoneIcon from '../assets/phone.png';
import emailIcon from '../assets/email.png';
import pinIcon from '../assets/pin.png';
import mapImg from '../assets/maps.png';
import Footer from '../components/Footer';
import { API } from '../config/Api';
import { useMutation, useQuery } from 'react-query';

const DetailEvent = () => {
   const {id} = useParams();

   const navigate = useNavigate();
   const contexts = useContext(AppContext);
   const [state,] = useContext(UserContext);
   const [qty, setQty] = useState(1)

   let { data: event } = useQuery("eventCache", async () => {
      const response = await API.get(`/event/${id}`);
      return response.data.data;
   });

   const handlerBuy = useMutation(async (e) => {
      try {
         e.preventDefault();
  
         const config = {headers: {"Content-type": "application/json"}};
         const body = JSON.stringify({
            event_id: parseInt(id),
            qty: qty,
            price: event.price * qty
         });
         await API.post("/add-payment", body, config);
   
         setQty(1)

      } catch (error) {
         console.log(error);
      }
   });

   return (
      <>
         <Container style={{marginTop: "180px", padding: "0 20px 0px", marginBottom: "40px"}}>
            <div>
               <div className='rounded-3 mb-5 overflow-hidden' style={{border: "4px solid #9a9a9a"}}>
                  <div>
                     <img src={event?.image} width="100%"/>
                  </div>
                  <div className='mx-4 my-3 pb-4' style={{borderBottom: "3px solid #9a9a9a"}}>
                     <div className='d-flex justify-content-between mt-4 mb-2'>
                        <h1 >{event?.title}</h1>
                        <h5 className='fs-1 fw-bold' style={{color: "#ff5555"}}>Rp. {(event?.price * qty).toString().slice(0, 3)}.000</h5>
                     </div>
                     <div className='d-flex justify-content-between align-items-center'>
                        <h5 className='fs-4 bg mb-0' style={{color: "#ff5555"}}>Music</h5>
                        <div className='d-flex align-items-center justify-content-between'>
                           {event?.progress === "Event is over" ? (
                              <h3 style={{backgroundColor: "#ff5555", padding: "2px 10px", color: "white"}}>Event is over</h3>
                           ) : (
                              <>
                                 <div className='d-flex align-items-center justify-content-between me-4' style={{width: "110px"}}>
                                    <img onClick={() => {if(qty > 1) {setQty(qty-1)}}} src={reduceIcon} width="34px" style={{cursor: "pointer"}}/>
                                    <span className='fs-4 fw-bold'>{qty}</span>
                                    <img onClick={() => setQty(qty+1)} src={addIcon} width="34px" style={{cursor: "pointer"}}/>
                                 </div>
                                 {contexts.isLogin === true ? (
                                    <img onClick={(e) => handlerBuy.mutate(e)} src={buyIcon} height="34px" style={{cursor: "pointer"}}/>
                                 ) : (
                                    <img onClick={() => contexts.setShowLogin(true)} src={buyIcon} height="34px" style={{cursor: "pointer"}}/>
                                 )}
                              </>
                           )}
                        </div>
                     </div>
                  </div>
                  <div className='d-flex mx-4 pb-4 mt-4 pt-3'>
                     <div className='col-5'>
                        <h2 className='fw-bold fs-3 mb-4' style={{color: "#454545"}}>Hosted By</h2>
                        <div className='d-flex align-items-center'>
                           <img src={juniConcert} height="100px" style={{cursor: "pointer"}}/>
                           <h4 className='text-muted ms-3'>Juni Concert</h4>
                        </div>
                     </div>
                     <div className='col-4'>
                        <h2 className='fw-bold fs-3 mb-4' style={{color: "#454545"}}>Date and Time</h2>
                        <div to='/myticket' className='text-muted fw-semibold text-decoration-none d-flex align-items-center mb-3'>
                           <img src={dateIcon} width='36px' className='me-3'/>
                           <span className='d-inlineblock fs-5'>{event?.start_date.slice(5, 16)} - {event?.end_date.slice(5, 16)}</span>
                        </div>
                        <div to='/myticket' className='text-muted fw-semibold text-decoration-none d-flex align-items-center'>
                           <img src={timeIcon} width='36px' className='me-3'/>
                           <span className='d-inlineblock fs-5'>{event?.start_date.slice(17, 19)} : {event?.start_date.slice(20, 22)} - {event?.end_date.slice(17, 19)} : {event?.end_date.slice(20, 22)}</span>
                        </div>
                     </div>
                     <div className='col-3'>
                        <h2 className='fw-bold fs-3 mb-4' style={{color: "#454545"}}>Contact Person</h2>
                        <div to='/myticket' className='text-muted fw-semibold text-decoration-none d-flex align-items-center mb-3'>
                           <img src={nameTagIcon} width='36px' className='me-3'/>
                           <span className='d-inlineblock fs-5'>{event?.merchant.name}</span>
                        </div>
                        <div to='/myticket' className='text-muted fw-semibold text-decoration-none d-flex align-items-center mb-3'>
                           <img src={phoneIcon} width='36px' className='me-3'/>
                           <span className='d-inlineblock fs-5'>{event?.phone}</span>
                        </div>
                        <div to='/myticket' className='text-muted fw-semibold text-decoration-none d-flex align-items-center mb-3'>
                           <img src={emailIcon} width='36px' className='me-3'/>
                           <span className='d-inlineblock fs-5'>{event?.email}</span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className='d-flex pb-4 mt-4 pt-3'>
                  <div className='col-6 pe-5 pt-3' style={{borderRight: "3px solid #9a9a9a"}}>
                     <h2 className='fw-bold fs-3 mb-5 text-center' style={{color: "#454545"}}>Event Description</h2>
                     <h6 className='fs-5 text-secondary mb-3'>{event?.description}</h6>
                     <p className='fs-5 text-secondary' style={{ textAlign: "justify"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                     <p className='fs-5 text-secondary' style={{ textAlign: "justify"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
                  <div className='col-6 ps-5 pt-3'>
                     <h2 className='fw-bold fs-3 mb-4 text-center' style={{color: "#454545"}}>Location</h2>
                     <div className='text-muted fw-semibold text-decoration-none d-flex align-items-center mb-4'>
                        <img src={pinIcon} width='36px' className='me-3'/>
                        <span className='d-inlineblock fs-5 pt-4' style={{ textAlign: "justify"}}>{event?.url_map}</span>
                     </div>
                     <div className='text-muted fw-semibold text-decoration-none d-flex align-items-center w-100'>
                        <img src={mapImg} width='100%'/>
                     </div>
                  </div>
               </div>
            </div>
         </Container>

         <Footer/>
      </>
   );
}

export default DetailEvent;

