package main

import (
	"flag"
	"fmt"

	"github.com/efadrin/apitoken"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func main() {
	database := flag.String("database", "test.db", "Database file")
	port := flag.Int("port", 8089, "Port to listen on")
	flag.Parse()

	db, err := gorm.Open(sqlite.Open(*database), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
		FullSaveAssociations:                     true,
	})

	if err != nil {
		fmt.Println(err)
		panic("failed to connect database")
	}

	server := apitoken.NewServer(db)
	server.RunServer(*port)
}
