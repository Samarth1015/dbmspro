package controller

import (
	"encoding/json"
	"fmt"
	

	"main/dbconnection"
	"math/rand"
	"strconv"

	"net/http"
)
type TempDetail struct{
		Email string `json:"email"`
		Password string `json:"password"`
		Staff_id string `json:"staff_id,omitempty"` 
		Customer_id string `json:"customer_id,omitempty"`
	}
type Detail struct{
		Name string `json:"name"`
		Email string `json:"email"`
		Address string `json:"address"`
		Password string `json:"password"`
		Role string `json:"role"`
	}
	
	func radomnumber() string{
		return strconv.Itoa(rand.Intn(999))
	}

	func getDetail(tempdetail *TempDetail,email string,pswd string,role string) bool{
		
		db:=dbconnection.ConnectionToDb()
		defer db.Close()
		
		if role=="staff"{
			fmt.Println("--->",email,pswd)
			err:=db.QueryRow("select email,password,staff_id from staff where email=? and password=?",email,pswd).Scan( &tempdetail.Email,&tempdetail.Password,&tempdetail.Staff_id)
			if err!=nil{
				fmt.Println("error",err)
				return false
			}
			
		}else {
			fmt.Println("--->",email,pswd);
			err:=db.QueryRow("select email,password,customer_id from customers where email=? and password=?",email,pswd).Scan( &tempdetail.Email,&tempdetail.Password,&tempdetail.Customer_id) 
			if err!=nil{
				fmt.Println("error",err);
				return false
			}
		}
		
		return true;

		

	}

func addindb( detail *Detail, role string  ) interface{}{
db:=dbconnection.ConnectionToDb()
defer db.Close()
if role=="staff"{
	staff_id :="s"+radomnumber() ;

	_,err:=db.Exec("insert into staff(staff_id,name,email,address,password) values(?,?,?,?,?)",staff_id,detail.Name,detail.Email,detail.Address,detail.Password)
	if err!=nil{
		panic(err)
	}
	return staff_id;
	
}else{
	customer_id :="c"+radomnumber() ;
	_,err:=db.Exec("insert into customers(customer_id,name,email,address,password) values(?,?,?,?,?)",customer_id,detail.Name,detail.Email,detail.Address,detail.Password)
	if err!=nil{
		panic(err)
	}
	return customer_id;
}
	




}



func Signup(w http.ResponseWriter,r *http.Request){
	fmt.Println("---->signup");
	var detail Detail;
	json.NewDecoder(r.Body).Decode(&detail)
	result:=addindb(&detail,detail.Role)
	fmt.Println("\n---->fucking",result);
	w.WriteHeader(http.StatusOK);
	json.NewEncoder(w).Encode(map[string]string{"message":"User added successfully","role":detail.Role,"email":detail.Email,"id":result.(string)})

}



type LoginDetail struct{
	Email string `json:"email"`
	Password string `json:"password"`
	Roles string `json:"role"`
}
func Login(w http.ResponseWriter , r *http.Request){

	var tempdetail TempDetail;
	var clientdetail LoginDetail;
	json.NewDecoder(r.Body).Decode(&clientdetail)
	
	
	if getDetail(&tempdetail, clientdetail.Email, clientdetail.Password, clientdetail.Roles) {
        fmt.Println("---->", tempdetail.Email, tempdetail.Password)

        // Prepare the response based on the role
        response := map[string]string{
            "message": "Login successful",
            "role":    clientdetail.Roles,
            "email":   tempdetail.Email,
        }

        // Add the appropriate ID to the response
        if clientdetail.Roles == "staff" {
            response["id"] = tempdetail.Staff_id
        } else if clientdetail.Roles == "customer" {
            response["id"] = tempdetail.Customer_id
        }

        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(response)
    } else {
        fmt.Println("----> falseeee")
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(map[string]string{"message": "Login failed"})
    }
}
	

	
