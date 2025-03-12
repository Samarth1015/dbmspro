package routes

import (
	"backend/controller"

	"github.com/gorilla/mux"
)

func Routes() (*mux.Router){
	r := mux.NewRouter();
	
	r.HandleFunc("/api/signup",controller.Signup).Methods("POST");
	r.HandleFunc("/api/login",controller.Login).Methods("POST");
	r.HandleFunc("/api/staff", controller.VerifyJWT(controller.Staff)).Methods("POST");
	r.HandleFunc("/api/customer",controller.VerifyJWT(controller.Customer)).Methods("POST");
	r.HandleFunc("/api/add",controller.AddData).Methods("POST");

	

	return r;
}