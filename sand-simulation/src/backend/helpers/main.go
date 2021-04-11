package h

import "math"

func Lerp(a, b, f float64) float64 {
	return a*(1-f) + b*f
}

func Pmod(x, d float64) float64 {
	x = math.Mod(x, d)
	if x >= 0 {
		return x
	}
	if d < 0 {
		return x - d
	}
	return x + d
}

func AbsInt(x int) int {
	if x < 0 {
		return -x
	}
	return x
}
