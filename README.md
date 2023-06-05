# kinsend-sqs-consumer

`kinsend-sqs-consumer` is a microservice built using NestJS, that listens to an Amazon SQS queue and outputs messages to the console.

## Installation

Before running the application, ensure that Node.js and NPM are installed on your system. Then follow these steps:

1. Clone the repository from GitHub:

```
git clone https://github.com/mak-zenkoders/kinsend-sqs-consumer.git
```

2. Navigate to the cloned directory:

```
cd kinsend-sqs-consumer
```

3. Install the required dependencies:

```
npm install
```

## Running the Application

To run the application, use the following command:

```
npm run start:dev
```

This will start the application in development mode and listen for incoming SQS messages.

## How to Use

As a microservice, `kinsend-sqs-consumer` does not require a client app to connect to it. Instead, it will directly listen to the specified SQS queue for incoming messages. 

When a message is received, the microservice will translate the message and will send an email to all the subscribers.

## Note

Please ensure that the necessary AWS credentials are configured in your environment through environment variables.
