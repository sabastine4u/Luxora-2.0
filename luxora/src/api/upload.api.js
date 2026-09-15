// Import the shared HTTP client used by the Luxora frontend.
import http from './http';

// Convert a browser File array into multipart/form-data for the backend upload endpoint.
const createFileFormData = (files, fieldName) => {
  // Create the multipart form container.
  const formData = new FormData();

  // Append each selected file using the field name expected by Multer.
  files.forEach((file) => {
    formData.append(fieldName, file);
  });

  return formData;
};

// Define the API methods responsible for property media uploads.
export const uploadApi = {
  // Upload property images and return their public URLs.
  uploadPropertyImages: (files = []) => {
    const formData = createFileFormData(files, 'images');

    return http.post('/uploads/properties/images', formData);
  },

  // Upload property documents and return their public URLs.
  uploadPropertyDocuments: (files = []) => {
    const formData = createFileFormData(files, 'documents');

    return http.post('/uploads/properties/documents', formData);
  },
};