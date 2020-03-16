import React, { useState, useReducer, useEffect, useRef } from 'react';

const initialStories = [
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

const getAsyncStories = () => 
  new Promise(resolve => 
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  );
 
const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STORIES':
      return action.payload
      break;
    case 'REMOVE_STORY':
      return state.filter(
        story => action.payload.objectID !== story.objectID
      );
    default:
      throw new Error();
  }
}

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
  const [stories, dispatchStories] = useReducer(storiesReducer, []);
  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAsyncStories()
      .then(result => {
        dispatchStories({
          type: 'SET_STORIES',
          payload: result.data.stories
        });
      setIsLoading(false);
    })
    .catch(() => setIsError(true));
  }, []);

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

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
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search</strong>
      </InputWithLabel>
      <hr />
      {isError && <p>Something went wrong ...</p>}
      {isLoading ? (
        <p>Is Loading ...</p>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const InputWithLabel = ({ 
  id, 
  value, 
  type = 'text',
  onInputChange,
  isFocused,
  children
}) => {
  // A - create a ref with the useRef hook
  const inputRef = useRef();
  // C - programming the focus on the input field when the component renders (or its dependencies change)
  useEffect(() => {
    if (isFocused && inputRef.current) {
      /* 
        D - since the ref is passed to the input field's ref attribute, its current property gives access to the element.
          Execute the focus programmatically as a side-effect, but only if isFocused is set and the current property is existent. 
      **/
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      {/* B - pass the ref into the input field's reserved ref attribute */}
      <input 
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

const List = ({ list, onRemoveItem }) => 
  list.map(item => (
    <Item
      key={item.objectID}
      item={item}
      onRemoveItem={onRemoveItem}
    />
  ));

const Item = ({ item, onRemoveItem }) => {
  function handleRemoveItem () {
    onRemoveItem(item);
  }
  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="buttton" onClick={handleRemoveItem}>
          Dismiss
        </button>
      </span>
    </div>
  )
}

export default App;