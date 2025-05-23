import { useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*');

    if (error) {
      console.error('Error fetching from Supabase:', error);
      return;
    }

    const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
    const proximity = 100;

    const filtered = (data || []).map(doc => {
      const content = doc.content;
      const lowerContent = content.toLowerCase();
      const previews = [];

      searchWords.forEach((word, i) => {
        let matchIndex = lowerContent.indexOf(word);
        while (matchIndex !== -1) {
          const start = Math.max(matchIndex - proximity, 0);
          const end = Math.min(matchIndex + word.length + proximity, content.length);
          const snippetRaw = content.substring(start, end);

          if (
            searchWords.every(otherWord =>
              snippetRaw.toLowerCase().includes(otherWord)
            )
          ) {
            const pageMatch = content.lastIndexOf('Page', matchIndex);
            const sectionMatch = content.lastIndexOf('Section', matchIndex);
            const pageLine = content.substring(pageMatch, content.indexOf('\n', pageMatch)).trim();
            const sectionLine = content.substring(sectionMatch, content.indexOf('\n', sectionMatch)).trim();

            let snippet = snippetRaw;
            searchWords.forEach(word => {
              const regex = new RegExp(`(${word})`, 'gi');
              snippet = snippet.replace(regex, '<mark>$1</mark>');
            });

            previews.push({ snippet, pageLine, sectionLine });
          }

          matchIndex = lowerContent.indexOf(word, matchIndex + 1);
        }
      });

      return {
        ...doc,
        previews: Array.from(new Set(previews.map(p => JSON.stringify(p)))).map(p => JSON.parse(p))
      };
    }).filter(doc => doc.previews.length > 0);

    setResults(filtered);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📄 Uploaded Documents</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        style={{ padding: '0.5rem', marginRight: '0.5rem' }}
      />
      <button onClick={handleSearch}>Search</button>
      <div style={{ marginTop: '2rem' }}>
        {results.length === 0 ? (
          <p>No documents match your search.</p>
        ) : (
          results.map((doc) => (
            <div key={doc.id} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
              <h3>{doc.name}</h3>
              {doc.previews.map((entry, index) => (
                <div key={index} style={{ marginBottom: '1rem' }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {entry.pageLine} | {entry.sectionLine}
                  </p>
                  <pre style={{ background: '#f4f4f4', padding: '1rem', whiteSpace: 'pre-wrap' }} dangerouslySetInnerHTML={{ __html: entry.snippet }} />
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;








