// utils/uploadAttributes.ts or directly where you need it

import { ImagePayload, MeasurementPayload } from "@/app/types/UserDetails";
import { axiosClient } from "../src/axios-client";

export const uploadAttributes = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient({
    method: "POST",
    url: "predict/attributes",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const uploadMeasurements = async ({
  frontImage,
  sideImage,
  height,
  weight,
  gender,
}: MeasurementPayload) => {
  const formData = new FormData();

  // Images must be File or Blob types (from file inputs or drag-drop)
  formData.append("front_image", frontImage);
  formData.append("side_image", sideImage);

  // Other fields as strings
  formData.append("height", height.toString());
  formData.append("weight", weight.toString());
  formData.append("gender", gender.toLowerCase());

  const response = await axiosClient({
    method: "POST",
    url: "predict/measurements",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const uploadFile = async ({ image }: ImagePayload) => {
  const formData = new FormData();

  formData.append("file", image);

  const response = await axiosClient({
    method: "POST",
    url: "upload-file",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data as any;
};

export const getPredictions = async ({
  height,
  weight,
  neck,
  waist,
  hip,
  chest,
  ankle,
  arm_length,
  bicep,
  calf,
  forearm,
  leg_length,
  shoulder_breadth,
  shoulder_to_crotch,
  thigh,
  gender,
  has_facial_hair,
  skin_tone,
  age_group,
  hair_color,
  hair_type,
  lighting,
}: any) => {
  const response = await axiosClient({
    method: "POST",
    url: "predict/styling",
    data: {
      height,
      weight,
      neck,
      waist,
      hip,
      chest,
      ankle,
      arm_length,
      bicep,
      calf,
      forearm,
      leg_length,
      shoulder_breadth,
      shoulder_to_crotch,
      thigh,
      gender,
      has_facial_hair,
      skin_tone,
      age_group,
      hair_color,
      hair_type,
      lighting,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data as any;
};

export const getPredictionImages = async ({ text }: any) => {
  const response = await axiosClient({
    method: "POST",
    url: "generate-product-images",
    data: {
      text,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data as any;
};

export const segmentOutfit = async (file: string) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosClient({
    method: "POST",
    url: "segment/creation",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};


export const fetchMaskData = async (fileName: string) => {
  const response = await axiosClient({
    method: "GET",
    url: `/files/${fileName}`,
    responseType: "arraybuffer",
  });

  return response.data;
};
