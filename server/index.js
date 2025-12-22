import express from 'express';
import cors from 'cors';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI environment variable is required');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

let db;
let client;
let gridFSBucket;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db('flownetics_website');
    console.log('Connected to MongoDB');
    
    // Create collections if they don't exist
    await db.createCollection('contacts').catch(() => {});
    await db.createCollection('newsletters').catch(() => {});
    await db.createCollection('roi_downloads').catch(() => {});
    await db.createCollection('blogs').catch(() => {});
    
    // Initialize GridFS bucket for image storage
    gridFSBucket = new GridFSBucket(db, { bucketName: 'blog_images' });
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectToMongoDB();

// Mailgun setup
const mailgun = new Mailgun(FormData);
const mailgunApiKey = process.env.MAILGUN_API_KEY;

if (!mailgunApiKey) {
  console.error('MAILGUN_API_KEY environment variable is required');
}

const mg = mailgun.client({
  username: 'api',
  key: mailgunApiKey,
});

// Helper function to generate PDF HTML content
function generatePDFHTML(reportData) {
  const roiYears = reportData.roiMonths / 12;
  const roiPercentage = reportData.totalCostClientINR > 0
    ? ((reportData.savingsAfterFaasINR / reportData.totalCostClientINR) * 100).toFixed(1)
    : '0';

  const formatMoney = (amount) => {
    if (!amount || amount === 0) return '0';
    const rate = reportData.currency === 'USD' ? 0.012 : reportData.currency === 'EUR' ? 0.011 : 1;
    const converted = amount * rate;
    const symbol = reportData.currencySymbol;
    return `${symbol} ${converted.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  return `
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #702594; margin-bottom: 20px;">ROI Analysis Summary</h2>
      
      <div style="background: linear-gradient(135deg, #702594, #057210); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 10px 0;">Investment Return Summary</h3>
        <div style="font-size: 32px; font-weight: bold; margin: 10px 0;">${reportData.roiMonths.toFixed(1)} Months</div>
        <div style="opacity: 0.9;">Breakeven Period (${roiYears.toFixed(1)} years) • ${roiPercentage}% Annual ROI</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background: #f5f5f7;">
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Annual Production Volume</strong></td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${reportData.annualQtyTons} tons</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Total Investment Required</strong></td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${formatMoney(reportData.totalCostClientINR)}</td>
        </tr>
        <tr style="background: #f5f5f7;">
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Annual Cost Savings</strong></td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${formatMoney(reportData.savingsAfterFaasINR)}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Cost per Kg Reduction</strong></td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${formatMoney(reportData.savingsRmPerKgINR)}</td>
        </tr>
        <tr style="background: #f5f5f7;">
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>Number of Process Steps</strong></td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${reportData.numSteps}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;"><strong>FaaS Fee Structure</strong></td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${reportData.faasPercent}% of savings</td>
        </tr>
      </table>
    </div>
  `;
}

// Contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, company, message } = req.body;
    
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const contactData = {
      firstName,
      lastName,
      email,
      phone: phone || '',
      company: company || '',
      message: message || '',
      createdAt: new Date(),
    };

    const result = await db.collection('contacts').insertOne(contactData);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

// Newsletter subscription
app.post('/api/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if email already exists
    const existing = await db.collection('newsletters').findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }

    const newsletterData = {
      email,
      subscribedAt: new Date(),
    };

    const result = await db.collection('newsletters').insertOne(newsletterData);
    res.status(201).json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username === 'flownetics' && password === 'Flow@AV_2025') {
      // In production, use JWT tokens
      res.json({ success: true, token: 'admin-token' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get all contacts (admin only)
app.get('/api/admin/contacts', async (req, res) => {
  try {
    const contacts = await db.collection('contacts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Get all newsletter subscriptions (admin only)
app.get('/api/admin/newsletters', async (req, res) => {
  try {
    const newsletters = await db.collection('newsletters')
      .find({})
      .sort({ subscribedAt: -1 })
      .toArray();
    res.json(newsletters);
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    res.status(500).json({ error: 'Failed to fetch newsletters' });
  }
});

// Download ROI Report endpoint
app.post('/api/download-roi', async (req, res) => {
  try {
    const { name, email, reportData } = req.body;
    
    if (!name || !email || !reportData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate PDF HTML content
    const pdfHTML = generatePDFHTML(reportData);

    // Send email with Mailgun
    const mailgunDomain = process.env.MAILGUN_DOMAIN;
    
    if (!mailgunDomain) {
      throw new Error('MAILGUN_DOMAIN environment variable is required');
    }
    const emailData = {
      from: `Flownetics <postmaster@${mailgunDomain}>`,
      to: [email],
      subject: 'Your Flownetics ROI Analysis Report',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #e07742, #702594, #057210); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; background: #f5f5f7; }
            .footer { text-align: center; padding: 20px; color: #86868b; font-size: 12px; background: white; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: #702594; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Flownetics ROI Report</h1>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for using the Flownetics ROI Calculator. Please find your comprehensive ROI Analysis Report below.</p>
              ${pdfHTML}
              <p>If you have any questions or would like to discuss your results, please don't hesitate to contact us.</p>
              <p>Best regards,<br><strong>Flownetics Team</strong></p>
            </div>
            <div class="footer">
              <p><strong>FLOWNETICS Engineering Private Limited</strong></p>
              <p>148/A, Industrial Suburb 1st Stage, Yeswanthpura-560022, Bangalore, India</p>
              <p>sales@flownetics-engg.com | +91 90350 21855</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await mg.messages.create(mailgunDomain, emailData);

    // Save download record to MongoDB
    const downloadRecord = {
      name,
      email,
      reportData: {
        currency: reportData.currency,
        volumeTonsPerMonth: reportData.volumeTonsPerMonth,
        numSteps: reportData.numSteps,
        roiMonths: reportData.roiMonths,
        totalCostClientINR: reportData.totalCostClientINR,
        savingsAfterFaasINR: reportData.savingsAfterFaasINR,
      },
      downloadedAt: new Date(),
    };

    await db.collection('roi_downloads').insertOne(downloadRecord);

    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Download ROI error:', error);
    res.status(500).json({ error: 'Failed to send email: ' + error.message });
  }
});

// Get ROI downloads (admin)
app.get('/api/admin/roi-downloads', async (req, res) => {
  try {
    const downloads = await db.collection('roi_downloads')
      .find({})
      .sort({ downloadedAt: -1 })
      .toArray();
    res.json(downloads);
  } catch (error) {
    console.error('Error fetching downloads:', error);
    res.status(500).json({ error: 'Failed to fetch downloads' });
  }
});

// Get dashboard stats
app.get('/api/admin/stats', async (req, res) => {
  try {
    const contactsCount = await db.collection('contacts').countDocuments();
    const newslettersCount = await db.collection('newsletters').countDocuments();
    const downloadsCount = await db.collection('roi_downloads').countDocuments();
    const blogsCount = await db.collection('blogs').countDocuments();
    
    res.json({
      contacts: contactsCount,
      newsletters: newslettersCount,
      downloads: downloadsCount,
      blogs: blogsCount,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// ========== BLOG ENDPOINTS ==========

// Get all blogs (public)
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await db.collection('blogs')
      .find({})
      .sort({ date: -1 })
      .toArray();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get single blog by slug (public)
app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const blog = await db.collection('blogs').findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Upload blog image (admin only)
app.post('/api/admin/blogs/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const filename = `blog_${Date.now()}_${req.file.originalname}`;
    const uploadStream = gridFSBucket.openUploadStream(filename, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', () => {
      res.json({ 
        success: true, 
        imageId: uploadStream.id.toString(),
        filename: filename
      });
    });

    uploadStream.on('error', (error) => {
      console.error('GridFS upload error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get blog image (public)
app.get('/api/blogs/images/:imageId', async (req, res) => {
  try {
    const imageId = new ObjectId(req.params.imageId);
    
    // Get file metadata to determine content type
    const files = await gridFSBucket.find({ _id: imageId }).toArray();
    if (files.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const file = files[0];
    res.setHeader('Content-Type', file.contentType || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    const downloadStream = gridFSBucket.openDownloadStream(imageId);
    
    downloadStream.on('data', (chunk) => {
      res.write(chunk);
    });

    downloadStream.on('end', () => {
      res.end();
    });

    downloadStream.on('error', (error) => {
      console.error('GridFS download error:', error);
      if (!res.headersSent) {
        res.status(404).json({ error: 'Image not found' });
      }
    });
  } catch (error) {
    console.error('Image retrieval error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to retrieve image' });
    }
  }
});

// Create blog (admin only)
app.post('/api/admin/blogs', async (req, res) => {
  try {
    const { title, excerpt, content, category, date, slug, imageId, author, readTime } = req.body;
    
    if (!title || !excerpt || !content || !category || !slug || !imageId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if slug already exists
    const existingBlog = await db.collection('blogs').findOne({ slug });
    if (existingBlog) {
      return res.status(409).json({ error: 'Blog with this slug already exists' });
    }

    const blogData = {
      title,
      excerpt,
      content,
      category,
      date: date || new Date().toISOString(),
      slug,
      image: `/api/blogs/images/${imageId}`, // Store the image URL
      imageId, // Store the image ID for reference
      author: author || 'Flownetics Team',
      readTime: readTime || '5 min read',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('blogs').insertOne(blogData);
    res.status(201).json({ success: true, id: result.insertedId, blog: blogData });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// Update blog (admin only)
app.put('/api/admin/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, date, slug, imageId, author, readTime } = req.body;
    
    const updateData = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (excerpt) updateData.excerpt = excerpt;
    if (content) updateData.content = content;
    if (category) updateData.category = category;
    if (date) updateData.date = date;
    if (slug) updateData.slug = slug;
    if (imageId) {
      updateData.image = `/api/blogs/images/${imageId}`;
      updateData.imageId = imageId;
    }
    if (author) updateData.author = author;
    if (readTime) updateData.readTime = readTime;

    // Check if slug already exists (excluding current blog)
    if (slug) {
      const existingBlog = await db.collection('blogs').findOne({ 
        slug, 
        _id: { $ne: new ObjectId(id) } 
      });
      if (existingBlog) {
        return res.status(409).json({ error: 'Blog with this slug already exists' });
      }
    }

    const result = await db.collection('blogs').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ success: true, message: 'Blog updated successfully' });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// Delete blog (admin only)
app.delete('/api/admin/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get blog to find image ID
    const blog = await db.collection('blogs').findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Delete image from GridFS if exists
    if (blog.imageId) {
      try {
        await gridFSBucket.delete(new ObjectId(blog.imageId));
      } catch (error) {
        console.error('Error deleting image from GridFS:', error);
        // Continue with blog deletion even if image deletion fails
      }
    }

    // Delete blog
    const result = await db.collection('blogs').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// Get all blogs (admin - for management)
app.get('/api/admin/blogs', async (req, res) => {
  try {
    const blogs = await db.collection('blogs')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  
  // Handle React routing - return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Serving static files from dist folder');
  }
});

