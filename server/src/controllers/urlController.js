import { nanoid } from 'nanoid';
import validator from 'validator';
import Url from '../models/Url.js';
import Visit from '../models/Visit.js';

// Helper to format/validate URL
const formatUrl = (url) => {
  let formatted = url.trim();
  if (!/^https?:\/\//i.test(formatted)) {
    formatted = `http://${formatted}`;
  }
  return formatted;
};

// @desc    Create a shortened URL
// @route   POST /api/urls
// @access  Protected
export const createUrl = async (req, res) => {
  const { originalUrl, customAlias, expiresAt } = req.body;
  const userId = req.user.id;

  try {
    if (!originalUrl) {
      return res.status(400).json({ message: 'Original URL is required' });
    }

    const formattedUrl = formatUrl(originalUrl);
    
    // Validate URL structure
    if (!validator.isURL(formattedUrl, { require_tld: true, require_protocol: true })) {
      return res.status(400).json({ message: 'Invalid URL format' });
    }

    let finalShortCode;

    if (customAlias) {
      const aliasClean = customAlias.trim();
      // Validate alias format (alphanumeric, dash, underscore)
      if (!/^[a-zA-Z0-9_-]+$/.test(aliasClean)) {
        return res.status(400).json({ message: 'Custom alias can only contain letters, numbers, dashes (-), and underscores (_)' });
      }

      if (aliasClean.length < 3 || aliasClean.length > 30) {
        return res.status(400).json({ message: 'Custom alias must be between 3 and 30 characters' });
      }

      // Check if alias is already in use (either as a customAlias or shortCode)
      const existingUrl = await Url.findOne({
        $or: [{ shortCode: aliasClean }, { customAlias: aliasClean }]
      });

      if (existingUrl) {
        return res.status(400).json({ message: 'Custom alias is already in use' });
      }
      finalShortCode = aliasClean;
    } else {
      // Generate a unique code using nanoid (length of 7)
      let unique = false;
      let attempts = 0;
      while (!unique && attempts < 5) {
        const code = nanoid(7);
        const exists = await Url.findOne({
          $or: [{ shortCode: code }, { customAlias: code }]
        });
        if (!exists) {
          finalShortCode = code;
          unique = true;
        }
        attempts++;
      }

      if (!unique) {
        return res.status(500).json({ message: 'Failed to generate unique short code. Please try again.' });
      }
    }

    // Parse expiration date
    let expirationDate = null;
    if (expiresAt) {
      expirationDate = new Date(expiresAt);
      if (isNaN(expirationDate.getTime())) {
        return res.status(400).json({ message: 'Invalid expiration date' });
      }
      if (expirationDate <= new Date()) {
        return res.status(400).json({ message: 'Expiration date must be in the future' });
      }
    }

    const newUrl = await Url.create({
      userId,
      originalUrl: formattedUrl,
      shortCode: finalShortCode,
      customAlias: customAlias ? finalShortCode : undefined,
      expiresAt: expirationDate,
    });

    res.status(201).json(newUrl);
  } catch (error) {
    console.error('Create URL error:', error);
    res.status(500).json({ message: 'Server error during URL creation', error: error.message });
  }
};

// @desc    Get all URLs for logged in user
// @route   GET /api/urls
// @access  Protected
export const getUrls = async (req, res) => {
  const userId = req.user.id;

  try {
    const urls = await Url.find({ userId }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    console.error('Get URLs error:', error);
    res.status(500).json({ message: 'Server error retrieving URLs', error: error.message });
  }
};

// @desc    Delete a URL
// @route   DELETE /api/urls/:id
// @access  Protected
export const deleteUrl = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Verify ownership
    if (url.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this URL' });
    }

    // Remove the URL
    await Url.findByIdAndDelete(id);

    // Clean up all related visits
    await Visit.deleteMany({ urlId: id });

    res.json({ message: 'URL and associated analytics deleted successfully' });
  } catch (error) {
    console.error('Delete URL error:', error);
    res.status(500).json({ message: 'Server error during URL deletion', error: error.message });
  }
};

// @desc    Get analytics for a specific URL
// @route   GET /api/urls/:id/analytics
// @access  Protected
export const getUrlAnalytics = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const url = await Url.findById(id);

    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Verify ownership
    if (url.userId.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to view analytics for this URL' });
    }

    // Retrieve all visits for this URL
    const visits = await Visit.find({ urlId: id }).sort({ timestamp: -1 });

    // 1. Total click count (fallback to database record or use list length)
    const totalClicks = url.clicks;

    // 2. Last visited timestamp
    const lastVisited = visits.length > 0 ? visits[0].timestamp : null;

    // 3. Daily clicks trend (past 7 days by default)
    // We group by calendar date (YYYY-MM-DD)
    const dailyClicksMap = {};
    
    // Initialize last 7 days with 0 clicks
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      dailyClicksMap[dateStr] = 0;
    }

    // Populate actual counts from visits
    visits.forEach((visit) => {
      const dateStr = new Date(visit.timestamp).toISOString().split('T')[0];
      if (dailyClicksMap[dateStr] !== undefined) {
        dailyClicksMap[dateStr]++;
      } else {
        // If visit is older than 7 days, we can still list it or ignore depending on visual limit
        // Let's dynamically add it if it's within the dataset range or keep it capped.
        // For Recharts, a fixed 7-day trend is standard and looks great. Let's just track it.
        dailyClicksMap[dateStr] = (dailyClicksMap[dateStr] || 0) + 1;
      }
    });

    const dailyTrend = Object.keys(dailyClicksMap)
      .sort()
      .map((date) => ({
        date,
        clicks: dailyClicksMap[date],
      }));

    // 4. Device analytics breakdown
    const devices = { Desktop: 0, Mobile: 0, Tablet: 0 };
    // 5. Browser analytics breakdown
    const browsers = {};

    visits.forEach((visit) => {
      // Devices
      const dev = visit.device || 'Desktop';
      devices[dev] = (devices[dev] || 0) + 1;

      // Browsers
      const br = visit.browser || 'Unknown';
      browsers[br] = (browsers[br] || 0) + 1;
    });

    const deviceStats = Object.keys(devices).map((name) => ({
      name,
      value: devices[name],
    }));

    const browserStats = Object.keys(browsers).map((name) => ({
      name,
      value: browsers[name],
    }));

    res.json({
      url,
      analytics: {
        totalClicks,
        lastVisited,
        dailyTrend,
        deviceStats,
        browserStats,
        recentHistory: visits.slice(0, 10), // return last 10 visits
      },
    });
  } catch (error) {
    console.error('Get Analytics error:', error);
    res.status(500).json({ message: 'Server error retrieving analytics', error: error.message });
  }
};
