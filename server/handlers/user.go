package handlers

import (
	dto "Server/dto/result"
	userdto "Server/dto/user"
	"Server/models"
	"Server/repositories"
	"context"
	"encoding/json"
	"net/http"
	"os"
	"strconv"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
)

type handlerUser struct {
	UserRepository repositories.UserRepository
}

func HandlerUser(UserRepository repositories.UserRepository) *handlerUser {
	return &handlerUser{UserRepository}
}

func (h *handlerUser) FindUsers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	users, err := h.UserRepository.FindUsers()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Status: "success", Data: users}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerUser) GetUserByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))

	if userId != id {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusUnauthorized, Message: "To show this data user, you must login as Admin or login with this user account!"}
		json.NewEncoder(w).Encode(response)
		return
	}

	user, err := h.UserRepository.GetUserByID(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
	}

	UserResponse := userdto.UserResponse{
		ID:       user.ID,
		Name:     user.Name,
		Birthday: user.Birthday,
		Phone:    user.Phone,
		Email:    user.Email,
		Image:    user.Photo,
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: UserResponse}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerUser) UpdateUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	dataContext := r.Context().Value("dataFile")
	filename := dataContext.(string)

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("CLOUD_API_KEY")
	var API_SECRET = os.Getenv("CLOUD_API_SECRET")

	request := userdto.UserUpdateRequest{
		Name:     r.FormValue("name"),
		Birthday: r.FormValue("birthday"),
		Phone:    r.FormValue("phone"),
		Email:    r.FormValue("email"),
		Image:    filename,
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))

	if userId != id {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusUnauthorized, Message: "You can't edit this data user, you must login as Admin or login with this user account!"}
		json.NewEncoder(w).Encode(response)
		return
	}

	user, err := h.UserRepository.GetUserByID(int(id))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)
	resp, _ := cld.Upload.Upload(ctx, filename, uploader.UploadParams{Folder: "uploads"})

	if request.Name != "" {
		user.Name = request.Name
	}
	if request.Birthday != "" {
		user.Birthday = request.Birthday
	}
	if request.Phone != "" {
		user.Phone = request.Phone
	}
	if request.Email != "" {
		user.Email = request.Email
	}
	if filename != "false" {
		user.Photo = resp.SecureURL
	}

	data, err := h.UserRepository.UpdateUser(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	UserUpdateResponse := userdto.UserUpdateResponse{
		ID:       data.ID,
		Name:     data.Name,
		Birthday: data.Birthday,
		Phone:    data.Phone,
		Email:    data.Email,
		Image:    data.Photo,
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: UserUpdateResponse}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerUser) UpdateUserWishlist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	request := new(userdto.UserWishlistRequest)
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userId := int(userInfo["id"].(float64))

	if userId != id {
		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusUnauthorized, Message: "You can't edit this data user, you must login as Admin or login with this user account!"}
		json.NewEncoder(w).Encode(response)
		return
	}

	var events []models.Event
	var err error

	if len(request.EventsID) != 0 {
		events, err = h.UserRepository.GetEventsById(request.EventsID)
	}

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Event Not Found!"}
		json.NewEncoder(w).Encode(response)
		return
	}

	user, err := h.UserRepository.GetUserByID(int(id))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	dataUser := models.User{
		ID:       user.ID,
		Name:     user.Name,
		Email:    user.Email,
		Username: user.Username,
		Password: user.Password,
		Birthday: user.Birthday,
		Phone:    user.Phone,
		Photo:    user.Photo,
		Wishlist: events,
	}

	err = h.UserRepository.DeleteUserWishlist(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	err = h.UserRepository.UpdateUserWishlist(dataUser)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}
}

func (h *handlerUser) GetUserWishlist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	user, err := h.UserRepository.GetUserWishlist(id)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
	}

	UserResponse := models.User{
		ID:       user.ID,
		Name:     user.Name,
		Birthday: user.Birthday,
		Phone:    user.Phone,
		Email:    user.Email,
		Photo:    user.Photo,
		Wishlist: user.Wishlist,
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: UserResponse}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerUser) DeleteUser(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	userID := userInfo["id"]
	userRole := userInfo["role"]

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	if (userID == id) || (userRole == "admin") {

		w.WriteHeader(http.StatusUnauthorized)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Status: "failed", Message: "unauthorized"}
		json.NewEncoder(w).Encode(response)
		return
	}

	user, err := h.UserRepository.GetUserByID(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	data, err := h.UserRepository.DeleteUser(user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Status: "failed", Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Status: "success", Data: data.ID}
	json.NewEncoder(w).Encode(response)

}
