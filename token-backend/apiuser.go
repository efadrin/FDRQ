package apitoken

import (
	"time"

	// import gorm orm
	"gorm.io/gorm"
)

// User struct
type User struct {
	gorm.Model
	ID               int           `json:"id"`
	Username         string        `json:"username"`
	Password         string        `json:"password"`
	Email            string        `json:"email"`
	SecondFactorType string        `json:"second_factor_type"`
	SecondFactorKey  string        `json:"second_factor_value"`
	Permissions      string        `json:"permissions"`
	Organization     *Organization `json:"organization" gorm:"foreignKey:OrganizationID"`
	OrganizationID   int           `json:"organization_id"`
	Tokens           []Token       `json:"tokens"`
}

type Organization struct {
	gorm.Model
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Users []User `gorm:"many2many:organization_users;"`
}

type Token struct {
	gorm.Model
	ID          int           `json:"id"`
	Token       string        `json:"token"`
	ExpiryDate  time.Time     `json:"expiry_date"`
	UserID      int           `json:"user_id"`
	User        *User         `json:"-" gorm:"foreignKey:UserID"`
	Permissions []*Permission `gorm:"many2many:token_permissions;"`
}

type Permission struct {
	gorm.Model
	ID          int      `json:"id"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Tokens      []*Token `gorm:"many2many:token_permissions;"`
	IsAdmin     bool     `json:"is_admin"`
}

func InitDB(db *gorm.DB) {
	db.AutoMigrate(&User{}, &Organization{}, &Token{}, &Permission{})
}

func (u *User) Create(db *gorm.DB) error {
	return db.Create(u).Error
}

func (u *User) Update(db *gorm.DB) error {
	return db.Save(u).Error
}

func (u *User) Delete(db *gorm.DB) error {
	return db.Delete(u).Error
}

func (u *User) Get(db *gorm.DB) error {
	return db.First(u).Error
}

func (u *User) GetByUsername(db *gorm.DB) error {
	return db.Where("username = ?", u.Username).First(u).Error
}

func (u *User) GetByEmail(db *gorm.DB) error {
	return db.Where("email = ?", u.Email).First(u).Error
}

func (o *Organization) Create(db *gorm.DB) error {
	return db.Create(o).Error
}

func (o *Organization) Update(db *gorm.DB) error {
	return db.Save(o).Error
}

func (o *Organization) Delete(db *gorm.DB) error {
	return db.Delete(o).Error
}

func (o *Organization) Get(db *gorm.DB) error {
	return db.First(o).Error
}

func (t *Token) Create(db *gorm.DB) error {
	return db.Create(t).Error
}

func (t *Token) Update(db *gorm.DB) error {
	return db.Save(t).Error
}

func (t *Token) Delete(db *gorm.DB) error {
	return db.Delete(t).Error
}

func (t *Token) Get(db *gorm.DB) error {
	return db.First(t).Error
}

func (p *Permission) Create(db *gorm.DB) error {
	return db.Create(p).Error
}

func (p *Permission) Update(db *gorm.DB) error {
	return db.Save(p).Error
}

func (p *Permission) Delete(db *gorm.DB) error {
	return db.Delete(p).Error
}

func (p *Permission) Get(db *gorm.DB) error {
	return db.First(p).Error
}

func (p *Permission) GetByName(db *gorm.DB) error {
	return db.Where("name = ?", p.Name).First(p).Error
}

func (u *User) GetOrganization(db *gorm.DB) error {
	return db.Model(u).Association("Organization").Find(&u.Organization)
}

func (u *User) GetTokens(db *gorm.DB) error {
	return db.Model(u).Association("Tokens").Find(&u.Tokens)
}

func (o *Organization) GetUsers(db *gorm.DB) error {
	return db.Model(o).Association("Users").Find(&o.Users)
}

// Check Password
func (u *User) CheckPassword(password string) bool {
	return u.Password == password
}

// check password u.CheckPassword(s.DB)
// func (u *User) CheckPassword(db *gorm.DB, password string) bool {
// 	return u.Password == password
// }

