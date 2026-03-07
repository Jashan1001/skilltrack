import AWS from "aws-sdk";
import axios from "axios";

const ec2 = new AWS.EC2({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const ENGINE_URL = process.env.EXECUTION_ENGINE_URL || "http://44.201.99.244:5001";

export const startExecutionEngine = async () => {
  try {
    await ec2.startInstances({
      InstanceIds: [process.env.EC2_INSTANCE_ID as string]
    }).promise();

    console.log("EC2 start requested");
  } catch (error) {
    console.error("Failed to start EC2:", error);
  }
};

export const waitForExecutionEngine = async () => {
  const MAX_RETRIES = 20;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      await axios.get(`${ENGINE_URL}`);
      console.log("Execution engine is ready");
      return;
    } catch {
      console.log("Waiting for execution engine...");
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  throw new Error("Execution engine failed to start");
};