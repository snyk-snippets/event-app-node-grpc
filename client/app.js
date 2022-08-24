const PROTO_PATH = "../events.proto";
const fs = require('fs');
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");

let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
	keepCase: true,
	longs: String,
	enums: String,
	arrays: true
});

const credentials = grpc.credentials.createSsl(
    fs.readFileSync('../certs/ca.crt'), 
    fs.readFileSync('../certs/client.key'), 
    fs.readFileSync('../certs/client.crt')
);

const EventService = grpc.loadPackageDefinition(packageDefinition).EventService;
//establishing an insecure connection
//const client = new EventService("127.0.0.1:50051",grpc.credentials.createInsecure());
const client = new EventService("localhost:50051",credentials);
module.exports = client;
