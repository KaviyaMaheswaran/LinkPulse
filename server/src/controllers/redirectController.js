import UAParser from 'ua-parser-js';
import Url from '../models/Url.js';
import Visit from '../models/Visit.js';

// @desc    Redirect short URL to original destination
// @route   GET /:shortCode
// @access  Public
export const redirectUrl = async (req, res) => {
  const { shortCode } = req.params;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  try {
    // Look up short code in the database
    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }],
    });

    // If not found, redirect to frontend 404 page
    if (!url) {
      return res.redirect(`${clientUrl}/404`);
    }

    // Check for expiration
    if (url.expiresAt && new Date(url.expiresAt) <= new Date()) {
      return res.redirect(`${clientUrl}/404?error=expired`);
    }

    // Capture user agent information
    const userAgent = req.headers['user-agent'] || '';
    const parser = new UAParser(userAgent);
    const parsedBrowser = parser.getBrowser();
    const parsedDevice = parser.getDevice();

    const browser = parsedBrowser.name || 'Unknown';
    
    // Map device type
    let device = 'Desktop';
    if (parsedDevice.type === 'mobile') {
      device = 'Mobile';
    } else if (parsedDevice.type === 'tablet') {
      device = 'Tablet';
    } else if (parsedDevice.type === 'smarttv' || parsedDevice.type === 'wearable' || parsedDevice.type === 'console') {
      device = 'Other';
    }

    // Extract referrer hostname or default to 'Direct'
    const refererHeader = req.headers['referer'] || req.headers['referrer'];
    let referrer = 'Direct';
    if (refererHeader) {
      try {
        const urlObj = new URL(refererHeader);
        referrer = urlObj.hostname;
      } catch (err) {
        referrer = 'Referrer Header';
      }
    }

    // Asynchronously update clicks and log visit analytics (non-blocking)
    url.clicks += 1;
    
    Promise.all([
      url.save(),
      Visit.create({
        urlId: url._id,
        device,
        browser,
        referrer,
        timestamp: new Date(),
      })
    ]).catch((err) => {
      console.error('Async analytics logging failed:', err);
    });

    // Redirect to the original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Redirect controller error:', error);
    res.status(500).json({ message: 'Server error during redirection' });
  }
};
