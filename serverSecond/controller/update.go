package controller

import (
    "encoding/json"
    "fmt"
    "main/dbconnection"
    "net/http"

    "github.com/gorilla/mux"
)

type Innerdata struct {
    Service_id string `json:"service_id"`
    Quantity   string `json:"quantity"`
}

type Data struct {
    Order_id    string      `json:"order_id"`
    Customer_id string      `json:"customer_id"`
    Inner       []Innerdata `json:"inner"` // Renamed to match JSON tag and convention
}

func Updatedata(w http.ResponseWriter, r *http.Request) {
    // Get the ID from URL parameters
    id := mux.Vars(r)["id"]
    
    // Establish database connection
    db := dbconnection.ConnectionToDb()
    if db == nil {
        http.Error(w, "Database connection failed", http.StatusInternalServerError)
        return
    }
    defer db.Close()

    // First query to get order details
    rows, err := db.Query("SELECT order_id, customer_id FROM orders WHERE order_id = ?", id)
    if err != nil {
        http.Error(w, fmt.Sprintf("Query error: %v", err), http.StatusInternalServerError)
        return
    }
    defer rows.Close()

    var responseData []Data

    for rows.Next() {
        var tempData Data
        err := rows.Scan(&tempData.Order_id, &tempData.Customer_id)
        if err != nil {
            http.Error(w, fmt.Sprintf("Scan error: %v", err), http.StatusInternalServerError)
            return
        }

        // Second query to get inner details
        rows1, err := db.Query(`
            SELECT service_id, quantity 
            FROM orders 
            NATURAL JOIN order_details 
            WHERE order_id = ?`, tempData.Order_id)
        if err != nil {
            http.Error(w, fmt.Sprintf("Inner query error: %v", err), http.StatusInternalServerError)
            return
        }

        // Collect inner data
        for rows1.Next() {
            var innerData Innerdata
            err := rows1.Scan(&innerData.Service_id, &innerData.Quantity)
            if err != nil {
                rows1.Close()
                http.Error(w, fmt.Sprintf("Inner scan error: %v", err), http.StatusInternalServerError)
                return
            }
            tempData.Inner = append(tempData.Inner, innerData)
        }
        rows1.Close()

        responseData = append(responseData, tempData)
    }

    // Check if rows had any errors
    if err = rows.Err(); err != nil {
        http.Error(w, fmt.Sprintf("Rows error: %v", err), http.StatusInternalServerError)
        return
    }

    // Set content type and send response
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    if err := json.NewEncoder(w).Encode(responseData); err != nil {
        http.Error(w, fmt.Sprintf("JSON encoding error: %v", err), http.StatusInternalServerError)
        return
    }
}