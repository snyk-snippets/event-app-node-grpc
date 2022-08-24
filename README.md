# Building Secure API with gRPC and Node and SSL/TLS

This app consists of two parts:
- Server: where gRPC serves the remote calls defined in the proto file
- Client: Express/Node Web APi for CRUD operations.

In order to run this app, follow the following steps:
# Generate SSL Certificates (certificates will be generated at ./certs)
- Open a new terminal window and execute the command below in the root directory of the application:
```
$ npm run generate:certs
```
# Start the Server
- In the in the root directory of the application run the following commands:

```
$ npm start
```

# Start the Client
- Open a new terminal window, with the previous terminal open, from the root directory of the application
naviage to the `client` folder and execute the following command:

```
$ node index
```

# Test the application
Then, go to http://localhost:50050/ and test it out.
