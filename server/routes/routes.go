package routes

import (
	"backend/controller"

	"github.com/gorilla/mux"
)

func Routes() (*mux.Router){
	r := mux.NewRouter();
	r.HandleFunc("/",controller.AllValue).Methods("GET");
	r.HandleFunc("/insert",controller.InsertData).Methods("POST");

	return r;
}