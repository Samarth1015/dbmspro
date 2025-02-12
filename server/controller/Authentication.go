package controller

import (
	"backend/model"
	"backend/util"
	
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func Login(w http.ResponseWriter, r *http.Request) {
    db := ConnectionToDb()
    defer db.Close()

    type userStruct struct {
        Email    string `json:"email"`
        Password string `json:"password"`
        Role    string `json:"role"`
    }
    var user userStruct
    json.NewDecoder(r.Body).Decode(&user)
    fmt.Print(user.Role);
    var role string;
    if user.Role=="customer"{
        role="customers";
        
    }else {role="staff";}

    query := fmt.Sprintf("SELECT name, password, email FROM %s WHERE email = ?", role)
    res, err := db.Query(query, user.Email)
    if err != nil {
        log.Fatal("error in selecting",err)
    }
    var name, password, email string
    for res.Next() {
        err := res.Scan(&name, &password, &email)
        if err != nil {
            log.Fatal("error scanning result", err)
        }
    }
    token, err := CreateToken(name, email,role)
    if err != nil {
        log.Fatal("error in creating token")
    }

    if user.Password == password {
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]string{"message": "Login successful", "token": token})
    } else {
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(map[string]string{"message": "Invalid credentials"})
    }
}

func Signup(w http.ResponseWriter, r *http.Request) {
    db := ConnectionToDb()
    defer db.Close()

    

    var res model.Customer
    err := json.NewDecoder(r.Body).Decode(&res)
    if err != nil {
        http.Error(w, "Invalid JSON input", http.StatusBadRequest)
        return
    }

    if res.Name == "" || res.Email == "" || res.Password == "" {
        http.Error(w, "All fields are required", http.StatusBadRequest)
        return
    }
    col:="customer_id";
    tableName := "users"
    if res.Role == "customer" {
        tableName = "customers"
        col="customer_id";
    } else if res.Role == "staff" {
        tableName = "staff"
        col="staff_id";
    }

    query := fmt.Sprintf("INSERT INTO %s (%s, name, password, email) VALUES (?, ?, ?, ?)",tableName ,col)

    var existingUser int
    db.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", res.Email).Scan(&existingUser)
    if existingUser > 0 {
        http.Error(w, "Email already exists", http.StatusConflict)
        return
    }
    token, err := CreateToken(res.Name, res.Email,res.Role)

    idi:=util.Random();
fmt.Println("coustomerid",idi);
    result, err := db.Exec(query, idi , res.Name, res.Password, res.Email)
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
        "token":   token,
    })
}
