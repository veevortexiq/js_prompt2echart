const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Saves data to the database.
 *
 * @param {string} InputText The input text.
 * @param {string} OutputText The output text.
 * @param {number} InputTokenCount The number of input tokens.
 * @param {number} OutputTokenCount The number of output tokens.
 * @param {string} model_used The name of the model used.
 * @param {string} task_name The name of the task.
 * @param {string} status The status of the task.
 * @returns {Promise<number>} The ID of the inserted row, or null if an error occurred.
 */
async function saveDataToDB(InputText, OutputText, InputTokenCount, OutputTokenCount, model_used, task_name, status) {
    const dbHost = process.env.DB_HOST;
    const dbPort = parseInt(process.env.DB_PORT, 10); // Ensure port is a number
    const dbUser = process.env.DB_USER;
    const dbPass = process.env.DB_PASS;
    const dbName = process.env.DB_NAME;

    let connection;

    try {
        connection = await mysql.createConnection({
            host: dbHost,
            port: dbPort,
            user: dbUser,
            password: dbPass,
            database: dbName
        });

        const [result] = await connection.execute(
            'INSERT INTO echart_json_generator (input, output, input_tokens, output_tokens, model_used, task, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [InputText, OutputText, InputTokenCount, OutputTokenCount, model_used, task_name, status]
        );

        return result.insertId; // Return the ID of the inserted row
    } catch (error) {
        console.error('Error saving data to database:', error);
        return null; // Indicate an error occurred
    } finally {
        if (connection) {
            await connection.end(); // Close the connection
        }
    }
}

module.exports = saveDataToDB;