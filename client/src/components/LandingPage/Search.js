import { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import search from '../../assets/search.png';
import { AppContext } from "../../contexts/AppContext";
import { UserContext } from "../../contexts/UserContext";
import SearchResult from "./SearchResult";
import { API } from '../../config/Api';
import { useQuery } from 'react-query';

export const Search = ({searchResult, setSearchResult}) => {
   const contexts = useContext(AppContext);
   const [state,] = useContext(UserContext);

   const [inputSearch, setInputSearch] = useState("");

   const handlerOnChange = (e) => {
      setSearchResult(e.target.value)

      var valueSearch = e.target.value.toLowerCase();
      setInputSearch(valueSearch);
   }

   let { data: events, refetch } = useQuery("searchEventsCache", async () => {
      const response = await API.get(`/search-events`);
      return response.data.data;
   });

   const handlerOnClick = (e) => {
      refetch();
   }

   const eventsOtherMerchant = [];
   for(let i = 0; i < events?.length; i++) {
      if(events[i]?.merchant_id !== state?.user.id) {
         eventsOtherMerchant.push(events[i]);
      }
   }

   const filteredData = eventsOtherMerchant?.filter((e) => {
      if (inputSearch === '') {
         return e;
      } else {
         return e.title.toLowerCase().includes(inputSearch)
      }
   })

   return (
      <>
         <Container
            className="position-relative"
            style={{padding : "0 24px", marginTop : "200px", marginBottom : "40px"}}
         >
            <div className="mb-4">
               <Form className="d-flex position-relative" id="searchField">
                  <Form.Control
                     className='border-start-0 border-end-0 border-top-0 rounded-0 px-1 fs-3'
                     style={{backgroundColor: "rgba(0,0,0,0)", borderBottom: "3px solid #484646"}}
                     type="text"
                     placeholder="Search Event"
                     onChange={handlerOnChange}
                     onClick={handlerOnClick}
                  />
                  <Button className="position-absolute border-0" style={{backgroundColor: "rgba(0,0,0,0)", top: "4px", right: "-6px"}}>
                     <img width="32px" src={search}/>
                  </Button>
               </Form>
            </div>
         </Container>
         {searchResult !== "" && (
            <SearchResult
               searchData = {filteredData}
            />
         )}
      </>
   );
};