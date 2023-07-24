import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import connection from '../mysql'
import { QueryError } from 'mysql2'

const MAIL_HOST = process.env.EMAIL_HOST
const MAIL_USER = process.env.EMAIL_USER
const MAIL_PASS = process.env.EMAIL_PASS

export async function hashPassword(password: string): Promise<string> {
  const saltRound = 10
  const hashedPassword = await bcrypt.hash(password, saltRound)
  return hashedPassword
}

async function simpleQuery(query: string): Promise<null> {
  return new Promise((resolve, reject) => {
    connection.query(query, async (err, _results, _fields) => {
      if (err) return reject(err)
      return resolve(null)
    })
  })
}

export async function sendMail(email: string, content: string): Promise<void> {
  const config = {
    service: MAIL_HOST,
    port: 465,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  }
  const transporter = nodemailer.createTransport(config)
  const options = () => {
    return {
      from: 'virtualbazaar.22.08@gmail.com',
      to: email,
      subject: 'Hello ✔',
      html: `<p>${content}</p>`,
    }
  }
  transporter.sendMail(options(), (error, _info) => {
    if (error) {
      console.log(error)
    } else {
      /* console.log(info) */
      /* console.log('Email sent: ' + info.response) */
    }
  })

  return
}

async function clearExpiredResetToken() {
  const query = `delete from User_Reset_password where User_Reset_password.Expiration_Date < NOW()`
  connection.query(query, (err, _results, _fields) => {
    if (err) return err
  })
  return
}

export async function resetPassword(
  email: string,
  token: string,
  password: string
): Promise<QueryError | string | null> {
  /* First, clear all the expired tokens */
  await clearExpiredResetToken()
  /* Check if the token is valid */
  const query = `select * from User_Reset_password where User_Mail = "${email}"`
  return new Promise((resolve, reject) => {
    connection.query(query, async (err, results, _fields) => {
      if (err) reject(err)
      const result = results as Array<any>
      if (result.length === 0) return resolve('No such user')
      const isValid = await bcrypt.compare(token, result[0].Token)
      if (!isValid) {
        return resolve('Invalid token')
      } else {
        const hashedPassword: string = await hashPassword(password)
        /* simpleQuery(query: string): Promise<null> // Will reject if query not vaild */
        /* Update password */
        await simpleQuery(
          `update User set User.Password = "${hashedPassword}" where User.Mail = "${email}"`
        )
        /* Delete used token */
        await simpleQuery(
          `delete from User_Reset_password where User_Reset_password.User_Mail = "${email}"`
        )

        await sendMail(email, 'Your password has been changed successfully')
        return resolve(
          'Password changed successfully, you can now login with your new password'
        )
      }
    })
  })
}
