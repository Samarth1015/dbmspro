package controller

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"main/dbconnection"
	"net/http"
	"time"
	
)


type OrderRequest struct {
	Email    string            `json:"email"`
	Services []struct {
		ServiceID int `json:"service_id"`
		Quantity  int `json:"quantity"`
	} `json:"services"`
	Id string `json:"id"`
	PaymentStatus string `json:"payment_status" `
	PaymentMethod string `json:"payment_mode"`
}

func AddOrder(w http.ResponseWriter, r *http.Request) {
	fmt.Print("this is the add order");
	var req OrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}
	// fmt.Print("--->add order content highlish ",req);


	
	db := dbconnection.ConnectionToDb()
	if db == nil {
		http.Error(w, "Database connection is nil", http.StatusInternalServerError)
		return
	}

	
	var customerID string
	err := db.QueryRow("SELECT customer_id FROM customers WHERE email = ?", req.Email).Scan(&customerID)
	if err == sql.ErrNoRows {
		panic("Customer not found")
	} else if err != nil {
		http.Error(w, "Customer query failed", http.StatusInternalServerError)
		return
	}

	
	var orderID = "o"+radomnumber();
	

	
	// fmt.Print("---->sexy",customerID,req.Id);
	_,err=db.Exec("Insert into orders (order_id,customer_id,staff_id,order_date) values (?,?,?,?)", orderID, customerID,req.Id,time.Now().Format("2006-01-02 15:04:05")) 
	if err!=nil{
		panic(err);		
	}
	for _, service := range req.Services {
		
		_,err:=	db.Exec("Insert into order_details (order_id,service_id,quantity) values (?,?,?)",  orderID, service.ServiceID, service.Quantity)
	if err!=nil{
panic(err);
	} 
}
var amt int;

db.QueryRow("select Final_Total from orders where order_id=?",orderID).Scan(&amt);
var paymentId = "p"+radomnumber();
if(req.PaymentStatus=="pending"){	
	fmt.Print("pending ke andar",orderID,amt,req.PaymentStatus);
	db.Exec("insert into payments (payment_id ,order_id,amount ,status) values (?,?,?,?)",paymentId,orderID,amt,req.PaymentStatus);

}else{
	fmt.Print("pending ke bahar")
		_,err:=db.Exec("insert into payments (payment_id ,order_id,amount ,status,payment_mode) values (?,?,?,?,?)",paymentId,orderID,amt,req.PaymentStatus,req.PaymentMethod);
		if err!=nil{ {
			panic(err);
		}}
}

// idharrr trigger lagega ekkk jo total add karee
	
	

	

	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"order_id": orderID})
}