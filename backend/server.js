const express = require("express");
const cors = require("cors");
require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("./config/db");

const {
    connectMongoDB,
    getMongoDB
} = require("./config/mongo");

const jwt = require("jsonwebtoken");

const app = express();


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());


// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication required."
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token."
        });

    }
}


// ========================================
// HOME / TEST BACKEND
// ========================================

app.get("/", (req, res) => {

    res.json({
        message: "Your Gear Backend is running!"
    });

});


// ========================================
// TEST MYSQL CONNECTION
// ========================================

app.get("/api/test-db", async (req, res) => {

    try {

        const [result] = await db.execute(
            "SELECT 1 AS result"
        );

        res.json({
            message: "MySQL connected successfully!",
            result: result
        });

    } catch (error) {

        console.error(
            "Database test error:",
            error
        );

        res.status(500).json({
            message: "MySQL connection failed.",
            error: error.message
        });

    }

});


// ========================================
// TEST MONGODB CONNECTION
// ========================================

app.get("/api/test-mongo", async (req, res) => {

    try {

        const mongo = getMongoDB();

        await mongo.command({
            ping: 1
        });

        res.json({
            message: "MongoDB connected successfully!"
        });

    } catch (error) {

        console.error(
            "MongoDB test error:",
            error
        );

        res.status(500).json({
            message: "MongoDB connection failed.",
            error: error.message
        });

    }

});


// ========================================
// GET PRODUCTS FROM MONGODB
// ========================================

app.get("/api/products", async (req, res) => {

    try {

        const mongo = getMongoDB();

        const {
            sport,
            category
        } = req.query;

        const filter = {};

        // Filter by sport if provided
        if (sport) {
            filter.sport = sport;
        }

        // Filter by category if provided
        if (category) {
            filter.category = category;
        }

        const products = await mongo
            .collection("products")
            .find(filter)
            .toArray();

        res.json(products);

    } catch (error) {

        console.error(
            "Error fetching products:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch products.",
            error: error.message
        });

    }

});


// ========================================
// ADD PRODUCT TO MONGODB
// ========================================

app.post("/api/products", async (req, res) => {

    try {

        const mongo = getMongoDB();

        const {
            name,
            sport,
            category,
            price,
            image,
            features
        } = req.body;


        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (
            !name ||
            !sport ||
            !category ||
            price === undefined
        ) {

            return res.status(400).json({
                message:
                    "name, sport, category and price are required."
            });

        }


        // -------------------------------
        // PRODUCT OBJECT
        // -------------------------------

        const product = {

            name: name,

            sport: sport,

            category: category,

            price: price,

            image: image || "",

            features: features || {},

            createdAt: new Date(),

            updatedAt: new Date()

        };


        // -------------------------------
        // INSERT INTO MONGODB
        // -------------------------------

        const result = await mongo
            .collection("products")
            .insertOne(product);


        // -------------------------------
        // RESPONSE
        // -------------------------------

        res.status(201).json({

            message: "Product added successfully!",

            product: {
                _id: result.insertedId,
                ...product
            }

        });

    } catch (error) {

        console.error(
            "Error adding product:",
            error
        );

        res.status(500).json({

            message: "Failed to add product.",

            error: error.message

        });

    }

});


// ========================================
// CREATE USER / CREATE GEAR ID
// ========================================

