import { faker } from '@faker-js/faker';
import { Product } from '../dataModels/Product'

const newProduct = (): Product => {
    return {
        productName: faker.commerce.productName(),
        category: faker.commerce.department(),
        price: faker.commerce.price(),
        seller: faker.person.fullName(),
        description: faker.commerce.productDescription()
    }
}

const getProducts = (len: number): Product[] => {
    const arr: Product[] = []
    for (let i = 0; i < len; i++) {
      arr.push(newProduct())
    }
    return arr
  }
  
export default getProducts