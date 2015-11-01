class window.PixelGrid
  constructor: (content) ->
    imageData = content.getImageData(0, 0, content.canvas.width, content.canvas.height)
    data = imageData.data
    bw = []
    for d, i in data
      bw.push(d) if i % 4 == 3

    w = WIDTH
    h = HEIGHT
    @pixels = new Array(w)
    for x in [0...w]
      @pixels[x] = []
      for y in [0...h]
        @pixels[x].push( 0 )
    for x in [0...w]
      for y in [0...h]
        d = x + (w * h - w ) - (y * w)
        @pixels[x][y] = bw[d]

  getPixel: (x, y) ->
    if @pixels[x] && @pixels[x][y]
      @pixels[x][y]
    else
      0