app.post("/api/users", async (req, res) => {

    try {

        // ----------------------------------------
        // GET DATA FROM REACT
        // ----------------------------------------

        const {
            gear_id,
            name,
            email,
            password,
            phone
        } = req.body;


        // ----------------------------------------
        // VALIDATION
        // ----------------------------------------

        if (!gear_id || !name || !password) {

            return res.status(400).json({
                message:
                    "Gear ID, name and password are required."
            });

        }


        // ----------------------------------------
        // PASSWORD LENGTH
        // ----------------------------------------

        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Password must be at least 6 characters."
            });

        }


        // ----------------------------------------
        // CHECK GEAR ID
        // ----------------------------------------

        const [existingUser] = await db.execute(
            "SELECT user_id FROM users WHERE gear_id = ?",
            [gear_id]
        );


        if (existingUser.length > 0) {

            return res.status(409).json({
                message:
                    "This GearID is already taken."
            });

        }


        // ----------------------------------------
        // CHECK EMAIL
        // ----------------------------------------

        if (email) {

            const [existingEmail] = await db.execute(
                "SELECT user_id FROM users WHERE email = ?",
                [email]
            );


            if (existingEmail.length > 0) {

                return res.status(409).json({
                    message:
                        "This email is already registered."
                });

            }

        }


        // ----------------------------------------
        // HASH PASSWORD
        // ----------------------------------------

        const passwordHash =
            await bcrypt.hash(password, 10);


        // ----------------------------------------
        // INSERT USER INTO MYSQL
        // ----------------------------------------

        const [result] = await db.execute(

            `INSERT INTO users
            (gear_id, name, email, password_hash, phone)
            VALUES (?, ?, ?, ?, ?)`,

            [
                gear_id,
                name,
                email || null,
                passwordHash,
                phone || null
            ]

        );


        // ----------------------------------------
        // CREATE USER OBJECT
        // ----------------------------------------

        const user = {

            user_id: result.insertId,

            gear_id: gear_id,

            name: name,

            email: email || null,

            role: "user"

        };


        // ----------------------------------------
        // CREATE JWT
        // ----------------------------------------

        const token = jwt.sign(

            {
                user_id: user.user_id,

                gear_id: user.gear_id,

                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        // ----------------------------------------
        // SUCCESS RESPONSE
        // ----------------------------------------

        res.status(201).json({

            message:
                "Gear ID created successfully!",

            token: token,

            user: user

        });


    } catch (error) {

        console.error(
            "Create user error:",
            error
        );

        res.status(500).json({

            message:
                "Server error while creating user.",

            error: error.message

        });

    }

});


// ========================================
// CHECK GEAR ID AVAILABILITY
// ========================================

app.get(
    "/api/users/check-gearid",
    async (req, res) => {

        try {

            const { gear_id } = req.query;


            if (
                !gear_id ||
                gear_id.trim() === ""
            ) {

                return res.json({

                    available: false,

                    message: ""

                });

            }


            const [rows] = await db.execute(

                "SELECT user_id FROM users WHERE gear_id = ? LIMIT 1",

                [gear_id.trim()]

            );


            if (rows.length > 0) {

                return res.json({

                    available: false,

                    message:
                        "GearID is already taken."

                });

            }


            return res.json({

                available: true,

                message:
                    "GearID is available!"

            });


        } catch (error) {

            console.error(
                "GearID check error:",
                error
            );

            res.status(500).json({

                available: false,

                message:
                    "Unable to check GearID."

            });

        }

    }
);


// ========================================
// LOGIN
// ========================================

