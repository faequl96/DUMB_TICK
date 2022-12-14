package models

type User struct {
	ID         int     `json:"id" gorm:"primary_key:auto_increment"`
	Name       string  `json:"name" gorm:"type: varchar(155)"`
	Email      string  `json:"email" gorm:"type: varchar(125)"`
	Username   string  `json:"username" gorm:"type: varchar(55)"`
	Password   string  `json:"password" gorm:"type: varchar(255)"`
	Birthday   string  `json:"birthday" gorm:"type: varchar(125)"`
	Phone      string  `json:"phone" gorm:"type: varchar(55)"`
	Photo      string  `json:"photo" gorm:"type: varchar(255)"`
	WishlistID []int   `json:"wishlist_id" gorm:"-"`
	Wishlist   []Event `json:"wishlist" gorm:"many2many:user_wishlist;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type UserResponse struct {
	ID       int     `json:"id"`
	Name     string  `json:"name"`
	Email    string  `json:"email"`
	Username string  `json:"username"`
	Birthday string  `json:"birthday"`
	Phone    string  `json:"phone"`
	Photo    string  `json:"photo"`
	Wishlist []Event `json:"wishlist" gorm:"many2many:user_wishlist;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

func (UserResponse) TableName() string {
	return "users"
}
