package main

import (
	"flag"
	"fmt"
	"os"
	"log"
	"time"

	"github.com/efadrin/apitoken"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Parse command line arguments
	// add option to create accounts

	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	// Get the database URL from the environment variable
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatalf("DATABASE_URL is not set in the environment")
	}

	// Parse command line arguments
	newDB := flag.Bool("new", false, "Create a new database")
	flag.Parse()

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
		FullSaveAssociations:                     true,
	})
	

	// newDB := flag.Bool("new", false, "Create a new database")

	// flag.Parse()
	// args := flag.Args()
	// if len(args) < 1 {
	// 	flag.PrintDefaults()
	// 	os.Exit(1)
	// }

	// db, err := gorm.Open(postgres.Open(args[0]), &gorm.Config{
	// 	DisableForeignKeyConstraintWhenMigrating: true,
	// 	FullSaveAssociations:                     true,
	// })

	if err != nil {
		fmt.Println(err)
		panic("failed to connect database")
	}

	if *newDB {
		fmt.Println("Creating a new database...")
		apitoken.InitDB(db)
	}

	fmt.Println("Database connection successful")

	efadrin := apitoken.Organization{
		Name: "Efadrin",
	}

	steve := apitoken.User{
		Username:     "steve",
		Password:     "password",
		Email:        "steve@efa.biz",
		Organization: &efadrin,
	}

	steve.Create(db)

	permRead := apitoken.Permission{
		Name:        "read",
		Description: "Read permission",
		IsAdmin:     false,
	}

	permRead.Create(db)

	permWrite := apitoken.Permission{
		Name:        "write",
		Description: "Write permission",
		IsAdmin:     false,
	}

	permWrite.Create(db)

	createPermissionPermission := apitoken.Permission{
		Name:        "create_permission",
		Description: "Create permission permission",
		IsAdmin:     true,
	}

	createPermissionPermission.Create(db)

	token := apitoken.Token{
		Token:       "blahblahblah",
		ExpiryDate:  time.Now().Add(time.Hour * 24),
		User:        &steve,
		Permissions: []*apitoken.Permission{&permRead, &permWrite},
	}

	token.Create(db)
}
