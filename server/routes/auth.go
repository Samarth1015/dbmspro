package routes

import (
	"backend/controller"

	"github.com/gorilla/mux"
)

func Routes() (*mux.Router){
	r := mux.NewRouter();
	
	r.HandleFunc("/signup",controller.Signup).Methods("POST");
	r.HandleFunc("/login",controller.Login).Methods("POST");
	r.HandleFunc("/verify",controller.Verifytoken).Methods("POST");

	return r;
}