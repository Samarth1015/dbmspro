package model

type Customer struct {
    CustomerID string `json:"customer_id"`
    Name       string `json:"name"`
    Phone      string `json:"phone"`
    Password   string `json:"password"`
    Email      string `json:"email"`
    Address    string `json:"address"`
    Role       string `json:"role"`
}
type Staff struct {
    StaffID   string `json:"staff_id"`
    Name      string `json:"name"`
    Phone     string `json:"phone"`
    Password  string `json:"password"`
    Email     string `json:"email"`
    Address   string `json:"address"`
    Role      string `json:"role"`
}

type Service struct {
    ServiceID    string  `json:"service_id"`
    Name         string  `json:"name"`
    PricePerItem float64 `json:"price_per_item"`
}

type Order struct {
    OrderID    string `json:"order_id"`
    CustomerID string `json:"customer_id"`
    StaffID    string `json:"staff_id"`
    OrderDate  string `json:"order_date"`
    Status     string `json:"status"`
}
