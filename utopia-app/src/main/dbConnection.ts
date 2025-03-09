import express from 'express' // Importing Express
import cors from 'cors' // Importing CORS
import { Db, MongoClient } from 'mongodb' // Importing MongoDB
import dotenv from 'dotenv'
import GETRaces from './REST-Operations/GET-Races'

dotenv.config()

const DbConnection = async () => {
  const server = express()
  const PORT = 3001

  // Middleware for CORS and JSON handling
  server.use(cors())
  server.use(express.json())

  // MongoDB connection setup
  const MONGO_URI = process.env.MONGO_URI
  if (!MONGO_URI) {
    throw new Error('The mongo uri is not defined in the .env')
  }
  // @ts-ignore
  const client = new MongoClient(MONGO_URI)

  try {
    await client.connect()
    const db: Db = client.db('Utopia')
    console.log('Connected to the DB')

    // ---- Import REST OPERATION File here ---->
    GETRaces(server, db, '/api/data')

    // ------------------------------------

    // This starts the server on the port
    server.listen(PORT, () => {
      console.log('Server running on http://localhost:3001')
    })
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}

export default DbConnection
