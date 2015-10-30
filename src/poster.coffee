WIDTH = 40
HEIGHT = 40

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
camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100 )
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

console.log grid

scene.add(grid.helpGrid(pixelGrid))

class Tube
  constructor: (@x, @y, @z) ->
    @x ?= Math.round(Math.random() * WIDTH)
    @y ?= Math.round(Math.random() * HEIGHT)
    @z ?= 0

    grid.nodes[@x][@y][@z] = 1

tube = new Tube(30, 30, 0)

render = () ->
  renderer.render( scene, camera )

render()
