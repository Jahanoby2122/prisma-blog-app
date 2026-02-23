import { Request, Response } from 'express';
import { postService } from './post.services';
import { Post } from '../../../generated/prisma/client';

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


const getAllPosts = async (req:Request, res:Response)=>{
    try{

        const {search}= req.query
        console.log("serach", search)
        const searchString = typeof search === "string"? search: undefined

        const result = await postService.getAllPosts(searchString ? {search: searchString} : {})
        res.status(200).json({
            posts: result
        })

    }catch(error){
        console.error("Error fetching posts:", error)
        res.status(500).json({message: "Internal server error"})
    }
    
}

export const postController = {
    createPost,
    getAllPosts
}