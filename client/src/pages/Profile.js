import { useContext, useEffect, useState } from 'react';
import {Button, Container, Form, Spinner} from 'react-bootstrap';
import profileIcon from '../assets/profileIcon.png';
import editProfile from '../assets/edit.png';
import { AppContext } from '../contexts/AppContext';
import Favorite from '../components/Profile/Favorite';
import { UserContext } from '../contexts/UserContext';
import { useMutation, useQuery } from 'react-query';
import { API } from '../config/Api';

function Profile() {
   const contexts = useContext(AppContext)
   const [state,] = useContext(UserContext);
   const [isEdit, setIsEdit] = useState(false);

   const [isLoading, setIsLoading] = useState(false);

   let { data: user, refetch } = useQuery("userCache", async () => {
      setIsLoading(true);
      const response = await API.get(`/user/${state.user.id}`);
      setIsLoading(false);
      return response.data.data;
   });

   const [preview, setPreview] = useState();
   const [editData, setEditData] = useState({
      name: "",
      birthday: "",
      phone: "",
      email: "",
      image: "",
   });

   useEffect(() => {
      setPreview(user?.image)
      setEditData({name: user?.name, birthday: user?.birthday, phone: user?.phone, email: user?.email})
   }, [user])
 
   const handleChange = (e) => {
      setEditData({...editData, [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value});
 
      if (e.target.type === "file") {
         let url = URL.createObjectURL(e.target.files[0]);
         setPreview(url);
      }
   };
 
   const handleSubmit = useMutation(async (e) => {
      try {
         e.preventDefault();
   
         const formData = new FormData();
         formData.set("name", editData.name);
         formData.set("birthday", editData.birthday);
         formData.set("phone", editData.phone);
         formData.set("email", editData.email);
         if(editData?.image !== undefined) {
            formData.set("image", editData?.image[0], editData?.image[0]?.name);
         }

         await API.patch(`/user/${state.user.id}`, formData);

         refetch()
         contexts.refreshNavbar()
         setIsEdit(false)
      } catch (error) {
         console.log(error);
      }
   });

   return (
      <>
         {/* {isLoading ? (
            <Container style={{marginTop: "180px", padding: "0 20px 0px"}}>
               <div className='d-flex pb-5'>
                  <div className='col-5 d-flex align-items-center'>
                     <h1 className='fw-bolder me-4' style={{color: "#ff5555"}}>Profile</h1>
                     <Spinner animation="border" style={{color: "#ff5555"}}/>
                  </div>
                  <div className='col-2'></div>
                  <div className='col-5 d-flex justify-content-center' style={{margin: "20px 100px"}}></div>
               </div>
            </Container>
         ) : (
            <> */}
         {!isEdit ? (
            <Container style={{marginTop: "180px", padding: "0 20px 0px"}}>
               <div className='d-flex pb-5'>
                  <div className='col-5'>
                     <h1 className='fw-bolder mb-5' style={{color: "#ff5555"}}>Profile</h1>
                     <h2 className='fw-bolder fs-1 mb-4 text-muted'>{user?.name}</h2>
                     <p className='fs-4 mb-3 text-muted'>{user?.birthday}</p>
                     <p className='fs-4 mb-3 text-muted'>{user?.phone}</p>
                     <p className='fs-4 mb-3 text-muted'>{user?.email}</p>
                  </div>
                  <div className='col-2'>
                     <Button onClick={() => setIsEdit(true)} variant='' className='fs-5 fw-semibold text-light' style={{backgroundColor: "#ff5555", marginTop: "100px", width: "160px"}}>Edit Profile</Button>
                  </div>
                  <div className='col-5 d-flex justify-content-center' style={{margin: "20px 100px"}}>
                     <div className='rounded-pill overflow-hidden position-relative' style={{width: "300px", height: "300px", border: "12px solid #ff5555"}}>
                        <img src={preview} width="100%"/>
                     </div>
                  </div>
               </div>
            </Container>
         ) : (
            <Container style={{marginTop: "180px", padding: "0 20px"}}>
               <div className='d-flex'>
                  <div className='col-5 pe-5'>
                     <h1 className='fw-bolder' style={{color: "#ff5555", marginBottom: "36px"}}>Profile</h1>
                     <Form id='profileField'>
                        <Form.Group className="mb-3">
                           <Form.Control
                              className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-1 py-0 fw-bold text-muted'
                              style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                              type="text"
                              name="name"
                              placeholder="Name"
                              value={editData.name}
                              onChange={handleChange}
                           />
                        </Form.Group>
                        <Form.Group className="mb-2">
                           <Form.Control
                              className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4 py-1 text-muted'
                              style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                              type="text"
                              name="birthday"
                              placeholder="Date Of Birth"
                              value={editData.birthday}
                              onChange={handleChange}
                           />
                        </Form.Group>
                        <Form.Group className="mb-2">
                           <Form.Control
                              className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4 py-1 text-muted'
                              style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                              type="text"
                              name="phone"
                              placeholder="Telp"
                              value={editData.phone}
                              onChange={handleChange}
                           />
                        </Form.Group>
                        <Form.Group className="mb-2">
                           <Form.Control
                              className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4 py-1 text-muted'
                              style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                              type="email"
                              name="email"
                              placeholder="Email"
                              value={editData.email}
                              onChange={handleChange}
                           />
                        </Form.Group>
                        <Form.Group className="mb-2">
                           <Form.Control
                              id='photo'
                              className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-4 py-1 text-muted invisible'
                              style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                              type="file"
                              name="image"
                              placeholder="Image"
                              onChange={handleChange}
                           />
                        </Form.Group>
                     </Form>
                  </div>
                  <div className='col-2'>
                     <Button onClick={(e) => handleSubmit.mutate(e)} type='submit' variant='' className='fs-5 fw-semibold text-light' style={{backgroundColor: "#ff5555", marginTop: "100px", width: "160px"}}>Save</Button>
                  </div>
                  <div className='col-5 d-flex justify-content-center' style={{margin: "20px 100px"}}>
                     <div className='rounded-pill overflow-hidden position-relative' style={{width: "300px", height: "300px", border: "12px solid #ff5555"}}>
                        <img src={preview} width="100%"/>
                        <label htmlFor="photo" className='position-absolute start-0' style={{cursor: "pointer"}}>
                           <img src={editProfile} width="100%" style={{zIndex: "1"}}/>
                        </label>
                     </div>
                  </div>
               </div>
            </Container>
         )}
            {/* </>
         )} */}

         <Favorite/>
      </>
   );
}

export default Profile;