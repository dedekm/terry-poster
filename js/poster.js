// Generated by CoffeeScript 1.4.0
(function() {
  var Grid, HEIGHT, Tube, WIDTH, camera, canvas, ctx, getData, grid, pixelGrid, render, renderer, scene, tube;

  WIDTH = 40;

  HEIGHT = 40;

  canvas = document.createElement('canvas');

  canvas.width = WIDTH;

  canvas.height = HEIGHT;

  document.body.appendChild(canvas);

  ctx = canvas.getContext("2d");

  ctx.font = "35px Georgia";

  ctx.fillStyle = "#000000";

  ctx.fillText("M", 3, 35);

  getData = function(content) {
    var bw, d, data, h, i, imageData, p, w, x, y, _i, _j, _k, _l, _len, _m;
    imageData = content.getImageData(0, 0, content.canvas.width, content.canvas.height);
    data = imageData.data;
    bw = [];
    for (i = _i = 0, _len = data.length; _i < _len; i = ++_i) {
      d = data[i];
      if (i % 4 === 3) {
        bw.push(d);
      }
    }
    w = bw.length / canvas.width;
    h = bw.length / canvas.height;
    p = new Array(w);
    for (x = _j = 0; 0 <= w ? _j < w : _j > w; x = 0 <= w ? ++_j : --_j) {
      p[x] = [];
      for (y = _k = 0; 0 <= h ? _k < h : _k > h; y = 0 <= h ? ++_k : --_k) {
        p[x].push(0);
      }
    }
    for (x = _l = 0; 0 <= w ? _l < w : _l > w; x = 0 <= w ? ++_l : --_l) {
      for (y = _m = 0; 0 <= h ? _m < h : _m > h; y = 0 <= h ? ++_m : --_m) {
        d = x + (w * h - w) - (y * h);
        p[x][y] = bw[d];
      }
    }
    return p;
  };

  pixelGrid = getData(ctx);

  document.body.removeChild(canvas);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 100);

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({
    logarithmicDepthBuffer: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  renderer.setClearColor(0x000000);

  Grid = (function() {

    function Grid(width, height, depth) {
      this.nodes = this.setGrid(width, height, depth);
    }

    Grid.prototype.setGrid = function(w, h, d) {
      var a, b, n, x, y, z, _i, _j, _k, _ref, _ref1, _ref2;
      n = [];
      for (x = _i = 0, _ref = w - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; x = 0 <= _ref ? ++_i : --_i) {
        a = [];
        for (y = _j = 0, _ref1 = h - 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
          b = [];
          for (z = _k = 0, _ref2 = d - 1; 0 <= _ref2 ? _k <= _ref2 : _k >= _ref2; z = 0 <= _ref2 ? ++_k : --_k) {
            b.push({
              x: x,
              y: y,
              z: z,
              full: false
            });
          }
          a.push(b);
        }
        n.push(a);
      }
      return n;
    };

    Grid.prototype.helpGrid = function(pixels) {
      var cube, g, geometry1, material1, x, y, z, _i, _j, _ref, _ref1;
      g = new THREE.Group;
      geometry1 = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      for (x = _i = 0, _ref = this.nodes.length; 0 <= _ref ? _i < _ref : _i > _ref; x = 0 <= _ref ? ++_i : --_i) {
        for (y = _j = 0, _ref1 = this.nodes[x].length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; y = 0 <= _ref1 ? ++_j : --_j) {
          z = this.nodes[x][y].length - 1;
          if (pixels[x][y] !== 0) {
            material1 = new THREE.MeshBasicMaterial({
              color: 0xff0000
            });
          } else {
            material1 = new THREE.MeshBasicMaterial({
              color: 0x00ff00
            });
          }
          cube = new THREE.Mesh(geometry1, material1);
          cube.position.set(x, y, z);
          g.add(cube);
        }
      }
      return g;
    };

    return Grid;

  })();

  grid = new Grid(WIDTH, HEIGHT, 10);

  camera.position.set(WIDTH / 2, HEIGHT / 2, 45);

  console.log(grid);

  scene.add(grid.helpGrid(pixelGrid));

  Tube = (function() {

    function Tube(x, y, z) {
      var _ref, _ref1, _ref2;
      this.x = x;
      this.y = y;
      this.z = z;
      if ((_ref = this.x) == null) {
        this.x = Math.round(Math.random() * WIDTH);
      }
      if ((_ref1 = this.y) == null) {
        this.y = Math.round(Math.random() * HEIGHT);
      }
      if ((_ref2 = this.z) == null) {
        this.z = 0;
      }
      grid.nodes[this.x][this.y][this.z] = 1;
    }

    return Tube;

  })();

  tube = new Tube(30, 30, 0);

  render = function() {
    return renderer.render(scene, camera);
  };

  render();

}).call(this);
