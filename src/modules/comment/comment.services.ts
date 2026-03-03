import { prisma } from "../../lib/prisma"

const createComment = async (payload: {
    content: string,
    PostId: string,
    AuthorId: string,
    ParentId?: string
})=>{
   
    try{

        await prisma.post.findUnique({
            where: {
                id: payload.PostId
            }
        })

        if (payload.ParentId){
             await prisma.comment.findUniqueOrThrow({
                where: {
                    id: payload.ParentId
                }
            })
            
        }


        const result = await prisma.comment.create({
            data: payload
        })

        return result

    }catch(error){
        console.error("Create Comment Error:", error)
    throw new Error("Failed to create comment")
        
    }
}


const getCommentById = async (commentId: string)=>{
    console.log("Fetching comment by ID:", commentId)

}




export const CommentServices = {
    createComment,
    getCommentById
}