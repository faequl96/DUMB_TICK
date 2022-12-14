package handlers

import (
	eventdto "Server/dto/event"
	dto "Server/dto/result"
	"Server/models"
	"Server/repositories"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"

	"github.com/go-playground/validator/v10"

	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
)

type handlerEvent struct {
	EventRepository repositories.EventRepository
}

func HandlerEvent(EventRepository repositories.EventRepository) *handlerEvent {
	return &handlerEvent{EventRepository}
}

func (h *handlerEvent) FindEvents(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	events, err := h.EventRepository.FindEvents()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: events}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerEvent) GetEventById(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	var event models.Event
	event, err := h.EventRepository.GetEventById(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	const formatDate = "Mon, 02 Jan 2006 15:04:00 MST"
	fStart, _ := time.Parse(formatDate, event.StartDate)
	fEnd, _ := time.Parse(formatDate, event.EndDate)

	dataEvent := models.Event{
		ID:          event.ID,
		Title:       event.Title,
		Category:    event.Category,
		Image:       event.Image,
		StartDate:   fStart.Local().Format(time.RFC1123),
		EndDate:     fEnd.Local().Format(time.RFC1123),
		Price:       event.Price,
		Address:     event.Address,
		UrlMap:      event.UrlMap,
		Phone:       event.Phone,
		Email:       event.Email,
		Description: event.Description,
		Progress:    event.Progress,
		Merchant:    event.Merchant,
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: dataEvent}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerEvent) CreateEvent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	price, _ := strconv.Atoi(r.FormValue("price"))

	request := eventdto.EventRequest{
		Title:       r.FormValue("title"),
		Category:    r.FormValue("category"),
		StartDate:   r.FormValue("start_date"),
		EndDate:     r.FormValue("end_date"),
		Price:       price,
		Address:     r.FormValue("address"),
		UrlMap:      r.FormValue("url_map"),
		Phone:       r.FormValue("phone"),
		Email:       r.FormValue("email"),
		Description: r.FormValue("description"),
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	dataContext := r.Context().Value("dataFile")
	filename := dataContext.(string)

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("CLOUD_API_KEY")
	var API_SECRET = os.Getenv("CLOUD_API_SECRET")

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)
	resp, err := cld.Upload.Upload(ctx, filename, uploader.UploadParams{Folder: "uploads"})

	if err != nil {
		fmt.Println(err.Error())
	}

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))

	event := models.Event{
		Title:       request.Title,
		Category:    request.Category,
		Image:       resp.SecureURL,
		StartDate:   request.StartDate,
		EndDate:     request.EndDate,
		Price:       request.Price,
		Address:     request.Address,
		UrlMap:      request.UrlMap,
		Phone:       request.Phone,
		Email:       request.Email,
		Description: request.Description,
		Progress:    "Event will start",
		MerchantID:  userId,
	}

	_, err = h.EventRepository.CreateEvent(event)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}
}

func (h *handlerEvent) UpdateEvent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	dataContex := r.Context().Value("dataFile")
	filepath := dataContex.(string)

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	price, _ := strconv.Atoi(r.FormValue("price"))

	request := eventdto.EventRequest{
		Title:       r.FormValue("title"),
		Category:    r.FormValue("category"),
		Price:       price,
		Address:     r.FormValue("address"),
		UrlMap:      r.FormValue("urlMap"),
		Phone:       r.FormValue("phone"),
		Email:       r.FormValue("email"),
		Description: r.FormValue("description"),
	}

	event, err := h.EventRepository.GetEventById(int(id))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	resp, err := cld.Upload.Upload(ctx, filepath, uploader.UploadParams{Folder: "Buckbug"})

	if request.Title != "" {
		event.Title = request.Title
	}

	if request.Category != "" {
		event.Category = request.Category
	}

	if filepath != "false" {
		event.Image = resp.SecureURL
	}

	if r.FormValue("price") != "" {
		event.Price = request.Price
	}

	if request.Address != "" {
		event.Address = request.Address
	}

	if request.UrlMap != "" {
		event.UrlMap = request.UrlMap
	}

	if request.Phone != "" {
		event.Phone = request.Phone
	}

	if request.Email != "" {
		event.Email = request.Email
	}

	if request.Description != "" {
		event.Description = request.Description
	}

	data, err := h.EventRepository.UpdateEvent(event)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Status: "success", Data: data}
	json.NewEncoder(w).Encode(response)

}

