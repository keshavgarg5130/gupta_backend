import prismadb from "@/lib/prismadb";
import {PoleForm} from "@/app/(dashboard)/[storeId]/(routes)/poles/components/poleForm";

const PolesPage = async ({
    params
                             }: {
    params : {poleId: string}
}) => {

    const poles = await prismadb.poles.findUnique({
        where:{
            id: params.poleId,
        }
        }
    )


    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <PoleForm initialData={poles}/>
            </div>
        </div>
    )

}
export default PolesPage;