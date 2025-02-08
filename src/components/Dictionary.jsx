import React, { useRef, useState, useEffect } from "react";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Articles from "./Articles";
import { Search } from 'lucide-react';

export const Dictionary = () => {
  const [language, setLanguage] = useState('ua');
  const [inputValue, setInputValue] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const handleChange = (event, newAlignment) => {
    setLanguage(newAlignment);
    setIsOpen(false);
  };


  const fetchtranslations = async (input) => {
    return fetch(
      `https://3o2i8nx2m4.execute-api.eu-central-1.amazonaws.com/opensearch?q=${input}&l=${language}`
    )
      .then((res) => res.json())
      .then((translationsData) => {
        return translationsData ? translationsData : [];
      });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSelectedIndex(-1);

    if (value.trim() === '') {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const formattedValue = value
      .toLowerCase()
      .replace(/â/g, 'a')
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ñ/g, 'n')
      .replace(/ö/g, 'o')
      .replace(/q/g, 'k')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/ё/g, 'е')
      .replace(/ы/g, 'и')
      .replace(/ґ/g, 'г');

    fetchtranslations(formattedValue).then((result) => {
      setSuggestions(result);
      setIsOpen(true);
    });
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item)
    setInputValue(item.word);
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : -1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectItem(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };
  
  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  return (
    <div className="autocomplete-container">
      <div className="centered">
        <ToggleButtonGroup
          color="primary"
          size="small"
          value={language}
          exclusive
          onChange={handleChange}
          aria-label="Language"
        >
          <ToggleButton value="ua">QT | UA</ToggleButton>
          <ToggleButton value="ru">QT | RU</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <h1 className="title">Luğat - Словник</h1>
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          className="search-input"
          placeholder="Перекласти..."
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : ''}
        />
        <Search 
          size={20}
          className="search-icon"
        />

        {isOpen && isFocused && suggestions.length > 0 && (
          <div 
            ref={listRef}
            id="search-suggestions"
            role="listbox"
            className="suggestions-dropdown"
          >
            {suggestions.map((item, index) => (
              <div
                key={item.word + index}
                id={`suggestion-${index}`}
                role="option"
                aria-selected={index === selectedIndex}
                className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={(e) => { handleSelectItem(item)}}
              >
                <div className="translation" key={item.word}>
                  <section className="translation__info">
                    <div className="translation__title">
                      <div dangerouslySetInnerHTML={{__html: item.word.substring(0, inputValue.length) + '<b>' + item.word.substring(inputValue.length) + '</b>'}}>
                      </div>
                    </div>
                    <Articles result={item} skipWord={true}/>
                  </section>
                </div>
              </div>
            ))}
          </div>
        )}

        {isOpen && isFocused && inputValue && suggestions.length === 0 && (
          <div className="suggestions-dropdown">
            <div className="no-results">
              Не знайдено результатів
            </div>
          </div>
        )}
      </div>
      {selectedItem != null && (
        <div className="detailed_transalation">
            <Articles result={selectedItem}/>         
        </div>
      )}
    </div>
  );
};
