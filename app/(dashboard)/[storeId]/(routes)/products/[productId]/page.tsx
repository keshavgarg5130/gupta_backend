import prismadb from "@/lib/prismadb";
import {ProductForm} from "@/app/(dashboard)/[storeId]/(routes)/products/components/productForm";


const ProductPage = async ({
    params
                             }: {
    params : {productId: string, storeId: string};
}) => {


    const products = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            }, include: {
                images: true,
            },
        }
    )
    const categories = await prismadb.category.findMany({
        where: {
            storeId: params.storeId,
        },
    });

    const currentRating = await prismadb.currentRating.findMany({
        where: {
            storeId: params.storeId,
        },
    });
    const poles = await prismadb.poles.findMany({
        where: {
            storeId: params.storeId,
        },
    });
    const brands = await prismadb.brand.findMany({
        where: {
            storeId: params.storeId,
        },
    })


    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductForm initialData={products} brands={brands} categories={categories} currentRating={currentRating} poles={poles}/>
            </div>
        </div>
    )

}
export default ProductPage;