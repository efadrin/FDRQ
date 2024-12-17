// apiuser.go
package apitoken

import (
	"crypto/rand"
	"fmt"
	"time"

	// import gorm orm

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// User struct
type User struct {
	gorm.Model
	ID               int           `json:"id"`
	Name			 string        `json:"name"`
	Username	     string        `json:"username" gorm:"unique"`
	Password         string        `json:"password"`
	Email            string        `json:"email" gorm:"unique"`
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
    Token       string        `json:"token" gorm:"unique;not null"`
    ExpiryDate  time.Time     `json:"expiry_date"`
    UserID      int           `json:"user_id"`
    User        *User         `json:"-" gorm:"foreignKey:UserID"`
    IsAPIToken  bool          `json:"is_api_token"`
    LastUsed    time.Time     `json:"last_used"`
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

func GenerateAPIToken() string {
    // Generate a random 32-byte token
    b := make([]byte, 32)
    if _, err := rand.Read(b); err != nil {
        return ""
    }
    return fmt.Sprintf("%x", b)
}


// Add these methods to Token struct
func (t *Token) IsValid() bool {
    return t.ExpiryDate.After(time.Now())
}

func (t *Token) UpdateLastUsed(db *gorm.DB) error {
    t.LastUsed = time.Now()
    return db.Save(t).Error
}

func CreateAPIToken(db *gorm.DB, userID int) (*Token, error) {
    token := &Token{
        Token:      GenerateAPIToken(),
        ExpiryDate: time.Now().AddDate(1, 0, 0), // Token valid for 1 year
        UserID:     userID,
        IsAPIToken: true,
        LastUsed:   time.Now(),
    }
    
    if err := db.Create(token).Error; err != nil {
        return nil, err
    }
    return token, nil
}


func (u *User) HashPassword() error {
    hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
    if err != nil {
        return err
    }
    u.Password = string(hashedPassword)
    return nil
}

func (u *User) CheckPassword(password string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	fmt.Println(err)
	fmt.Println(u.Password, "and", password)
    return err == nil
}

func (u *User) Create(db *gorm.DB) error {
    if err := u.HashPassword(); err != nil {
        return err
    }
    return db.Create(u).Error
}

func InitDB(db *gorm.DB) {
	db.AutoMigrate(&User{}, &Organization{}, &Token{}, &Permission{})
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
