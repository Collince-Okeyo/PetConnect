import { api } from './api';

const VERIFICATION = '/verification';
const ADMIN_VERIFICATION = '/admin/verifications';

// User Verification APIs

export async function uploadIdFront(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  
  const { data } = await api.post(`${VERIFICATION}/upload-id-front`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
}

export async function uploadIdBack(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  
  const { data } = await api.post(`${VERIFICATION}/upload-id-back`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
}

export async function uploadSelfie(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  
  const { data } = await api.post(`${VERIFICATION}/upload-selfie`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
}

export async function submitVerification(nationalIdNumber: string) {
  const { data } = await api.post(`${VERIFICATION}/submit`, { nationalIdNumber });
  return data;
}

export async function getVerificationStatus() {
  const { data } = await api.get(`${VERIFICATION}/status`);
  return data;
}

// Admin Verification APIs

export async function getPendingVerifications(page = 1, status = 'under_review') {
  const { data } = await api.get(`${ADMIN_VERIFICATION}/pending`, {
    params: { page, status }
  });
  return data;
}

export async function getVerificationDetails(userId: string) {
  const { data } = await api.get(`${ADMIN_VERIFICATION}/${userId}`);
  return data;
}

export async function approveVerification(userId: string, reviewNotes?: string) {
  const { data } = await api.put(`${ADMIN_VERIFICATION}/${userId}/approve`, { reviewNotes });
  return data;
}

export async function rejectVerification(userId: string, rejectionReason: string, reviewNotes?: string) {
  const { data } = await api.put(`${ADMIN_VERIFICATION}/${userId}/reject`, {
    rejectionReason,
    reviewNotes
  });
  return data;
}

export async function getVerificationStats() {
  const { data } = await api.get(`${ADMIN_VERIFICATION}/stats`);
  return data;
}
