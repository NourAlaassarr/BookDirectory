import { PaginationFunction } from "./PaginationFunction.js";


export class ApiFeature {

    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery
        this.queryData = queryData
    }
    //pagination
    pagination() {
        const { page, size } = this.queryData
        const { limit, skip } = PaginationFunction({ page, size })
        this.mongooseQuery.limit(limit).skip(skip)
        return this
    }

    //sort
    sort() {
        this.mongooseQuery.sort(this.queryData.sort?.replaceAll(',', ' '))
        return this
    }

    //select
    select() {
        this.mongooseQuery.select(this.queryData.select?.replaceAll(',', ' '))
        return this
    }


    //filter
    filter() {
        const queryinstance = { ...this.queryData }
        const execuldeKeysArr = ['page', 'size', 'sort', 'select', 'search']
        execuldeKeysArr.forEach((key) => delete queryinstance[key])
        const Querystring = JSON.parse(JSON.stringify(queryinstance).replace(/gt|gte|lt|lte|in|nin|eq|neq|regex/g, (match) => `$${match}`,))
        this.mongooseQuery.find(Querystring)
        return this
    }






}