import type { ISanityImage } from "./product";

export interface ISiteStoryChapter {
  _key?: string;
  label: string;
  title: string;
  text: string;
  image?: ISanityImage;
}

export interface ISiteCollectionCardImage {
  _key?: string;
  categoryTitle: string;
  image?: ISanityImage;
}

export interface ISiteMedia {
  heroImage?: ISanityImage;
  homepageStoryImage?: ISanityImage;
  collectionCardImages?: ISiteCollectionCardImage[];
  weaveJourneyChapters?: ISiteStoryChapter[];
}
