package routes

import (
	"github.com/gorilla/mux"
)

func RouteInit(r *mux.Router) {
	UserRoutes(r)
	AuthRoutes(r)
	EventRoutes(r)
	PaymentRoutes(r)

	go setInterval()
}
