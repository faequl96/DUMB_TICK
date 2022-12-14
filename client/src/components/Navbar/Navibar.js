import { useContext } from 'react';
import {Button, Container, Dropdown, DropdownButton, Image, Nav, Navbar, Offcanvas} from 'react-bootstrap';
import logo from '../../assets/logo.png';
import register from '../../assets/register.png';
import login from '../../assets/login.png';
import profileIcon from '../../assets/profileIcon.png';
import myTicket from '../../assets/dropdown/myticket.png';
import payment from '../../assets/dropdown/payment.png';
import addEvent from '../../assets/dropdown/addevent.png';
import logout from '../../assets/dropdown/logout.png';
import { AppContext } from '../../contexts/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';
import { UserContext } from '../../contexts/UserContext';

function Navibar() {
   const navigate = useNavigate();
   const [, dispatch] = useContext(UserContext);
   const contexts = useContext(AppContext)

   const handlerLogout = () => {
      dispatch({
			type: "LOGOUT",
		});
		contexts.setIsLogin(false)
		navigate("/");
	};

   return (
      <>
         {['md'].map((expand) => (
            <Navbar key={expand} expand={expand} 
               className="py-1 position-fixed top-0 start-0 end-0" 
               style={{backgroundColor: "#ff5555", boxShadow: "0 1px 6px 2px rgba(10, 10, 10, .6)", zIndex: "999"}}
            >
               <Container fluid style={{padding: "0 60px"}}>
                  <Navbar.Brand>
                     <Link
                        to={'/'}
								className='text-dark text-decoration-none d-flex gap-2'
							>
								<img alt="" src={logo} width="90px" className="d-inline-block"/>
							</Link>
                  </Navbar.Brand>
                  <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                  <Navbar.Offcanvas
                     id={`offcanvasNavbar-expand-${expand}`}
                     aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                     placement="end"
                  >
                     <Offcanvas.Header closeButton>
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>NavBar</Offcanvas.Title>
                     </Offcanvas.Header>
                     <Offcanvas.Body>
                        {!contexts.isLogin ? (
                           <Nav className="justify-content-end flex-grow-1 fs-5 pe-0">
                              <div onClick={() => contexts.setShowRegister(true)} className='me-4' style={{cursor: "pointer"}}>
                                 <img src={register} width="36px"/>
                                 <span className="ps-2 text-white">Register</span>
                              </div>
                              <div onClick={() => contexts.setShowLogin(true)} style={{cursor: "pointer"}}>
                                 <img src={login} width="36px"/>
                                 <span className="ps-2 text-white">Login</span>
                              </div>
                           </Nav>
                        ) : (
                           <Nav className="justify-content-end flex-grow-1 fs-5 pe-0">
                              <Dropdown>
                                 <DropdownToggle variant='' className="pt-0 position-relative px-0" style={{border: "1px solid #ff5555", height: "60px"}}>
                                    <div className='rounded-pill overflow-hidden mb-0' style={{border: "2px solid #454545", marginTop: "-1px", height: "62px", width: "62px"}}>
                                       <Image src={contexts.profilePhoto} width='100%'/>
                                    </div>
                                    <div className='position-absolute' style={{height: "13px", width: "60px", backgroundColor: "#ff5555"}}></div>
                                 </DropdownToggle>
                                 <Dropdown.Menu
                                    align="end"
                                    title="Dropdown end"
                                    id="dropdown-menu-align-end"
                                    className='rounded-0 mt-3 position-absolute'
                                    style={{zIndex: "9", background: "linear-gradient(0deg, rgba(255,186,186,1) 0%, rgba(255,255,255,1) 75%)", boxShadow: "0 2px 4px rgba(0, 0, 0, .3)"}}
                                 >
                                    <div className='position-absolute' 
                                       style={{width: "20px", height: "20px", transform: "rotate(45deg)", right: "21px", top: "-10px", backgroundColor: "white", zIndex: "1"}}
                                    ></div>
                                    <Dropdown.Item className='fs-5 mb-3 mt-2' style={{width: "220px"}}>
                                       <Link to='/profile' className='text-muted fw-semibold text-decoration-none d-flex align-items-center'>
                                          <div className='rounded-pill overflow-hidden me-3' style={{border: "2px solid #9a9a9a", height: "40px", width: "40px"}}>
                                             <Image src={contexts.profilePhoto} width='100%'/>
                                          </div>
                                          <span className='d-inlineblock'>Profile</span>
                                       </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item className='fs-5 mb-3'>
                                       <Link to='/myticket' className='text-muted fw-semibold text-decoration-none d-flex align-items-center'>
                                          <Image src={myTicket} width='40px' className='me-3'/>
                                          <span className='d-inlineblock'>My Ticket</span>
                                       </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item className='fs-5 mb-3'>
                                       <Link to='/payment' className='text-muted fw-semibold text-decoration-none d-flex align-items-center'>
                                          <Image src={payment} width='40px' className='me-3'/>
                                          <span className='d-inlineblock'>Payment</span>
                                       </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item className='fs-5 pb-4' style={{ borderBottom: "3px solid gray"}}>
                                       <Link to='/add-event' className='text-muted fw-semibold text-decoration-none d-flex align-items-center'>
                                          <Image src={addEvent} width='40px' className='me-3'/>
                                          <span className='d-inlineblock'>Add Event</span>
                                       </Link>
                                    </Dropdown.Item>
                                    <Dropdown.Item className='fs-5 pt-3 pb-2'>
                                       <div onClick={handlerLogout} className='text-muted fw-semibold text-decoration-none d-flex align-items-center'>
                                          <Image src={logout} width='40px' className='me-3'/>
                                          <span className='d-inlineblock'>Logout</span>
                                       </div>
                                    </Dropdown.Item>
                                 </Dropdown.Menu>
                              </Dropdown>
                           </Nav>
                        )}
                     </Offcanvas.Body>
                  </Navbar.Offcanvas>
               </Container>
            </Navbar>
         ))}
      </>
   );
}

export default Navibar;