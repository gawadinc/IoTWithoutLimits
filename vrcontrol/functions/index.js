const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// //exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin');
//const cors = require('cors')({ origin: true });
admin.initializeApp(functions.config().firebase);

const db = admin.database();

/**
 * Receive data from pubsub, then 
 * Write telemetry raw data to bigquery
 * Maintain last data on firebase realtime database
 */
exports.nunchuk = functions.pubsub
  .topic('nunchuk')
  .onPublish(event => {
	const name = Buffer.from(event.data, 'base64').toString();
	var message = null;
	try {
		message = JSON.parse(name);
	} catch (e) {
		console.error('PubSub message was not JSON', e);
	}

    return Promise.all([
      updateCurrentDataFirebase(message)
    ]);
  });

/** 
 * Maintain last status in firebase
*/
function updateCurrentDataFirebase(message) {
	 var d = new Date();
 var timeInMillis = d.getTime();
return db.ref(`/devices/${timeInMillis}`).set({
	accelX: message.accelX,
    accelY: message.accelY,
	accelZ: message.accelZ
  });
}