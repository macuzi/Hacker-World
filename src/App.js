import React, { useState, useEffect } from 'react';
import './App.css';
/**
  pass in a key so we don't overwrite the value in storage
  now this 🎣 custom hook 🎣 is reusable 🧙🏾‍♂️

  // key -- 'React' 
*/
const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = useState(
    localStorage.getItem(key) || initialState
  );

  useEffect(() => {
    localStorage.setItem(key, value)
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
  const stories = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0
    },
    {
      title: 'Redux',
      url: 'https://reduxjs.org',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1
    },
  ];

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const handleSearch = event => {
    console.log('%c Event Triggred', 'color: orange; font-weight: bold;');
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div>
      <h1>Hacker Stories</h1>
      <InputWithLabel 
        id="search"
        label="Search"
        value={searchTerm}
        onInputChange={handleSearch}
      />
      <List list={searchedStories} />
    </div>
  );
};

const InputWithLabel = ({ 
  id, 
  label, 
  value, 
  type = 'text',
  onInputChange 
}) => (
  <>
    <label htmlFor={id}>{label}</label>
    &nbsp;
    <input 
      id={id}
      type={type}
      value={value}
      onChange={onInputChange}
    />
  </>
);

const List = ({ list }) => list.map(item => <Item key={item.objectID} item={item} />);

const Item = ({ item }) => (
  <div>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
  </div>
)

export default App;