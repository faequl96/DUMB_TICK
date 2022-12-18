import React, { useContext } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { AppContext } from '../../contexts/AppContext';

function Login() {
   const contexts = useContext(AppContext)

   return (
      <Modal show={contexts.showLogin} onHide={() => contexts.setShowLogin(false)} centered>
         <Modal.Body className='rounded-0 px-5' style={{backgroundColor: "#f4e1e1"}}>
            <Modal.Title className="my-4 fw-bolder fs-1 text-center" style={{color: "#484646"}}>LOGIN</Modal.Title>
            <Form onSubmit={(e) => contexts.handlerLogin.mutate(e)} id='loginField'>
               {contexts.loginMessage !== '' && (contexts.loginMessage)}
               <Form.Group className="mb-4">
                  <Form.Control
                     className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-5'
                     style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                     type="text"
                     name="userName"
                     placeholder="Username"
                     value={contexts.loginData.userName}
                     onChange={contexts.OnChangeFormLogin}
                  />
               </Form.Group>
               <Form.Group className="mb-4">
                  <Form.Control
                     className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-5'
                     style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "2px solid #484646"}}
                     type="password"
                     name="password"
                     placeholder="Password"
                     value={contexts.loginData.password}
                     onChange={contexts.OnChangeFormLogin}
                  />
               </Form.Group>
               <Form.Group className="mb-4 mt-5">
                  {contexts.isLoading ? (
                     <Button variant='' className="w-100 d-flex align-items-center justify-content-center" style={{backgroundColor: "#ff5555"}} type='submit'>
                        <span className="fs-4 fw-bold text-white me-3">Login</span>
                        <Spinner animation="border" style={{color: "#fff"}}/>
                     </Button>
                  ) : (
                     <Button variant='' className="w-100 d-flex align-items-center justify-content-center" style={{backgroundColor: "#ff5555"}} type='submit'>
                        <span className="fs-4 fw-bold text-white me-3">Login</span>
                     </Button>
                  )}
               </Form.Group>
               
            </Form>
            <p className="text-muted text-center mb-4">
               <span>Don't have an account ? click </span>
               <span
                  style={{ cursor: "pointer" }}
                  className="text-primary fw-semibold text-muted"
                  onClick={() => {
                     contexts.setShowLogin(false);
                     contexts.setShowRegister(true);
                  }}
               >
                  Here
               </span>
            </p>
         </Modal.Body>
      </Modal>
   );
}

export default Login;