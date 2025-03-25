package main

import (
	"fmt"
	"main/controller"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

func main() {
	corsHandler := handlers.CORS(
        handlers.AllowedOrigins([]string{"*"}),  // Allows all origins for development
        handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}), // Allowed HTTP methods
        handlers.AllowedHeaders([]string{"Content-Type", "Authorization", "X-Requested-With"}), // Allowed headers
    )
	fmt.Print("this is the server");
	r:=mux.NewRouter();
	//routes
	r.HandleFunc("/api/signup",controller.Signup);
	r.HandleFunc("/api/login",controller.Login);
	r.HandleFunc("/api/addorder",controller.AddOrder);
	r.HandleFunc("/api/getstaffdata",controller.Getitem);
	r.HandleFunc("/api/getcutomeritem",controller.GetCustomerItem);
	r.HandleFunc("/api/staff/{id}", controller.Updatedata).Methods("GET")
	r.HandleFunc("/api/staff/{id}", controller.OfficialUpdate).Methods("PUT")
	r.HandleFunc("/api/staff/{id}", controller.Delete).Methods("DELETE")	




http.ListenAndServe(":8000",corsHandler(r));
}