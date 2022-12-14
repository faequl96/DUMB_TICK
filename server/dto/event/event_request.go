package eventdto

type EventRequest struct {
	Title       string `json:"title" form:"title"`
	Category    string `json:"category" form:"category"`
	Image       string `json:"image" form:"pamflet"`
	StartDate   string `json:"start_date" form:"startdate"`
	EndDate     string `json:"end_date" form:"enddate"`
	Price       int    `json:"price" form:"price"`
	Address     string `json:"address" form:"address"`
	UrlMap      string `json:"url_map" form:"urlMap"`
	Phone       string `json:"phone" form:"phone"`
	Email       string `json:"email" form:"email"`
	Description string `json:"description" form:"description"`
}
