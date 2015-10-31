WIDTH = 40
HEIGHT = 40
MATERIAL = new THREE.MeshDepthMaterial()


canvas = document.createElement('canvas')
canvas.width = WIDTH
canvas.height = HEIGHT
document.body.appendChild(canvas)
ctx = canvas.getContext("2d")

ctx.font = "35px Georgia"
ctx.fillStyle = "#000000"
ctx.fillText("M", 3, 35)

getData = (content) ->
  imageData = content.getImageData(0, 0, content.canvas.width, content.canvas.height)
  data = imageData.data
  bw = []
  for d, i in data
    bw.push(d) if i % 4 == 3

  w = bw.length / canvas.width
  h = bw.length / canvas.height
  p = new Array(w)
  for x in [0...w]
    p[x] = []
    for y in [0...h]
      p[x].push( 0 )
  for x in [0...w]
    for y in [0...h]
      d = x + (w * h - w ) - (y * h)
      p[x][y] = bw[d]
  return p

pixelGrid = getData(ctx)
document.body.removeChild(canvas)


scene = new THREE.Scene()
camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 20, 55 )
scene = new THREE.Scene()

renderer = new THREE.WebGLRenderer ({logarithmicDepthBuffer: true } )
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )
renderer.setClearColor(0x000000)

class Grid
  constructor: (width, height, depth) ->
    @nodes = this.setGrid(width, height, depth)

  setGrid: (w, h, d) ->
    n = []
    for x in [0..w - 1]
      a = []
      for y in [0..h - 1]
        b = []
        for z in [0..d - 1]
          b.push {x: x, y: y, z: z, full: false}
        a.push b
      n.push a
    return n

  getNode: (x, y, z) ->
    if @nodes[x] && @nodes[x][y] && @nodes[x][y][z]
      'full' if @nodes[x][y][z].full
    else
      'out'

  setNode: (x, y, z, full) ->
    if @nodes[x] && @nodes[x][y] && @nodes[x][y][z]
      @nodes[x][y][z].full = full


  helpGrid: (pixels) ->
    g = new THREE.Group
    geometry1 = new THREE.BoxGeometry( 0.1, 0.1, 0.1)
    for x in [0...@nodes.length]
      for y in [0...@nodes[x].length]
        z = @nodes[x][y].length - 1
        if pixels[x][y] != 0
          material1 = new THREE.MeshBasicMaterial( { color: 0xff0000 } )
        else
          material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
        cube = new THREE.Mesh( geometry1, material1 )
        cube.position.set(x, y, z)
        g.add( cube )
    return g

grid = new Grid(WIDTH, HEIGHT, 10)
camera.position.set( WIDTH/2, HEIGHT/2, 45 )

scene.add(grid.helpGrid(pixelGrid))

class Tube
  constructor: (@x, @y, @z) ->
    @x ?= Math.round(Math.random() * WIDTH)
    @y ?= Math.round(Math.random() * HEIGHT)
    @z ?= 0

    grid.setNode(@x,@y,@z, true)
    @path = [this.actualPosition()]

  actualPosition: () ->
    new THREE.Vector3(@x, @y, @z)

  possible_directions: () ->
    preferable = [
      'right' if pixelGrid[@x + 1][@y] > 0,
      'up' if pixelGrid[@x][@y + 1] > 0,
      'forward' if pixelGrid[@x][@y] > 0,
      'left' if pixelGrid[@x - 1][@y] > 0,
      'down' if pixelGrid[@x][@y - 1] > 0
    ].filter(Boolean)
    directions = [
      'right' unless grid.getNode(@x + 1, @y, @z),
      'up' unless grid.getNode(@x, @y + 1, @z),
      'forward' unless grid.getNode(@x, @y, @z + 1),
      'left' unless grid.getNode(@x - 1, @y, @z),
      'down' unless grid.getNode(@x, @y - 1, @z),
      'backward' unless grid.getNode(@x, @y, @z - 1)
    ].filter(Boolean)
    (direction for direction in directions when direction in preferable)

  move: (direction) ->
    pd = this.possible_directions()
    if pd.length > 0
      direction ?= pd[Math.floor(Math.random()*pd.length)]
      switch direction
        when 'right'
          @x++
        when 'up'
          @y++
        when 'forward'
          @z++
        when 'left'
          @x--
        when 'down'
          @y--
        when 'backward'
          @z--

      grid.setNode(@x,@y,@z, true)
      @path.push(this.actualPosition())
    else
      console.log 'cant move'

  createTube: () ->
    curve = new THREE.SplineCurve3(@path)
    geometry = new THREE.TubeGeometry(
      curve, #path
      @path.length * 3, #segments
      0.45, #radius
      8, #radiusSegments
      false #closed
    )
    tube = new THREE.Mesh( geometry, MATERIAL )

tube = new Tube(30, 30, 0)
tube.move() for [1..100]

scene.add(tube.createTube())


render = () ->
  renderer.render( scene, camera )

render()
