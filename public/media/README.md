# Media Assets Folder

This folder contains images and videos for the website.

## Folder Structure

- `/media/images/` - Place your images here
- `/media/videos/` - Place your videos here

## How to Use

### For Videos
1. Place your video file (e.g., `intro.mp4`) in `/public/media/videos/`
2. Reference it in your code as: `/media/videos/intro.mp4`

Example:
```jsx
<video src="/media/videos/intro.mp4" />
```

### For Images
1. Place your image file (e.g., `hero-bg.jpg`) in `/public/media/images/`
2. Reference it in your code as: `/media/images/hero-bg.jpg`

Example:
```jsx
<img src="/media/images/hero-bg.jpg" alt="Description" />
```

## Supported Formats

### Videos
- MP4 (recommended)
- WebM
- OGG

### Images
- JPG/JPEG
- PNG
- WebP
- SVG
- GIF

## Tips
- Keep file sizes reasonable for web performance
- Use descriptive filenames (e.g., `hero-background.jpg` instead of `img1.jpg`)
- Optimize images before uploading
- For videos, consider using compressed versions for better loading times
