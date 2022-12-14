import { Header } from "../components/LandingPage/Header";
import CategoryList from "../components/LandingPage/CategoryList";
import Upcoming from "../components/LandingPage/UpcomingEvents";
import Footer from "../components/Footer";
import TodayEvent from "../components/LandingPage/TodayEvents";
import { useState } from "react";

export const LandingPage = () => {

   const [searchResult, setSearchResult] = useState("");
   const [refetchWishlist, setRefetchWishlist] = useState(false);

   return (
      <>
         <Header
            searchResult={searchResult}
            setSearchResult={setSearchResult}
         />
         {searchResult === "" && (
            <>
               <CategoryList/>
               <TodayEvent />
               <Upcoming />
            </>
         )}
         <Footer/>
      </>
   );
};