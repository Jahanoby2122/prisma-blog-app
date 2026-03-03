type Ioptions = {
    page: number,
    limit: number,
    sortBy?: string | undefined,
    sortOrder?: string | undefined
}


type IoptionsResult = {
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: string,
    skip: number
}


const pagenationShortingHelpers = (option:Ioptions): IoptionsResult=>{

    const page:number = option.page || 1
    const limit:number = option.limit || 10
    const sortBy:string = option.sortBy || "createdAt"
    const sortOrder:string = option.sortOrder || "desc"
    const skip = (page-1)*limit

return { page, limit, sortBy, sortOrder, skip }
}


export default pagenationShortingHelpers