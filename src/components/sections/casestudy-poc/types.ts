export type SanityImage = { asset: { _ref: string } };

export type PocProject = {
  _id: string;
  title: string;
  client?: string;
  slug: string;
  coverImage?: SanityImage;
  gallery?: SanityImage[];
  excerpt?: string;
  categories?: string[];
};
