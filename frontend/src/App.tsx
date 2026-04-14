import { FormEvent, useMemo, useState } from 'react';

interface CrawlResult {
  title: string;
  description: string;
  body: string;
  classification: string;
  topics: string[];
  links: string[];
}

const apiUrl = import.meta.env.VITE_CRAWL_API_URL || '/crawl';

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<CrawlResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedBody = useMemo(() => {
    if (!result || !result.body) return '';
    return isExpanded ? result.body : `${result.body.slice(0, 500)}${result.body.length > 500 ? '...' : ''}`;
  }, [isExpanded, result]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setResult(null);

    if (!url.trim()) {
      setError('Please enter a valid URL.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Unable to crawl URL');
      } else {
        setResult(data);
      }
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setIsExpanded(false);
    }
  };

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand">
            <i className="fas fa-spider" /> Web Crawler
          </span>
          <span className="navbar-text text-secondary ms-auto">Extract & analyze web content</span>
        </div>
      </nav>

      <main className="container-main">
        <section className="header-section text-center">
          <h1><i className="fas fa-globe" /> Web Crawler</h1>
          <p>Enter a URL to extract metadata, classification, topics, and links.</p>
        </section>

        <section className="form-section card shadow-sm p-4 mb-4">
          <form onSubmit={handleSubmit}>
            <label htmlFor="urlInput" className="form-label">
              <i className="fas fa-link"></i> Enter URL
            </label>
            <div className="input-group">
              <input
                id="urlInput"
                type="url"
                className="form-control form-control-lg"
                placeholder="https://example.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                required
              />
              <button className="btn btn-primary" type="submit" disabled={loading}>
                <i className="fas fa-search"></i> Crawl
              </button>
            </div>
          </form>
        </section>

        {loading && (
          <div className="alert alert-info text-center" role="status">
            <i className="fas fa-spinner fa-spin" /> Crawling... Please wait.
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {result && (
          <section className="result-section card shadow-sm p-4">
            <h2>Results</h2>
            <div className="table-responsive">
              <table className="table table-hover">
                <tbody>
                  <tr>
                    <td>Title</td>
                    <td><strong>{result.title}</strong></td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>{result.description || <em className="text-muted">No description</em>}</td>
                  </tr>
                  <tr>
                    <td>Classification</td>
                    <td><span className="badge bg-info text-dark">{result.classification}</span></td>
                  </tr>
                  <tr>
                    <td>Topics</td>
                    <td>{result.topics.length ? result.topics.map((topic) => <span key={topic} className="badge topic-badge me-1">{topic}</span>) : <em className="text-muted">No topics</em>}</td>
                  </tr>
                  <tr>
                    <td>Links</td>
                    <td>
                      {result.links.length ? (
                        <ul className="list-unstyled mb-0">
                          {result.links.map((link) => (
                            <li key={link}>
                              <a href={link} target="_blank" rel="noreferrer">
                                <i className="fas fa-external-link-alt me-1" />{link}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <em className="text-muted">No links found</em>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>Body Content</td>
                    <td>
                      <pre className="body-text">{displayedBody}</pre>
                      {result.body && result.body.length > 500 && (
                        <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => setIsExpanded((prev) => !prev)}>
                          <i className={`fas ${isExpanded ? 'fa-compress' : 'fa-expand'}`} /> {isExpanded ? 'Show Less' : 'Show Full Body'}
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
