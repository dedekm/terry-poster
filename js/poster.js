// Generated by CoffeeScript 1.9.3
(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.init = function() {
    var Tube, appendChild, bufferGeometry, camera, canvas, ctx, grid, group, i, j, k, l, len, len1, len2, m, mesh, n, o, p, pixelGrid, ref, ref1, render, renderPDF, renderer, s, scene, strings, tube, tubes, x, y;
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
      ctx.fillText(s.split("").join(String.fromCharCode(8202)), WIDTH / 2, 40 + i * 25);
    }
    pixelGrid = new PixelGrid(ctx);
    document.body.removeChild(canvas);
    $('#input').remove();
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(100, WIDTH / HEIGHT, 33, 33 + DEPTH * 2 - 1);
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
      logarithmicDepthBuffer: true
    });
    renderer.setSize(WIDTH * 10, HEIGHT * 10);
    renderer.setClearColor(0x000000);
    grid = new Grid(WIDTH, HEIGHT, DEPTH);
    camera.position.set(WIDTH / 2, HEIGHT / 2, 45);
    Tube = (function() {
      function Tube(x1, y1, z) {
        this.x = x1;
        this.y = y1;
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
        preferable = [pixelGrid.getPixel(this.x + 1, this.y) > 0 ? 'right' : void 0, pixelGrid.getPixel(this.x, this.y + 1) > 0 ? 'up' : void 0, pixelGrid.getPixel(this.x, this.y) > 0 ? 'forward' : void 0, pixelGrid.getPixel(this.x - 1, this.y) > 0 ? 'left' : void 0, pixelGrid.getPixel(this.x, this.y - 1) > 0 ? 'down' : void 0, pixelGrid.getPixel(this.x, this.y) > 0 && this.z >= DEPTH - 2 ? 'backward' : void 0].filter(Boolean);
        if (pixelGrid.getPixel(this.x, this.y) > 0 && this.z < DEPTH - DEPTH / 2) {
          preferable = ['forward'];
        }
        if (pixelGrid.getPixel(this.x, this.y) === 0 && this.z > DEPTH / 3) {
          preferable = ['backward'];
        }
        directions = [!grid.getNode(this.x + 1, this.y, this.z) ? 'right' : void 0, !grid.getNode(this.x, this.y + 1, this.z) ? 'up' : void 0, !grid.getNode(this.x, this.y, this.z + 1) && ((this.z < DEPTH / 4 && pixelGrid.getPixel(this.x, this.y) === 0) || (pixelGrid.getPixel(this.x, this.y) > 0)) ? 'forward' : void 0, !grid.getNode(this.x - 1, this.y, this.z) ? 'left' : void 0, !grid.getNode(this.x, this.y - 1, this.z) ? 'down' : void 0, !grid.getNode(this.x, this.y, this.z - 1) ? 'backward' : void 0].filter(Boolean);
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
        }
      };

      Tube.prototype.createTube = function() {
        var curve, geometry;
        curve = new THREE.SplineCurve3(this.path);
        return geometry = new THREE.TubeGeometry(curve, this.path.length * 3, 0.45, 8, false);
      };

      return Tube;

    })();
    n = 10;
    tubes = [];
    for (x = k = 0, ref = WIDTH / n; 0 <= ref ? k < ref : k > ref; x = 0 <= ref ? ++k : --k) {
      for (y = l = 0, ref1 = HEIGHT / n; 0 <= ref1 ? l < ref1 : l > ref1; y = 0 <= ref1 ? ++l : --l) {
        if (grid.getNode(x * n, y * n, 1) !== 'full') {
          tubes.push(new Tube(x * n, y * n, 1));
        }
      }
    }
    for (m = 0; m <= 40; m++) {
      for (o = 0, len1 = tubes.length; o < len1; o++) {
        tube = tubes[o];
        tube.move();
      }
    }
    group = new THREE.Geometry();
    for (p = 0, len2 = tubes.length; p < len2; p++) {
      tube = tubes[p];
      group.merge(tube.createTube());
    }
    bufferGeometry = new THREE.BufferGeometry().fromGeometry(group);
    mesh = new THREE.Mesh(bufferGeometry, MATERIAL);
    scene.add(mesh);
    renderPDF = function() {
      var dataURL, doc, len3, q, ref2;
      dataURL = renderer.domElement.toDataURL();
      doc = new jsPDF('p', 'mm', 'b1-poster');
      doc.addImage(dataURL, 'PNG', 8, 8, 708, 1008);
      doc.setFont("monospace", "bold");
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      s = '© Martin Dedek, Graficky design 2, FUD UJEP';
      doc.text(s, 12 + 350 - s.length, 980);
      s = new Date().toUTCString() + ' for Terry posters';
      doc.text(s, 12 + 350 - s.length, 985);
      s = strings.join('') + ' poster generated by software licensed under the MIT licence';
      doc.text(s, 12 + 350 - s.length, 995);
      s = 'dedekm.github.io/terry-poster';
      doc.text(s, 12 + 350 - s.length, 1000);
      ref2 = [
        {
          c: 255,
          w: 1.5
        }, {
          c: 0,
          w: 0.5
        }
      ];
      for (q = 0, len3 = ref2.length; q < len3; q++) {
        i = ref2[q];
        doc.setDrawColor(i.c, i.c, i.c);
        doc.setLineWidth(i.w);
        doc.line(12, 0, 12, 9);
        doc.line(0, 12, 9, 12);
        doc.line(712, 0, 712, 9);
        doc.line(715, 12, 724, 12);
        doc.line(712, 1015, 712, 1024);
        doc.line(715, 1012, 724, 1012);
        doc.line(0, 1012, 9, 1012);
        doc.line(12, 1015, 12, 1024);
      }
      return doc.save('Test.pdf');
    };
    render = function() {
      renderer.render(scene, camera);
      return appendChild();
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
