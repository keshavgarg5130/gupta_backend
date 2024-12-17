import prismadb from "@/lib/prismadb";
import {BrandForm} from "@/app/(dashboard)/[storeId]/(routes)/brands/components/brandForm";

const BrandPage = async ({
    params
                             }: {
    params : {brandId: string, storeId: string}
}) => {

    const brand = await prismadb.brand.findUnique({
        where:{
            id: params.brandId,
        }
        }
    )
    const billboards = await prismadb.billboard.findMany({
        where:{
            storeId: params.storeId
        }
    })


    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BrandForm initialData={brand} billboards={billboards}/>
            </div>
        </div>
    )

}
export default BrandPage;