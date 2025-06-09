import { MediaRequestParams, MediaSchema } from "../../db/models/Media";
import { v4 as uuidv4 } from "uuid";

export const uploadMedia = async (mediaDetails: MediaRequestParams) => {
  const mediaDataWithId: MediaSchema = {
    ...mediaDetails,
    mediaId: uuidv4(),
  };
};
