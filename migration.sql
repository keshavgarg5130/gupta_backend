-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email_otp_exp" TIMESTAMP(3),
ADD COLUMN     "phone_otp_exp" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

