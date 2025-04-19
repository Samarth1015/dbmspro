package controller

import (
	"database/sql"
	"encoding/json"
	"fmt"

	"main/dbconnection"
	"net/http"
)

func GetCustomerItem(w http.ResponseWriter,r *http.Request){
	db:=dbconnection.ConnectionToDb();
	defer db.Close();
	type detail struct{
		Id string `json:"id"`
	};
	var id detail;
	json.NewDecoder(r.Body).Decode(&id);
	fmt.Print("this is the get customer item",id.Id);
	row,err:=db.Query("select * from orders where customer_id=?",id.Id);
	if err!=nil{
		panic(err);
	}
	type sqlData struct{
		Order_id string `json:"order_id"`
		Customer_id string `json:"customer_id"`
		Staff_id string `json:"staff_id"`
		Order_date string `json:"order_date"`
		Final_total string `json:"final_total"`
		Status string `json:"status"`
	}

	var alb []sqlData;
	for row.Next() {
		var data sqlData;
		var finalTotal sql.NullString; // Use NullString to handle NULL values
		
		// Scan into NullString for Final_total
		err = row.Scan(&data.Order_id, &data.Customer_id, &data.Staff_id, &data.Order_date, &finalTotal);
		if err != nil {
			panic(err);
		}
		
		// If finalTotal is valid, use its value, otherwise use "0"
		if finalTotal.Valid {
			data.Final_total = finalTotal.String;
		} else {
			data.Final_total = "0";
		}
		
		// Default status to "pending" in case we don't get a status from the payment
		data.Status = "pending";
		
		// Get payment status if available
		var status sql.NullString;
		err = db.QueryRow("select status from payments where order_id=?", data.Order_id).Scan(&status);
		if err == nil && status.Valid {
			data.Status = status.String;
		}
		
		alb = append(alb, data);
	}

	fmt.Print(alb);
	w.WriteHeader(http.StatusOK);
	json.NewEncoder(w).Encode(map[string]interface{}{"data":alb});
}