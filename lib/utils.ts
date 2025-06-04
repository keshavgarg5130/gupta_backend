import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from "jsonwebtoken";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// @ts-expect-error/naa
export const generateToken =(user) => jwt.sign(
    {id: user.id, email: user.email, storeId: user.storeId},
    process.env.JWT_SECRET || "default_secret",
    {expiresIn: "30d"}
);
export function slugify(name: string): string {
  return name
      .toLowerCase()
      .replace(/\s+/g, '-')         // Replace spaces with hyphens
      .replace(/[^\w.\-]+/g, '')    // Remove all non-word characters except hyphens and periods
      .replace(/\./g, '-')          // Replace periods with hyphens
      .replace(/\-\-+/g, '-')       // Replace multiple hyphens with a single hyphen
      .trim();
}

type PaymentMethod = "BANK_TRANSFER" | "PHONEPE" | "COD";

export function calculateCharges(total: number, method: PaymentMethod) {
  const shipping = total >= 5000 ? 0 : 500;

  let transactionFee = 0;
  if (method === "PHONEPE") {
    transactionFee = total * 0.02;
  } else if (method === "COD") {
    transactionFee = total * 0.01;
  }

  const grandTotal = total + shipping + transactionFee;

  return {
    shipping,
    transactionFee,
    grandTotal,
  };
}
