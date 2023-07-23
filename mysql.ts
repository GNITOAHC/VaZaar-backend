import mysql from 'mysql2'

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'vazaar',
  password: process.env.DB_PASSWORD
})
connection.connect((err) => {
  if (err) throw err
  console.log('Connected!')
})

export default connection
