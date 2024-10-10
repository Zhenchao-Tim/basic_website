import { Product } from "./Product";

export type listingProduct = Product & {
    price: string;
    seller: string;
    description: string;
};