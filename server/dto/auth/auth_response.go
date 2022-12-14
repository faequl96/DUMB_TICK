package authdto

type LoginResponse struct {
	ID    int    `gorm:"type: varchar(255)" json:"id"`
	Name  string `gorm:"type: varchar(255)" json:"name"`
	Email string `gorm:"type: varchar(255)" json:"email"`
	Image string `gorm:"type: varchar(255)" json:"image"`
	Token string `gorm:"type: varchar(255)" json:"token"`
}

type RegisterResponse struct {
	Name string `gorm:"type: varchar(255)" json:"name"`
}

type CheckAuthResponse struct {
	Id    int    `gorm:"type: int" json:"id"`
	Name  string `gorm:"type: varchar(255)" json:"name"`
	Email string `gorm:"type: varchar(255)" json:"email"`
	Image string `json:"image"`
}
