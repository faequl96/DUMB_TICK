package models

type Payment struct {
	ID            int          `json:"id" gorm:"primary_key:auto_increment"`
	TransactionID int          `json:"transaction_id"`
	PurchaserID   int          `json:"purchaser_id"`
	Purchaser     UserResponse `json:"purchaser" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	EventID       int          `json:"event_id"`
	Event         Event        `json:"event" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Qty           int          `json:"qty"`
	Price         int          `json:"price"`
	Status        string       `json:"status" gorm:"type: varchar(255)"`
}
