const { MongoClient } = require('mongodb');

let cachedDb = null;

const handler = async (event, context) => {
    try {
        console.log('calling connectToDatabase');
        if (cachedDb) {
            return Promise.resolve(cachedDb);
        }

        const db = await MongoClient.connect(
            process.env.DB_Connection_String,
            { tls: true, tlsCAFile: 'global-bundle.pem'  }
        );

        cachedDb = db;
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'Successfully connected to the database' })
        };
    } catch (error) {
        console.error('Error connecting to the database:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
};

module.exports = { handler };
