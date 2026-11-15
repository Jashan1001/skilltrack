"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForExecutionEngine = exports.startExecutionEngine = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const axios_1 = __importDefault(require("axios"));
const ec2 = new aws_sdk_1.default.EC2({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
// ✅ No hardcoded IP — fail fast if env var is missing
const ENGINE_URL = process.env.EXECUTION_ENGINE_URL;
if (!ENGINE_URL) {
    throw new Error("EXECUTION_ENGINE_URL environment variable is not set. " +
        "Set it to http://localhost:5001 for local dev or your EC2 URL for production.");
}
const startExecutionEngine = async () => {
    try {
        await ec2
            .startInstances({
            InstanceIds: [process.env.EC2_INSTANCE_ID],
        })
            .promise();
        console.log("EC2 start requested");
    }
    catch (error) {
        console.error("Failed to start EC2:", error);
    }
};
exports.startExecutionEngine = startExecutionEngine;
const waitForExecutionEngine = async () => {
    const MAX_RETRIES = 20;
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            await axios_1.default.get(`${ENGINE_URL}`);
            console.log("Execution engine is ready");
            return;
        }
        catch {
            console.log(`Waiting for execution engine... (${i + 1}/${MAX_RETRIES})`);
            await new Promise((r) => setTimeout(r, 3000));
        }
    }
    throw new Error("Execution engine failed to start after maximum retries");
};
exports.waitForExecutionEngine = waitForExecutionEngine;
