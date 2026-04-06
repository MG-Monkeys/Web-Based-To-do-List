import dotenv from "dotenv";

// Load environment variables
dotenv.config({
  quiet: true,

  path: [".env", "../.env"],
});

// Validate required variables
const user = process.env.MONGO_USER;
if (!user) throw new Error("MONGO_USER is not defined");

const password = process.env.MONGO_PASSWORD;
if (!password) throw new Error("MONGO_PASSWORD is not defined");

const cluster = process.env.MONGO_CLUSTER;
if (!cluster) throw new Error("MONGO_CLUSTER is not defined");

export const databasename = process.env.MONGO_DATABASE;
if (!databasename) throw new Error("MONGO_DATABASE is not defined");

// Construct the MongoDB connection string
const encodedUser = encodeURIComponent(user);
const encodedPassword = encodeURIComponent(password);
const encodedDbName = encodeURIComponent(databasename);
const normalizedCluster = cluster.includes(".mongodb.net")
  ? cluster
  : `${cluster}.mongodb.net`;
const uri = `mongodb+srv://${encodedUser}:${encodedPassword}@${normalizedCluster}/${encodedDbName}?retryWrites=true&w=majority&appName=Cluster0`;


// Export the URI
export default uri;

