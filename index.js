const express = require("express");
const app = express();
const mysql=require('mysql');
const PubSub = require('@google-cloud/pubsub');

var con=mysql.createConnection({
host:"35.200.193.57",
	user:"root",
	password:"root",
	database:"testcloudsql"
});

con.connect(function(err){
	if(err) throw err;
	console.log("Connected");
	/*var sql="INSERT INTO `batch_details` (batch_id, publish_status, message_id, message) VALUES(1, 1, '9876545678', 'published message')";
	con.query(sql,function(err,result){
		if(err) throw err;
		console.log("1 Record Inserted, ID:"+result.insertId);
	});*/
});

app.get('/',(req,res)=>{
	 const pubsub = PubSub();

  // References an existing subscription, e.g. "my-subscription"
  
  const subscription = pubsub.subscription("test_sub");
  var messages = ''; 	
  var messageid='';
  // Create an event handler to handle messages
  let messageCount = 0;
  const messageHandler = (message) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    messages = message.data;
    messageid = message.id;
    console.log(`Message Id: ${message.id}`);
    console.log(`\tAttributes: ${message.attributes}`);
    var sql="INSERT INTO `batch_details` (batch_id, publish_status, message_id, message) VALUES(1, 1, '9876545678', '"+message.data+"')";
	con.query(sql,function(err,result){
		if(err) throw err;
		console.log("1 Record Inserted, ID:"+result.insertId);
		messageCount += 1;
	});
    // "Ack" (acknowledge receipt of) the message
   // message.ack();
  };

  // Listen for new messages until timeout is hit
  subscription.on(`message`, messageHandler);
  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received.`);
    //res.send(messages);
  }, 5 * 1000);
});

app.listen("8080",function(err){
	if(err){throw err;}
	console.log("server is running. Port 8080");
})