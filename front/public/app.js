var three = THREE;

var scene = new three.Scene();
var camera = new three.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);



var geometry = new three.BoxGeometry(1, 1, 1);
//var material = new three.MeshNormalMaterial();
/* * /
var material = new three.MeshBasicMaterial({
    color: 0x00ff00
});
/* */
/* */
three.ImageUtils.crossOrigin = '';
var texture = three.ImageUtils.loadTexture('http://i.imgur.com/CEGihbB.gif');
texture.anisotropy = renderer.getMaxAnisotropy();

var material = new three.MeshFaceMaterial([
    new three.MeshBasicMaterial({
        color: 0x00ff00
    }),
    new three.MeshBasicMaterial({
        color: 0xff0000
    }),
    new three.MeshBasicMaterial({
        //color: 0x0000ff,
        map: texture
    }),
    new three.MeshBasicMaterial({
        color: 0xffff00
    }),
    new three.MeshBasicMaterial({
        color: 0x00ffff
    }),
    new three.MeshBasicMaterial({
        color: 0xff00ff
    })
]);
/* */

var cube = new three.Mesh(geometry, material);
cube.rotation.x = Math.PI/4;
cube.rotation.y = Math.PI/4;
scene.add(cube);


camera.position.z = 5;

/* */
var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};
// Loads chat messages history and listens for upcoming ones.
function loadMessages() {
  // Loads the last 12 messages and listen for new ones.
  var callback = function(snap) {
    var data = snap.val();
	
	accelX = data.accelX;
	accelY = data.accelY;

	 var deltaMove = {
        x: accelX-previousMousePosition.x,
        y: accelY-previousMousePosition.y
    };

            
        var deltaRotationQuaternion = new three.Quaternion()
            .setFromEuler(new three.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));
        
        cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);
    
    
    previousMousePosition = {
        x: accelX,
        y: accelY
    };
	
	
	console.log (' X: ' + accelX + ' Y: ' + accelY);
  }; 

  firebase.database().ref('/devices/').limitToLast(12).on('child_added', callback);
  firebase.database().ref('/devices/').limitToLast(12).on('child_changed', callback);
}


// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var lastFrameTime = new Date().getTime() / 1000;
var totalGameTime = 0;
function update(dt, t) {
    //console.log(dt, t);
    
    //camera.position.z += 1 * dt;
    //cube.rotation.x += 1 * dt;
    //cube.rotation.y += 1 * dt;
    
    setTimeout(function() {
        var currTime = new Date().getTime() / 1000;
        var dt = currTime - (lastFrameTime || currTime);
        totalGameTime += dt;
        
        update(dt, totalGameTime);
    
        lastFrameTime = currTime;
    }, 0);
}


function render() {
    renderer.render(scene, camera);
    
    
    requestAnimFrame(render);
}
loadMessages();
render();
update(0, totalGameTime);


function toRadians(angle) {
	return angle * (Math.PI / 180);
}

function toDegrees(angle) {
	return angle * (180 / Math.PI);
}

