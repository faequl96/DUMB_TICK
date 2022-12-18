import React, { useContext, useEffect, useState } from 'react';
import { Card, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"
import Footer from '../components/Footer';
import { AppContext } from '../contexts/AppContext';
import { UserContext } from '../contexts/UserContext';
import qrCode from '../assets/qrcode.png';
import { useQuery } from 'react-query';
import { API } from '../config/Api';

const MyTicket = () => {
   const navigate = useNavigate();
   const contexts = useContext(AppContext);
   const [state,] = useContext(UserContext);

   let { data: tickets, refetch } = useQuery("userTicketCache", async () => {
      const response = await API.get(`/payments-success`);
      return response.data.data;
   });

   const [isLoading, setIsLoading] = useState(true)

   useEffect(() => {
      if(tickets) {setIsLoading(false)}
   }, [tickets])

   setInterval(() => {
      refetch()
   }, 3000)

   return (
      <>
         
         <Container className='justify-content-between m-auto pb-5 px-4 mb-4' 
            style={{padding : "200px 24px 0"}}
         >
            {isLoading ? (
               <div className='d-flex ps-0 align-items-center'>
                  <h1 className='fw-bolder pe-4' style={{color: "#ff5555"}}>My Ticket</h1>
                  <Spinner animation="border" style={{color: "#ff5555"}}/>
               </div>
            ) : (
               <>
                  <h1 className='fw-bolder pb-4' style={{color: "#ff5555"}}>My Ticket</h1>
                  <div className='bg-light' style={{borderTop: "8px solid #ff5555", padding: "80px 120px 20px"}}>
                     {tickets?.map((item, index) => (
                        <div key={index} className='position-relative py-4 ps-5 pe-4 mb-5' style={{backgroundColor: "#ff5555"}}>
                           <div 
                              className='bg-light rounded-circle position-absolute' 
                              style={{height: '70px', width: '40px', left: '-22px', top: '62px'}}>
                           </div>
                           <div 
                              className='bg-light rounded-circle position-absolute' 
                              style={{height: '70px', width: '40px', left: '-22px', top: '162px'}}>
                           </div>
                           <Card 
                              className='border-0 py-0 bg-light rounded-0' 
                              style={{ width: '100%', backgroundColor : '#f4dcdc', cursor: 'pointer', borderColor: '#acacac', boxShadow: "0 2px 4px rgba(0, 0, 0, .3)" }} 
                              onClick={() => navigate(`/detail-event/${item.event.id}`)}
                           >  
                              <Card.Body className='px-0 py-0'>
                                 <div className='d-flex align-items-center px-4 pt-2' style={{backgroundColor: "#bcbcbc"}}>
                                    <p className='col-6 fw-semibold fs-4 mb-0' style={{color: "#454545"}}>{item.purchaser.name}</p>
                                    <p className='col-6 text-end mb-0' style={{color: "#454545"}}>Face value {contexts.formatRupiah(item.price)}</p>
                                 </div>
                                 <div className='d-flex align-items-center px-4 pb-1' style={{backgroundColor: "#bcbcbc"}}>
                                    <p className='col-6 fs-5 mb-1 text-muted'>{item.purchaser_id}</p>
                                    <p className='col-6 text-end fs-5 mb-1 text-muted'>{item.transaction_id}</p>
                                 </div>
                              </Card.Body>
                              <Card.Body className='d-flex justify-content-between pt-3 px-4'>
                                 <div className='col-9'>
                                    <h2 className='fw-bolder' style={{color: "#454545"}}>{item.event.title}</h2>
                                    <p className='fs-5 fw-semibold mb-1 text-muted'>{item.event.start_date}</p>
                                    <h6 className='text-muted' style={{fontSize: "1.1rem"}}>{item.event.url_map}</h6>
                                 </div>
                                 <div className='col-3 text-end'>
                                    <div className='mt-1' style={{height: "90px"}}>
                                       <img src={qrCode} className='h-100'/>
                                    </div>
                                    <h3 className='fs-4 mt-2 mb-0 fw-semibold text-end text-danger'>{item.event.progress}</h3>
                                 </div>
                              </Card.Body>
                           </Card>
                        </div>
                     ))}
                  </div>
               </>
            )}
         </Container>

         <Footer/>
      </>
   );
}

export default MyTicket;

