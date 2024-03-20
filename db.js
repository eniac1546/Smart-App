'use strict';
const fs = require('fs').promises; // Use fs.promises for asynchronous operations
const path = require('path');

const filename = path.join(__dirname, 'data.json'); // Ensure the path is correctly resolved
const initialStates = {
    'external-device-1': {
        main: {
            switch: 'off'
        }
    }
};

let deviceStates = {};

// Asynchronously read states from file
async function readStates() {
    try {
        const data = await fs.readFile(filename, 'utf8');
        deviceStates = { ...initialStates, ...JSON.parse(data) };
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File does not exist, initialize deviceStates with initialStates
            console.log('No existing state file found. Initializing with default states.');
            deviceStates = initialStates;
        } else {
            // Log and rethrow any other error to be handled by the caller
            console.error('Failed to read device states:', error);
            throw error;
        }
    }
}

// Asynchronously save states to file
async function saveStates() {
    try {
        await fs.writeFile(filename, JSON.stringify(deviceStates, null, 2), 'utf8');
    } catch (error) {
        console.error('Failed to save device states:', error);
        throw error;
    }
}

// Exported functions
module.exports = {
    async getState(externalId) {
        await readStates(); // Ensure the latest state is read before returning it
        return deviceStates[externalId];
    },

    async getAttribute(externalId, component, attribute) {
        await readStates();
        return deviceStates[externalId]?.[component]?.[attribute];
    },

    async setAttribute(externalId, component, attribute, data) {
        await readStates(); // Ensure we have the latest states
        if (!deviceStates[externalId]) {
            deviceStates[externalId] = { [component]: { [attribute]: data } };
        } else if (!deviceStates[externalId][component]) {
            deviceStates[externalId][component] = { [attribute]: data };
        } else {
            deviceStates[externalId][component][attribute] = data;
        }
        await saveStates();
    },
};
