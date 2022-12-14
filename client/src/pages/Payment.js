import React, { useContext, useEffect } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { useMutation, useQuery } from 'react-query';
import { useNavigate } from "react-router-dom"
import Footer from '../components/Footer';
import { API } from '../config/Api';
import { AppContext } from '../contexts/AppContext';
import { UserContext } from '../contexts/UserContext';

const Payment = () => {
   const navigate = useNavigate();
   const contexts = useContext(AppContext);
   const [state,] = useContext(UserContext);

   let { data: payments } = useQuery("userPaymentCache", async () => {
      const response = await API.get(`/payments`);
      return response.data.data;
   });

   const handlerCheckout = useMutation(async (transID) => {
      try {
         // e.preventDefault();

         const resMidtrans = await API.patch(`/checkout/${transID}`);
         console.log(resMidtrans);
         const token = resMidtrans.data.data.token;

         window.snap.pay(token, {
            onSuccess: function (result) {
               navigate("/");
            },
            onPending: function (result) {
               console.log(result);
            },
            onError: function (result) {
               console.log(result);
            },
            onClose: function () {
               alert("you closed the popup without finishing the payment");
            },
         });

      } catch (error) {
         console.log(error);
      }
   })

   useEffect(() => {
      const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
      const myMidtransClientKey = "SB-Mid-client-oHRMncHcXqOdGAwt";

      let scriptTag = document.createElement("script");
      scriptTag.src = midtransScriptUrl;
      scriptTag.setAttribute("data-client-key", myMidtransClientKey);

      document.body.appendChild(scriptTag);
      return () => {
          document.body.removeChild(scriptTag);
      };

   }, []);

   return (
      <>
         <Container className='justify-content-between m-auto pb-5 px-4 mb-4' 
            style={{padding : "200px 24px 0"}}
         >
            <h1 className='fw-bolder pb-5' style={{color: "#ff5555"}}>Payment</h1>
            <div className='d-flex'>
               <div className='col-6 fs-4 fw-semibold py-3 text-center text-light' style={{backgroundColor: "#ff5555"}}>Payment</div>
            </div>
            <div className='bg-light' style={{borderTop: "8px solid #ff5555", padding: "80px 120px 20px"}}>
               {payments?.map((item, index) => (
                  <div key={index}>
                     <div className='position-relative py-4 ps-5 pe-4 mb-3' style={{backgroundColor: "#ff5555"}}>
                        <div 
                           className='bg-light rounded-circle position-absolute' 
                           style={{height: '70px', width: '40px', left: '-22px', top: '50px'}}>
                        </div>
                        <div 
                           className='bg-light rounded-circle position-absolute' 
                           style={{height: '70px', width: '40px', left: '-22px', top: '150px'}}>
                        </div>
                        <Card 
                           className='border-0 py-0 bg-light rounded-0' 
                           style={{ width: '100%', backgroundColor : '#f4dcdc', cursor: 'pointer', borderColor: '#acacac', boxShadow: "0 2px 4px rgba(0, 0, 0, .3)" }}
                        >  
                           <Card.Body className='px-0 py-0'>
                              <div className='d-flex align-items-center px-4' style={{backgroundColor: "#bcbcbc"}}>
                                 <p className='col-6 fw-semibold fs-4 mb-0' style={{color: "#454545"}}>{item.purchaser.name}</p>
                                 <p className='col-6 text-end mb-0' style={{color: "#454545"}}>Face value Rp. {item.event.price.toString().slice(0, 3)}.000</p>
                              </div>
                              <div className='d-flex align-items-center px-4' style={{backgroundColor: "#bcbcbc"}}>
                                 <p className='col-6 fs-5 mb-1 text-muted'>{item.purchaser.id}</p>
                                 {/* <p className='col-6 text-end fs-5 mb-1 text-muted'>id.confirm</p> */}
                              </div>
                           </Card.Body>
                           <Card.Body className='position-relative flex align-items-center pt-3 px-4'>
                              <h2 className='fw-bolder' style={{color: "#454545"}}>{item.event.title}</h2>
                              <p className='fs-5 fw-semibold mb-1 text-muted'>{item.event.start_date.slice(0, 22)}</p>
                              <p className='text-muted' style={{fontSize: "1.1rem"}}>{item.event.url_map}</p>
                           </Card.Body>
                        </Card>
                     </div>
                     <div style={{ borderBottom: "3px solid gray"}} className="px-5 text-muted">
                        <h3 className='fs-4 fw-semibold'>Order Summary</h3>
                        <div className='d-flex justify-content-between' style={{fontSize: "1.1rem"}}>
                           <p>Total Price ({item.qty} Item)</p>
                           <p>Rp. {item.price.toString().slice(0, 3)}.000</p>
                        </div>
                     </div>
                     <div className='d-flex justify-content-end pt-4' style={{marginBottom: "80px"}}>
                        <Button onClick={() => handlerCheckout.mutate(item.id)} className='border-0 py-2 fs-5 fw-bold' style={{backgroundColor: "#ff5555", width: "180px"}}>{item.status}</Button>
                     </div>
                  </div>
               ))}
            </div>
         </Container>

         <Footer/>
      </>
   );
}

export default Payment;

