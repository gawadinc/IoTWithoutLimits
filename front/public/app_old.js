// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
var scene = new THREE.Scene();

// Create a basic perspective camera
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

// Create a renderer with Antialiasing
var renderer = new THREE.WebGLRenderer({antialias:true});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize( window.innerWidth, window.innerHeight );

// Append Renderer to DOM
document.body.appendChild( renderer.domElement );

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
var cube = new THREE.Mesh( geometry, material );

var previousMousePosition = {
    x: 0,
    y: 0
};

	var deltaMove = {
        x: 0,
        y: 0
    };

	var accelX = 0;
	var accelY = 0;

	function toRadians(angle) {
	return angle * (Math.PI / 180);
}


// Loads chat messages history and listens for upcoming ones.
function loadMessages() {
  // Loads the last 12 messages and listen for new ones.
  var callback = function(snap) {
    var data = snap.val();
	
	accelX = data.accelX;
	accelY = data.accelY;
	
	deltaMove = {
        x: accelX-previousMousePosition.x,
        y: accelY-previousMousePosition.y
    };
	
	previousMousePosition = {
        x: accelX,
        y: accelY
    };

	
	console.log (' X: ' + accelX + ' Y: ' + accelY);
  }; 

  firebase.database().ref('/devices/').limitToLast(12).on('child_added', callback);
  firebase.database().ref('/devices/').limitToLast(12).on('child_changed', callback);
}

// Add cube to Scene
scene.add( cube );

// Render Loop
var render = function () {
  requestAnimationFrame( render );
  if(typeof accelX == 'undefined'){
	  
  }else{
	    var deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(
                toRadians(deltaMove.y * 1),
                toRadians(deltaMove.x * 1),
                0,
                'XYZ'
            ));
        
        cube.quaternion.multiplyQuaternions(deltaRotationQuaternion, cube.quaternion);

  }
    
  // Render the scene
  renderer.render(scene, camera);
};
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
loadMessages();
render();
update(0, totalGameTime);
