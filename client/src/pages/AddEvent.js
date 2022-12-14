import React, { useContext } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"
import Footer from '../components/Footer';
import { AppContext } from '../contexts/AppContext';
import { UserContext } from '../contexts/UserContext';

const AddEvent = () => {
   const navigate = useNavigate();
   const contexts = useContext(AppContext);
   const [state,] = useContext(UserContext);

   return (
      <>
         <Container className='justify-content-between m-auto pb-5 px-4 mb-4' 
            style={{padding : "200px 0 0", marginBottom : "40px"}}
         >
            <h1 className='fw-bolder pb-4' style={{color: "#ff5555"}}>Add Event</h1>
            <div className='pt-5 pb-1' style={{padding: "0 160px"}}>
               <Form onSubmit={(e) => contexts.handlerAddEvent.mutate(e)} id="eventField">
                  <Form.Group style={{marginBottom: "26px"}}>
                     <Form.Control
                        className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4'
                        style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "4px solid #484646"}}
                        type="text"
                        name="title"
                        placeholder="Title Event"
                        value={contexts.eventData.title}
                        onChange={contexts.OnChangeFormEvent}
                     />
                  </Form.Group>
                  <Form.Group style={{marginBottom: "26px"}}>
                     <Form.Select
                     className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4 text-muted'
                     style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "4px solid #484646"}}
                     name='category'
                     value={contexts.eventData.category}
                     onChange={contexts.OnChangeFormEvent}
                     >
                        <option>Choose Category</option>
                        <option value='sport'>Sport</option>
                        <option value='music'>Music</option>
                        <option value='science'>Science</option>
                        <option value='programming'>Programming</option>
                     </Form.Select>
                  </Form.Group>
                  <Form.Group className="position-relative" style={{marginBottom: "26px"}}>
                     <div className='position-absolute' style={{width: "160px", height: "70px", left: "-160px", top: "-10px", backgroundColor: "#f4e1e1"}}></div>
                     <div className='position-absolute text-end' style={{width: "240px", height: "70px", right: "0", top: "-10px", paddingTop: "16px", backgroundColor: "#f4e1e1"}}>
                        <label htmlFor="pamflet" className='fs-5 fw-bold py-2 px-4 bg-secondary rounded-2 text-light' style={{cursor: "pointer"}}>Attache Pamflet</label>
                     </div>
                     <Form.Control
                        id="pamflet"
                        className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4 text-muted'
                        style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "4px solid #484646", marginLeft: "-146px"}}
                        type="file"
                        name="image"
                        placeholder="Upload Pamflet"
                        onChange={contexts.OnChangeFormEvent}
                     />
                  </Form.Group>
                  <Form.Group className="position-relative" style={{marginBottom: "26px"}}>
                     <div className='position-absolute text-end' style={{width: "240px", height: "50px", right: "32px", top: "-10px", paddingTop: "8px"}}>
                        <label htmlFor="startTime" className='fs-4 py-2 px-4 text-muted' style={{cursor: "pointer"}}>Start Time</label>
                     </div>
                     <Form.Control
                        id='startTime'
                        className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4 text-muted'
                        style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "4px solid #484646"}}
                        type="datetime-local"
                        name="start_date"
                        placeholder="Start Time"
                        value={contexts.eventData.start_date}
                        onChange={contexts.OnChangeFormEvent}
                     />
                  </Form.Group>
                  <Form.Group className="position-relative" style={{marginBottom: "26px"}}>
                     <div className='position-absolute text-end' style={{width: "240px", height: "50px", right: "32px", top: "-10px", paddingTop: "8px"}}>
                        <label htmlFor="endTime" className='fs-4 py-2 px-4 text-muted' style={{cursor: "pointer"}}>End Time</label>
                     </div>
                     <Form.Control
                        id='endTime'
                        className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4 text-muted'
                        style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "4px solid #484646"}}
                        type="datetime-local"
                        name="end_date"
                        placeholder="End Time"
                        value={contexts.eventData.end_date}
                        onChange={contexts.OnChangeFormEvent}
                     />
                  </Form.Group>
                  <Form.Group style={{marginBottom: "26px"}}>
                     <Form.Control
                        className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4'
                        style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "4px solid #484646"}}
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={contexts.eventData.price}
                        onChange={contexts.OnChangeFormEvent}
                     />
                  </Form.Group>
                  <Form.Group style={{marginBottom: "26px"}}>
                     <Form.Control
                        className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4'
                        style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "4px solid #484646"}}
                        type="text"
                        name="address"
                        placeholder="Address Event"
                        value={contexts.eventData.address}
                        onChange={contexts.OnChangeFormEvent}
                     />
                  </Form.Group>
                  <Form.Group style={{marginBottom: "26px"}}>
                     <Form.Control
                        className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4'
                        style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "4px solid #484646"}}
                        type="text"
                        name="url_map"
                        placeholder="Url Map"
                        value={contexts.eventData.url_map}
                        onChange={contexts.OnChangeFormEvent}
                     />
                  </Form.Group>
                  <Form.Group style={{marginBottom: "26px"}}>
                     <Form.Control
                        className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4'
                        style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "4px solid #484646"}}
                        type="text"
                        name="phone"
                        placeholder="Telp"
                        value={contexts.eventData.phone}
                        onChange={contexts.OnChangeFormEvent}
                     />
                  </Form.Group>
                  <Form.Group style={{marginBottom: "26px"}}>
                     <Form.Control
                        className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4'
                        style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "4px solid #484646"}}
                        type="email"
                        name="email"
                        placeholder="Email EO"
                        value={contexts.eventData.email}
                        onChange={contexts.OnChangeFormEvent}
                     />
                  </Form.Group>
                  <Form.Group style={{marginBottom: "80px"}}>
                     <Form.Control
                        className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4'
                        style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "4px solid #484646"}}
                        type="text"
                        name="description"
                        placeholder="Description Event"
                        value={contexts.eventData.description}
                        onChange={contexts.OnChangeFormEvent}
                     />
                  </Form.Group>
                  <Form.Group className="mb-4 mt-5">
                     <Button variant='' className="w-100 fs-4 fw-bold text-white pt-1" style={{backgroundColor: "#ff5555"}} type='submit'>Publish</Button>
                  </Form.Group>
                  
               </Form>
            </div>
         </Container>

         <Footer/>
      </>
   );
}

export default AddEvent;

