
import express, { Request, Response } from "express"
import { commentController } from "./comment.controllers"
import auth, { UserRole } from "../../middleware/auth"


const router = express.Router()


router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentController.createComment)




export const commentRouter = router
