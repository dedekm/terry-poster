class window.Grid
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
        z = @nodes[x][y].length - 2
        if pixels[x][y] != 0
          material1 = new THREE.MeshBasicMaterial( { color: 0xff0000 } )
        else
          material1 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
        cube = new THREE.Mesh( geometry1, material1 )
        cube.position.set(x, y, z)
        g.add( cube )
    return g
