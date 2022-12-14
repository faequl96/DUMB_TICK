package userdto

type UserResponse struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Birthday string `json:"birthday"`
	Phone    string `json:"phone"`
	Email    string `json:"email"`
	Image    string `json:"image"`
}

type UserUpdateResponse struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Birthday string `json:"birthday"`
	Phone    string `json:"phone"`
	Email    string `json:"email"`
	Image    string `json:"image"`
}

type UserDeleteResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}
