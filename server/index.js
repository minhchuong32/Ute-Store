import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan' 
import helmet from 'helmet'

const app = express()
app.use(cors({
    credentials: true,
    origin : process.env.FRONTEND_URL
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet({
    contentSecurityPolicy: false // disable content security policy
}))

const PORT = 8080 

app.get('/', (reques, response) => {
   response.json({message: 'Hello from server ' + PORT})
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
