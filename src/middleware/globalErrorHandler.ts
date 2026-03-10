import { NextFunction, Request, Response } from "express"
import { Prisma } from "../../generated/prisma/client"

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {

  let statusCode = 500
  let errorMessage = "Internal Server Error"
  let errorDetails: any = null

  // Prisma Validation Error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400
    errorMessage = "Invalid query or incorrect fields"
    errorDetails = err.message
  }

  // Prisma Known Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {

    // Record not found
    if (err.code === "P2025") {
      statusCode = 404
      errorMessage = "Record not found"
    }

    // Unique constraint failed
    else if (err.code === "P2002") {
      statusCode = 409
      errorMessage = "Duplicate field value"
      errorDetails = err.meta
    }

    // Foreign key constraint
    else if (err.code === "P2003") {
      statusCode = 400
      errorMessage = "Invalid foreign key reference"
    }

    // Missing required value
    else if (err.code === "P2011") {
      statusCode = 400
      errorMessage = "Null constraint violation"
    }

    // Invalid data
    else if (err.code === "P2000") {
      statusCode = 400
      errorMessage = "Value too long for field"
    }

  }

  // Prisma Initialization Error
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500
    errorMessage = "Database connection failed"
  }

  // Prisma Panic Error
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500
    errorMessage = "Database engine panic"
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: process.env.NODE_ENV === "development" ? errorDetails : undefined
  })
}

export default errorHandler