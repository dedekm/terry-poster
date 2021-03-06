// Generated by CoffeeScript 1.9.3
(function() {
  window.Grid = (function() {
    function Grid(width, height, depth) {
      this.nodes = this.setGrid(width, height, depth);
    }

    Grid.prototype.setGrid = function(w, h, d) {
      var a, b, i, j, k, n, ref, ref1, ref2, x, y, z;
      n = [];
      for (x = i = 0, ref = w - 1; 0 <= ref ? i <= ref : i >= ref; x = 0 <= ref ? ++i : --i) {
        a = [];
        for (y = j = 0, ref1 = h - 1; 0 <= ref1 ? j <= ref1 : j >= ref1; y = 0 <= ref1 ? ++j : --j) {
          b = [];
          for (z = k = 0, ref2 = d - 1; 0 <= ref2 ? k <= ref2 : k >= ref2; z = 0 <= ref2 ? ++k : --k) {
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
      var cube, g, geometry1, i, j, material1, ref, ref1, x, y, z;
      g = new THREE.Group;
      geometry1 = new THREE.BoxGeometry(0.1, 0.1, 0.1);
      for (x = i = 0, ref = this.nodes.length; 0 <= ref ? i < ref : i > ref; x = 0 <= ref ? ++i : --i) {
        for (y = j = 0, ref1 = this.nodes[x].length; 0 <= ref1 ? j < ref1 : j > ref1; y = 0 <= ref1 ? ++j : --j) {
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

}).call(this);
