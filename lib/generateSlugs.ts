import { PrismaClient } from "@prisma/client";
import {slugify} from "@/lib/utils";


const prisma = new PrismaClient();

async function generateSlugs() {
    let upadateConter = 0
    const products = await prisma.product.findMany({

        select: { id: true, name: true },
    });

    for (const product of products) {
        const slug = slugify(product.name ?? "").toLowerCase(); // ✅ Ensure a valid string

        await prisma.product.update({
            where: { id: product.id },
            data: { slug },
        });
        upadateConter++
        console.log(`Updated product ${product.name} with slug: ${slug}:::${upadateConter}`);
    }

    console.log("Slug generation completed!");
}

generateSlugs()
    .catch((error) => console.error("❌ Error:", error))
    .finally(async () => {
        await prisma.$disconnect();
    });
