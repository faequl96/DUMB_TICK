package repositories

import (
	"Server/models"

	"gorm.io/gorm"
)

type UserRepository interface {
	FindUsers() ([]models.User, error)
	GetUserByID(ID int) (models.User, error)
	CreateUser(user models.User) (models.User, error)
	UpdateUser(user models.User) (models.User, error)
	GetEventsById(ID []int) ([]models.Event, error)
	UpdateUserWishlist(user models.User) error
	DeleteUserWishlist(user models.User) error
	GetUserWishlist(ID int) (models.User, error)
	DeleteUser(user models.User) (models.User, error)
}

func RepositoryUser(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindUsers() ([]models.User, error) {
	var users []models.User
	err := r.db.Find(&users).Error

	return users, err
}

func (r *repository) GetUserByID(ID int) (models.User, error) {
	var user models.User
	err := r.db.First(&user, ID).Error

	return user, err
}

func (r *repository) CreateUser(user models.User) (models.User, error) {
	err := r.db.Create(&user).Error

	return user, err
}

func (r *repository) UpdateUser(user models.User) (models.User, error) {
	err := r.db.Save(&user).Error

	return user, err
}

func (r *repository) GetEventsById(ID []int) ([]models.Event, error) {
	var events []models.Event
	err := r.db.Find(&events, ID).Error

	return events, err
}

func (r *repository) UpdateUserWishlist(user models.User) error {
	err := r.db.Save(&user).Error

	return err
}

// func (r *repository) DeleteUserWishlist(user models.User) error {
// 	err := r.db.Model(&user).Where("id = ?", ID).Update("name", "hello").Error
// 	// db.Model(&user).Where("active = ?", true).Update("name", "hello")
// 	return err
// }

func (r *repository) DeleteUserWishlist(user models.User) error {
	// err := r.db.Table("user_wishlist").Where("user_id IN ?", ID).Delete(map[string]interface{}{"wishlist": IsPayed}).Error
	err := r.db.Model(&user).Association("Wishlist").Clear()

	return err
}

func (r *repository) GetUserWishlist(ID int) (models.User, error) {
	var user models.User
	err := r.db.Preload("Wishlist").First(&user, ID).Error

	return user, err
}

func (r *repository) DeleteUser(user models.User) (models.User, error) {
	err := r.db.Delete(&user).Error

	return user, err
}
