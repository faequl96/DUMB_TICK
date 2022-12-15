package repositories

import (
	"Server/models"

	"gorm.io/gorm"
)

type EventRepository interface {
	FindEvents() ([]models.Event, error)
	GetEventById(ID int) (models.Event, error)
	CreateEvent(event models.Event) (models.Event, error)
	UpdateEvent(event models.Event) (models.Event, error)
	UpdateProgressEvent(event models.Event)
	GetEventByCat(category string) ([]models.Event, error)
	GetEventByProgress() ([]models.Event, error)
}

func RepositoryEvent(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindEvents() ([]models.Event, error) {
	var events []models.Event
	err := r.db.Find(&events).Error

	return events, err
}

func (r *repository) GetEventById(ID int) (models.Event, error) {
	var event models.Event
	err := r.db.Preload("Merchant").First(&event, ID).Error

	return event, err
}

func (r *repository) CreateEvent(event models.Event) (models.Event, error) {
	err := r.db.Create(&event).Error

	return event, err
}

func (r *repository) UpdateEvent(event models.Event) (models.Event, error) {
	err := r.db.Save(&event).Error

	return event, err
}

func (r *repository) UpdateProgressEvent(event models.Event) {
	r.db.Save(&event)
	return
}

func (r *repository) GetEventByCat(category string) ([]models.Event, error) {
	var event []models.Event

	err := r.db.Preload("Merchant").Where("category = ? AND progress = ?", category, "Event will start").Or("category = ? AND progress = ?", category, "Event in progress").Find(&event).Error

	return event, err
}

func (r *repository) GetEventByProgress() ([]models.Event, error) {
	var event []models.Event
	err := r.db.Preload("Merchant").Where("progress = ?", "Event will start").Or("progress = ?", "Event in progress").Find(&event).Error

	return event, err
}
