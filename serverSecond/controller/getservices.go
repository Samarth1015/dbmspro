package controller

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"main/dbconnection"
	"net/http"
)

type Service struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Price int    `json:"price"`
}

func GetServices(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Fetching services")
	
	// Set up database connection
	db := dbconnection.ConnectionToDb()
	if db == nil {
		http.Error(w, "Database connection is nil", http.StatusInternalServerError)
		return
	}
	defer db.Close()
	
	// Query the services table
	rows, err := db.Query("SELECT service_id, service_name, price FROM services")
	if err != nil {
		http.Error(w, "Failed to query services: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	
	// Process the results
	var services []Service
	for rows.Next() {
		var service Service
		var price sql.NullInt64
		
		if err := rows.Scan(&service.ID, &service.Name, &price); err != nil {
			http.Error(w, "Error scanning service: "+err.Error(), http.StatusInternalServerError)
			return
		}
		
		if price.Valid {
			service.Price = int(price.Int64)
		} else {
			service.Price = 0
		}
		
		services = append(services, service)
	}
	
	// Check for errors from iterating over rows
	if err := rows.Err(); err != nil {
		http.Error(w, "Error iterating over services: "+err.Error(), http.StatusInternalServerError)
		return
	}
	
	// Send the response
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(services)
} 