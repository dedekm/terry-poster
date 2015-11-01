// Generated by CoffeeScript 1.9.3
(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.init = function() {
    var Tube, appendChild, camera, canvas, ctx, grid, i, j, k, len, pixelGrid, render, renderPDF, renderer, s, scene, strings, tube;
    canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    strings = $('#input input').map(function(iput) {
      return this.value;
    }).get();
    ctx.font = "25px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    for (i = j = 0, len = strings.length; j < len; i = ++j) {
      s = strings[i];
      ctx.fillText(s.split("").join(String.fromCharCode(8202)), WIDTH / 2, 30 + i * 30);
    }
    pixelGrid = new PixelGrid(ctx);
    document.body.removeChild(canvas);
    $('#input').remove();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 24, 50);
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.setClearColor(0x000000);
    grid = new Grid(WIDTH, HEIGHT, DEPTH);
    camera.position.set(WIDTH / 2, HEIGHT / 2, 45);
    scene.add(grid.helpGrid(pixelGrid.pixels));
    Tube = (function() {
      function Tube(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
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
        preferable = [pixelGrid.getPixel(this.x + 1, this.y) > 0 ? 'right' : void 0, pixelGrid.getPixel(this.x, this.y + 1) > 0 ? 'up' : void 0, pixelGrid.getPixel(this.x, this.y) > 0 ? 'forward' : void 0, pixelGrid.getPixel(this.x - 1, this.y) > 0 ? 'left' : void 0, pixelGrid.getPixel(this.x, this.y - 1) > 0 ? 'down' : void 0].filter(Boolean);
        if (pixelGrid.getPixel(this.x, this.y) > 0 && this.z < DEPTH - DEPTH / 3) {
          preferable = ['forward'];
        }
        if (pixelGrid.getPixel(this.x, this.y) === 0 && this.z > DEPTH / 2) {
          preferable = ['backward'];
        }
        directions = [!grid.getNode(this.x + 1, this.y, this.z) ? 'right' : void 0, !grid.getNode(this.x, this.y + 1, this.z) ? 'up' : void 0, !grid.getNode(this.x, this.y, this.z + 1) || (this.z > DEPTH / 2 && pixelGrid.getPixel(this.x, this.y) === 0) ? 'forward' : void 0, !grid.getNode(this.x - 1, this.y, this.z) ? 'left' : void 0, !grid.getNode(this.x, this.y - 1, this.z) ? 'down' : void 0, !grid.getNode(this.x, this.y, this.z - 1) ? 'backward' : void 0].filter(Boolean);
        preferable_directions = (function() {
          var k, len1, results;
          results = [];
          for (k = 0, len1 = directions.length; k < len1; k++) {
            direction = directions[k];
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
    for (k = 1; k <= 50; k++) {
      tube.move();
    }
    renderPDF = function() {
      var dataURL, doc;
      dataURL = renderer.domElement.toDataURL();
      doc = new jsPDF('p', 'mm', 'b1');
      doc.text(20, 20, 'Hello world.');
      doc.addImage(dataURL, 'PNG', 0, 0, 700, 1000);
      return doc.save('Test.pdf');
    };
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
    return render();
  };

  init();

}).call(this);
