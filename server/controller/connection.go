package controller

import (
	"database/sql"
	"fmt"
	"log"
	_ "github.com/go-sql-driver/mysql"
)

func ConnectionToDb() *sql.DB {
	db, err := sql.Open("mysql", "root:nandini>samarth@tcp(127.0.0.1:3306)/laundrysystem")
	if err != nil {
		log.Fatal("Error opening DB:", err)
	}

	
	err = db.Ping()
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}

	fmt.Println("Connected to database successfully!")
	return db
}
