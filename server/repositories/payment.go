package repositories

import (
	"Server/models"
	"fmt"

	"gorm.io/gorm"
)

type PaymentRepository interface {
	AddPayment(payment models.Payment) error
	GetEventPayment(ID int) (models.Event, error)
	GetPaymentsByIdUser(ID int) ([]models.Payment, error)
	GetPaymentsSuccess(ID int) ([]models.Payment, error)
	GetPaymentById(ID int) (models.Payment, error)
	UpdatePayment(payment models.Payment) (models.Payment, error)
	GetPaymentByIdTrans(ID int) (models.Payment, error)
	UpdatePaymentStatus(status string, TransactionID int) error
}

func RepositoryPayment(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) AddPayment(payment models.Payment) error {
	err := r.db.Create(&payment).Error

	return err
}

func (r *repository) GetEventPayment(ID int) (models.Event, error) {
	var event models.Event
	err := r.db.Preload("Merchant").First(&event, ID).Error

	return event, err
}

func (r *repository) GetPaymentsByIdUser(ID int) ([]models.Payment, error) {
	var payment []models.Payment
	err := r.db.Preload("Event").Preload("Purchaser").Where("purchaser_id = ? AND status = ?", ID, "Confirm").Or("purchaser_id = ? AND status = ?", ID, "Pending").Find(&payment).Error

	return payment, err
}

func (r *repository) GetPaymentsSuccess(ID int) ([]models.Payment, error) {
	var payment []models.Payment
	err := r.db.Preload("Event").Preload("Purchaser").Where("purchaser_id = ? AND status = ?", ID, "Success").Find(&payment).Error

	return payment, err
}

func (r *repository) GetPaymentById(ID int) (models.Payment, error) {
	var payment models.Payment
	err := r.db.Preload("Event").Preload("Purchaser").Where("id = ?", ID).Find(&payment).Error

	return payment, err
}

func (r *repository) UpdatePayment(payment models.Payment) (models.Payment, error) {
	err := r.db.Save(&payment).Error

	return payment, err
}

func (r *repository) GetPaymentByIdTrans(ID int) (models.Payment, error) {
	var payment models.Payment
	err := r.db.Preload("Event").Where("transaction_id = ?", ID).Find(&payment).Error

	fmt.Println(payment)
	return payment, err
}

func (r *repository) UpdatePaymentStatus(status string, TransactionID int) error {
	var payment models.Payment
	r.db.Preload("Event").Where("transaction_id = ?", TransactionID).Find(&payment)
	payment.Status = status
	err := r.db.Preload("Purchaser").Save(&payment).Error
	return err
}
