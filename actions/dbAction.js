const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'gpt',
  });
  

const registerUser = (chatId, name) => {
    connection.query('SELECT * FROM users WHERE chat_id = ?' , [chatId], function(err, results){
        if(!results.length) connection.query('INSERT INTO users SET chat_id = ? , name = ?',[chatId, name]);
    })
}

const incrRequestFree = (chatId) => {
    connection.query('SELECT * FROM users WHERE chat_id = ?' , [chatId], function(err, results){
        if(results.length){
            const user = results[0]

            connection.query('UPDATE users SET request_free = ? WHERE chat_id = ?',[(user.request_free + 1) ,chatId]);
        }
    })
}


module.exports = { registerUser , incrRequestFree}