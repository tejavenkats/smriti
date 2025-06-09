export interface ICreateEventParams {
  name: string;
  occasion: string;
  description: string;
  totalGuests: number;
  location: string;
  date: Date;
  time: string;
  userId: string;
  image?: string;
}
