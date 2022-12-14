package routes

import (
	"Server/handlers"
	"Server/pkg/middleware"
	"Server/pkg/mysql"
	"Server/repositories"
	"time"

	"github.com/gorilla/mux"
)

func EventRoutes(r *mux.Router) {
	eventRepository := repositories.RepositoryEvent(mysql.DB)
	h := handlers.HandlerEvent(eventRepository)

	r.HandleFunc("/events", h.FindEvents).Methods("GET")
	r.HandleFunc("/event/{id}", h.GetEventById).Methods("GET")
	r.HandleFunc("/event", middleware.Auth(middleware.UploadFile(h.CreateEvent))).Methods("POST")
	r.HandleFunc("/event/{id}", middleware.Auth(middleware.UploadFile(h.UpdateEvent))).Methods("PATCH")
	r.HandleFunc("/category/{category}", h.GetEventByCat).Methods("GET")
	r.HandleFunc("/today-events", h.GetEventByToday).Methods("GET")
	r.HandleFunc("/upcoming-events", h.GetEventByUpcoming).Methods("GET")
	r.HandleFunc("/search-events", h.SearchEvent).Methods("GET")
}

func setInterval() {
	eventRepository := repositories.RepositoryEvent(mysql.DB)
	h := handlers.HandlerEvent(eventRepository)

	ticker := time.Tick(2 * time.Second)
	for _ = range ticker {
		h.UpdateProgressEvent()
	}
}
