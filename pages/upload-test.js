import { useState } from 'react';

export default function UploadTest() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending upload request...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      setResult(data);
    } catch (err) {
      console.error('Error during upload:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h1>File Upload Test</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input type="file" onChange={handleFileChange} disabled={uploading} />
        </div>
        <button 
          type="submit" 
          disabled={!file || uploading}
          style={{
            padding: '0.5rem 1rem',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            opacity: (!file || uploading) ? 0.5 : 1,
          }}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>
      </form>

      {error && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          <h3>Error:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{error}</pre>
        </div>
      )}

      {result && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '4px' }}>
          <h3>Upload Successful!</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#e3f2fd', borderRadius: '4px' }}>
        <h3>Instructions:</h3>
        <ol>
          <li>Click "Choose File" and select an image file</li>
          <li>Click "Upload File"</li>
          <li>Check the results below</li>
        </ol>
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.9em', color: '#666' }}>
        <h4>Debug Info:</h4>
        <p>File selected: {file ? file.name : 'None'}</p>
        <p>File size: {file ? `${(file.size / 1024).toFixed(2)} KB` : 'N/A'}</p>
        <p>File type: {file ? file.type : 'N/A'}</p>
      </div>
    </div>
  );
}
