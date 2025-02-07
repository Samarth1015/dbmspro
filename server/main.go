package main

import (
	"backend/routes"
	"fmt"

	"net/http"

	 "github.com/gorilla/handlers"  
)

func main() {
	corsHandler := handlers.CORS(
        handlers.AllowedOrigins([]string{"*"}),  // Allows all origins for development
        handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}), // Allowed HTTP methods
        handlers.AllowedHeaders([]string{"Content-Type", "Authorization", "X-Requested-With"}), // Allowed headers
    )
	r:=routes.Routes();
	fmt.Print("listening and serving on :8000");
	http.ListenAndServe(":8000",corsHandler(r));
	
	
}