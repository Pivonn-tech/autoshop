export const productImageMap: Record<number, string[]> = {
  1: [
    "/product1/IMG-20260509-WA0008.jpg",
    "/product1/IMG-20260509-WA0009.jpg",
    "/product1/IMG-20260509-WA0017.jpg",
    "/product1/IMG-20260509-WA0018.jpg",
    "/product1/IMG-20260509-WA0019.jpg",
    "/product1/IMG-20260509-WA0020.jpg",
  ],
  2: [
    "/product2/IMG-20260509-WA0010.jpg",
    "/product2/IMG-20260509-WA0011.jpg",
    "/product2/IMG-20260509-WA0012.jpg",
    "/product2/IMG-20260509-WA0013.jpg",
    "/product2/IMG-20260509-WA0014.jpg",
    "/product2/IMG-20260509-WA0015.jpg",
  ],
  3: [
    "/product3/IMG-20260509-WA0016.jpg",
    "/product3/IMG-20260509-WA0021.jpg",
  ],
};

export const defaultProductImage = "/product1/IMG-20260509-WA0008.jpg";

export const getProductImages = (id: number) =>
  productImageMap[id] ?? [defaultProductImage];

export const getProductCardImage = (id: number) =>
  getProductImages(id)[0] ?? defaultProductImage;
