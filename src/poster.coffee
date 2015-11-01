window.init = () ->
  canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  document.body.appendChild(canvas)
  ctx = canvas.getContext("2d")

  strings = $('#input input').map((iput) ->
    this.value
    ).get()

  ctx.font = "25px Arial"
  ctx.fillStyle = "#000000"
  ctx.textAlign="center"

  for s, i in strings
    ctx.fillText(s.split("").join(String.fromCharCode(8202)), WIDTH/2, 30 + i* 30)

  pixelGrid = new PixelGrid(ctx)
  document.body.removeChild(canvas)
  $('#input').remove()

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 24, 50 )
  scene = new THREE.Scene()

  renderer = new THREE.WebGLRenderer ({logarithmicDepthBuffer: true } )
  renderer.setSize( window.innerWidth, window.innerHeight )
  document.body.appendChild( renderer.domElement )
  renderer.setClearColor(0x000000)

  grid = new Grid(WIDTH, HEIGHT, DEPTH)
  camera.position.set( WIDTH/2, HEIGHT/2, 45 )

  scene.add(grid.helpGrid(pixelGrid.pixels))

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
        'right' if pixelGrid.getPixel(@x + 1, @y) > 0,
        'up' if pixelGrid.getPixel(@x,@y + 1) > 0,
        'forward' if pixelGrid.getPixel(@x, @y) > 0,
        'left' if pixelGrid.getPixel(@x - 1,@y) > 0,
        'down' if pixelGrid.getPixel(@x,@y - 1) > 0
      ].filter(Boolean)
      preferable = ['forward'] if pixelGrid.getPixel(@x, @y) > 0 && @z < DEPTH - DEPTH/3
      preferable = ['backward'] if pixelGrid.getPixel(@x, @y) == 0 && @z > DEPTH / 2

      directions = [
        'right' unless grid.getNode(@x + 1, @y, @z),
        'up' unless grid.getNode(@x, @y + 1, @z),
        'forward' if not grid.getNode(@x, @y, @z + 1) or (@z > DEPTH / 2 && pixelGrid.getPixel(@x, @y) == 0),
        'left' unless grid.getNode(@x - 1, @y, @z),
        'down' unless grid.getNode(@x, @y - 1, @z),
        'backward' unless grid.getNode(@x, @y, @z - 1)
      ].filter(Boolean)

      preferable_directions = (direction for direction in directions when direction in preferable)
      if preferable_directions.length > 0
        preferable_directions
      else
        directions

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

  tube = new Tube(4, 5, 5)

  for [1..50]
    tube.move()

  # scene.add(tube.createTube())

  renderPDF= () ->
    dataURL = renderer.domElement.toDataURL()
    doc = new jsPDF('p', 'mm', 'b1')
    doc.text(20, 20, 'Hello world.')
    doc.addImage(dataURL, 'PNG', 0, 0, 700, 1000)
    doc.save('Test.pdf')

  render = () ->
    renderer.render( scene, camera )
    # renderPDF()

  appendChild = () ->
    imgData = renderer.domElement.toDataURL()
    imgNode = document.createElement("img")
    imgNode.src = imgData
    document.body.appendChild(imgNode)

  render()


init()
