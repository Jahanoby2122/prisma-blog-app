
import express, { Request, Response } from "express"
import { commentController } from "./comment.controllers"
import auth, { UserRole } from "../../middleware/auth"


const router = express.Router()

router.get("/author/:AuthorId", commentController.getCommentByAuthorId)
router.get("/:commentId", commentController.getCommentById)
router.delete("/:commentId", auth(UserRole.USER, UserRole.ADMIN), commentController.deleteComment)
router.patch("/:commentId", auth(UserRole.USER, UserRole.ADMIN), commentController.updateComment)
router.patch("/:commentId/moderate", auth(UserRole.ADMIN), commentController.moderateComment)



router.post("/", auth(UserRole.USER, UserRole.ADMIN), commentController.createComment)




export const commentRouter = router