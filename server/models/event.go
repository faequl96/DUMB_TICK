package models

type Event struct {
	ID          int          `json:"id" gorm:"primary_key:auto_increment"`
	Title       string       `json:"title" gorm:"type: varchar(255)"`
	Category    string       `json:"category" gorm:"type: varchar(55)"`
	Image       string       `json:"image" gorm:"type: varchar(255)"`
	StartDate   string       `json:"start_date" gorm:"type: varchar(155)"`
	EndDate     string       `json:"end_date" gorm:"type: varchar(155)"`
	Price       int          `json:"price"`
	Address     string       `json:"address" gorm:"type: varchar(255)"`
	UrlMap      string       `json:"url_map" gorm:"type: varchar(255)"`
	Phone       string       `json:"phone" gorm:"type: varchar(55)"`
	Email       string       `json:"email" gorm:"type: varchar(155)"`
	Description string       `json:"description" gorm:"type: varchar(55)"`
	Progress    string       `json:"progress" gorm:"type:text"`
	MerchantID  int          `json:"merchant_id"`
	Merchant    UserResponse `json:"merchant" gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
