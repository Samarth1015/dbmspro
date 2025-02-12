package util

import (
	
	"math/rand"
	
)

func Random() int {

	var x1  = rand.Int();
	
	x1 = rand.Intn(900000) + 100000
	
	return x1;
}
