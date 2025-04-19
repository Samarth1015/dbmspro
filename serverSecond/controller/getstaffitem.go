package controller

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"main/dbconnection"
	"net/http"
)
type Details struct{
	Order_id string `json:"order_id"`
	Customer_id string `json:"customer_id"`
	Staff_id string `json:"staff_id"`
	Order_date string `json:"order_date"`
	Final_total string `json:"final_total"`
	Status string `json:"status"`
}

func Getitem(w http.ResponseWriter, r *http.Request) {
	
type Req struct {
	Staff_id string `json:"staff_id"`
}
var staffDetail Req; 
	json.NewDecoder(r.Body).Decode(&staffDetail);
	fmt.Println("--->",staffDetail.Staff_id);
	db:=dbconnection.ConnectionToDb();
	defer db.Close();
	res,err:=db.Query("select * from orders where staff_id=?",staffDetail.Staff_id);
	
	if err!=nil{
		panic(err);
	}
	
	var album [] Details;
	for res.Next() {
		var alb Details;
		var finalTotal sql.NullString; // Use NullString to handle NULL values
		
		// Scan into NullString for Final_total
		err = res.Scan(&alb.Order_id, &alb.Customer_id, &alb.Staff_id, &alb.Order_date, &finalTotal);
		if err != nil {
			panic(err);
		}
		
		// If finalTotal is valid, use its value, otherwise use "0"
		if finalTotal.Valid {
			alb.Final_total = finalTotal.String;
		} else {
			alb.Final_total = "0";
		}
		
		// Default status to "pending" in case we don't get a status from the payment
		alb.Status = "pending";
		
		// Get payment status if available
		var status sql.NullString;
		err = db.QueryRow("select status from payments where order_id=?", alb.Order_id).Scan(&status);
		if err == nil && status.Valid {
			alb.Status = status.String;
		}
		
		album = append(album, alb);
	}
	
	fmt.Println(album);
	w.WriteHeader(http.StatusOK);
	json.NewEncoder(w).Encode(album);
}