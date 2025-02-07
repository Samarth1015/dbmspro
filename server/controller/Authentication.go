package controller

import (
	"backend/model"
	"encoding/json"
	"fmt"
	"log"

	"net/http"
)


func AllValue(w http.ResponseWriter,r *http.Request) {
	
   db:=ConnectionToDb();
   rows,err:=db.Query(
	"SELECT * from teacher",
   );
   if err!=nil {
	panic("some error in selecting the values");

   }
   type Teacher struct{
      Name string
   }
   var value  Teacher;
   for rows.Next(){
      rows.Scan(&value.Name);
     
   }
    fmt.Print(value);



	
}
func InsertData(w http.ResponseWriter, r *http.Request) {
    query := "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)"

    var res model.User
    err := json.NewDecoder(r.Body).Decode(&res)
    if err != nil {
        http.Error(w, "Invalid JSON input", http.StatusBadRequest)
        return
    }

    if res.Username == "" || res.Email == "" || res.PasswordHash == "" {
        http.Error(w, "All fields are required", http.StatusBadRequest)
        return
    }

    db := ConnectionToDb()
    defer db.Close()

 
    var existingUser int
    db.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", res.Email).Scan(&existingUser)
    if existingUser > 0 {
        http.Error(w, "Email already exists", http.StatusConflict)
        return
    }

    result, err := db.Exec(query, res.Username, res.Email, res.PasswordHash)
    if err != nil {
        log.Println("Error inserting user:", err)
        http.Error(w, "Error inserting data", http.StatusInternalServerError)
        return
    }

    id, err := result.LastInsertId()
    if err != nil {
        log.Println("Error fetching last inserted ID:", err)
        http.Error(w, "Error retrieving user ID", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "status":  http.StatusOK,
        "message": "User inserted successfully",
        "id":      id,
    })
}
