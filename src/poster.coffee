canvas = document.createElement('canvas')
canvas.id = 'canvas'
canvas.width = 40
canvas.height = 40
document.body.appendChild(canvas)
ctx = canvas.getContext("2d")

ctx.font = "35px Georgia"
ctx.fillStyle = "#FF0000"
ctx.fillText("M", 2, 32)

getData = (content) ->
  imageData = content.getImageData(0, 0, content.canvas.width, content.canvas.height)
  data = imageData.data
  bw = []
  for d, i in data
    bw.push(d) if i % 4 == 0

getData(ctx)

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

helpGrid = (grid) ->
  g = new THREE.Group
  for x in [0..grid.length - 1]
    for y in [0..grid[x].length - 1]
      z = grid[x][y].length - 1
      if grid[x][y][z].full
        material1 = new THREE.MeshBasicMaterial( { color: 0xff0000 } )
      else
        material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
      cube = new THREE.Mesh( geometry1, material1 )
      cube.position.set(x, y, z)
      g.add( cube )
  return g

grid = setGrid(16, 16, 5)
camera.position.set( 8, 8, 20 )

geometry1 = new THREE.BoxGeometry( 0.1, 0.1, 0.1)

scene.add(helpGrid(grid))

render = () ->
  renderer.render( scene, camera )

render()
