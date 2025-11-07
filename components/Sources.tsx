
import React from 'react';

interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  // could add maps later
}

interface SourcesProps {
  sources: GroundingChunk[];
}

const Sources: React.FC<SourcesProps> = ({ sources }) => {
  if (!sources || sources.length === 0) {
    return null;
  }
  
  const webSources = sources.filter(s => s.web && s.web.uri);

  if (webSources.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 text-xs text-text-secondary-light dark:text-text-secondary-dark">
      <h4 className="font-semibold mb-1 text-text-primary-light dark:text-text-primary-dark">Information Sources:</h4>
      <ul className="list-disc list-inside space-y-1">
        {webSources.map((source, index) => (
          <li key={index}>
            <a href={source.web.uri} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
              {source.web.title || source.web.uri}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sources;
