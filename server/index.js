const PROTO_PATH = "./events.proto";
const fs = require('fs');

let grpc = require("@grpc/grpc-js");
let protoLoader = require("@grpc/proto-loader");

let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	arrays: true
});

let eventsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

let credentials = grpc.ServerCredentials.createSsl(
	fs.readFileSync('./certs/ca.crt'), [{
		cert_chain: fs.readFileSync('./certs/server.crt'),
		private_key: fs.readFileSync('./certs/server.key')
	}], true);

const { randomUUID } = require("node:crypto");
const events = [
	{
		id: "34415c7c-f82d-4e44-88ca-ae2a1aaa92b7",
		name: "Vitalis's Birthday Party",
		description: "Vitalis's 27th Birthday in Paris",
		location: "Paris France",
		duration: "All Day",
		lucky_number: 27,
		status: "Pending"
	},
];

server.addService(eventsProto.EventService.service, {

	getAllEvents: (_, callback) => {
		callback(null, { events });
	},

	getEvent: (call, callback) => {
		let event = events.find(n => n.id == call.request.id);

		if (event) {
			callback(null, event);
		} else {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Event Not found"
			});
		}
	},

	createEvent: (call, callback) => {
		let event = call.request;

		event.id = randomUUID();
		events.push(event);
		callback(null, event);
	},

	updateEvent: (call, callback) => {
		let existingEvent = events.find(n => n.id == call.request.id);

		if (existingEvent) {
			existingEvent.name = call.request.name;
			existingEvent.description = call.request.description;
			existingEvent.location = call.request.location;
			existingEvent.duration = call.request.duration;
			existingEvent.lucky_number = call.request.lucky_number;
			existingEvent.status = call.request.status;
			callback(null, existingEvent);
		} else {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Event Not found"
			});
		}
	},

	deleteEvent: (call, callback) => {
		let existingEventIndex = events.findIndex(
			n => n.id == call.request.id
		);

		if (existingEventIndex != -1) {
			events.splice(existingEventIndex, 1);
			callback(null, {});
		} else {
			callback({
				code: grpc.status.NOT_FOUND,
				details: "Event Not found"
			});
		}
	}
});

//creating insecure connection without encryption
// server.bindAsync("127.0.0.1:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
// 	console.log(`Server listening at http://127.0.0.1:${port}`);
// 	server.start();
// });
server.bindAsync("0.0.0.0:50051", credentials, (error, port) => {
	console.log(`Server listening at http://0.0.0.0:${port}`);
	server.start();
});
