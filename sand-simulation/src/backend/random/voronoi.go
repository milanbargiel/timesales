package random

import (
	"math"

	"git.jim-fx.com/max/sand/src/backend/canvas"
	h "git.jim-fx.com/max/sand/src/backend/helpers"
)

var (
	c            *canvas.Canvas
	_w           int
	_h           int
	points       []int
	pointAmount  int
	pointTexture []float64
)

func GetVoronoi(x, y int) float64 {
	if c.Width != _w || c.Height != _h {
		GenTexture()
	}

	i := c.XYtoIndex(x, y)

	if i >= len(pointTexture) {
		println(i)
		println(x, y)
	}

	if pointTexture[i] == 0 {
		var (
			minDistance float64 = 100000
			_i          int     = 0
		)

		// This adds some distortion to the texture
		x += int(Noise2DScaleXY(x, y, 0.005, 0.05) * 200)

		// This adds the "blur" to some parts
		y += int(Noise2DScale(x+100, y, 0.01) * float64(IntMinMax(-20, 20)))

		for j := 0; j < pointAmount; j++ {

			dist := lengthVec2DFast(x, y, points[j*2], points[j*2+1])
			if dist < minDistance {
				minDistance = dist
				_i = j
			}

		}

		pointTexture[i] = float64(_i) / float64(pointAmount)
	}
	return pointTexture[i]

}

func lengthVec2DFast(x1, y1, x2, y2 int) float64 {
	return float64(h.AbsInt(x1-x2)+h.AbsInt(y1-y2)) / 4
}
func lengthVec2D(x1, y1, x2, y2 int) float64 {
	return math.Sqrt(math.Pow(float64(x1-x2), 2) + math.Pow(float64(y1-y2), 2))
}

func shuffleByTwo(a []int) []int {
	for i := len(a) - 2; i > 0; i -= 2 { // Fisher–Yates shuffle
		j := IntMinMax(0, i+1)
		a[i], a[j] = a[j], a[i]
		a[i+1], a[j+1] = a[j+1], a[i+1]
	}
	return a
}

func GenTexture() {

	_w = c.Width
	_h = c.Height
	amount := _w * _h

	pointW := 10
	pointH := 10
	pointAmount = pointW * pointH

	points = make([]int, pointAmount*2)
	pointTexture = make([]float64, amount)

	offset := 100

	overscale := 0.2

	scaleX := 1.5
	scaleY := 1.0

	for x := 0; x < pointW; x++ {
		for y := 0; y < pointH; y++ {

			_x := int((float64(x)/float64(pointW)*(1+2*overscale) - overscale) * scaleX * float64(_w))
			_y := int((float64(y)/float64(pointH)*(1+2*overscale) - overscale) * scaleY * float64(_h))

			i := x + y*pointW

			points[i*2+0] = IntMinMax(_x-offset, _x+offset)
			points[i*2+1] = IntMinMax(_y-offset, _y+offset)

		}

	}

	points = shuffleByTwo(points)

}

func SetCanvas(_c *canvas.Canvas) {
	c = _c
}
