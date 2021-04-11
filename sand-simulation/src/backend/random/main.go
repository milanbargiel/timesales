package random

import (
	"math/rand"
	"time"

	"github.com/ojrac/opensimplex-go"
)

var (
	randInts         [100000]int
	seed             int64
	randFloats       [100000]float64
	currentRandIndex int = 0
	p                opensimplex.Noise
)

func Float() float64 {
	currentRandIndex = (currentRandIndex + 1) % len(randInts)
	return randFloats[currentRandIndex]
}
func Int() int {
	currentRandIndex = (currentRandIndex + 1) % len(randInts)
	return randInts[currentRandIndex]
}

func IntMinMax(min, max int) int {
	return min + (max-min)*Int()/1000
}

func Noise1D(x int) float64 {
	return Noise2D(x, 0)
}

func Noise1DScale(x int, scale float64) float64 {
	return p.Eval2(float64(x)*scale, 0)
}

func Noise2D(x, y int) float64 {
	return p.Eval2(float64(x), float64(y))
}

func Noise2DScale(x, y int, scale float64) float64 {
	return p.Eval2(float64(x)*scale, float64(y)*scale)
}

func Noise2DScaleXY(x, y int, sx, sy float64) float64 {
	return p.Eval2(float64(x)*sx, float64(y)*sy)
}

func Bool() bool {
	return BoolPerc(0.5)
}

func BoolPerc(perc float64) bool {
	if perc == 1 {
		return true
	}
	if perc == 0 {
		return false
	}
	currentRandIndex = (currentRandIndex + 1) % len(randInts)
	return randFloats[currentRandIndex] < perc
}

func GetSeed() int {
	return int(seed)
}

func Init() {

	seed = time.Now().UnixNano()

	rand.Seed(seed)

	p = opensimplex.NewNormalized(seed)

	for i := 0; i < len(randInts); i++ {
		randInts[i] = rand.Intn(1000)
		randFloats[i] = rand.Float64()
	}
}
