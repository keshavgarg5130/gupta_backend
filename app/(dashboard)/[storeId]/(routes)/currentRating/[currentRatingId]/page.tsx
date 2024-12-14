import prismadb from "@/lib/prismadb";
import {CurrentRatingForm} from "@/app/(dashboard)/[storeId]/(routes)/currentRating/components/currentRatingForm";

const CurrentRatingPage = async ({
    params
                             }: {
    params : {currentRatingId: string}
}) => {

    const currentRating = await prismadb.currentRating.findUnique({
        where:{
            id: params.currentRatingId,
        }
        }
    )


    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CurrentRatingForm initialData={currentRating}/>
            </div>
        </div>
    )

}
export default CurrentRatingPage;