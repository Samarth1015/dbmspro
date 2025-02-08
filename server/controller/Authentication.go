package controller

import (
	
	"backend/model"
	"encoding/json"
	"fmt"

	"log"

	"net/http"
)


func Login(w http.ResponseWriter,r *http.Request){

    fmt.Println("in login");
    db:=ConnectionToDb();
    defer db.Close();
    

    type userStruct struct{
        Email    string `json:"email"`
        Password string `json:"password"`
        Token   string `json:"token"`
    }
    var user userStruct;
    json.NewDecoder(r.Body).Decode(&user); 
    fmt.Print(user);
   err:=
    VerifyToken(user.Token);
    if err!=nil {
        w.WriteHeader(http.StatusUnauthorized);
        json.NewEncoder(w).Encode(map[string]string{"message": "Invalid token"});
        return;     
    }
    res,err:=db.Query("select email,password_hash from users where email=?",user.Email);

    if err!=nil{
        log.Fatal("error in selecting");
    }
    var dbEmail, dbPasswordHash string
    for res.Next() {
        err := res.Scan(&dbEmail, &dbPasswordHash)
        if err != nil {
            log.Fatal("error scanning result")
        }
    }

    
    

   
    if user.Password == dbPasswordHash {
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(map[string]string{"message": "Login successful"})
    } else {
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(map[string]string{"message": "Invalid credentials"})
    }




}

func Signup(w http.ResponseWriter, r *http.Request) {
        db := ConnectionToDb()
    defer db.Close()
    fmt.Println("signup");
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



 
    var existingUser int
    db.QueryRow("SELECT COUNT(*) FROM users WHERE email = ?", res.Email).Scan(&existingUser)
    if existingUser > 0 {
        http.Error(w, "Email already exists", http.StatusConflict)
        return
    }
  token,err:=  CreateToken(res.Username,res.Email);

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
        "token":token,
    })
}
