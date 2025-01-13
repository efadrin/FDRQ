package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/efadrin/apitoken"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
    err := godotenv.Load()

    if err != nil {
        log.Fatalf("Error loading .env file")
        fmt.Println("Error loading .env file")
    }

    // Get the database URL from the environment variable
    dsn := os.Getenv("DATABASE_URL")
    // fmt.Println("DATABASE_URL is", dsn)
    if dsn == "" {
        log.Fatalf("DATABASE_URL is not set in the environment")
        fmt.Println("DATABASE_URL is not set in the environment")
    }

    // Parse command line arguments
    port := flag.Int("port", 8089, "Port to listen on")
    flag.Parse()

    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
        DisableForeignKeyConstraintWhenMigrating: true,
        FullSaveAssociations:                     true,
    })

    if err != nil {
        fmt.Println(err)
        panic("failed to connect database")
    }

	server := apitoken.NewServer(db)
    
    // Set up the routes first and then start the server
    server.RunServer(*port)

    // Then create the CORS handler
    c := cors.New(cors.Options{
        AllowedOrigins:     []string{"http://localhost:5173"},
        AllowedMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders:     []string{"Content-Type", "Authorization"},
        AllowCredentials:   true,
        Debug:             true,
    })

    // Wrap the router with CORS
    handler := c.Handler(server.Router)
    
    // Start the server
    if err := http.ListenAndServe(fmt.Sprintf(":%d", *port), handler); err != nil {
        log.Fatal(err)
    }
}