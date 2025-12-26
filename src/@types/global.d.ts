type ErrorResponse = {
  status: number;
  data: {
    code: number;
    message: string;
    success: boolean;
  };
};