app.post("/api/login", async (req, res) => {

    try {

        const {
            gear_id,
            password
        } = req.body;


        // ----------------------------------------
        // VALIDATION
        // ----------------------------------------

        if (!gear_id || !password) {

            return res.status(400).json({

                message:
                    "GearID and password are required."

            });

        }


        // ----------------------------------------
        // FIND USER
        // ----------------------------------------

        const [users] = await db.execute(

            `SELECT
                user_id,
                gear_id,
                name,
                email,
                password_hash,
                role
             FROM users
             WHERE gear_id = ?`,

            [gear_id]

        );


        if (users.length === 0) {

            return res.status(401).json({

                message:
                    "Invalid GearID or password."

            });

        }


        const user = users[0];


        // ----------------------------------------
        // CHECK PASSWORD
        // ----------------------------------------

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );


        if (!passwordMatch) {

            return res.status(401).json({

                message:
                    "Invalid GearID or password."

            });

        }


        // ----------------------------------------
        // CREATE JWT
        // ----------------------------------------

        const token = jwt.sign(

            {
                user_id: user.user_id,

                gear_id: user.gear_id,

                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        // ----------------------------------------
        // SUCCESS
        // ----------------------------------------

        res.status(200).json({

            message:
                "Login successful!",

            token: token,

            user: {

                user_id: user.user_id,

                gear_id: user.gear_id,

                name: user.name,

                email: user.email,

                role: user.role

            }

        });


    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({

            message:
                "Server error during login."

        });

    }

});


// ========================================
// GET USER SPORT PREFERENCE
// ========================================

app.get(
    "/api/preferences/:sport",
    authenticateToken,
    async (req, res) => {

        try {

            const mongo = getMongoDB();

            const sport = req.params.sport;

            const userId = req.user.user_id;


            // ----------------------------------------
            // FIND PREFERENCE
            // ----------------------------------------

            const preference = await mongo
                .collection("sport_preferences")
                .findOne({

                    userId: userId,

                    sport: sport

                });


            // ----------------------------------------
            // FIRST TIME USING SPORT
            // ----------------------------------------

            if (!preference) {

                return res.json({

                    exists: false,

                    needsItemsQuestionnaire: true,

                    preference: null

                });

            }


            // ----------------------------------------
            // CHECK WHETHER Q1 IS STALE
            // ----------------------------------------

            const STALE_DAYS = 90;


            const staleLimit = new Date(

                Date.now() -
                STALE_DAYS *
                24 *
                60 *
                60 *
                1000

            );


            const lastItemsDate =

                preference.lastItemsQuestionnaireAt

                    ? new Date(
                        preference.lastItemsQuestionnaireAt
                    )

                    : null;


            const needsItemsQuestionnaire =

                !lastItemsDate ||
                lastItemsDate < staleLimit;


            // ----------------------------------------
            // RESPONSE
            // ----------------------------------------

            res.json({

                exists: true,

                needsItemsQuestionnaire:
                    needsItemsQuestionnaire,

                preference: preference

            });


        } catch (error) {

            console.error(
                "Preference fetch error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to fetch sport preferences."

            });

        }

    }
);


// ========================================
// SAVE / UPDATE USER SPORT PREFERENCE
// ========================================

app.put(
    "/api/preferences/:sport",
    authenticateToken,
    async (req, res) => {

        try {

            const mongo = getMongoDB();

            const sport = req.params.sport;

            const userId = req.user.user_id;


            const {
                interestedItems,
                interestLevel,
                playingFrequency,
                currentLevel
            } = req.body;


            // ----------------------------------------
            // DATA TO UPDATE
            // ----------------------------------------

            const updateData = {

                userId: userId,

                sport: sport,

                updatedAt: new Date()

            };


            // ----------------------------------------
            // Q1
            // ----------------------------------------

            if (
                Array.isArray(interestedItems)
            ) {

                updateData.interestedItems =
                    interestedItems;

                updateData.lastItemsQuestionnaireAt =
                    new Date();

            }


            // ----------------------------------------
            // Q2
            // ----------------------------------------

            if (
                interestLevel !== undefined
            ) {

                updateData.interestLevel =
                    interestLevel;

            }


            // ----------------------------------------
            // Q3
            // ----------------------------------------

            if (
                playingFrequency !== undefined
            ) {

                updateData.playingFrequency =
                    playingFrequency;

            }


            // ----------------------------------------
            // Q4
            // ----------------------------------------

            if (
                currentLevel !== undefined
            ) {

                updateData.currentLevel =
                    currentLevel;

            }


            // ----------------------------------------
            // SAVE TO MONGODB
            // ----------------------------------------

            await mongo
                .collection("sport_preferences")
                .updateOne(

                    {
                        userId: userId,

                        sport: sport
                    },

                    {
                        $set: updateData,

                        $setOnInsert: {

                            createdAt: new Date()

                        }

                    },

                    {
                        upsert: true

                    }

                );


            // ----------------------------------------
            // GET SAVED DATA
            // ----------------------------------------

            const savedPreference =
                await mongo
                    .collection("sport_preferences")
                    .findOne({

                        userId: userId,

                        sport: sport

                    });


            // ----------------------------------------
            // RESPONSE
            // ----------------------------------------

            res.json({

                message:
                    "Sport preferences saved successfully.",

                preference:
                    savedPreference

            });


        } catch (error) {

            console.error(
                "Preference save error:",
                error
            );

            res.status(500).json({

                message:
                    "Failed to save sport preferences."

            });

        }

    }
);


// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 5000;


async function startServer() {

    try {

        await connectMongoDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Backend server running on port ${PORT}`);
        });

    } catch (error) {

        console.error(
            "Failed to start server:",
            error
        );

        process.exit(1);

    }

}


startServer();