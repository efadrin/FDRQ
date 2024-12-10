package main

import (
	"flag"
	"fmt"
	"os"
	"time"

	"github.com/efadrin/apitoken"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	// Parse command line arguments
	// add option to create accounts

	newDB := flag.Bool("new", false, "Create a new database")

	flag.Parse()
	args := flag.Args()
	if len(args) < 1 {
		flag.PrintDefaults()
		os.Exit(1)
	}

	// Create a new client// github.com/mattn/go-sqlite3
	db, err := gorm.Open(sqlite.Open(args[0]), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
		FullSaveAssociations:                     true,
	})

	if err != nil {
		fmt.Println(err)
		panic("failed to connect database")
	}

	if *newDB {
		apitoken.InitDB(db)
	}

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
