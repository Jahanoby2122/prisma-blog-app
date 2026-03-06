import { Request, Response } from 'express';
import { postService } from './post.services';
import { Post, PostStatus } from '../../../generated/prisma/client';
import pagenationShortingHelpers from '../../helpers/paganationShortingHelpers';

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

export const postController = {
    createPost,
    getAllPosts,
    getPostById,
    getMyPosts
}