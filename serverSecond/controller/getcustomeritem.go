package controller

import (
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

	var  alb []sqlData;
	for row.Next() {
		var data sqlData;
		err = row.Scan(&data.Order_id,&data.Customer_id,&data.Staff_id,&data.Order_date,&data.Final_total);
		db.QueryRow("select status from payments where order_id=?",data.Order_id).Scan(&data.Status);
		if err != nil {	
			panic(err)
		}
		alb = append(alb, data);
	}

	fmt.Print(alb);
	w.WriteHeader(http.StatusOK);
	json.NewEncoder(w).Encode(map[string]interface{}{"data":alb});



}