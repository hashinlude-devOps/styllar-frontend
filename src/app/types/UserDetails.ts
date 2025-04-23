export type UserDetails = {
  name: string;
  email: string;
  weight: string;
  height: string;
  gender: string;
};

export type UserDetailsFormProps = {
  userDetails: UserDetails;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails>>;
};

export type CameraCaptureProps = {
  onProceedToMeasurements: () => void;
  onGoBack: () => void;
  setCapturedImages: React.Dispatch<
    React.SetStateAction<{ front: File | null; side: File | null }>
  >;
};

export type MeasurementPayload = {
  frontImage: File;
  sideImage: File;
  height: number;
  weight: number;
  gender: "male" | "female";
};

export type ImagePayload = {
  image: File;
};

export type SegmentAnalysis = {
  description: string;
  pattern: string;
  predominant_color: string;
  secondary_color: string;
  style: string;
  type: string;
};
