package controller

import (
	"fmt"
	"net/http"
	"strings"

	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("secret-key")

func CreateToken(username string,email string,role string) (string, error) {
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, 
        jwt.MapClaims{ 
        "username": username, 
		"email": email,
		"role": role,
        "exp": time.Now().Add(time.Hour * 24).Unix(), 
        })

    tokenString, err := token.SignedString(secretKey)
    if err != nil {
    return "", err
    }

 return tokenString, nil
}



// VerifyToken - Function to validate and decode JWT token
func VerifyToken(tokenString string) (jwt.MapClaims, error) {
   fmt.Println("verifying ")
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})

	if err != nil {
      
		return nil, err
	}

	if !token.Valid {
    
		return nil, fmt.Errorf("invalid token")
	}

	// Extract claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		return claims, nil
	}
  
	return nil, fmt.Errorf("invalid token claims")
}


func  VerifyJWT(f func(http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header missing", http.StatusUnauthorized)
			return
		}

		
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader { 

     
			http.Error(w, "Invalid token format", http.StatusUnauthorized)
			return
		}

		
		claims, err := VerifyToken(tokenString)
		if err != nil {
          fmt.Println("yahaaa error aayaa")
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		
		for key, value := range claims {
			r.Header.Set("X-Claim-"+key, fmt.Sprintf("%v", value))
		}

		
		f(w, r)
	}
}