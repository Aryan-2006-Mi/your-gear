const { connectMongoDB, getMongoDB } = require("./config/mongo");

const products = [
    {
        name: "YONEX GR 303i Black, Red Strung Badminton Racquet",
        brand: "Yonex",
        sport: "Badminton",
        category: "Racket",

        price: 912,
        currency: "INR",

        retailer: "Flipkart",

        productUrl:
            "https://www.flipkart.com/yonex-gr-303i-black-strung-badminton-racquet/p/itmf4dfb09fb489e",

        image: "",

        rating: 4.2,
        reviewCount: 19097,

        features: {
            weight: "83g",
            balance: "Even Balance",
            flexibility: "Medium",
            playingStyle: "All Round"
        },

        availability: "In Stock",

        lastUpdated: new Date()
    },

    {
        name: "YONEX Power Cushion 65 R 3 Badminton Shoes For Men",
        brand: "Yonex",
        sport: "Badminton",
        category: "Shoes",

        price: 3227,
        currency: "INR",

        retailer: "Flipkart",

        productUrl:
            "https://www.flipkart.com/yonex-power-cushion-65-r-3-badminton-shoes-men/p/itmd310e86e6033f",

        image: "",

        rating: 3.8,
        reviewCount: 272,

        features: {
            shoeType: "Cushioned",
            soleType: "Non-Marking",
            surface: "Indoor Court"
        },

        availability: "In Stock",

        lastUpdated: new Date()
    }
];

async function seedProducts() {
    try {
        await connectMongoDB();

        const db = getMongoDB();

        await db.collection("products").deleteMany({
            sport: "Badminton"
        });

        const result = await db.collection("products").insertMany(products);

        console.log(
            `Inserted ${result.insertedCount} real Flipkart products successfully!`
        );

        process.exit(0);
    } catch (error) {
        console.error("Error seeding products:", error);
        process.exit(1);
    }
}

seedProducts();