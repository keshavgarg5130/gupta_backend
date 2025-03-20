import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";
import prismadb from "@/lib/prismadb";
import {slugify} from "@/lib/utils";

export async function POST(
    req: Request,
    {params} : {params:{storeId:string}}
){
    try{

        const authData = await auth();
        const { userId } = authData ;


        const body = await req.json()
        const {name, mPrice, price,gstRate,brandId,description, categoryId,images,currentRatingId,polesId,isFeatured, isArchived } = body;
        const slug = slugify(name).toLowerCase();
        console.log(images);
        if(!userId){
            return new NextResponse("Unauthenticated",{status: 401})
        }
        if(!name){
            return new NextResponse("name is Required",{status: 400})
        }
        console.log("description:", description)
        if(!description|| typeof description !== "string"){
            return new NextResponse("description is Required",{status: 400})
        }
        if(!images || !images.length){
            return new NextResponse("image is Required",{status: 400})
        }
        if(!mPrice){
            return new NextResponse("mPrice is Required",{status: 400})
        }if(!price){
            return new NextResponse("price is Required",{status: 400})
        }
        if(!gstRate){
            return new NextResponse("gstRate is Required",{status: 400})
        }
        if(!categoryId){
            return new NextResponse("CategoryId is Required",{status: 400})
        }
        if(!params.storeId){
            return new NextResponse("storeId is required", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({where:{id:params.storeId,
            userId:userId}})
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }



        const product = await prismadb.product.create({
            data: {
                storeId: params.storeId,
                description,
                brandId,
                name,
                price,
                isArchived,
                gstRate,
                mPrice,
                isFeatured,
                categoryId,
                currentRatingId,
                polesId,
                slug,
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url: string}) => ({url: image.url}))
                        ]
                    }
                }
            }
        })
        return NextResponse.json(product)
    }catch (error) {
        console.log('PRODUCT_POST',error)
        return new NextResponse("Internal error",{status: 500})
    }
}

export async function GET(
    req: Request,
    {params} : {params:{storeId:string}}
){
    try{
        const {searchParams} = new URL(req.url)
        const categoryId = searchParams.get('categoryId') || undefined
        const currentRatingId = searchParams.get('currentRatingId') || undefined
        const polesId = searchParams.get('polesId') || undefined
        const isFeatured = searchParams.get('isFeatured')


        if(!params.storeId){
            return new NextResponse("storeId is required", {status:400})
        }
        const products = await prismadb.product.findMany({where:
                {storeId: params.storeId,
                categoryId:categoryId,
                currentRatingId:currentRatingId,
                polesId:polesId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
        include:{
            images: true,
            category: true,
            currentRating: true,
            poles: true,
            brand: true,
        },
        orderBy:{
            createdAt: 'desc'
        }})
        return NextResponse.json(products)
    }catch (error) {
        console.log('PRODUCTS_GET',error)
        return new NextResponse("Internal error",{status: 500})
    }
}