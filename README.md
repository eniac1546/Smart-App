## SmartThings Schema Connector with OAuth server
Introduction: 
This project focuses on setting up an OAuth server alongside a SmartThings schema server to simulate a virtual device within the Samsung SmartThings platform. The purpose of this setup is to provide a controlled environment that allows for the authentication and interaction testing of a virtual switch device without the need for physical hardware.

Project Outline:
Development Environment: Utilization of Node.js and ngrok to create and expose the necessary server environments.
OAuth Server Setup: Configuration of a mock OAuth server to handle authentication requests, facilitating a secure testing framework.
SmartThings Schema Server Configuration: Establishment of a schema server to manage and simulate device communications within SmartThings.
Integration and Testing: Demonstration of how these components integrate with the SmartThings platform to simulate the functionality of a virtual device, followed by testing to ensure operational integrity.
SmartThings Webhook Endpoint and Virtual Device Setup: Configure and integrate the SmartThings webhook endpoint and virtual device to facilitate seamless communication and control within the SmartThings ecosystem.
Adding a Virtual Switch Instance from the SmartThings Application: Add a virtual switch instance from the SmartThings application to test and interact with your virtual device setup directly from your smartphone.

This report will detail each step of the process, from initial setup to final testing, providing a comprehensive guide for replicating this virtual device simulation setup.

Detailed Setup and Configuration
> Development Environment Setup
To initiate this project, specific development tools and software were necessary to create and manage the servers for our SmartThings device simulation.
Node.js:
Usage: Serves as the primary platform for running our JavaScript-based servers.
Reason for Selection: Chosen for its efficiency and extensive support for network applications.
Installation:
Download the installer from the Node.js website.
Follow the installation prompts to complete the setup.
ngrok:
Purpose: Creates a secure tunnel to our localhost server, making it accessible over the internet. This is essential for allowing SmartThings to interact with our locally hosted servers.
Installation:
Download ngrok from ngrok's website.
Unzip the package and execute it from the command line.
To initiate a tunnel on a specific port (e.g., 8000 for the OAuth server and 3000 for the schema server), use command:ngrok http <port_number>
Environment Setup:
Utilize Node.js’s package manager, npm, to install all dependencies.
Run npm install in the root directory of each server project, which reads the package.json file and installs the necessary packages.
> OAuth Server Configuration
The OAuth server plays a critical role in securely handling authentication processes.
Clone this Github repository for the Oauth server setup “Oauth Server Setup”
Environment Variables:
Key Variables: EXPECTED_CLIENT_ID, EXPECTED_CLIENT_SECRET, AUTH_REQUEST_PATH, ACCESS_TOKEN_REQUEST_PATH, ACCESS_TOKEN_PREFIX, and PERMITTED_REDIRECT_URLS.
Purpose: These variables ensure sensitive information is securely managed and not hard-coded into the application's source code.
Configuration: Set in an .env file to control the behavior of OAuth endpoints.
Server Port:
Set the server to listen on port 8000, which is bound with ngrok for the secure tunnel application.
Endpoint Behavior:
Endpoints Configured:
/oauth/login handles initial login requests and redirects users for authentication.
/oauth/token manages requests to exchange an authorization code for an access token.
Technology Used: The server utilizes Express, a web application framework for Node.js, to define these endpoints and manage behavior.
Operation: The server listens for incoming HTTP requests and responds according to the OAuth 2.0 protocol.
Launching the Server:
Use the command node .\server.js to start the OAuth server, making it ready to handle requests.


