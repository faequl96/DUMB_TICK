package routes

import (
	"Server/handlers"
	"Server/pkg/middleware"
	"Server/pkg/mysql"
	"Server/repositories"

	"github.com/gorilla/mux"
)

func UserRoutes(r *mux.Router) {
	userRepository := repositories.RepositoryUser(mysql.DB)
	h := handlers.HandlerUser(userRepository)

	r.HandleFunc("/users", h.FindUsers).Methods("GET")
	r.HandleFunc("/user/{id}", middleware.Auth(h.GetUserByID)).Methods("GET")
	r.HandleFunc("/user/{id}/wishlist", middleware.Auth(h.UpdateUserWishlist)).Methods("PATCH")
	r.HandleFunc("/user/{id}/wishlist", middleware.Auth(h.GetUserWishlist)).Methods("GET")
	r.HandleFunc("/user/{id}", middleware.Auth(middleware.UploadFile(h.UpdateUser))).Methods("PATCH")
	r.HandleFunc("/user/{id}", middleware.Auth(h.DeleteUser)).Methods("DELETE")
}
