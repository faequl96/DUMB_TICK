import React, { useContext, useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"
import { AppContext } from '../../contexts/AppContext';
import { UserContext } from '../../contexts/UserContext';
import wishlistIcon from '../../assets/wishlist.png';
import wishlistWhite from '../../assets/wishlistWhite.png';
import noEvents from '../../assets/no-event.png';
import { API } from '../../config/Api';
import { useQuery } from 'react-query';

const Upcoming = () => {
   const navigate = useNavigate();
   const contexts = useContext(AppContext);
   const [state,] = useContext(UserContext);

   const [wishlist, setWishlist] = useState([0]);

   useEffect(() => {
      const getWishlist = async () => {
         const response = await API.get(`/user/${state.user.id}/wishlist`);
         const wish = response.data.data.wishlist?.map((item) => (item.id))
         setWishlist(wish)
      };
      if(state.user.id !== undefined) {getWishlist()}
   }, []);

   const handlerSaveWishlist = async () => {
      try {
         const config = {headers: {"Content-type": "application/json"}};
         let body = JSON.stringify({
            events_id: wishlist
         });

         if(wishlist[0] !== 0) {
            await API.patch(`/user/${state.user.id}/wishlist`, body, config);
         }

      } catch (error) {
         console.log(error);
      }
   };

   useEffect(() => {handlerSaveWishlist()}, [wishlist]);

   let { data: events } = useQuery("upcomingEventsCache", async () => {
      const response = await API.get(`/upcoming-events`);
      return response.data.data;
   });

   const handlerWishlist = (id) => {

      if (wishlist[0] === 0) {
         wishlist.pop()
      }

      let filterID = wishlist.filter((e) => e === id);
      if (filterID[0] !== id) {
         setWishlist([...wishlist, id])
      } else {
         setWishlist(wishlist.filter((e) => e !== id));
      }
   };

   return (
      <Container className='row m-auto pb-5 px-0 mb-4'>
         <h1 className='fw-bolder px-4 pb-4' style={{color: "#ff5555"}}>Upcoming Events</h1>
         {events?.length === undefined ? (
            <div className='text-center'>
               <img src={noEvents} width="50%"/>
            </div>
         ) : (
            <>
               {events?.map((item, index) => (
                  <div key={index} className='col-4 p-4'>
                     <Card 
                        className='position-relative border-0 py-0 bg-light rounded-0' 
                        style={{width: '100%', backgroundColor : '#f4dcdc', borderColor: '#acacac', boxShadow: "0 2px 4px rgba(0, 0, 0, .3)"}}
                     >
                        <Card.Img onClick={() => navigate(`/detail-event/${item.id}`)} variant="top" src={item.image} style={{cursor: 'pointer'}}/>
                        {item.price > 0 ? (
                           <div 
                              className='position-absolute px-2 py-1 bg-light text-center rounded-1 fw-semibold' 
                              style={{width: "110px", right: "8px", top: "8px", color: "#ff5555", boxShadow: "0 2px 4px rgba(0, 0, 0, .6)"}}
                           >
                              Rp. {item.price.toString().slice(0, 3)}.000
                           </div>
                        ) : (
                           <div 
                              className='position-absolute px-2 py-1 bg-light text-center rounded-1 fw-semibold' 
                              style={{width: "100px", right: "8px", top: "8px", color: "#ff5555", boxShadow: "0 2px 4px rgba(0, 0, 0, .6)"}}
                           >
                              Free
                           </div>
                        )}
                        <Card.Body className='position-relative flex align-items-center pt-2'>
                           <div className='d-flex pt-2'>
                              {item.title.length > 22 ? (
                                 <h2 className='col-10 fs-4 fw-bold'>{item.title.slice(0, 22)}...</h2>
                              ) : (
                                 <h2 className='col-10 fs-4 fw-bold'>{item.title}</h2>
                              )}
                              <div className='col-2'></div>
                              {contexts.isLogin === true && (
                                 <>
                                    {wishlist.filter((e) => e === item.id)[0] === item.id && (
                                       <div className='position-absolute' style={{right: "18px", top: "14px", zIndex: "99"}}>
                                          <img width="34px" src={wishlistIcon}
                                             onClick={() => handlerWishlist(item.id)}
                                             style={{cursor: 'pointer'}}
                                          />
                                       </div>
                                    )}
                                    <div className='position-absolute' style={{right: "18px", top: "14px"}}>
                                       <img width="34px" src={wishlistWhite}
                                          onClick={() => handlerWishlist(item.id)}
                                          style={{cursor: 'pointer'}}
                                       />
                                    </div>
                                 </>
                              )}
                           </div>
                           <p className='fs-5 fw-bold mb-1' style={{color: "#ff5555"}}>{item.start_date.slice(0, 22)}</p>
                           <p className='fs-6 text-muted mb-0' style={{lineHeight: "1.2rem"}}>{item.description}</p>
                           <p className='fs-6 text-muted' style={{lineHeight: "1.2rem", textAlign: "justify"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...</p>
                        </Card.Body>
                     </Card>
                  </div>
               ))}
            </>
         )}
      </Container>
   );
}

export default Upcoming;

