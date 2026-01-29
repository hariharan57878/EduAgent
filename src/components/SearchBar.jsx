import React, { useState } from 'react';
import { Search, Compass, BookOpen, FileText } from 'lucide-react';
import './SearchBar.css';

const SearchBar = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');

  const mockData = {
    completed: ['Intro to AI', 'Logic Basics', 'Probabilistic Models'],
    ongoing: ['Bayesian Networks – Day 12', 'Markov Chains', 'Neural Architecture'],
    notes: ['My Logic Notes', 'Bayesian Summary', 'Project Ideas']
  };

  const hasResults = query.length > 0;

  const filterItems = (items) => {
    if (!query) return items;
    return items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
  };

  return (
    <div className="search-container">
      <div className={`search-input-wrapper ${isFocused ? 'focused' : ''}`}>
        <Search className="search-icon" size={20} />
        <input
          type="text"
          placeholder="Search your learning..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow clicking suggestions
          className="search-input"
        />
      </div>

      {isFocused && (
        <div className="search-suggestions">
          <div className="suggestion-group">
            <h4>Ongoing</h4>
            {filterItems(mockData.ongoing).map((item, i) => (
              <div key={i} className="suggestion-item">
                <BookOpen size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="suggestion-group">
            <h4>Notes</h4>
            {filterItems(mockData.notes).map((item, i) => (
              <div key={i} className="suggestion-item">
                <FileText size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
          {!hasResults && (
            <div className="suggestion-group">
              <h4>Completed</h4>
              {filterItems(mockData.completed).map((item, i) => (
                <div key={i} className="suggestion-item">
                  <Compass size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
