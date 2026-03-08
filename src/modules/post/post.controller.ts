import { Request, Response } from 'express';
import { postService } from './post.services';
import { Post, PostStatus } from '../../../generated/prisma/client';
import pagenationShortingHelpers from '../../helpers/paganationShortingHelpers';
import { UserRole } from '../../middleware/auth';

const createPost = async (req:Request, res:Response) => {
   
    try{

        
        if(!req.user){
            return res.status(401).json({message: "Unauthorized"})
        }

        console.log(req.user)
        

        const result = await postService.createPost(req.body , req.user.id)
        res.status(201).json(result)

    }catch (error){
        console.error("Error creating post:", error)
    }
};


const getAllPosts = async (req: Request, res: Response) => {
    try {
        const { search } = req.query
        const searchString = typeof search === 'string' ? search : undefined

        const tags = req.query.tags ? (req.query.tags as string).split(",") : [];


        // true or false
        const isFeatured = req.query.isFeatured
            ? req.query.isFeatured === 'true'
                ? true
                : req.query.isFeatured === 'false'
                    ? false
                    : undefined
            : undefined

        const status = req.query.status as PostStatus | undefined

        const authorId = req.query.authorId as string | undefined



        const { page, limit, sortBy, sortOrder, skip } = pagenationShortingHelpers(req.query as any)

        console.log("myoptions", { page, limit, sortBy, sortOrder, skip })

        const result = await postService.getAllPosts({ search: searchString, tags, isFeatured, status, authorId, page , limit  , sortBy , sortOrder, skip })
        res.status(200).json(result)
    } catch (e) {
        res.status(400).json({
            error: "Post fetching failed",
            details: e
        })
    }
}

const getPostById = async(req: Request, res: Response)=>{
    try{
        const { postid } = req.params
        if(!postid){
            return res.status(400).json({error: "Post ID is required"})
        }

         const result = await postService.getPostById(postid as string)
         res.status(200).json(result)

    }catch(error){
       res.status(400).json({
        error: "Post fetching failed",
        details: error
       })
    }
}
const getMyPosts = async(req: Request, res: Response)=>{
    try{

        const user = req.user
        console.log("User in getMyPosts:", user)
        if(!user){
            return res.status(401).json({message: "user not found unauthorized"})
        }
 
         const result = await postService.getMyPosts(user.id)
         res.status(200).json(result)

    }catch(error){
       res.status(400).json({
        error: "Post fetching failed",
        details: error
       })
    }
}


const updatePost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized!")
        }

        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN
        const result = await postService.updatePost(postId as string, req.body, user.id, isAdmin);
        res.status(200).json(result)
    } catch (e) {
        const errorMessage = (e instanceof Error) ? e.message : "Post update failed!"
        res.status(400).json({
            error: errorMessage,
            details: e
        })
    }
}


const deletePost = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("You are unauthorized!")
        }

        const { postId } = req.params;
        const isAdmin = user.role === UserRole.ADMIN
        const result = await postService.deletePost(postId as string, user.id, isAdmin);
        res.status(200).json(result)
    } catch (e) {
        const errorMessage = (e instanceof Error) ? e.message : "Post delete failed!"
        res.status(400).json({
            error: errorMessage,
            details: e
        })
    }
}

const getStats = async (req: Request, res: Response) => {
    try {

        console.log("API hit: /get-stats"); // request আসছে কিনা দেখার জন্য

        const result = await postService.getStats();

        console.log("Stats result:", result); // console এ result দেখাবে

        res.status(200).json(result)

    } catch (e) {
        console.log("Error:", e) // error console এ দেখাবে

        const errorMessage = (e instanceof Error) ? e.message : "getStats failed!"
        res.status(400).json({
            error: errorMessage,
            details: e
        })
    }
}

export const postController = {
    createPost,
    getAllPosts,
    getPostById,
    getMyPosts,
    updatePost,
    deletePost,
    getStats
}