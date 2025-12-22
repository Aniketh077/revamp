const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function submitContact(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to submit contact form');
  }

  return response.json();
}

export async function subscribeNewsletter(email: string) {
  const response = await fetch(`${API_BASE_URL}/api/newsletter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to subscribe');
  }

  return response.json();
}

export async function adminLogin(username: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
}

export async function getContacts(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/contacts`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch contacts');
  }

  return response.json();
}

export async function getNewsletters(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/newsletters`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch newsletters');
  }

  return response.json();
}

export async function getStats(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  return response.json();
}

export async function downloadROIReport(data: {
  name: string;
  email: string;
  reportData: any;
}) {
  const response = await fetch(`${API_BASE_URL}/api/download-roi`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to send report');
  }

  return response.json();
}

export async function getROIDownloads(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/roi-downloads`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch downloads');
  }

  return response.json();
}

// Blog API functions
export async function getBlogs() {
  const response = await fetch(`${API_BASE_URL}/api/blogs`);
  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }
  return response.json();
}

export async function getBlogBySlug(slug: string) {
  const response = await fetch(`${API_BASE_URL}/api/blogs/${slug}`);
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch blog');
  }
  return response.json();
}

export async function uploadBlogImage(file: File, token: string) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE_URL}/api/admin/blogs/upload-image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload image');
  }

  return response.json();
}

export async function createBlog(blogData: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/blogs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(blogData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create blog');
  }

  return response.json();
}

export async function updateBlog(id: string, blogData: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/blogs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(blogData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update blog');
  }

  return response.json();
}

export async function deleteBlog(id: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/blogs/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete blog');
  }

  return response.json();
}

export async function getAdminBlogs(token: string) {
  const response = await fetch(`${API_BASE_URL}/api/admin/blogs`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }

  return response.json();
}

