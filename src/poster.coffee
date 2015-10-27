canvas = document.createElement('canvas')
canvas.id = 'canvas'
canvas.width = 40
canvas.height = 40
document.body.appendChild(canvas)
ctx = canvas.getContext("2d")

ctx.font = "35px Georgia"
ctx.fillStyle = "#FF0000"
ctx.fillText("M", 3, 35)

getData = (content) ->
  imageData = content.getImageData(0, 0, content.canvas.width, content.canvas.height)
  data = imageData.data
  bw = []
  for d, i in data
    bw.push(d) if i % 4 == 0

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


scene = new THREE.Scene()
camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100 )
scene = new THREE.Scene()

renderer = new THREE.WebGLRenderer ({logarithmicDepthBuffer: true } )
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )
renderer.setClearColor(0x000000)

setGrid = (w, h, d) ->
  g = []
  for x in [0..w - 1]
    a = []
    for y in [0..h - 1]
      b = []
      for z in [0..d - 1]
        b.push {x: x, y: y, z: z, full: false}
      a.push b
    g.push a
  return g

helpGrid = (grid, pixels) ->
  g = new THREE.Group
  for x in [0...grid.length]
    for y in [0...grid[x].length]
      z = grid[x][y].length - 1
      if pixels[x][y] != 0
        material1 = new THREE.MeshBasicMaterial( { color: 0xff0000 } )
      else
        material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
      cube = new THREE.Mesh( geometry1, material1 )
      cube.position.set(x, y, z)
      g.add( cube )
  return g

grid = setGrid(40, 40, 5)
camera.position.set( 20, 20, 45 )

geometry1 = new THREE.BoxGeometry( 0.1, 0.1, 0.1)

scene.add(helpGrid(grid, pixelGrid))

render = () ->
  renderer.render( scene, camera )

render()
