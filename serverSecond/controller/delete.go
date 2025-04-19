package controller

import (
	"fmt"
	"main/dbconnection"
	"net/http"

	"github.com/gorilla/mux"
)

func Delete(w http.ResponseWriter, r *http.Request  ) {
	fmt.Print("this is delete");
	id:=mux.Vars(r)["id"];
	db:=dbconnection.ConnectionToDb();
	defer db.Close();
	fmt.Print(id);

	db.Exec("delete from  order_details where order_id=?",id);
	db.Exec("delete from payments where order_id=?",id);
	res,err:=db.Exec("delete from orders where order_id=?",id);
	if err!=nil{
		panic(err);	
	}
	fmt.Print(res);
	w.WriteHeader(http.StatusOK);


}