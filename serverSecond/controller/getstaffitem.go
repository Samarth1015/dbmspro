package controller

import (
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
		err = res.Scan(&alb.Order_id,&alb.Customer_id,&alb.Staff_id,&alb.Order_date,&alb.Final_total)
		if err != nil {
			panic(err)
		}
		album = append(album, alb);
	}
	fmt.Println(album);
	w.WriteHeader(http.StatusOK);
	json.NewEncoder(w).Encode(album);


}