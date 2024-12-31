// server.go
package apitoken

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Server struct {
    Router    *mux.Router
    DB        *gorm.DB
    StartTime time.Time
    Config    Config        // Add this
    KeyStore  APIKeyStore   // Add this
}

func NewServer(db *gorm.DB) *Server {
    server := &Server{
        DB:        db,
        StartTime: time.Now(),
        Router:    mux.NewRouter(),
        Config: Config{
            EFAEndpoint: os.Getenv("EFA_ENDPOINT"),
            AuthToken:   os.Getenv("EFA_AUTH_TOKEN"),
        },
        KeyStore:  NewInMemoryAPIKeyStore(),
    }
    return server
}

var jwtKey = []byte("scret_key_is_super_secret")

type Claims struct {
    Username string `json:"username"`
    Permissions string `json:"permissions"`
    jwt.StandardClaims
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

    s.Router.HandleFunc("/api/v1/docsearch", s.ValidateAPIToken(DocSearchHandler(s.Config, s.KeyStore))).Methods("POST")


    s.StartTime = time.Now()

    fmt.Printf("Server starting on port %d...\n", port)
}

func (s *Server) Login(w http.ResponseWriter, r *http.Request) {
    var loginRequest struct {
        UsernameOrEmail string `json:"username_or_email"`
        Password        string `json:"password"`
    }

    err := json.NewDecoder(r.Body).Decode(&loginRequest)
    if err != nil {
        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(map[string]string{
            "error": "Invalid request body",
            "details": err.Error(),
        })
        return
    }

    // Print the received credentials (without password)
    fmt.Printf("Login attempt - Username/Email: %s\n", loginRequest.UsernameOrEmail)

    // Try to find the user by either username or email
    var dbUser User
    result := s.DB.Where("email = ? OR username = ?", 
        loginRequest.UsernameOrEmail, 
        loginRequest.UsernameOrEmail,
    ).First(&dbUser)

    if result.Error != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(map[string]string{
            "error": "Authentication failed",
            "details": "Invalid credentials",
        })
        return
    }

    // Print the found user details (except password)
    fmt.Printf("Found user - Email: %s, Username: %s\n", dbUser.Email, dbUser.Username)

    // Compare passwords
    if err := bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(loginRequest.Password)); err != nil {
        fmt.Printf("Password comparison failed - Error: %v\n", err)
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(map[string]string{
            "error": "Authentication failed",
            "details": "Invalid credentials",
        })
        return
    }

    // Generate JWT token
    expirationTime := time.Now().Add(24 * time.Hour)
    claims := &Claims{
        Username: dbUser.Username,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(map[string]string{
            "error": "Internal server error",
            "details": "Could not generate token",
        })
        return
    }

    // Generate API token
    apiToken, err := CreateAPIToken(s.DB, dbUser.ID)
    if err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(map[string]string{
            "error": "Could not generate API token",
        })
        return
    }

    // Send successful response with both JWT and API token
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]interface{}{
        "user": map[string]interface{}{
            "email":    dbUser.Email,
            "username": dbUser.Username,
            "name":     dbUser.Name,
        },
        "token":     tokenString, // JWT token
        "api_token": apiToken.Token,
    })
}



func (s *Server) CreateUser(w http.ResponseWriter, r *http.Request) {
    var u User
    err := json.NewDecoder(r.Body).Decode(&u)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    fmt.Printf("Received user data: %+v\n", u)
    // Validate required fields
    if u.Username == "" {
        http.Error(w, "Username is required", http.StatusBadRequest)
        return
    }
    if u.Email == "" {
        http.Error(w, "Email is required", http.StatusBadRequest)
        return
    }
    if u.Password == "" {
        http.Error(w, "Password is required", http.StatusBadRequest)
        return
    }

    // Check if username already exists
    var existingUser User
    if err := s.DB.Where("username = ?", u.Username).First(&existingUser).Error; err == nil {
        http.Error(w, "Username already exists", http.StatusConflict)
        return
    }

    // Check if email already exists
    if err := s.DB.Where("email = ?", u.Email).First(&existingUser).Error; err == nil {
        http.Error(w, "Email already exists", http.StatusConflict)
        return
    }

    err = u.Create(s.DB)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    // Clear sensitive information before sending response
    apiToken, err := CreateAPIToken(s.DB, u.ID)
    if err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(map[string]string{
            "error": "Could not generate API token",
        })
        return
    }

    response := map[string]interface{}{
        "email":     u.Email,
        "username":  u.Username,
        "api_token": apiToken.Token,
    }
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(response)
}

func (s *Server) CheckAuthorization(w http.ResponseWriter, r *http.Request) {
    tokenStr := r.Header.Get("Authorization")
    if tokenStr == "" {
        http.Error(w, "Token is required", http.StatusUnauthorized)
        return
    }

    claims := &Claims{}
    token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })

    if err != nil || !token.Valid {
        http.Error(w, "Invalid token", http.StatusUnauthorized)
        return
    }

    // Token is valid, proceed with the request
}


func (s *Server) ValidateAPIToken(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        apiToken := r.Header.Get("X-API-Token")
        if apiToken == "" {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusUnauthorized)
            json.NewEncoder(w).Encode(map[string]string{
                "error": "API token required",
            })
            return
        }

        var token Token
        if err := s.DB.Where("token = ? AND is_api_token = ?", apiToken, true).First(&token).Error; err != nil {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusUnauthorized)
            json.NewEncoder(w).Encode(map[string]string{
                "error": "Invalid API token",
            })
            return
        }

        if !token.IsValid() {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusUnauthorized)
            json.NewEncoder(w).Encode(map[string]string{
                "error": "Expired API token",
            })
            return
        }

        // Update last used timestamp
        token.UpdateLastUsed(s.DB)

        // Add user and token info to request context
        ctx := context.WithValue(r.Context(), "user_id", token.UserID)
        ctx = context.WithValue(ctx, "token", &token)
        next.ServeHTTP(w, r.WithContext(ctx))
    }
}

func (s *Server) GetUsers(w http.ResponseWriter, r *http.Request) {
    var users []User
    s.DB.Preload("Organization").Find(&users)
    // for i := range users {
    //     users[i].Password = ""
    // }
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