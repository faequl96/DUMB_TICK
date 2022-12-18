import React, { useContext } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { AppContext } from '../../contexts/AppContext';

function Register() {
	const contexts = useContext(AppContext)

   return (
      <Modal show={contexts.showRegister} onHide={() => contexts.setShowRegister(false)} centered>
         <Modal.Body className='rounded-0 px-5' style={{backgroundColor: "#f4e1e1"}}>
         <Modal.Title className="my-4 fw-bolder fs-1 text-center" style={{color: "#484646"}}>Register</Modal.Title>
         <Form onSubmit={(e) => contexts.handlerRegister.mutate(e)} id='regisField'>
            {contexts.regisMessage !== '' && (contexts.regisMessage)}
            <Form.Group className="mb-4">
               <Form.Control
                  className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-5'
                  style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={contexts.regisData.name}
                  onChange={contexts.OnChangeFormRegis}
               />
            </Form.Group>
            <Form.Group className="mb-4">
               <Form.Control
                  className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-5'
                  style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={contexts.regisData.email}
                  onChange={contexts.OnChangeFormRegis}
               />
            </Form.Group>
            <Form.Group className="mb-4">
               <Form.Control
                  className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-5'
                  style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                  type="text"
                  name="userName"
                  placeholder="Username"
                  value={contexts.regisData.userName}
                  onChange={contexts.OnChangeFormRegis}
               />
            </Form.Group>
            <Form.Group className="mb-4">
               <Form.Control
                  className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-5'
                  style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={contexts.regisData.password}
                  onChange={contexts.OnChangeFormRegis}
               />
            </Form.Group>
            <Form.Group className="mb-4 mt-5">
               {contexts.isLoading ? (
                  <Button variant='' className="w-100 d-flex align-items-center justify-content-center" style={{backgroundColor: "#ff5555"}} type='submit'>
                     <span className="fs-4 fw-bold text-white me-3">Register</span>
                     <Spinner animation="border" style={{color: "#fff"}}/>
                  </Button>
               ) : (
                  <Button variant='' className="w-100 d-flex align-items-center justify-content-center" style={{backgroundColor: "#ff5555"}} type='submit'>
                     <span className="fs-4 fw-bold text-white me-3">Register</span>
                  </Button>
               )}
            </Form.Group>
         </Form>
         <p className="text-muted text-center mb-4">
            <span>Already have an account ? Click </span>
            <span
               style={{ cursor: 'pointer' }}
               className="text-primary fw-semibold text-muted"
               onClick={() => {
                  contexts.setShowRegister(false);
                  contexts.setShowLogin(true);
               }}
            >
               Here
            </span>
         </p>
         </Modal.Body>
      </Modal>
   );
}

export default Register;