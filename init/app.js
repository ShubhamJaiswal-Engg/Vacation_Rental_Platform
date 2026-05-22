require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../model/listing.js");

const MONGO_URL = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected DB");
    // Initialize data only AFTER successful connection
    initDB();
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    try {
        // await Listing.deleteMany({});
        initData.data = initData.data.map((obj) => ({
            ...obj, 
            owner: "69f23fb4b0fe37deff48e623",
            // geometry: { type: "Point", coordinates: [ 77.2090, 28.6139 ] } // Default dummy coordinates to prevent map crash
        }));
        await Listing.insertMany(initData.data);
        console.log("Data was initialized");
    } catch (err) {
        console.error("Error initializing data:", err);
    } finally {
        mongoose.connection.close();
    }
};
