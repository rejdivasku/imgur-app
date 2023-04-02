import React, { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './store/hooks';
import { useFetchPostsQuery } from './store/slice';
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faComment, faEye, faBackward } from '@fortawesome/free-solid-svg-icons';
import Navbar from './components/Navbar';

function App() {
  const dispatch = useAppDispatch();

  const [numDogs, setNumDogs] = useState('hot');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const { data: postData, isFetching } = useFetchPostsQuery(numDogs);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isDetails, setIsDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>({});

  const openDetails = (item: any) => {
    setIsDetails(true);
    setSelectedItem(item);
  };

  const url = 'https://api.imgur.com/homepage/v1/messages/random?client_id=546c25a59c58ad7&filter%5Btype%5D=welcome';

  useEffect(() => {
    function handleScroll() {
      const scrollTop = document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight === scrollHeight) {
        setPage((prevCount) => prevCount + 1);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': 'Client-ID 546c25a59c58ad7'
          }
        });
        const data = await response.json();
        setMessage(data.message);
      } catch (error: any) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  return (
    isFetching ?
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
      : isDetails ?
        <div>
          <div style={{ background: '#171544' }}>
            <Navbar />
          </div>
          <div className='details-page'>
            <button style={{
              background: '#6432f9',
              borderRadius: '5px',
              color: '#fff',
              fontSize: '20px',
              padding: '8px',
              border: 'none',
              marginLeft: '20px',
              cursor: 'pointer',
              marginRight: 'auto'
            }} onClick={e => { setIsDetails(false) }}><FontAwesomeIcon icon={faBackward} /> Go Back</button>
            <div className='detail-comp'>
              {
                selectedItem.images_count > 0 && (selectedItem?.images[0]?.type == "image/jpeg" || selectedItem?.images[0]?.type == "image/png") ? <img src={selectedItem.images[0].link} style={{ objectFit: 'cover', overflow: 'auto' }} alt={selectedItem.description} /> :
                  selectedItem.images_count > 0 && (selectedItem?.images[0]?.type != "image/jpeg" || selectedItem?.images[0]?.type != "image/png") ?
                    <video autoPlay muted loop controls style={{ objectFit: 'cover', overflow: 'auto' }}>
                      <source src={selectedItem.images[0].link} />
                    </video> :
                    <video autoPlay muted loop controls style={{ objectFit: 'cover', overflow: 'auto' }}>
                      <source src={selectedItem.link} />
                    </video>
              }
              <span style={{
                padding: '10px',
                color: 'rgb(174, 216, 234)'
              }}>{selectedItem.title}</span>
              <div style={{ marginTop: 'auto' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px',
                  color: 'rgb(174, 216, 234)'
                }}>
                  <span><FontAwesomeIcon icon={faArrowUp} />{selectedItem.ups}<FontAwesomeIcon icon={faArrowDown} /></span>
                  <span><FontAwesomeIcon icon={faComment} />{selectedItem.comment_count}</span>
                  <span><FontAwesomeIcon icon={faEye} />{selectedItem.views}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        :
        <div className="App">
          <div className='header-img'>
            <Navbar />
            <h2 style={{ color: '#aed8ea' }}>{message}</h2>
            <div className="filter-select">
              <select className='select-filter' value={numDogs} onChange={(e) => { setNumDogs((e.target.value)); setPage(1) }}>
                <option value="hot">MOST VIRAL</option>
                <option value="top">HIGHEST SCORING</option>
                <option value="user">USER SUBMITTED</option>
              </select>
            </div>
          </div>

          <div className='post-item'>
            {
              postData?.data?.map((item: any, index: number) => (
                index > page * 10 ? null :
                  <div key={item?.id} className='item-inside' style={{ background: `linear-gradient(165deg, rgb(105, 216, 202) 0%, rgb(53, 146, 255) 50%, rgb(156, 49, 255) 100%)` }} onClick={e => { openDetails(item) }}>
                    {
                      item.images_count > 0 && (item?.images[0]?.type == "image/jpeg" || item?.images[0]?.type == "image/png") ? <img src={item.images[0].link} style={{ objectFit: 'cover', overflow: 'auto' }} alt={item.description} /> :
                        item.images_count > 0 && (item?.images[0]?.type != "image/jpeg" || item?.images[0]?.type != "image/png") ?
                          <video autoPlay muted loop controls style={{ objectFit: 'cover', overflow: 'auto' }}>
                            <source src={item.images[0].link} />
                          </video> :
                          <video autoPlay muted loop controls style={{ objectFit: 'cover', overflow: 'auto' }}>
                            <source src={item.link} />
                          </video>
                    }
                    <span style={{
                      marginRight: 'auto',
                      padding: '10px',
                      color: 'rgb(174, 216, 234)'
                    }}>{item.title}</span>
                    <div style={{ marginTop: 'auto' }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '10px',
                        color: 'rgb(174, 216, 234)'
                      }}>
                        <span><FontAwesomeIcon icon={faArrowUp} />{item.ups}<FontAwesomeIcon icon={faArrowDown} /></span>
                        <span><FontAwesomeIcon icon={faComment} />{item.comment_count}</span>
                        <span><FontAwesomeIcon icon={faEye} />{item.views}</span>
                      </div>
                    </div>
                  </div>
              ))}
          </div>
        </div >
  )
}

export default App