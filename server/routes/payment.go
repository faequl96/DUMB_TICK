package routes

import (
	"Server/handlers"
	"Server/pkg/middleware"
	"Server/pkg/mysql"
	"Server/repositories"

	"github.com/gorilla/mux"
)

func PaymentRoutes(r *mux.Router) {
	paymentRepository := repositories.RepositoryPayment(mysql.DB)
	h := handlers.HandlerPayment(paymentRepository)

	r.HandleFunc("/add-payment", middleware.Auth(h.AddPayment)).Methods("POST")
	r.HandleFunc("/payments", middleware.Auth(h.GetPayments)).Methods("GET")
	r.HandleFunc("/payments-success", middleware.Auth(h.GetPaymentsSuccess)).Methods("GET")
	r.HandleFunc("/checkout/{id}", middleware.Auth(h.CreateTransaction)).Methods("PATCH")
	r.HandleFunc("/notification", h.Notification).Methods("POST")
}
