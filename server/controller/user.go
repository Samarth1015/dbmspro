package controller

import (
	// "backend/util"
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
	type Service struct {
			ServiceName string `json:"service_name"`
			Quantity   string `json:"quantity"`
	}
type Order struct {
	Name string `json:"name"`
	OrderDate  string `json:"order_date"`
	Status     string `json:"status"`
	Price      string `json:"price"`
	Quantity   string `json:"quantity"`
	Service []Service `json:"service"`
}
	var order Order
	err := json.NewDecoder(r.Body).Decode(&order)
	fmt.Println("Order--->",order);

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// db:=ConnectionToDb();
	// order_id:=util.Random();
	// name:=r.Header.Get(	"X-Claim-username")	
	// var staff_id string;
	// db.QueryRow("select staff_id from staff where name=?",name).Scan(&staff_id)
	// fmt.Println("staff_id--->",staff_id);
	// q:=`INSERT INTO orders (order_id,customer_id,staff_id, order_date, status, price, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)`
	// res,err:= db.Exec(q,order_id,order.,staff_id,order.OrderDate,order.Status,order.Price,order.Quantity)
	// if err!=nil{ 
	// 	fmt.Println("Error inserting order:", err)
	// 	}
	// 	fmt.Println("Order inserted successfully",res)
		
	// 	w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		
	json.NewEncoder(w).Encode("ok");
}