func (h *handlerEvent) GetEventByCat(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	category := mux.Vars(r)["category"]

	events, err := h.EventRepository.GetEventByCat(category)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var data []models.Event
	for _, ev := range events {

		const formatTime = "Mon, 02 Jan 2006 15:04:05 MST"
		fStart, _ := time.Parse(formatTime, ev.StartDate)
		fEnd, _ := time.Parse(formatTime, ev.EndDate)

		dataGet := models.Event{
			ID:          ev.ID,
			Title:       ev.Title,
			Category:    ev.Category,
			Image:       ev.Image,
			StartDate:   fStart.Local().Format(time.RFC1123),
			EndDate:     fEnd.Local().Format(time.RFC1123),
			Price:       ev.Price,
			Address:     ev.Address,
			UrlMap:      ev.UrlMap,
			Phone:       ev.Phone,
			Email:       ev.Email,
			Description: ev.Description,
			Progress:    ev.Progress,
		}
		data = append(data, dataGet)
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: data}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerEvent) GetEventByToday(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	events, err := h.EventRepository.GetEventByProgress()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	const localFormat = "Mon, 02 Jan 2006 15:04:00 MST"

	var dataEvents []models.Event
	for _, ev := range events {

		timeLocalFormat := ev.StartDate
		splitTimeLocal := strings.Split(timeLocalFormat, " ")
		splitedTimeLocal := splitTimeLocal[5]

		timeNow := time.Now()
		timeNowLocal := timeNow.Local()
		timeNowPlus24 := timeNowLocal.Add(24 * time.Hour)
		tomorrowNoHour := timeNowPlus24.Format("Mon, 02 Jan 2006")
		tomorrowWithHour := tomorrowNoHour + " 00:00:00 " + splitedTimeLocal
		tomorrow00_00, _ := time.Parse(localFormat, tomorrowWithHour)

		fStart, _ := time.Parse(localFormat, ev.StartDate)
		fEnd, _ := time.Parse(localFormat, ev.EndDate)

		dataGet := models.Event{
			ID:          ev.ID,
			Title:       ev.Title,
			Category:    ev.Category,
			Image:       ev.Image,
			StartDate:   fStart.Format(time.RFC1123),
			EndDate:     fEnd.Format(time.RFC1123),
			Price:       ev.Price,
			Address:     ev.Address,
			UrlMap:      ev.UrlMap,
			Phone:       ev.Phone,
			Email:       ev.Email,
			Description: ev.Description,
			Progress:    ev.Progress,
			MerchantID:  ev.MerchantID,
		}

		if (timeNow.Unix() <= fStart.Unix()) && (fStart.Unix() <= tomorrow00_00.Unix()) {
			dataEvents = append(dataEvents, dataGet)
		}
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: dataEvents}
	json.NewEncoder(w).Encode(response)

}

func (h *handlerEvent) GetEventByUpcoming(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	events, err := h.EventRepository.GetEventByProgress()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	const localFormat = "Mon, 02 Jan 2006 15:04:00 MST"

	timeNow := time.Now()
	timeNowLocal := timeNow.Local()
	timeNowPlus24 := timeNowLocal.Add(24 * time.Hour)
	tomorrowNoHour := timeNowPlus24.Format("Mon, 02 Jan 2006")
	tomorrowWithHour := tomorrowNoHour + " 00:00:00 +07"
	tomorrow00_00, _ := time.Parse(localFormat, tomorrowWithHour)

	var dataEvents []models.Event
	for _, ev := range events {

		fStart, _ := time.Parse(localFormat, ev.StartDate)
		fEnd, _ := time.Parse(localFormat, ev.EndDate)

		dataGet := models.Event{
			ID:          ev.ID,
			Title:       ev.Title,
			Category:    ev.Category,
			Image:       ev.Image,
			StartDate:   fStart.Local().Format(time.RFC1123),
			EndDate:     fEnd.Local().Format(time.RFC1123),
			Price:       ev.Price,
			Address:     ev.Address,
			UrlMap:      ev.UrlMap,
			Phone:       ev.Phone,
			Email:       ev.Email,
			Description: ev.Description,
			Progress:    ev.Progress,
		}

		if fStart.Unix() >= tomorrow00_00.Unix() {
			dataEvents = append(dataEvents, dataGet)
		}
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: dataEvents}
	json.NewEncoder(w).Encode(response)

}

func (h *handlerEvent) SearchEvent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	const longFormat = "Mon, 02 Jan 2006 15:04:00 MST"
	const shortFormat = "2006-January-02"

	events, err := h.EventRepository.GetEventByProgress()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var dataEvents []models.Event
	for _, ev := range events {

		fStart, _ := time.Parse(longFormat, ev.StartDate)
		fEnd, _ := time.Parse(longFormat, ev.EndDate)

		dataGet := models.Event{
			ID:          ev.ID,
			Title:       ev.Title,
			Category:    ev.Category,
			Image:       ev.Image,
			StartDate:   fStart.Local().Format(time.RFC1123),
			EndDate:     fEnd.Local().Format(time.RFC1123),
			Price:       ev.Price,
			Address:     ev.Address,
			UrlMap:      ev.UrlMap,
			Phone:       ev.Phone,
			Email:       ev.Email,
			Description: ev.Description,
			Progress:    ev.Progress,
		}

		dataEvents = append(dataEvents, dataGet)
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: dataEvents}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerEvent) UpdateProgressEvent() {

	const longFormat = "Mon, 02 Jan 2006 15:04:00 MST"

	timeNow := time.Now().UTC()

	events, _ := h.EventRepository.GetEventByProgress()

	for _, ev := range events {

		fStart, _ := time.Parse(longFormat, ev.StartDate)
		fEnd, _ := time.Parse(longFormat, ev.EndDate)

		dataGet := models.Event{
			ID:          ev.ID,
			Title:       ev.Title,
			Category:    ev.Category,
			Image:       ev.Image,
			StartDate:   fStart.Format(time.RFC1123),
			EndDate:     fEnd.Format(time.RFC1123),
			Price:       ev.Price,
			Address:     ev.Address,
			UrlMap:      ev.UrlMap,
			Phone:       ev.Phone,
			Email:       ev.Email,
			Description: ev.Description,
			MerchantID:  ev.MerchantID,
			Merchant:    ev.Merchant,
		}

		if timeNow.Unix() >= fEnd.Unix() {
			dataGet.Progress = "Event is over"
		}
		if timeNow.Unix() >= fEnd.Unix() {
			h.EventRepository.UpdateProgressEvent(dataGet)
		}

		if timeNow.Unix() <= fEnd.Unix() && timeNow.Unix() >= fStart.Unix() {
			dataGet.Progress = "Event in progress"
		}
		if timeNow.Unix() <= fEnd.Unix() && timeNow.Unix() >= fStart.Unix() {
			h.EventRepository.UpdateProgressEvent(dataGet)
		}
	}
}
