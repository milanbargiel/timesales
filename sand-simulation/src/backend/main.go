package main

import (
	"fmt"
	"math"
	"syscall/js"
	"time"

	"git.jim-fx.com/max/sand/src/backend/canvas"
	h "git.jim-fx.com/max/sand/src/backend/helpers"
	"git.jim-fx.com/max/sand/src/backend/random"
)

var (
	c *canvas.Canvas
)

//export CreateCanvas
func CreateCanvas(width, height int) {

	fmt.Printf("[wasm] generate canvas %vx%v\n", width, height)

	s := time.Now()

	c = canvas.CreateCanvas(width, height, js.Global().Get("sandPixelArray"))
	random.SetCanvas(c)

	for y := 0; y < c.Height; y++ {
		for x := 0; x < c.Width; x++ {

			v := random.GetVoronoi(x, y) * 255

			v += float64(random.IntMinMax(-20, 20))

			v = math.Min(math.Max(v, 0), 255)

			c.SetCell(x, y, byte(v))
		}
	}

	c.UpdatePixels()

	fmt.Printf("[wasm] init in %v \n", time.Since(s))

}

var (
	timeInt         int     = 0
	timeF           float64 = 0
	simFinished     bool    = false
	errorCorrection float64 = 0
	xOffset         float64 = 0
	diff            float64 = 0
	smallestY               = 100000
	start                   = time.Now()
)

//export Update
func Update(percentage float64) int {

	if simFinished {
		return 0
	}

	timeInt++
	timeF += 0.01

	// This is the actual percentage
	// of empty cells in the grid
	perc := 1 - float64(c.GetAmountEmpty())/float64(c.Amount)
	if perc == 0 {
		println("SIM FINISHED")
		simFinished = true
	}

	// This is the difference of the
	// actual percentage and the "should be" percentage
	// lerping this worked great, but causes the value to be inaccurate
	diff = h.Lerp(percentage-perc, diff, 0.995)

	// Error Correction

	// If the error correction is too high
	// it caused a sort of stepping motion

	// THe last part is to make the error correction less
	// strong in the beginning and more strong in the end
	// https://www.desmos.com/calculator/fjbjx18jhi

	errorCorrection = h.Lerp(-diff*5, errorCorrection, 0.98)

	// The second parameter to the random.Noise1DScale function
	// sets the speed at which the bottom moves
	// the lower the number the lower the speed
	xOffset = h.Pmod(random.Noise1DScale(random.GetSeed()/1000+int(timeF*700), 0.0002)*float64(c.Width)*2, float64(c.Width))

	// xOffset = 0.5 * float64(c.Width)
	// errorCorrection = 0.02

	minX := int(xOffset - float64(c.Width)*errorCorrection)
	maxX := int(xOffset + float64(c.Width)*errorCorrection)

	if timeInt%60 == 0 {
		fmt.Println("----------------------")
		fmt.Printf("PROGRESS %v \n", percentage)

		d := int(diff * 100)

		if d == 0 {
			fmt.Printf("SIM IS ON TRACK %v \n", diff)
		} else if d > 0 {
			fmt.Printf("SIM IS AHEAD BY %v%%\n", d)
		} else {
			fmt.Printf("SIM IS BEHIND BY %v%%\n", d)
		}
		fmt.Printf("ERROR CORRECTION %f\n", errorCorrection)

		fmt.Printf("EXECUTION TIME %v\n", time.Since(start))
	}

	if percentage == 0 {
		errorCorrection = -1000
		errorCorrection = 1000
	}

	// Find the largest y coordinate
	// in the
	largestY := 0

	for y := 0; y < c.Height; y++ {

		// Stop loop if top cell is reached
		// because we loop from the bottom up
		// we can do that
		if y > smallestY {
			continue
		}

		for _x := 0; _x < c.Width; _x++ {

			x := _x

			if timeInt%2 == 0 {
				x = c.Width - x - 1
			}

			//Skip Empty Cells
			if c.GetCell(x, y) == 0 {
				continue
			}

			if y > largestY {
				largestY = y
			}

			// Remove cells at the bottom
			if y == 0 {
				if x > minX && x < maxX {
					c.SetCell(x, y, 0)
				}
			}

			c.SwitchIfEmpty(x, y, 0, -1)

			if random.Bool() {
				c.SwitchIfEmpty(x, y, -1, -1)
			} else {
				c.SwitchIfEmpty(x, y, 1, -1)
			}

		}
	}

	smallestY = largestY

	updates := c.GetUpdates()

	if updates > 0 {
		c.UpdatePixels()
	}

	start = time.Now()

	return updates

}

//export Resize
func Resize(width, height int) {
	c.Resize(width, height)
	smallestY = 100000

}

func main() {
	random.Init()
}
