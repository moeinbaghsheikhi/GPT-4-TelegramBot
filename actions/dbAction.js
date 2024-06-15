const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'gpt',
  });
  

const registerUser = (chatId, name) => {
    connection.query(
        'INSERT INTO users SET chat_id = ? , name = ?',
        [chatId, name],
        function (err, results) {
        //   console.log(err);
        }
      );
}


module.exports = { registerUser }