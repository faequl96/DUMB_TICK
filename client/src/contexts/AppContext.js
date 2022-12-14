import { createContext, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import React, { useContext, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { API, setAuthToken } from '../config/Api';
import { UserContext } from './UserContext';


export const AppContext = createContext();

export const AppContextProvider = ({children}) => {

   const [state, dispatch] = useContext(UserContext);

   // ==================================================================================================================================
   // GLOBAL STATES ====================================================================================================================
   // ==================================================================================================================================

   const [isLogin, setIsLogin] = useState(false);
   const [loginMessage, setLoginMessage] = useState('');
   const [regisMessage, setRegisMessage] = useState('');
   const [showLogin, setShowLogin] = useState(false);
   const [showRegister, setShowRegister] = useState(false);
   const [profilePhoto, setProfilePhoto] = useState();
   const [navbarLoading, setNavbarLoading] = useState(true);
   const [isLoading, setIsLoading] = useState(false);
   // const [cartLength, setCartLength] = useState();

   // ==================================================================================================================================
   // FORMAT CURRENCY ==================================================================================================================
   // ==================================================================================================================================

   const formatRupiah = (money) => {
      return new Intl.NumberFormat('id-ID',
        { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
      ).format(money);
   }

   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // ////////////////////////////////////////////////////// HANDLER AUTH //////////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================

   // ==================================================================================================================================
   // CHECK USER AUTH ==================================================================================================================
   // ==================================================================================================================================

   const checkUserAuth = async () => {
      try {
         const token = JSON.parse(localStorage.token)
         setAuthToken(token.value);
         const response = await API.get("/check-auth");
         setNavbarLoading(false);
         const payload = response.data.data;
  
         payload.token = token.value;
      
         dispatch({
            type: "USER_SUCCESS",
            payload,
         });

         setProfilePhoto(payload.image);
         setIsLogin(true);
      } catch (error) {
        console.log(error);
      }
   };

   // useEffect(() => {
   //    checkUserAuth()
   // }, [showLogin])

   // ==================================================================================================================================
   // HANDLER REGISTER =================================================================================================================
   // ==================================================================================================================================

   const [regisData, setRegisData] = useState({
		name: '',
		email: '',
      userName: '',
		password: '',
	});

   const OnChangeFormRegis = (e) => setRegisData({ ...regisData, [e.target.name]: e.target.value })

	const handlerRegister = useMutation(async(e) => {
		try {
			e.preventDefault();

         setIsLoading(true)

			const config = {headers: {"Content-type": "application/json"}}
			const body = JSON.stringify(regisData);
			await API.post('/register', body, config);

         setIsLoading(false)
			setShowRegister(false);
			setShowLogin(true);
			setRegisMessage('');
			setRegisData({name: '', email: '', userName: '', password: ''});

		} catch (error) {
			const alert = (
				<Alert className='fs-6 fw-bolder text-center' variant={'danger'}>
					{error.response.data.message}
				</Alert>
			);
			setRegisMessage(alert);
		}
	});

   // ==================================================================================================================================
   // HANDLER LOGIN ====================================================================================================================
   // ==================================================================================================================================

   const [loginData, setLoginData] = useState({
      userName: "",
      password: ""
   });

   const OnChangeFormLogin = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value })

   const handlerLogin = useMutation(async(e) => {
      try {
         e.preventDefault();

         setIsLoading(true)

         const config = {headers: {"Content-type": "application/json"}}
         const body = JSON.stringify(loginData);
         const response = await API.post("/login", body, config);
         
         dispatch({type: "LOGIN_SUCCESS", payload: response.data.data});

         setIsLoading(false)
         setProfilePhoto(response.data.data.image)
         setIsLogin(true);
         setShowLogin(false);
         setLoginMessage('');
         setLoginData({userName: "", password: ""})

      } catch (err) {
         const alert = (
            <Alert className='fs-6 fw-bolder text-center' variant={'danger'}>
               {err.response.data.message}
            </Alert>
         );
         setLoginMessage(alert);
      }
   });

   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // /////////////////////////////////////////////////////// HANDLER NAVBAR ///////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================

   const refreshNavbar = async () => {
      try {
         const response = await API.get(`/user/${state.user.id}`);
         let payload = response.data.data;
         setProfilePhoto(payload.image)
      } catch (error) {
        console.log(error);
      }
   };

   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // //////////////////////////////////////////////////// HANDLER lANDINGPAGE /////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================

   // let { data: products } = useQuery("productsCache", async () => {
   //    const response = await API.get("/products");
   //    return response.data.data;
   // });

   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // ///////////////////////////////////////////////////// HANDLER ADD EVENT //////////////////////////////////////////////////////////
   // ==================================================================================================================================
   // //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // ==================================================================================================================================

   const [eventData, setEventData] = useState({
		title: '',
		category: '',
      image: '',
		start_date: '',
      end_date: '',
      price: '',
      address: '',
      url_map: '',
      phone: '',
      email: '',
      description: '',
	});

   const OnChangeFormEvent = (e) => setEventData({...eventData, [e.target.name]: e.target.type === "file" ? e.target.files : e.target.value});

	const handlerAddEvent = useMutation(async(e) => {
		try {
			e.preventDefault();

			const formData = new FormData();
         formData.set("title", eventData.title);
         formData.set("category", eventData.category);

         let startDateWIB = new Date(eventData.start_date.replace('T',' ').replace('-','/'));
         const startDate = startDateWIB.toString().slice(0, 3) + ", " + startDateWIB.toString().slice(8, 10) + startDateWIB.toString().slice(3, 7) + startDateWIB.toString().slice(10, 25) + startDateWIB.toString().slice(28, 31);
         formData.set('start_date', startDate);

         let endDateWIB = new Date(eventData.end_date.replace('T',' ').replace('-','/'));
         const endDate = endDateWIB.toString().slice(0, 3) + ", " + endDateWIB.toString().slice(8, 10) + endDateWIB.toString().slice(3, 7) + endDateWIB.toString().slice(10, 25) + endDateWIB.toString().slice(28, 31);
         formData.set('end_date', endDate);

         formData.set("price", eventData.price);
         formData.set("address", eventData.address);
         formData.set("url_map", eventData.url_map);
         formData.set("phone", eventData.phone);
         formData.set("email", eventData.email);
         formData.set("description", eventData.description);
         if(eventData?.image !== undefined) {
            formData.set("image", eventData?.image[0], eventData?.image[0]?.name);
         }

			await API.post('/event', formData);

         setEventData({title: "", category: "", start_date: "", end_date: "", price: "", address: "", url_map: "", phone: "", email: "", description: "", image: ""})

		} catch (error) {
			console.log(error);
		}
	});


    
   const appContextsValue = {
      isLogin,
      setIsLogin,
      isLoading,
      navbarLoading,
      setNavbarLoading,

      loginMessage,
      setLoginMessage,
      regisMessage,
      setRegisMessage,
      
      showLogin,
      setShowLogin,
      showRegister,
      setShowRegister,

      profilePhoto,
      refreshNavbar,
      // cartLength,
      // setCartLength,

      formatRupiah,
      
      checkUserAuth,
      regisData,
      OnChangeFormRegis,
      handlerRegister,
      loginData,
      OnChangeFormLogin,
      handlerLogin,

      eventData,
      OnChangeFormEvent,
      handlerAddEvent,
   }
   return(
      <AppContext.Provider value={appContextsValue}>
         {children}
      </AppContext.Provider>
   )
}