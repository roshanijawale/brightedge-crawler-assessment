import axios from 'axios';
import * as cheerio from 'cheerio';

interface CrawlResult {
  title: string;
  description: string;
  body: string;
  classification: string;
  topics: string[];
  images: Array<{ src: string; alt: string }>;
}

export async function crawl(url: string): Promise<CrawlResult> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    const $ = cheerio.load(response.data);

    // Remove scripts, styles, and other noisy elements to clean the text
    $('script, style, noscript, iframe, nav, footer, header, aside').remove();

    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content')?.trim() || '';
    
    // Extract body content from main areas first, then fallback to entire body
    let body = '';
    const mainAreas = $('main, article, [role="main"], .content, .main-content, .post-content');
    if (mainAreas.length > 0) {
      body = mainAreas.text().replace(/\s+/g, ' ').trim();
    }
    
    // If main areas are empty, try paragraphs
    if (body.length < 100) {
      const paragraphs = $('p');
      if (paragraphs.length > 0) {
        body = paragraphs.text().replace(/\s+/g, ' ').trim();
      }
    }
    
    // If still empty, get all body text
    if (body.length < 100) {
      body = $('body').text().replace(/\s+/g, ' ').trim();
    }
    
    // Add image information to body
    const images: Array<{ src: string; alt: string }> = [];
    const baseUrl = new URL(url);
    $('img').each((i, elem) => {
      let src = $(elem).attr('src')?.trim() || '';
      const alt = $(elem).attr('alt')?.trim() || '';
      if (src) {
        try {
          src = new URL(src, baseUrl.href).href;
          images.push({ src, alt });
        } catch (e) {
          // Ignore invalid image URLs
        }
      }
    });
    
    // Add image alt text to body for topic extraction
    const imageAlts = images.map(img => `[Image: ${img.alt}]`).join(' ');
    if (imageAlts.length > 0) {
      body = body + ' ' + imageAlts;
    }
    
    // Limit body to first 50000 characters to avoid performance issues
    if (body.length > 50000) {
      body = body.substring(0, 50000);
    }

    // Simple classification: check for common indicators
    let classification = 'General Page';
    if (body.toLowerCase().includes('product') || $('[data-asin]').length > 0) {
      classification = 'Product Page';
    } else if (body.toLowerCase().includes('article') || $('article').length > 0) {
      classification = 'Article Page';
    } else if (body.toLowerCase().includes('blog') || $('[class*="post"]').length > 0) {
      classification = 'Blog Page';
    }

    // Extract topics: simple keyword extraction
    const text = title + ' ' + description + ' ' + body;
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || []; // words longer than 2 chars
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'an', 'a', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how']);
    const filteredWords = words.filter(word => !stopWords.has(word));
    const freq: { [key: string]: number } = {};
    filteredWords.forEach(word => freq[word] = (freq[word] || 0) + 1);
    const topics = Object.entries(freq).sort(([, a], [, b]) => b - a).slice(0, 10).map(([k]) => k);

    return {
      title,
      description,
      body,
      classification,
      topics,
      images
    };
  } catch (error) {
    throw new Error(`Failed to crawl ${url}: ${error}`);
  }
}