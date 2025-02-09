package routes

import (
	"backend/controller"

	"github.com/gorilla/mux"
)

func Routes() (*mux.Router){
	r := mux.NewRouter();
	
	r.HandleFunc("/signup",controller.Signup).Methods("POST");
	r.HandleFunc("/login",controller.Login).Methods("POST");
	r.HandleFunc("/staff", controller.VerifyJWT(controller.Staff)).Methods("POST");
	r.HandleFunc("/customer",controller.VerifyJWT(controller.Customer)).Methods("POST");

	return r;
}