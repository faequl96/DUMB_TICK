package userdto

type UserUpdateRequest struct {
	Name     string `json:"name" gorm:"type: varchar(255)" validate:"required"`
	Birthday string `json:"birthday" gorm:"type: varchar(255)" validate:"required"`
	Phone    string `json:"phone" gorm:"type: varchar(255)" validate:"required"`
	Email    string `json:"email" gorm:"type: varchar(255)" validate:"required"`
	Image    string `json:"image" gorm:"type: varchar(255)" validate:"required"`
}

type UserWishlistRequest struct {
	EventsID []int `json:"events_id" form:"events_id"`
}