SmartThings Schema Server Setup
The SmartThings schema server is crucial as it facilitates communication between the SmartThings platform and the virtual device by managing commands and state information.
1. Clone this Github repository for the Schema server setup “Smart things Schema”
2. Configuration:
Server Setup: The schema server is built using Node.js and the Express framework to handle HTTP requests efficiently.
Environment Variables: Important settings such as the server's port and other sensitive configurations are managed through environment variables. This helps in keeping sensitive information secure and allows for easier adjustments without code changes.
3. SmartThings Integration:
Register your schema server.
Specify the ngrok URL (e.g., https://your_ngrok_URL.ngrok.app) as the endpoint for SmartThings to send commands to your server.
4. Interaction with SmartThings API:
Using SmartThings SDK: The server utilizes the SmartThings Node.js SDK to interact directly with the SmartThings API. This setup allows for handling device command executions and reporting device states back to the SmartThings cloud efficiently.
Environment Setup:
Edit the .env_example file to update the ACCESS_TOKEN_PREFIX with the value used in your OAuth server .env to ensure consistency.
Rename .env_example to .env to activate the environment settings.
Launch the Server:
Launch the schema server by running the following command in your terminal and the project directory “node .\server.js”
This command starts the server, making it ready to receive and handle requests from SmartThings.
> SmartThings Webhook Endpoint and Virtual Device Setup
Access Samsung Developer Workspace:
Go to the Samsung Developer Workspace website.
Sign in using your email ID.
Select ‘Create a new project’ to initiate the setup process.
Configure Project Settings:
Choose ‘Device Integration’ for the type of project since you're creating a virtual device.
Select ‘SmartThings Cloud Connector’ to simulate a dummy cloud server, leveraging the OAuth server for authentication.
Project Registration:
Provide a name for your project.
Click on ‘Register App’, then select ‘Webhook Endpoint’ to define how SmartThings will communicate with your server.
Set Up Webhook Endpoint:
In the ‘Target URL’ field, input the ngrok HTTPS URL that points to your schema on port 3000: https://your_ngrok_URL.ngrok.app.
Click ‘Next’ to proceed.
OAuth Configuration:
Fill in the details for client_id, client_secret, authorization_URI, and Token URI as configured in your OAuth server .env file.
Notification Settings:
Add an email address where you wish to receive notifications related to your project.
Click ‘Next’ to continue.
App Display Configuration:
Enter a display name for your app that will appear in the SmartThings app.
Upload a device icon that should be 240x240 pixels in dimension.
Click on ‘Save’ to finalize the app creation.
Obtain Credentials:
After saving, you will be provided with SmartThings_client_id and SmartThings_client_secret. Note these down as they are crucial for building multiple properties of the virtual device.
Deployment:
Navigate to the ‘Overview’ section of your project.
Click on ‘Deploy to test’ to launch your virtual device instance for testing.













> Adding a Virtual Switch Instance from the SmartThings Application:
Open the SmartThings App:
Launch the SmartThings app on your Android device.
Navigate to Device Addition:
Tap on the ‘Devices’ tab at the bottom.
Tap the ‘+’ sign located at the top right corner.
Select ‘Add device’ from the options that appear.
Access Partner Devices:
Scroll to the ‘Partner devices’ section and tap ‘Add’.
Enable Developer Mode (if necessary):
If the ‘My Testing Devices’ option does not appear, you need to enable Developer Mode:
Go back to the home screen of the SmartThings app.
Tap on the menu icon (three horizontal lines) and select ‘Settings’.
Scroll down to find the ‘Developer Mode’ option.
Toggle the switch to enable Developer Mode.
Once enabled, return to the device addition process.
Select Your Device:
Tap on ‘My Testing Devices’.
You should see your webhook schema app or the virtual device schema listed here. Tap on it to proceed.
Authorize the Device:
You will be directed to an authorization screen.
Enter your email as the username and specify your password.
Set the token validation duration if required.
Tap on ‘Create’ to finalize the authorization.
View and Control Your Virtual Device:
Go back to the ‘Devices’ section.
You should now see your newly created virtual device listed.
Tap on the device to access its features, such as dimming the light or setting up a timer.






> Testing and Debugging
Oauth Server Console log:
Monitor the oauth server console for more details related to the HTTPS request and the token request and the state id and other parameters.

Access device details using the PAT token:
Visit this link to generate a PAT token, to access the device from console.
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" https://api.yourserver.com/devices/
