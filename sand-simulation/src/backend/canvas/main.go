package canvas

import (
	"fmt"
	"math"
	"syscall/js"
)

type Canvas struct {
	cells       []byte
	updateCells []byte
	outArray    js.Value
	Width       int
	Height      int
	Amount      int
	updates     int
}

func (c *Canvas) inBounds(x, y int) bool {
	return x >= 0 && x < c.Width && y >= 0 && y < c.Height
}

func (c *Canvas) XYtoIndex(x, y int) int {
	return x + c.Width*y
}

func (c *Canvas) IndexToXY(i int) (int, int) {
	return i % c.Width, i / c.Height
}

// i always come back to this
// https://softwareengineering.stackexchange.com/questions/212808/treating-a-1d-data-structure-as-2d-grid
func (c *Canvas) GetCell(x, y int) byte {
	if c.inBounds(x, y) {
		return c.cells[c.XYtoIndex(x, y)]
	} else {
		return 200
	}
}

func (c *Canvas) GetAmountEmpty() int {

	amount := 0

	for i := 0; i < c.Amount; i++ {
		if c.cells[i] == 0 {
			amount++
		}
	}

	return amount

}

func (c *Canvas) SetCell(x, y int, ce byte) {
	if c.inBounds(x, y) {
		c.updates++
		c.updateCells[c.XYtoIndex(x, y)] = 100
		c.cells[c.XYtoIndex(x, y)] = ce
	}
}

func (c *Canvas) SwitchCells(x1, y1, x2, y2 int) {
	if c.inBounds(x1, y1) && c.inBounds(x2, y2) {
		c.updates++
		temp := c.GetCell(x2, y2)
		c.SetCell(x2, y2, c.GetCell(x1, y1))
		c.SetCell(x1, y1, temp)
	}
}

func (c *Canvas) UpdatePixels() {

	js.CopyBytesToJS(c.outArray, c.cells)

	for i := 0; i < c.Amount; i++ {
		c.updateCells[i] = 0
	}
}

func (c *Canvas) SwitchIfEmpty(x1, y1, oX, oY int) bool {

	if c.GetCell(x1+oX, y1+oY) == 0 {
		c.SwitchCells(x1, y1, x1+oX, y1+oY)
		return true
	}

	return false

}

func (c *Canvas) GetUpdates() int {

	updates := c.updates

	c.updates = 0

	return updates

}

func (c *Canvas) Resize(w, h int) {

	cells := make([]byte, w*h)

	fmt.Printf("[wasm] resize canvas %vx%v > %vx%v\n", c.Width, c.Height, w, h)

	for x := 0; x < w; x++ {
		for y := 0; y < h; y++ {

			_x := int(math.Floor(float64(x) / float64(w) * float64(c.Width)))
			_y := int(math.Floor(float64(y) / float64(h) * float64(c.Height)))

			i := x + y*w

			cells[i] = c.GetCell(_x, _y)

		}
	}

	c.Width = w
	c.Height = h
	c.Amount = w * h
	c.cells = cells
	c.updateCells = make([]byte, w*h)

	c.outArray = js.Global().Get("sandPixelArray")

}

func CreateCanvas(width, height int, value js.Value) *Canvas {

	return &Canvas{
		cells:       make([]byte, width*height),
		updateCells: make([]byte, width*height),
		Width:       width,
		Height:      height,
		outArray:    value,
		Amount:      width * height,
	}
}
