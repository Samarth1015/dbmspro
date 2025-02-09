package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	

	
)

// Staff - Handler to access user claims from request headers
func Staff(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Inside Staff Handler")

	// Extract claims from headers
	username := r.Header.Get("X-Claim-username")
	email := r.Header.Get("X-Claim-email")
	exp := r.Header.Get("X-Claim-exp") // Expiry time (if needed)

	// Print claims
	fmt.Println("User:", username)
	fmt.Println("Email:", email)
	fmt.Println("Expiry:", exp)

	// Respond with claims
	json.NewEncoder(w).Encode(map[string]string{
		"message":  "Token is valid",
		"username": username,
		"email":    email,
		"exp":      exp,
	})
}

func Customer(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Inside Customer Handler")

	// Extract claims from headers
	username := r.Header.Get("X-Claim-username")
	email := r.Header.Get("X-Claim-email")
	exp := r.Header.Get("X-Claim-exp") // Expiry time (if needed)

	// Print claims
	fmt.Println("User:", username)
	fmt.Println("Email:", email)
	fmt.Println("Expiry:", exp)

	// Respond with claims
	json.NewEncoder(w).Encode(map[string]string{
		"message":  "Token is valid",
		"username": username,
		"email":    email,
		"exp":      exp,
	})
}