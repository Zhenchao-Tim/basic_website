import { faker } from '@faker-js/faker';
import { listingProduct } from '../dataModel/ListingProduct';

const newProduct = (): listingProduct => {
    return {
        id: faker.string.uuid(),
        productName: faker.commerce.productName(),
        category: faker.commerce.department(),
        price: faker.commerce.price(),
        seller: faker.person.fullName(),
        description: faker.commerce.productDescription()
    }
}

const getProducts = (len: number): listingProduct[] => {
    const arr: listingProduct[] = []
    for (let i = 0; i < len; i++) {
      arr.push(newProduct())
    }
    return arr
  }
  
export default getProducts