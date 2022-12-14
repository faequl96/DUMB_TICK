package ticketdto

type TicketRequest struct {
	EventID int `json:"event" form:"event"`
	Qty     int `json:"qty" form:"qty"`
}
