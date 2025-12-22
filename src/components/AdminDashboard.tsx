import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Mail, TrendingUp, Calendar, Phone, Building, MessageSquare, Download, FileText, Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { adminLogin, getContacts, getNewsletters, getStats, getROIDownloads, getAdminBlogs, createBlog, updateBlog, deleteBlog, uploadBlogImage } from '../lib/api';

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  createdAt: string;
}

interface Newsletter {
  _id: string;
  email: string;
  subscribedAt: string;
}

interface ROIDownload {
  _id: string;
  name: string;
  email: string;
  reportData: {
    currency: string;
    volumeTonsPerMonth: number;
    numSteps: number;
    roiMonths: number;
    totalCostClientINR: number;
    savingsAfterFaasINR: number;
  };
  downloadedAt: string;
}

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  slug: string;
  image: string;
  imageId?: string;
  author: string;
  readTime: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [downloads, setDownloads] = useState<ROIDownload[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState({ contacts: 0, newsletters: 0, downloads: 0, blogs: 0 });
  const [activeTab, setActiveTab] = useState<'contacts' | 'newsletters' | 'downloads' | 'blogs'>('contacts');
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    slug: '',
    author: 'Flownetics Team',
    readTime: '5 min read',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingBlog, setSavingBlog] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      const [contactsData, newslettersData, statsData, downloadsData, blogsData] = await Promise.all([
        getContacts(token),
        getNewsletters(token),
        getStats(token),
        getROIDownloads(token),
        getAdminBlogs(token),
      ]);
      setContacts(contactsData);
      setNewsletters(newslettersData);
      setStats(statsData);
      setDownloads(downloadsData);
      setBlogs(blogsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminLogin(username, password);
      localStorage.setItem('adminToken', response.token);
      setIsAuthenticated(true);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
    setContacts([]);
    setNewsletters([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) return null;
    
    const token = localStorage.getItem('adminToken');
    if (!token) throw new Error('Not authenticated');

    setUploadingImage(true);
    try {
      const result = await uploadBlogImage(imageFile, token);
      return result.imageId;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveBlog = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    if (!blogForm.title || !blogForm.excerpt || !blogForm.content || !blogForm.category || !blogForm.slug) {
      alert('Please fill in all required fields');
      return;
    }

    setSavingBlog(true);
    try {
      let imageId = editingBlog?.imageId;

      // Upload new image if selected
      if (imageFile) {
        imageId = await handleUploadImage();
      }

      if (!imageId) {
        alert('Please upload an image');
        return;
      }

      const blogData = {
        ...blogForm,
        imageId,
      };

      if (editingBlog) {
        await updateBlog(editingBlog._id, blogData, token);
      } else {
        await createBlog(blogData, token);
      }

      // Reset form and close modal
      setShowBlogModal(false);
      setEditingBlog(null);
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        slug: '',
        author: 'Flownetics Team',
        readTime: '5 min read',
      });
      setImageFile(null);
      setImagePreview('');
      
      // Refresh blogs list
      fetchData();
    } catch (error) {
      console.error('Error saving blog:', error);
      alert(error instanceof Error ? error.message : 'Failed to save blog');
    } finally {
      setSavingBlog(false);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    try {
      await deleteBlog(id, token);
      fetchData();
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setBlogForm({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      category: blog.category,
      date: new Date(blog.date).toISOString().split('T')[0],
      slug: blog.slug,
      author: blog.author,
      readTime: blog.readTime,
    });
    setImagePreview(blog.image.startsWith('http') ? blog.image : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${blog.image}`);
    setImageFile(null);
    setShowBlogModal(true);
  };

  const handleNewBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      slug: '',
      author: 'Flownetics Team',
      readTime: '5 min read',
    });
    setImageFile(null);
    setImagePreview('');
    setShowBlogModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-black via-gray-900 to-brand-black flex items-center justify-center px-6">
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green blur-lg opacity-40"></div>
                <h1 className="relative text-3xl font-bold tracking-tighter bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Flownetics Admin Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none transition-all"
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-purple text-white font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-brand-purple/30 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-black via-gray-900 to-brand-black">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-orange via-brand-purple to-brand-green bg-clip-text text-transparent">
              Flownetics Admin
            </h1>
            <p className="text-gray-400 text-sm">Dashboard Panel</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Contacts</p>
                <p className="text-3xl font-bold text-white">{stats.contacts}</p>
              </div>
              <div className="w-12 h-12 bg-brand-purple/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-brand-purple" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Newsletter Subscribers</p>
                <p className="text-3xl font-bold text-white">{stats.newsletters}</p>
              </div>
              <div className="w-12 h-12 bg-brand-green/20 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-brand-green" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">ROI Downloads</p>
                <p className="text-3xl font-bold text-white">{stats.downloads || 0}</p>
              </div>
              <div className="w-12 h-12 bg-brand-orange/20 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-brand-orange" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Blog Posts</p>
                <p className="text-3xl font-bold text-white">{stats.blogs || 0}</p>
              </div>
              <div className="w-12 h-12 bg-brand-purple/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-brand-purple" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-xl shadow-lg">
          <div className="border-b border-gray-800 flex">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === 'contacts'
                  ? 'text-brand-orange border-b-2 border-brand-orange'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Contacts ({contacts.length})
            </button>
            <button
              onClick={() => setActiveTab('newsletters')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === 'newsletters'
                  ? 'text-brand-orange border-b-2 border-brand-orange'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Newsletters ({newsletters.length})
            </button>
            <button
              onClick={() => setActiveTab('downloads')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === 'downloads'
                  ? 'text-brand-orange border-b-2 border-brand-orange'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              ROI Downloads ({downloads.length})
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`flex-1 px-6 py-4 font-medium transition-all ${
                activeTab === 'blogs'
                  ? 'text-brand-orange border-b-2 border-brand-orange'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              Blogs ({blogs.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'contacts' ? (
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No contacts yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Name</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Email</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Phone</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Company</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Message</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((contact) => (
                          <tr key={contact._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                            <td className="py-3 px-4 text-white">
                              {contact.firstName} {contact.lastName}
                            </td>
                            <td className="py-3 px-4 text-gray-300">{contact.email}</td>
                            <td className="py-3 px-4 text-gray-300">{contact.phone || '-'}</td>
                            <td className="py-3 px-4 text-gray-300">{contact.company || '-'}</td>
                            <td className="py-3 px-4 text-gray-300 max-w-xs truncate">
                              {contact.message || '-'}
                            </td>
                            <td className="py-3 px-4 text-gray-400 text-sm">
                              {formatDate(contact.createdAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : activeTab === 'newsletters' ? (
              <div className="space-y-4">
                {newsletters.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No newsletter subscriptions yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Email</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Subscribed At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newsletters.map((newsletter) => (
                          <tr key={newsletter._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                            <td className="py-3 px-4 text-white">{newsletter.email}</td>
                            <td className="py-3 px-4 text-gray-400 text-sm">
                              {formatDate(newsletter.subscribedAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : activeTab === 'downloads' ? (
              <div className="space-y-4">
                {downloads.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No ROI downloads yet</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Name</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Email</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Currency</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Volume (tons/month)</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">ROI (months)</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Total Investment</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Downloaded At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {downloads.map((download) => (
                          <tr key={download._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                            <td className="py-3 px-4 text-white">{download.name}</td>
                            <td className="py-3 px-4 text-gray-300">{download.email}</td>
                            <td className="py-3 px-4 text-gray-300">{download.reportData.currency}</td>
                            <td className="py-3 px-4 text-gray-300">{download.reportData.volumeTonsPerMonth}</td>
                            <td className="py-3 px-4 text-gray-300">{download.reportData.roiMonths.toFixed(1)}</td>
                            <td className="py-3 px-4 text-gray-300">
                              {download.reportData.currency === 'USD' ? '$' : download.reportData.currency === 'EUR' ? '€' : '₹'} 
                              {' '}
                              {download.reportData.totalCostClientINR.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-gray-400 text-sm">
                              {formatDate(download.downloadedAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">Blog Posts</h2>
                  <button
                    onClick={handleNewBlog}
                    className="flex items-center gap-2 bg-gradient-purple text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    New Blog
                  </button>
                </div>
                {blogs.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No blogs yet. Create your first blog post!</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Title</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Category</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Date</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Author</th>
                          <th className="text-left py-3 px-4 text-gray-400 font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogs.map((blog) => (
                          <tr key={blog._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                            <td className="py-3 px-4 text-white font-medium">{blog.title}</td>
                            <td className="py-3 px-4 text-gray-300">
                              <span className="bg-brand-purple/20 text-brand-purple px-2 py-1 rounded text-xs">
                                {blog.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-300 text-sm">
                              {new Date(blog.date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-gray-300 text-sm">{blog.author}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditBlog(blog)}
                                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4 text-brand-orange" />
                                </button>
                                <button
                                  onClick={() => handleDeleteBlog(blog._id)}
                                  className="p-2 hover:bg-gray-700 rounded transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Blog Modal */}
      {showBlogModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {editingBlog ? 'Edit Blog' : 'Create New Blog'}
              </h2>
              <button
                onClick={() => {
                  setShowBlogModal(false);
                  setEditingBlog(null);
                  setImageFile(null);
                  setImagePreview('');
                }}
                className="w-10 h-10 rounded-full hover:bg-gray-800 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Blog Image *</label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                  )}
                  <label className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                    <Upload className="w-4 h-4" />
                    {imageFile ? 'Change Image' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>
                {uploadingImage && <p className="text-gray-400 text-sm mt-2">Uploading image...</p>}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none"
                  placeholder="Enter blog title"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Slug * (URL-friendly)</label>
                <input
                  type="text"
                  value={blogForm.slug}
                  onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none"
                  placeholder="blog-post-slug"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Excerpt *</label>
                <textarea
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none"
                  placeholder="Short description of the blog post"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Content * (HTML supported)</label>
                <textarea
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  rows={12}
                  className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none font-mono text-sm"
                  placeholder="Enter blog content (HTML supported)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Category *</label>
                  <input
                    type="text"
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none"
                    placeholder="Technology, Innovation, etc."
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Date *</label>
                  <input
                    type="date"
                    value={blogForm.date}
                    onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Author</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none"
                    placeholder="Author name"
                  />
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Read Time</label>
                  <input
                    type="text"
                    value={blogForm.readTime}
                    onChange={(e) => setBlogForm({ ...blogForm, readTime: e.target.value })}
                    className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-brand-orange focus:border-brand-orange outline-none"
                    placeholder="5 min read"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowBlogModal(false);
                    setEditingBlog(null);
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBlog}
                  disabled={savingBlog || uploadingImage}
                  className="px-6 py-2 bg-gradient-purple text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {savingBlog ? 'Saving...' : editingBlog ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

