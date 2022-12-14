package handlers

import (
	paymentdto "Server/dto/payment"
	dto "Server/dto/result"
	"Server/models"
	"Server/repositories"
	"encoding/json"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/coreapi"
	"github.com/midtrans/midtrans-go/snap"
)

var c = coreapi.Client{
	ServerKey: os.Getenv("SERVER_KEY"),
	ClientKey: os.Getenv("CLIENT_KEY"),
}

type handlerPayment struct {
	PaymentRepository repositories.PaymentRepository
}

func HandlerPayment(PaymentRepository repositories.PaymentRepository) *handlerPayment {
	return &handlerPayment{PaymentRepository}
}

func (h *handlerPayment) AddPayment(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	request := new(paymentdto.AddPaymentRequest)
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	validation := validator.New()
	err := validation.Struct(request)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "error validation"}
		json.NewEncoder(w).Encode(response)
		return
	}

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	purchaserID := int(userInfo["id"].(float64))

	event, err := h.PaymentRepository.GetEventPayment(request.EventID)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "Product Not Found!"}
		json.NewEncoder(w).Encode(response)
		return
	}

	dataPayment := models.Payment{
		PurchaserID: purchaserID,
		EventID:     event.ID,
		Qty:         request.Qty,
		Price:       request.Price,
		Status:      "Confirm",
	}

	err = h.PaymentRepository.AddPayment(dataPayment)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: "Failed to add payment!"}
		json.NewEncoder(w).Encode(response)
		return
	}
}

func (h *handlerPayment) GetPayments(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	purchaserID := int(userInfo["id"].(float64))

	payments, err := h.PaymentRepository.GetPaymentsByIdUser(purchaserID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var data []models.Payment
	for _, pay := range payments {
		dataGet := models.Payment{
			ID:            pay.ID,
			TransactionID: pay.TransactionID,
			PurchaserID:   pay.PurchaserID,
			Purchaser:     pay.Purchaser,
			EventID:       pay.EventID,
			Event:         pay.Event,
			Qty:           pay.Qty,
			Price:         pay.Price,
			Status:        pay.Status,
		}
		data = append(data, dataGet)
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: data}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerPayment) GetPaymentsSuccess(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userInfo := r.Context().Value("userInfo").(jwt.MapClaims)
	purchaserID := int(userInfo["id"].(float64))

	payments, err := h.PaymentRepository.GetPaymentsSuccess(purchaserID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	var data []models.Payment
	for _, pay := range payments {
		dataGet := models.Payment{
			ID:            pay.ID,
			TransactionID: pay.TransactionID,
			PurchaserID:   pay.PurchaserID,
			Purchaser:     pay.Purchaser,
			EventID:       pay.EventID,
			Event:         pay.Event,
			Qty:           pay.Qty,
			Price:         pay.Price,
			Status:        pay.Status,
		}
		data = append(data, dataGet)
	}

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: data}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerPayment) CreateTransaction(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("content-type", "application/json")

	id, _ := strconv.Atoi(mux.Vars(r)["id"])

	payment, err := h.PaymentRepository.GetPaymentById(id)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: "User Account not make a Purchase!"}
		json.NewEncoder(w).Encode(response)
		return
	}

	time := time.Now()
	idTrans := time.Unix()

	dataTrans := models.Payment{
		ID:            payment.ID,
		TransactionID: int(idTrans),
		PurchaserID:   payment.PurchaserID,
		Purchaser:     payment.Purchaser,
		EventID:       payment.EventID,
		Event:         payment.Event,
		Qty:           payment.Qty,
		Price:         payment.Price,
		Status:        payment.Status,
	}

	newTrans, err := h.PaymentRepository.UpdatePayment(dataTrans)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		response := dto.ErrorResult{Code: http.StatusInternalServerError, Message: "Failed to checkout!"}
		json.NewEncoder(w).Encode(response)
		return
	}

	dataTrans, err = h.PaymentRepository.GetPaymentByIdTrans(newTrans.TransactionID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(err.Error())
		return
	}

	var s = snap.Client{}
	s.New(os.Getenv("SERVER_KEY"), midtrans.Sandbox)

	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  strconv.Itoa(dataTrans.TransactionID),
			GrossAmt: int64(dataTrans.Price),
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: dataTrans.Purchaser.Name,
			Email: dataTrans.Purchaser.Email,
		},
	}

	snapResp, _ := s.CreateTransaction(req)

	w.WriteHeader(http.StatusOK)
	response := dto.SuccessResult{Code: http.StatusOK, Data: snapResp}
	json.NewEncoder(w).Encode(response)
}

func (h *handlerPayment) Notification(w http.ResponseWriter, r *http.Request) {
	var notificationPayload map[string]interface{}

	err := json.NewDecoder(r.Body).Decode(&notificationPayload)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		response := dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()}
		json.NewEncoder(w).Encode(response)
		return
	}

	transactionStatus := notificationPayload["transaction_status"].(string)
	fraudStatus := notificationPayload["fraud_status"].(string)
	orderId := notificationPayload["order_id"].(string)

	idTrans, _ := strconv.Atoi(orderId)

	transaction, _ := h.PaymentRepository.GetPaymentByIdTrans(idTrans)

	if transactionStatus == "capture" {
		if fraudStatus == "challenge" {
			h.PaymentRepository.UpdatePaymentStatus("Pending", transaction.TransactionID)
		} else if fraudStatus == "accept" {
			h.PaymentRepository.UpdatePaymentStatus("Success", transaction.TransactionID)
		}
	} else if transactionStatus == "settlement" {
		h.PaymentRepository.UpdatePaymentStatus("Success", transaction.TransactionID)
	} else if transactionStatus == "deny" {
		h.PaymentRepository.UpdatePaymentStatus("Pending", transaction.TransactionID)
	} else if transactionStatus == "cancel" || transactionStatus == "expire" {
		h.PaymentRepository.UpdatePaymentStatus("Pending", transaction.TransactionID)
	} else if transactionStatus == "pending" {
		h.PaymentRepository.UpdatePaymentStatus("Pending", transaction.TransactionID)
	}

	w.WriteHeader(http.StatusOK)
}
