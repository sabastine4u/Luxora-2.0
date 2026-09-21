// Import the shared HTTP client.
import http from './http';

// Convert a browser File array into multipart/form-data.
const createFileFormData = (
  files,
  fieldName,
) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append(
      fieldName,
      file,
    );
  });

  return formData;
};

// Define the API methods responsible for Property media uploads.
export const uploadApi = {
  // Upload Property images.
  uploadPropertyImages: (files = []) => {
    const formData =
      createFileFormData(
        files,
        'images',
      );

    return http.post(
      '/uploads/properties/images',
      formData,
      {
        headers: {
          // Tell Axios this request is multipart.
          // Axios will add the required boundary.
          'Content-Type':
            'multipart/form-data',
        },
      },
    );
  },

  // Upload Property documents.
  uploadPropertyDocuments: (
    files = [],
  ) => {
    const formData =
      createFileFormData(
        files,
        'documents',
      );

    return http.post(
      '/uploads/properties/documents',
      formData,
      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      },
    );
  },
};