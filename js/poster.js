// Generated by CoffeeScript 1.9.3
(function() {
  var DEPTH, Grid, HEIGHT, MATERIAL, Tube, WIDTH, appendChild, camera, canvas, ctx, getData, grid, j, pixelGrid, render, renderer, scene, tube,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  WIDTH = 40;

  HEIGHT = 40;

  DEPTH = 10;

  MATERIAL = new THREE.MeshDepthMaterial();

  canvas = document.createElement('canvas');

  canvas.width = WIDTH;

  canvas.height = HEIGHT;

  document.body.appendChild(canvas);

  ctx = canvas.getContext("2d");

  ctx.font = "35px Georgia";

  ctx.fillStyle = "#000000";

  ctx.fillText("M", 3, 35);

  getData = function(content) {
    var bw, d, data, h, i, imageData, j, k, l, len, m, o, p, ref, ref1, ref2, ref3, w, x, y;
    imageData = content.getImageData(0, 0, content.canvas.width, content.canvas.height);
    data = imageData.data;
    bw = [];
    for (i = j = 0, len = data.length; j < len; i = ++j) {
      d = data[i];
      if (i % 4 === 3) {
        bw.push(d);
      }
    }
    w = bw.length / canvas.width;
    h = bw.length / canvas.height;
    p = new Array(w);
    for (x = k = 0, ref = w; 0 <= ref ? k < ref : k > ref; x = 0 <= ref ? ++k : --k) {
      p[x] = [];
      for (y = l = 0, ref1 = h; 0 <= ref1 ? l < ref1 : l > ref1; y = 0 <= ref1 ? ++l : --l) {
        p[x].push(0);
      }
    }
    for (x = m = 0, ref2 = w; 0 <= ref2 ? m < ref2 : m > ref2; x = 0 <= ref2 ? ++m : --m) {
      for (y = o = 0, ref3 = h; 0 <= ref3 ? o < ref3 : o > ref3; y = 0 <= ref3 ? ++o : --o) {
        d = x + (w * h - w) - (y * h);
        p[x][y] = bw[d];
      }
    }
    return p;
  };

  pixelGrid = getData(ctx);

  document.body.removeChild(canvas);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 24, 50);

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
      var a, b, j, k, l, n, ref, ref1, ref2, x, y, z;
      n = [];
      for (x = j = 0, ref = w - 1; 0 <= ref ? j <= ref : j >= ref; x = 0 <= ref ? ++j : --j) {
        a = [];
        for (y = k = 0, ref1 = h - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; y = 0 <= ref1 ? ++k : --k) {
          b = [];
          for (z = l = 0, ref2 = d - 1; 0 <= ref2 ? l <= ref2 : l >= ref2; z = 0 <= ref2 ? ++l : --l) {
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

    Grid.prototype.getNode = function(x, y, z) {
      if (this.nodes[x] && this.nodes[x][y] && this.nodes[x][y][z]) {
        if (this.nodes[x][y][z].full) {
          return 'full';
        }
      } else {
        return 'out';
      }
    };

    Grid.prototype.setNode = function(x, y, z, full) {
      if (this.nodes[x] && this.nodes[x][y] && this.nodes[x][y][z]) {
        return this.nodes[x][y][z].full = full;
      }
    };

    Grid.prototype.helpGrid = function(pixels) {
      var cube, g, geometry1, j, k, material1, ref, ref1, x, y, z;
      g = new THREE.Group;
      geometry1 = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      for (x = j = 0, ref = this.nodes.length; 0 <= ref ? j < ref : j > ref; x = 0 <= ref ? ++j : --j) {
        for (y = k = 0, ref1 = this.nodes[x].length; 0 <= ref1 ? k < ref1 : k > ref1; y = 0 <= ref1 ? ++k : --k) {
          z = this.nodes[x][y].length - 2;
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

  grid = new Grid(WIDTH, HEIGHT, DEPTH);

  camera.position.set(WIDTH / 2, HEIGHT / 2, 45);

  scene.add(grid.helpGrid(pixelGrid));

  Tube = (function() {
    function Tube(x1, y1, z1) {
      this.x = x1;
      this.y = y1;
      this.z = z1;
      if (this.x == null) {
        this.x = Math.round(Math.random() * WIDTH);
      }
      if (this.y == null) {
        this.y = Math.round(Math.random() * HEIGHT);
      }
      if (this.z == null) {
        this.z = 0;
      }
      grid.setNode(this.x, this.y, this.z, true);
      this.path = [this.actualPosition()];
    }

    Tube.prototype.actualPosition = function() {
      return new THREE.Vector3(this.x, this.y, this.z);
    };

    Tube.prototype.possible_directions = function() {
      var direction, directions, preferable, preferable_directions;
      preferable = [pixelGrid[this.x + 1][this.y] > 0 ? 'right' : void 0, pixelGrid[this.x][this.y + 1] > 0 ? 'up' : void 0, pixelGrid[this.x][this.y] > 0 ? 'forward' : void 0, pixelGrid[this.x - 1][this.y] > 0 ? 'left' : void 0, pixelGrid[this.x][this.y - 1] > 0 ? 'down' : void 0].filter(Boolean);
      if (pixelGrid[this.x][this.y] > 0 && this.z < DEPTH - DEPTH / 3) {
        preferable = ['forward'];
      }
      if (pixelGrid[this.x][this.y] === 0 && this.z > DEPTH / 2) {
        preferable = ['backward'];
      }
      directions = [!grid.getNode(this.x + 1, this.y, this.z) ? 'right' : void 0, !grid.getNode(this.x, this.y + 1, this.z) ? 'up' : void 0, !grid.getNode(this.x, this.y, this.z + 1) || (this.z > DEPTH / 2 && pixelGrid[this.x][this.y] === 0) ? 'forward' : void 0, !grid.getNode(this.x - 1, this.y, this.z) ? 'left' : void 0, !grid.getNode(this.x, this.y - 1, this.z) ? 'down' : void 0, !grid.getNode(this.x, this.y, this.z - 1) ? 'backward' : void 0].filter(Boolean);
      preferable_directions = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = directions.length; j < len; j++) {
          direction = directions[j];
          if (indexOf.call(preferable, direction) >= 0) {
            results.push(direction);
          }
        }
        return results;
      })();
      if (preferable_directions.length > 0) {
        return preferable_directions;
      } else {
        return directions;
      }
    };

    Tube.prototype.move = function(direction) {
      var pd;
      pd = this.possible_directions();
      if (pd.length > 0) {
        if (direction == null) {
          direction = pd[Math.floor(Math.random() * pd.length)];
        }
        switch (direction) {
          case 'right':
            this.x++;
            break;
          case 'up':
            this.y++;
            break;
          case 'forward':
            this.z++;
            break;
          case 'left':
            this.x--;
            break;
          case 'down':
            this.y--;
            break;
          case 'backward':
            this.z--;
        }
        grid.setNode(this.x, this.y, this.z, true);
        return this.path.push(this.actualPosition());
      } else {
        return console.log('cant move');
      }
    };

    Tube.prototype.createTube = function() {
      var curve, geometry, tube;
      curve = new THREE.SplineCurve3(this.path);
      geometry = new THREE.TubeGeometry(curve, this.path.length * 3, 0.45, 8, false);
      return tube = new THREE.Mesh(geometry, MATERIAL);
    };

    return Tube;

  })();

  tube = new Tube(4, 5, 5);

  for (j = 1; j <= 50; j++) {
    tube.move();
  }

  scene.add(tube.createTube());

  render = function() {
    return renderer.render(scene, camera);
  };

  appendChild = function() {
    var imgData, imgNode;
    imgData = renderer.domElement.toDataURL();
    imgNode = document.createElement("img");
    imgNode.src = imgData;
    return document.body.appendChild(imgNode);
  };

  render();

}).call(this);
