scene = new THREE.Scene()
camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 20, 35 )
scene = new THREE.Scene()

renderer = new THREE.WebGLRenderer ({logarithmicDepthBuffer: true } )
renderer.setSize( window.innerWidth, window.innerHeight )
document.body.appendChild( renderer.domElement )
renderer.setClearColor(0x000000)

render = () ->
  renderer.render( scene, camera )

render()
