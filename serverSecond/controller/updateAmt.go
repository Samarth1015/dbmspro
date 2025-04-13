package controller

import (
	"encoding/json"
	"fmt"
	"main/dbconnection"
	"net/http"

	"github.com/gorilla/mux"
)

func UpdateAmt(w http.ResponseWriter, r *http.Request) {
db:=dbconnection.ConnectionToDb();
	defer db.Close()
	id:=mux.Vars(r)["id"];
	fmt.Print("--->"+id);

_, err := db.Exec("UPDATE payments SET status='paid' WHERE order_id=?", id)
if err != nil {
	http.Error(w, "Failed to update payment status", http.StatusInternalServerError)
	return
}

http.ResponseWriter(w).Header().Set("Content-Type", "application/json")
w.WriteHeader(http.StatusOK)
json.NewEncoder(w).Encode("updated successfully")



}