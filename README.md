## SmartThings Schema integration with OAuth server
## Introduction
This project sets up an OAuth server and a SmartThings schema server to simulate a virtual device within the Samsung SmartThings platform. The goal is to create a controlled environment for authentication and interaction testing with a virtual switch device, eliminating the need for physical hardware.

## Project Outline
- **Development Environment**: Utilization of Node.js and ngrok to expose the necessary server environments.
- **OAuth Server Setup**: Configuration of a mock OAuth server to handle authentication requests.
- **SmartThings Schema Server Configuration**: Establishment of a schema server for device communication simulation within SmartThings.
- **Integration and Testing**: Demonstrates integration with the SmartThings platform and conducts testing to ensure operational integrity.
- **SmartThings Webhook Endpoint and Virtual Device Setup**: Configuration of the SmartThings webhook endpoint and virtual device for seamless communication.
- **Adding a Virtual Switch Instance**: Process to add a virtual switch instance from the SmartThings application to interact with the setup directly from a smartphone.

## Detailed Setup and Configuration

### Development Environment Setup
- **Node.js**: 
  - **Usage**: Serves as the primary platform for our JavaScript-based servers.
  - **Installation**: Download from the Node.js website and follow the installation prompts.

- **ngrok**: 
  - **Purpose**: Creates a secure tunnel to our localhost server, making it accessible over the internet.
  - **Installation**: Download from the ngrok website, unzip the package, and execute from the command line.

### OAuth Server Configuration
- **Repository**: Clone this "https://github.com/eniac1546/Oauth-Server" GitHub repository for OAuth server setup.
- **Environment Variables**: Set key variables like `EXPECTED_CLIENT_ID`, `EXPECTED_CLIENT_SECRET`, etc., in an `.env` file.
- **Launching the Server**: Use the command `node .\server.js` to start the OAuth server.

### SmartThings Schema Server Setup
- **Repository**: Clone this "https://github.com/eniac1546/Smartthings_Schema_Switch" GitHub repository for the schema server setup.
- **SmartThings Integration**: Register your schema server and specify the ngrok URL as the endpoint for SmartThings.
- **Launching the Server**: Launch the schema server by running `node .\server.js`.

### SmartThings Webhook Endpoint and Virtual Device Setup
- **Access Samsung Developer Workspace**: Sign in and select 'Create a new project'.
- **Configure Project Settings**: Choose ‘Device Integration’ and select ‘SmartThings Cloud Connector’.
- **Project Registration**: Provide a name and set up webhook endpoint.
- **Deployment**: Navigate to ‘Overview’ and click on ‘Deploy to test’.

### Adding a Virtual Switch Instance from the SmartThings Application
- **Open the SmartThings App**: Navigate to the ‘Devices’ tab and tap the ‘+’ sign.
- **Access Partner Devices**: Scroll to the ‘Partner devices’ section and add.
- **Enable Developer Mode**: If necessary, enable Developer Mode from the ‘Settings’.
- **Authorize the Device**: Follow authorization prompts and set up the device.

### Testing and Debugging
- **Monitor the OAuth Server Console**: Keep an eye on HTTPS requests and token requests.
- **Access device details using the PAT token**: Generate a PAT token to access the device.
