package apitoken

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"gorm.io/gorm"
)

type Server struct {
    Router    *mux.Router
    DB        *gorm.DB
    StartTime time.Time
}

func NewServer(db *gorm.DB) *Server {
    server := &Server{
        DB:        db,
        StartTime: time.Now(),
        Router:    mux.NewRouter(), // Initialize the router here
    }
    return server
}

func (s *Server) RunServer(port int) {
    s.Router.HandleFunc("/api/v1/login", s.Login).Methods("POST")
    s.Router.HandleFunc("/api/v1/users", s.CreateUser).Methods("POST")
    s.Router.HandleFunc("/api/v1/users", s.GetUsers).Methods("GET")
    s.Router.HandleFunc("/api/v1/users/{id}", s.GetUser).Methods("GET")
    s.Router.HandleFunc("/api/v1/users/{id}", s.UpdateUser).Methods("PUT")
    s.Router.HandleFunc("/api/v1/users/{id}", s.DeleteUser).Methods("DELETE")
    s.Router.HandleFunc("/api/v1/organizations", s.CreateOrganization).Methods("POST")
    s.Router.HandleFunc("/api/v1/organizations", s.GetOrganizations).Methods("GET")
    s.Router.HandleFunc("/api/v1/organizations/{id}", s.GetOrganization).Methods("GET")
    s.Router.HandleFunc("/api/v1/organizations/{id}", s.UpdateOrganization).Methods("PUT")
    s.Router.HandleFunc("/api/v1/organizations/{id}", s.DeleteOrganization).Methods("DELETE")
    s.Router.HandleFunc("/api/v1/tokens", s.CreateToken).Methods("POST")
    s.Router.HandleFunc("/api/v1/tokens", s.GetTokens).Methods("GET")
    s.Router.HandleFunc("/api/v1/tokens/{id}", s.GetToken).Methods("GET")
    s.Router.HandleFunc("/api/v1/tokens/{id}", s.UpdateToken).Methods("PUT")
    s.Router.HandleFunc("/api/v1/tokens/{id}", s.DeleteToken).Methods("DELETE")

    s.Router.HandleFunc("/api/v1/permissions", s.CreatePermission).Methods("POST")
    s.Router.HandleFunc("/api/v1/permissions", s.GetPermissions).Methods("GET")
    s.Router.HandleFunc("/api/v1/permissions/{id}", s.GetPermission).Methods("GET")
    s.Router.HandleFunc("/api/v1/permissions/{id}", s.UpdatePermission).Methods("PUT")
    s.Router.HandleFunc("/api/v1/permissions/{id}", s.DeletePermission).Methods("DELETE")

    s.StartTime = time.Now()

    fmt.Printf("Server starting on port %d...\n", port)
}

// func (s *Server) Login(w http.ResponseWriter, r *http.Request) {
//     var u User
//     err := json.NewDecoder(r.Body).Decode(&u)
//     if err != nil {
//         http.Error(w, err.Error(), http.StatusBadRequest)
//         return
//     }
//     err = u.GetByEmail(s.DB)
//     if err != nil {
//         http.Error(w, err.Error(), http.StatusUnauthorized)
//         return
//     }
//     if !u.CheckPassword(u.Password) {
//         http.Error(w, "Invalid password", http.StatusUnauthorized)
//         return
//     }
//     t := Token{
//         Token:      u.Username + time.Now().String(),
//         ExpiryDate: time.Now().Add(time.Hour * 24),
//         UserID:     u.ID,
//     }
//     err = t.Create(s.DB)
//     if err != nil {
//         http.Error(w, err.Error(), http.StatusBadRequest)
//         return
//     }
//     json.NewEncoder(w).Encode(t)
// }


func (s *Server) Login(w http.ResponseWriter, r *http.Request) {
    var u User
    err := json.NewDecoder(r.Body).Decode(&u)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    err = u.GetByEmail(s.DB)
    if err != nil {
        http.Error(w, err.Error(), http.StatusUnauthorized)
        return
    }
    if !u.CheckPassword(u.Password) {
        http.Error(w, "Invalid password", http.StatusUnauthorized)
        return
    }
    t := Token{
        Token:      u.Username + time.Now().String(),
        ExpiryDate: time.Now().Add(time.Hour * 24),
        UserID:     u.ID,
    }
    err = t.Create(s.DB)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    response := map[string]interface{}{
        "user": map[string]interface{}{
            "email": u.Email,
            "name":  u.Username,
        },
        "token": t.Token,
    }
    json.NewEncoder(w).Encode(response)
}

// func (s *Server) CreateUser(w http.ResponseWriter, r *http.Request) {
//     var u User
//     err := json.NewDecoder(r.Body).Decode(&u)
//     if err != nil {
//         http.Error(w, err.Error(), http.StatusBadRequest)
//         return
//     }
//     err = u.Create(s.DB)
//     if err != nil {
//         http.Error(w, err.Error(), http.StatusBadRequest)
//         return
//     }
// }

