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
    Inner       []Innerdata `json:"inner"` 
}

func Updatedata(w http.ResponseWriter, r *http.Request) {
   
    id := mux.Vars(r)["id"]
    
  
    db := dbconnection.ConnectionToDb()
    if db == nil {
        http.Error(w, "Database connection failed", http.StatusInternalServerError)
        return
    }
    defer db.Close()

    
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

    
        rows1, err := db.Query(`
            SELECT service_id, quantity 
            FROM orders 
            NATURAL JOIN order_details 
            WHERE order_id = ?`, tempData.Order_id)
        if err != nil {
            http.Error(w, fmt.Sprintf("Inner query error: %v", err), http.StatusInternalServerError)
            return
        }

      
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

   
    if err = rows.Err(); err != nil {
        http.Error(w, fmt.Sprintf("Rows error: %v", err), http.StatusInternalServerError)
        return
    }

   
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    if err := json.NewEncoder(w).Encode(responseData); err != nil {
        http.Error(w, fmt.Sprintf("JSON encoding error: %v", err), http.StatusInternalServerError)
        return
    }
}
type ServiceItem struct {
    ServiceID string `json:"service_id"`
    Quantity  string `json:"quantity"`
}

type DataReq struct {
    OrderID    string        `json:"order_id"`
    CustomerID string        `json:"customer_id"`
    Inner      []ServiceItem `json:"inner"`
}

func OfficialUpdate(w http.ResponseWriter, r *http.Request) {
    
    vars := mux.Vars(r)
    id := vars["id"]
    fmt.Println("Update request for ID:", id)

   
    var dataReq DataReq
    
   
    err := json.NewDecoder(r.Body).Decode(&dataReq)
    if err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        fmt.Println("Error decoding JSON:", err)
        return
    }

   
    fmt.Println("Received data:")
    fmt.Printf("Order ID: %s\n", dataReq.OrderID)
    fmt.Printf("Customer ID: %s\n", dataReq.CustomerID)
    
    fmt.Println("Services:")
    db:=dbconnection.ConnectionToDb();
    defer db.Close();
    for _, item := range dataReq.Inner {
        db.Exec("UPDATE order_details SET quantity = ? WHERE order_id = ? AND service_id = ?", item.Quantity, dataReq.OrderID, item.ServiceID);
        
    }

  
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{
        "message": "Data updated successfully",
        "id":      id,
    })
}