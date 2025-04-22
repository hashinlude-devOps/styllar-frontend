// utils/uploadAttributes.ts or directly where you need it

import { MeasurementPayload } from "@/app/types/UserDetails";
import { axiosClient } from "../src/axios-client";

export const uploadAttributes = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosClient({
    method: 'POST',
    url: 'predict/attributes',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
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
  }:  MeasurementPayload) => {
    const formData = new FormData();
  
    // Images must be File or Blob types (from file inputs or drag-drop)
    formData.append("front_image", frontImage);
    formData.append("side_image", sideImage);
  
    // Other fields as strings
    formData.append("height", height.toString());
    formData.append("weight", weight.toString());
    formData.append("gender", gender.toLowerCase()); 
  
    const response = await axiosClient({
      method: 'POST',
      url: 'predict/measurements',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    return response.data;
  };