func (s *Server) CreateUser(w http.ResponseWriter, r *http.Request) {
    var u User
    err := json.NewDecoder(r.Body).Decode(&u)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    err = u.Create(s.DB)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    response := map[string]interface{}{
        "email":        u.Email,
        "username":     u.Username,
        "organization": u.Organization,
    }
    json.NewEncoder(w).Encode(response)
}

func (s *Server) CheckAuthorization(w http.ResponseWriter, r *http.Request) {
    token := r.Header.Get("Authorization")
    if token == "" {
        http.Error(w, "Token is required", http.StatusUnauthorized)
        return
    }
    var t Token
    s.DB.Where("token = ?", token).First(&t)
    if t.Token == "" {
        http.Error(w, "Invalid token", http.StatusUnauthorized)
        return
    }
    if t.ExpiryDate.Before(time.Now()) {
        http.Error(w, "Token is expired", http.StatusUnauthorized)
        return
    }
}

func (s *Server) GetUsers(w http.ResponseWriter, r *http.Request) {
    var users []User
    s.DB.Preload("Organization").Find(&users)
    for i := range users {
        users[i].Password = ""
    }
    json.NewEncoder(w).Encode(users)
}

func (s *Server) GetUser(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    var u User
    s.DB.Preload("Organization").First(&u, vars["id"])
    u.Password = ""
    json.NewEncoder(w).Encode(u)
}

func (s *Server) UpdateUser(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    var u User
    s.DB.First(&u, vars["id"])
    json.NewDecoder(r.Body).Decode(&u)
    s.DB.Save(&u)
}

func (s *Server) DeleteUser(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    var u User
    s.DB.First(&u, vars["id"])
    s.DB.Delete(&u)
}

func (s *Server) CreateOrganization(w http.ResponseWriter, r *http.Request) {
    var o Organization
    err := json.NewDecoder(r.Body).Decode(&o)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    err = o.Create(s.DB)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
}

func (s *Server) GetOrganizations(w http.ResponseWriter, r *http.Request) {
    var organizations []Organization
    s.DB.Find(&organizations)
    json.NewEncoder(w).Encode(organizations)
}

func (s *Server) GetOrganization(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    var o Organization
    s.DB.First(&o, vars["id"])
    json.NewEncoder(w).Encode(o)
}

func (s *Server) UpdateOrganization(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    var o Organization
    s.DB.First(&o, vars["id"])
    json.NewDecoder(r.Body).Decode(&o)
    s.DB.Save(&o)
}

func (s *Server) DeleteOrganization(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    var o Organization
    s.DB.First(&o, vars["id"])
    s.DB.Delete(&o)
}

func (s *Server) CreateToken(w http.ResponseWriter, r *http.Request) {
    var t Token
    err := json.NewDecoder(r.Body).Decode(&t)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    err = t.Create(s.DB)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
}

func (s *Server) GetTokens(w http.ResponseWriter, r *http.Request) {
    var tokens []Token
    s.DB.Find(&tokens)
    json.NewEncoder(w).Encode(tokens)
}

func (s *Server) GetToken(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    var t Token
    s.DB.First(&t, vars["id"])
    json.NewEncoder(w).Encode(t)
}

func (s *Server) UpdateToken(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    var t Token
    s.DB.First(&t, vars["id"])
    json.NewDecoder(r.Body).Decode(&t)
    s.DB.Save(&t)
}

func (s *Server) DeleteToken(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    var t Token
    s.DB.First(&t, vars["id"])
    s.DB.Delete(&t)
}

func (s *Server) CreatePermission(w http.ResponseWriter, r *http.Request) {
    var p Permission
    err := json.NewDecoder(r.Body).Decode(&p)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    err = p.Create(s.DB)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
}

func (s *Server) GetPermissions(w http.ResponseWriter, r *http.Request) {
    var permissions []Permission
    s.DB.Find(&permissions)
    json.NewEncoder(w).Encode(permissions)
}

func (s *Server) GetPermission(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    var p Permission
    s.DB.First(&p, vars["id"])
    json.NewEncoder(w).Encode(p)
}

func (s *Server) UpdatePermission(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    var p Permission
    s.DB.First(&p, vars["id"])
    json.NewDecoder(r.Body).Decode(&p)
    s.DB.Save(&p)
}

func (s *Server) DeletePermission(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    var p Permission
    s.DB.First(&p, vars["id"])
    s.DB.Delete(&p)
}

func (s *Server) GetOrganizationUsers(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    var o Organization
    s.DB.First(&o, vars["id"])
    var users []User
    s.DB.Model(&o).Association("Users").Find(&users)
    json.NewEncoder(w).Encode(users)
}