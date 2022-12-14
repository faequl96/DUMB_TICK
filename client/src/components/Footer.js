import { Container } from "react-bootstrap";
import logo from '../assets/logo.png';
import instagram from '../assets/instagram.png';
import twitter from '../assets/twitter.png';

function Footer() {
 
   return (
      <div style={{backgroundColor: "#ff5555"}}>
         <Container style={{padding: "70px 20px 20px"}}>
            <div className="row">
               <div className="col-5" style={{paddingRight: "220px"}}>
                  <img src={logo} width="90px"/>
                  <p className="text-light mt-3" style={{fontSize: "1.15rem"}}>
                     Dumb-tick - is a web-based platform that provides tickets for various events around sports, music, science, and programming
                  </p>
               </div>
               <div className="col-4 text-light pt-3">
                  <div>
                     <a className="fs-5 fw-semibold text-light text-decoration-none" href="#">Links</a>
                  </div>
                  <div className="mb-4">
                     <a className="text-light text-decoration-none" style={{fontSize: "1.15rem"}} href="#">About Us</a>
                  </div>
                  <p className="fs-5 fw-semibold text-light text-decoration-none">Follow Us On</p>
                  <a className="d-flex text-light text-decoration-none" href="#">
                     <img src={instagram} width="27px" height="26.5px"/>
                     <p className="ps-2 pt-0" style={{fontSize: "1.12rem"}}>Instagram</p>
                  </a>
                  <a className="d-flex text-light text-decoration-none" href="#">
                     <img src={twitter} width="27px" height="26.5px"/>
                     <p className="ps-2" style={{fontSize: "1.12rem"}}>Twitter</p>
                  </a>
               </div>
               <div className="col-3 text-light pt-3">
                  <p className="fs-5 fw-semibold text-light text-decoration-none mb-1">Have A Question ?</p>
                  <p className="fw-semibold mb-1">Dumb-Tick</p>
                  <p style={{fontSize: "1.12rem"}}>Email : support@dumbtick.com</p>
               </div>
            </div>
            <div className="text-center pt-5 fs-5 fw-semibold text-light mb-5">
               <span>Copyrights 2022 Dumb-Tick</span>
            </div>
         </Container>  
      </div>
   );
}
 
export default Footer;