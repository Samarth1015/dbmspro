package controller

import (
	
	"backend/util"
	"encoding/json"
	"fmt"
	"net/http"
)

// Staff - Handler to access user claims from request headers
func Staff(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Inside Staff Handler")

	// Extract claims from headers
	username := r.Header.Get("X-Claim-username")
	email := r.Header.Get("X-Claim-email")
	exp := r.Header.Get("X-Claim-exp") // Expiry time (if needed)

	// Print claims
	fmt.Println("User:", username)
	fmt.Println("Email:", email)
	fmt.Println("Expiry:", exp)

	// Respond with claims
	json.NewEncoder(w).Encode(map[string]string{
		"message":  "Token is valid",
		"username": username,
		"email":    email,
		"exp":      exp,
	})
}

func Customer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Inside Customer Handler")

	// Extract claims from headers
	username := r.Header.Get("X-Claim-username")
	email := r.Header.Get("X-Claim-email")
	exp := r.Header.Get("X-Claim-exp") // Expiry time (if needed)

	// Print claims
	fmt.Println("User:", username)
	fmt.Println("Email:", email)
	fmt.Println("Expiry:", exp)

	// Respond with claims
	json.NewEncoder(w).Encode(map[string]string{
		"message":  "Token is valid",
		"username": username,
		"email":    email,
		"exp":      exp,
	})
}
func AddData(w http.ResponseWriter, r *http.Request) {
	db:=ConnectionToDb()
	defer db.Close()
	type Service struct {
		ServiceName string `json:"service_name"`
		Quantity    int    `json:"quantity"`
	}

	type Order struct {
		CustomerID string    `json:"customer_id"`
		Name       string    `json:"name"`
		OrderDate  string    `json:"order_date"`
		Status     string    `json:"status"`
		Price      int       `json:"price"`
		Services   []Service `json:"services"`
	}

	var order Order
	err := json.NewDecoder(r.Body).Decode(&order)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	
	if order.CustomerID == "" || order.Name == "" || order.OrderDate == "" || order.Status == "" || order.Price == 0 || len(order.Services) == 0 {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "All fields are required"})
		return
	}

	
	orderID := generateOrderID() 
	query := `INSERT INTO orders (order_id, customer_id, staff_id, order_date, status, price) VALUES (?, ?, ?, ?, ?, ?)`
	_, err = db.Exec(query, orderID, order.CustomerID, "staff_id_placeholder", order.OrderDate, order.Status, order.Price)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to insert order"})
		return
	}

	
	for _, service := range order.Services {
		serviceID := generateServiceID() 
		query := `INSERT INTO services (service_id, name, price_per_item) VALUES (?, ?, ?)`
		_, err = db.Exec(query, serviceID, service.ServiceName, 0) 
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to insert service"})
			return
		}

		
		
		_, err = db.Exec(query, orderID, serviceID, service.Quantity)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to insert order service"})
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Order created successfully"})
}

func generateOrderID() int {
return util.Random();
}

func generateServiceID() int {
	
	return util.Random();
}