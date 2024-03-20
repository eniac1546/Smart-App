'use strict';

const { SchemaConnector, DeviceErrorTypes } = require('st-schema');
const SmartThingsAPI = require('./smartThings'); // Import the SmartThings API handler

const connector = new SchemaConnector()
    .enableEventLogging(2)
    .discoveryHandler(async (accessToken, response) => {
        // Example discovery logic; adjust according to your needs
        console.log("Discovery handler called from connector");

        // Initialize SmartThings API with dynamic accessToken for this session/user
        const smartThingsApi = new SmartThingsAPI(accessToken);

        // Example: Retrieve devices from SmartThings for the current user
        try {
            const devices = await smartThingsApi.getDevices();
            devices.forEach(device => {
                let d = response.addDevice(device.deviceId, device.name, device.deviceTypeId);
                d.manufacturerName(device.manufacturerName);
                d.modelName(device.modelName);
                // Add capabilities as required
                device.capabilities.forEach(cap => d.addCapability(cap.id, cap.version));
            });
        } catch (error) {
            console.error('Failed to retrieve devices for discovery:', error);
        }
    })
    .stateRefreshHandler(async (accessToken, response, devices) => {
        // Initialize SmartThings API with dynamic accessToken for this session/user
        const smartThingsApi = new SmartThingsAPI(accessToken);

        // Iterate over each device in the request and populate its current state
        for (const device of devices) {
            try {
                const deviceStatus = await smartThingsApi.getDeviceStatus(device.externalDeviceId);
                // Construct state data based on deviceStatus; this is an example
                const states = deviceStatus.components.main.map(state => ({
                    component: 'main', capability: state.capability, attribute: state.attribute, value: state.value
                }));
                response.addDevice(device.externalDeviceId, states);
            } catch (error) {
                console.error(`Failed to retrieve status for device ${device.externalDeviceId}:`, error);
                // You might choose to handle errors differently here
            }
        }
    })
    .commandHandler(async (accessToken, response, devices) => {
        // Initialize SmartThings API with dynamic accessToken for this session/user
        const smartThingsApi = new SmartThingsAPI(accessToken);

        for (const device of devices) {
            const deviceResponse = response.addDevice(device.externalDeviceId);
            for (const cmd of device.commands) {
                try {
                    // Execute the command using the SmartThings API
                    await smartThingsApi.executeDeviceCommand(
                        device.externalDeviceId,
                        cmd.component,
                        cmd.capability,
                        cmd.command
                    );
                    // Here, you could update the device's state in your database if necessary
                    deviceResponse.addState(cmd.component, cmd.capability, cmd.attribute, /* Expected new value here */);
                } catch (error) {
                    console.error(`Failed to execute command on device ${device.externalDeviceId}:`, error);
                    deviceResponse.setError(
                        `Failed to execute command '${cmd.command}'`,
                        DeviceErrorTypes.DEVICE_UNREACHABLE
                    );
                }
            }
        }
    });

module.exports = connector;