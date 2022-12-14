import React, { useContext } from 'react';
import { Card, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom"
import { AppContext } from '../../contexts/AppContext';
import { UserContext } from '../../contexts/UserContext';
import {Category} from '../../data/DataCategoryList';

const CategoryList = () => {
   const navigate = useNavigate();
   const contexts = useContext(AppContext);
   const [state,] = useContext(UserContext);

   return (
      <Container className='row m-auto pb-5 px-0 mb-3'>
         <h1 className='fw-bolder px-4 pb-2' style={{color: "#ff5555"}}>Category</h1>
         {Category.map((item, index) => (
            <div key={index} className='col-3 p-4'>
               <Card 
                  className='border-0 position-relative py-0' 
                  style={{ width: '100%', backgroundColor : '#f4dcdc', cursor: 'pointer', borderColor: '#acacac' }} 
                  key={"item.id"} 
                  onClick={() => navigate(`/category/${item.categoryParam}`)}
               >
                  <Card.Img variant="top" src={item.image}/>
                  <Card.Body className='position-absolute start-0 end-0 top-0 bottom-0'>
                     <div className='d-flex align-items-center justify-content-center h-100 text-white fw-bolder text-center'>
                        <h2 className='fs-3 text-white fw-bolder text-center'>{item.eventCategory}</h2>
                     </div>
                  </Card.Body>
               </Card>
            </div>
         ))}
      </Container>
   );
}

export default CategoryList;

