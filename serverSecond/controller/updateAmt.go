package controller

import (
	"encoding/json"
	"fmt"
	"main/dbconnection"
	"net/http"
	"net/url"
	"strconv"

	"github.com/gorilla/mux"
)
type detail struct{
	Id string `json:"userId"`
	Amount string `json:"amount"`
}

func UpdateAmt(w http.ResponseWriter, r *http.Request) {
	fmt.Println("inside update amt");
	db := dbconnection.ConnectionToDb();
	defer db.Close()
	id := mux.Vars(r)["id"];
	fmt.Print("--->"+id);
	
	var D detail;
	err := json.NewDecoder(r.Body).Decode(&D);
	if err != nil {
		http.Error(w, "Failed to decode request body", http.StatusBadRequest)
		return
	}
	// fmt.Println("", D);

	// Get the amount from the payment table
	// var amount float64
	// err = db.QueryRow("SELECT amount FROM payments WHERE order_id = ?", id).Scan(&amount)
	// if err != nil {
	// 	http.Error(w, "Failed to get payment amount: "+err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	// Get customer email by first getting customer_id from orders, then getting email from customers
	// var customerID string
	// err = db.QueryRow("SELECT customer_id FROM orders WHERE order_id = ?", id).Scan(&customerID)
	// if err != nil {
	// 	http.Error(w, "Failed to get customer ID: "+err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	var customerEmail string
	err = db.QueryRow("SELECT email FROM customers WHERE customer_id = ?", D.Id).Scan(&customerEmail)
	if err != nil {
		http.Error(w, "Failed to get customer email: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Update payment status
	_, err = db.Exec("UPDATE payments SET status='paid' WHERE order_id=?", id)
	if err != nil {
		http.Error(w, "Failed to update payment status: "+err.Error(), http.StatusInternalServerError)
		return
	}

	// Send email notification to customer
	// Encode the email and amount to prevent URL issues
	encodedEmail := url.QueryEscape(customerEmail)
	amountValue, _ := strconv.ParseFloat(D.Amount, 64)
	encodedAmount := url.QueryEscape(fmt.Sprintf("%.2f", amountValue))
	mailURL := fmt.Sprintf("https://mail-dbpj.onrender.com/send_mail?email=%s&amount=%s", encodedEmail, encodedAmount)
	
	// Make a GET request to the mail service
	resp, err := http.Get(mailURL)
	if err != nil {
		fmt.Println("Warning: Failed to send email notification:", err)
		// Continue with the response even if email fails
	} else {
		defer resp.Body.Close()
		fmt.Println("Email notification sent to:", customerEmail)
	}

	// Respond to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Payment updated successfully",
		"email_sent": customerEmail,
		"amount": amountValue,
	})
}