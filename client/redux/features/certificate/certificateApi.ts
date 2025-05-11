import { apiSlice } from "../api/apiSlice";

export const generateCertificate = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateCertificate: builder.mutation<Blob, { data: any }>({
      query: (data) => ({
        url: "generate-certificate",
        method: "POST",
        body: data,
        credentials: "include",
        responseHandler: async (response: Response) => {
          if (!response.ok) {
            throw new Error("Failed to generate certificate");
          }
          return response.blob();
        },
      }),
      transformErrorResponse: (response) => {
        return (
          (response.data as { message: string })?.message ||
          "Failed to generate certificate"
        );
      },
    }),
  }),
});

export const { useGenerateCertificateMutation } = generateCertificate;
