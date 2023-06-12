'use client';

import {useState, useEffect} from 'react';

import PromptCard from './PromptCard';

const PromptCardList = ({data, handleTagClick}) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        >
          {/* {console.log(post)} */}
        </PromptCard>
      ))}
    </div>
  );
};


const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);

  //Search States
  const [searchText, setSearchText] = useState('');
  const [searchTimeout, setSearchTimeout] = useState('');
  const [searchResults, setSearchResults] = useState('');


  const fetchPosts = async () => {
    const response = await fetch('/api/prompt');
    const data = await response.json();

    setAllPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  // console.log(posts, 'all')

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); //'i' flag for case-insensitive search

    return allPosts.filter(
      (item) => regex.test(item.creator.username) || regex.test(item.tag) || regex.test(item.prompt)
    );
  };

  const handleSearchTextChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounch method
    setSearchTimeout(() => {
      const searchResult = filterPrompts(e.target.value);
      setSearchResults(searchResult);
    }, 500);
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchResults(searchResult);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchTextChange}
          required
          className='search_input peer'
        />
      </form>

      <PromptCardList
        data={searchResults ? searchResults : allPosts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;