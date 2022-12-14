package paymentdto

type AddPaymentRequest struct {
	EventID int `json:"event_id" form:"event_id"`
	Qty     int `json:"qty" form:"qty"`
	Price   int `json:"price" form:"price"`
}

type PaymentUpdate struct {
	Status string `json:"status"  gorm:"type:varchar(255)"`
}
