import express from 'express'
import connection from '../mysql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET as string
if (!JWT_SECRET || JWT_SECRET === '') {
  throw new Error('JWT_SECRET is not defined')
}

router.use((_req, _res, next) => {
  console.log('Auth request')
  next()
})

async function hashPassword(password: string): Promise<string> {
  const saltRound = 10
  const hashedPassword = await bcrypt.hash(password, saltRound)
  return hashedPassword
}

router.post('/register', async (req, res) => {
  const query = `select * from User where User.Mail = "${req.body.Mail}"`
  /* const emailExist = await connection */
  connection.query(query, async (err, results, _fields) => {
    if (err) {
      return res.status(500).send({ message: 'Internal Server Error' })
    }
    const result = results as Array<any>
    console.log(result)
    if (result.length > 0) {
      return res.status(401).send({ message: 'Email already exists' })
    } else {
      /* User = {
       *  Mail: varchar(30),
       *  Id: int,
       *  Sex: string(4),
       *  Name: varchar(20),
       *  Password: varchar(20),
       *  Nick_name: varchar(20),
       *  Model_id: int
       * }
       */
      const hashedPassword = await hashPassword(req.body.Password)
      const registerUser = `
        insert into User (Mail, Id, Sex, Name, Password, Nick_name, Model_id)
        values ("${req.body.Mail}", ${req.body.Id}, "${req.body.Sex}", "${req.body.Name}", "${hashedPassword}", "${req.body.Nick_name}", ${req.body.Model_id});
      `
      connection.query(registerUser, (err, result, _fields) => {
        if (err) {
          /* return res.send(err) */
          console.log(err)
          return res.status(500).send({ message: 'Internal server error' })
        }
        console.log(result)
        return res.status(200).send({ message: 'Register success' })
      })
    }
  })
})

router.post('/login', async (req, res) => {
  const query = `select * from User where User.Mail = "${req.body.Mail}"`
  connection.query(query, async (err, results, _fields) => {
    if (err) {
      console.log(err)
      return res.status(500).send({ message: 'Internal server error' })
    }
    const result = results as Array<any>
    if (result.length === 0) {
      /* User not exists */
      return res.status(401).send({ message: 'Email not exists' })
    } else {
      console.log(result[0])
      const validPassword = await bcrypt.compare(
        req.body.Password,
        result[0].Password
      )
      /* const validPassword = 'test' */
      if (!validPassword) {
        return res.status(401).send({ message: 'Password not match' })
      } else {
        const jwt_token = jwt.sign({ Mail: req.body.Mail }, JWT_SECRET, {
          expiresIn: '180d',
        })
        return res.status(200).send({
          message: 'Login success',
          Mail: req.body.Mail,
          jwt_token: jwt_token,
        })
      }
    }
  })
})

router.get('/verify', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).send({ message: 'Access denied' })
  try {
    jwt.verify(token, JWT_SECRET, (err, _decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          console.log('Token expired')
          return res.status(401).send({ message: 'Token expired' })
        } else {
          return res.status(400).send({ verified: false })
        }
      }
      return res.status(200).send({ verified: true })
    })
  } catch (err) {
    return res.status(400).send({ verified: false })
  }
})

export default router
