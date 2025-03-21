package controller

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"main/dbconnection"
	"net/http"
	"time"
	// Adjust import path as per your project structure
)


type OrderRequest struct {
	Email    string            `json:"email"`
	Services []struct {
		ServiceID int `json:"service_id"`
		Quantity  int `json:"quantity"`
	} `json:"services"`
}

func AddOrder(w http.ResponseWriter, r *http.Request) {
	fmt.Print("this is the add order");
	var req OrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	fmt.Print("--->",req.Services[0].Quantity);


	// Get database connection from dbconnection module
	db := dbconnection.ConnectionToDb()
	if db == nil {
		http.Error(w, "Database connection is nil", http.StatusInternalServerError)
		return
	}

	// Check or insert customer
	var customerID string
	err := db.QueryRow("SELECT customer_id FROM customers WHERE email = ?", req.Email).Scan(&customerID)
	if err == sql.ErrNoRows {
		panic("Customer not found")
	} else if err != nil {
		http.Error(w, "Customer query failed", http.StatusInternalServerError)
		return
	}

	// Insert order
	var orderID = "o"+radomnumber();
	

	// idharrr trigger lagega ekkk jo subtotal add karee
	fmt.Print("---->sexy",customerID);
	_,err=db.Exec("Insert into orders (order_id,customer_id,staff_id,order_date) values (?,?,?,?)", orderID, customerID,"s833",time.Now().Format("2006-01-02 15:04:05")) 
	if err!=nil{
		panic(err);		
	}
	for _, service := range req.Services {
		
		_,err:=	db.Exec("Insert into order_details (order_id,service_id,quantity) values (?,?,?)",  orderID, service.ServiceID, service.Quantity)
	if err!=nil{
panic(err);
	} 
}
// idharrr trigger lagega ekkk jo total add karee
	
	

	

	// Respond with success
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"order_id": orderID})
}