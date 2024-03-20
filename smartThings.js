const axios = require('axios');

const SMARTTHINGS_API_URL = 'https://api.smartthings.com';

class SmartThingsAPI {
    constructor(accessToken) {
        this.accessToken = accessToken;
    }

    async axiosRequest(config) {
        try {
            const response = await axios({
                ...config,
                headers: {
                    ...config.headers,
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('SmartThings API request failed:', error.response ? error.response.data : error.message);
            throw error;
        }
    }

    // Get a list of all devices accessible by this token
    async getDevices() {
        return this.axiosRequest({
            method: 'get',
            url: `${SMARTTHINGS_API_URL}/v1/devices`
        }).then(data => data.items);
    }

    // Get the current status of a specific device
    async getDeviceStatus(deviceId) {
        return this.axiosRequest({
            method: 'get',
            url: `${SMARTTHINGS_API_URL}/v1/devices/${deviceId}/status`
        });
    }

    // Execute a command on a specific device
    async executeDeviceCommand(deviceId, componentId, capability, command) {
        return this.axiosRequest({
            method: 'post',
            url: `${SMARTTHINGS_API_URL}/v1/devices/${deviceId}/commands`,
            data: {
                commands: [{ component: componentId, capability: capability, command: command }]
            }
        });
    }

    // List all Schema Apps associated with this token
    async listSchemaApps() {
        return this.axiosRequest({
            method: 'get',
            url: `${SMARTTHINGS_API_URL}/v1/schema/apps`
        });
    }

    // Get details for a specific Schema App
    async getSchemaApp(appId) {
        return this.axiosRequest({
            method: 'get',
            url: `${SMARTTHINGS_API_URL}/v1/schema/apps/${appId}`
        });
    }

    // Send an event to a specific device under a Schema App
    async sendDeviceEvent(appId, deviceId, componentId, capability, value) {
        return this.axiosRequest({
            method: 'post',
            url: `${SMARTTHINGS_API_URL}/v1/schema/apps/${appId}/devices/${deviceId}/events`,
            data: {
                events: [{ component: componentId, capability: capability, value: value }]
            }
        });
    }
}

module.exports = SmartThingsAPI;
