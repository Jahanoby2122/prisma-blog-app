import express from "express"
import { postController } from "./post.controller"
import auth, { UserRole } from "../../middleware/auth"

const router = express.Router()

router.get("/", postController.getAllPosts)
router.get("/stats", auth(UserRole.ADMIN), postController.getStats)

router.get("/my-posts", auth(UserRole.USER, UserRole.ADMIN), postController.getMyPosts)

router.get("/:postId", postController.getPostById)

router.post("/", auth(UserRole.USER), postController.createPost)

router.patch(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.updatePost
)

router.delete(
  "/:postId",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.deletePost
)

export const postRouter = router