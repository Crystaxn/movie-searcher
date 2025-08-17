import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faStarHalfStroke, faSearch, faHistory, faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { useEffect } from "react";

function MovieSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [genreMap, setGenreMap] = useState({});
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false)
  const [time, setTime] = useState('');
  const [darkMode, setDarkMode] = useState(false)
  

  function historyFunc(){
    if (!searchQuery.trim()) return;

  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  setHistory((prevHistory) => {
    const filteredHistory = prevHistory.filter(item => item.query !== searchQuery);
    return [{ query: searchQuery, time: currentTime }, ...filteredHistory];
  });
   
  }
  function handlePopup(movieId) {
    setSelectedMovieId(prev => (prev === movieId ? null : movieId));
  }
  function Stars({ rating }) {
    const betterRating = Math.floor(rating)
    const starRating = betterRating / 2; // Convert 1–10 to 0–5
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span style={{ color: "#FFD700" , fontSize: "1.2em" }}>
        {Array(fullStars).fill().map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} />))}
        {hasHalfStar ? <FontAwesomeIcon icon={faStarHalfStroke}></FontAwesomeIcon> : ""}
        {Array(emptyStars).fill().map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStarRegular} />))}
      </span>
    );
  }
  function HistoryPopup(){
    return(<>
    <div style={{display: showHistory === true ? 'flex' : 'none'}}>
        <div style={{backgroundColor: "black",
                          position: "fixed",
                          width: "100%",
                          height: "100%",
                          top: "50%",
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 1000,
                          opacity: "0.5",
                  }}></div>
          <div className={`hisPopup ${showHistory === true ? "slide-in" : "slide-out"}`}style={{display: "flex",
                          overflowY: 'auto',
                          alignItems: "flex-start",
                          flexDirection: "column",
                          zIndex: 1001,
                          minWidth: "85%",
                          maxHeight: "80%",
                          top: "50%",
                          left: '50%',
                          scrollbarWidth: "none", // Firefox
                          msOverflowStyle: "none",
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: darkMode === true ? "black" : "#F8F8FF",
                          border: "1px solid black",
                          borderRadius: "10px",
                          position: "fixed",
                          fontFamily: "sans-serif"}}>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" , padding: '8px 0px', backgroundColor: darkMode === true ? "black" : "white"}}>
                              <div style={{display:"flex", alignItems: "center", gap: 10, paddingLeft: "10px"}}>
          <h1 style={{ margin: 0, fontSize: "2.2em",color: darkMode === true ? "white":"black",}}>History</h1>
          <FontAwesomeIcon icon={faHistory} style={{fontSize: "2em"}}></FontAwesomeIcon>
          </div>
            <button style={{ height: "50px", width: "50px" ,border: "none", alignItems: "center", fontSize: "2em", display: "flex", justifyContent: "center", borderRadius: "10px",backgroundColor: darkMode === true ? "#141414":"#F8F8FF", color: darkMode === true ? "white":"black",}} 
              
              onClick={() => {setShowHistory(false)}}>✖</button>

            </div>
            <div style={{display: 'flex', flexDirection: 'column', width: "100%", alignItems: "center", justifyItems: "center"}}>
            {history.map((searches, index) => (
             
              <button onClick={() => {setSearchQuery(searches.query);
                
                setShowHistory(false)
                search();
              }} className="search" key={index} style={{width: "100%", display: "flex",justifyContent: "center",  border: "none",  backgroundColor:darkMode === true ? "#343434": "#DCDCDC",}}>
              <div className="searches"  style={{fontSize: "1.3em", display: 'flex',justifyContent: "space-between",  padding: "0 12px",width: "95%",borderBottom: "1px solid black",}}>
              
                <p style={{color: darkMode === true ? "white":"black",}}><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>{searches.query}</p>
              
                <p style={{color: darkMode === true ? "white":"black",}}>{searches.time}</p>
              </div>
              </button>
           
            ))}
            </div>
          </div>
          </div>
    </>)
  }
 
  useEffect(() => {
    fetch("https://api.themoviedb.org/3/genre/movie/list?language=en-US", {
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZWY2Y2YyZjFlZTU4NGY0YTRjNjlkMDY3OGE2NGViNyIsIm5iZiI6MTc1NTA3MDUyNy4wMjEsInN1YiI6IjY4OWM0MDNmMmY3NjBiMTQ5ZDFhMzU0ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3yzVoyOXww0-Y9aBUtMG-WrN5yY1TFO3CHQu_8pByj0",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        data.genres.forEach((genre) => {
          map[genre.id] = genre.name;
        });
        setGenreMap(map);
      });
  }, []);
  function getGenreNames(genreIds) {
    return genreIds.map((id) => genreMap[id]).filter(Boolean);
  }

  function search() {

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZWY2Y2YyZjFlZTU4NGY0YTRjNjlkMDY3OGE2NGViNyIsIm5iZiI6MTc1NTA3MDUyNy4wMjEsInN1YiI6IjY4OWM0MDNmMmY3NjBiMTQ5ZDFhMzU0ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3yzVoyOXww0-Y9aBUtMG-WrN5yY1TFO3CHQu_8pByj0",
      },
    };

    fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        searchQuery
      )}&include_adult=false&language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        setMovies(res.results || []);
        
      })
      .catch((err) => console.error(err));
      historyFunc()
      
  }

  return (
    <>
      <div
      
        style={{
          backgroundColor: darkMode === true ? "#121212":"#F9F9F9",
          display: "flex",
          boxShadow:
            "0 0 10px rgb(97, 97, 97), 0 0 10px rgb(97, 97, 97), 0 0 10px rgb(97, 97, 97)",
          zIndex: "1000",
          height: "60px",
          position: "fixed",
          top: "0",
          left: "0",
          width: "100%",
          alignItems: "center",
          paddingLeft: "30px",
          fontFamily: "sans-serif",
          justifyContent: "space-between",
        
          
        }}
      >
        <h1 style={{color: darkMode === true ? "white":"black",}}>Uyfer</h1> <div style={{ marginRight: "50px", }}><button style={{padding: "5px", fontSize: "1.6em" , borderRadius: "50%", border: "none", marginRight: "20px",backgroundColor:darkMode === true ? "#343434": "#DCDCDC", }} onClick={() => {setDarkMode(!darkMode); document.body.classList.toggle('darkmode')}}><FontAwesomeIcon style={{color: darkMode === true ? "white":"black",}} icon={darkMode === true ? faMoon : faSun}></FontAwesomeIcon></button> 
        <button onClick={() => {setShowHistory(true);}}style={{padding: "5px",fontSize: "1.6em", borderRadius: "50%", border: "none",backgroundColor:darkMode === true ? "#343434": "#DCDCDC", }}><FontAwesomeIcon style={{color: darkMode === true ? "white":"black",}} icon={faHistory}></FontAwesomeIcon></button></div>
      </div>
        <HistoryPopup></HistoryPopup>
      <div
        style={{
          paddingTop: "30px",
          backgroundColor: darkMode === true ? "#121212":"#F7F7F7",
          width: "80%",
          justifySelf: "center",
          padding: "8px 16px",
          border: "1px solid grey",
          fontFamily: "sans-serif",
          marginTop: "30px",
          fontSize: "1.3em",
          alignItems: "center",
          margin: "30px",
          borderRadius: "10px",
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", alignItems: "center", backgroundColor:darkMode === true ? "#343434": "#DCDCDC", padding: 50 }}
        >
          <h1 style={{color: darkMode === true ? "white":"black",}}>Search For A Movie!</h1>
          <div
            style={{
              display: "flex",
              fontSize: "1em",
              border: "1px solid black",
              backgroundColor: darkMode === true ? "black":"#F2F2F2",
              borderRadius: "40px",
              overflow: "hidden",
              width: "fit-content",
              margin: 10,
              
            }}
          >
            <input

              type="text"
              placeholder="Type Movie Name"
              id="search"
              style={{
                padding: "8px",
                width: "170px"
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={search}
              style={{
                backgroundColor: darkMode === true ? "black":"#2E2E2E",
                color: "white",
                padding: "8px 16px",
              }}
            >
              Find
            </button>
          </div>
        </div>

        {/* ✅ Movie Results */}
        <div style={{ }}>
          {movies.length > 0 && (
            <div>
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", color: darkMode === true ? 'white':'grey'}}>
              Search:<FontAwesomeIcon icon={faSearch}></FontAwesomeIcon><p style={{color: darkMode === true ? "white":"grey",}}>{searchQuery}</p>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "20px",
                }}
              >
                {movies.map((movie) => (
                  <div key={movie.id}>
                    <div

                      style={{
                        border: darkMode === true ? "1px solid grey" : "1px solid #ccc" ,
                        borderRadius: "8px",
                        padding: "10px",
                        backgroundColor: darkMode === true ? "#1C1B1F":"#fff",
                        boxShadow: darkMode === true ? "0 3px #101010, 0 0 3px #101010, 0 0 3px #101010":
                          "0 0 3px rgb(97, 97, 97), 0 0 3px rgb(97, 97, 97), 0 0 3px rgb(97, 97, 97)", 
                        minHeight: "95%",
                        maxHeight: "95%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}
                      className="movies"
                    >
                      <div>
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                            alt={movie.title}
                            style={{ width: "100%", borderRadius: "5px", border: darkMode === true ? "1px solid #ccc" : "none"}}
                          ></img>
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "300px",
                              backgroundColor: darkMode === true ? "black":"#ddd",
                              color: darkMode === true ? "white": "black",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "5px",
                              border: darkMode === true ? "1px solid #ccc" : "none"
                            }}
                          >
                            No Image
                          </div>

                        )}

                        <h3 style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                          height: "fit-content",
                          margin: '5px',
                          fontSize: "1em",
                          borderBottom:  darkMode === true ? "1px white solid":"1px black solid" ,
                          color: darkMode === true ? "white" : "black",
                          
                        }}>{movie.title}</h3>

                      </div>
                      <button style={{ color: "white", width: "100%", padding: "15px 16px", fontWeight: "bold", border: "none", borderRadius: "10px" , marginTop: "10px", marginBottom:"10px"}} className="details-button" onClick={() => { handlePopup(movie.id) }}>Check Details</button>


                    </div>
                    {selectedMovieId === movie.id && (
                      <div>
                        <div className="popup-overlay" style={{
                          backgroundColor: darkMode === true ? "darkgray": "black",
                          position: "fixed",
                          width: "100%",
                          height: "100%",
                          top: "50%",
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          zIndex: 1000,
                          opacity: "0.5",

                        }}></div>
                        <div className={`movie-popup ${isClosing ? "slide-out" : "slide-in"}`} style={{
                          position: "fixed",
                          display: "flex",
                          overflowY: 'auto',
                          alignItems: "center",
                          padding: "16px",
                          zIndex: 1001,
                          minWidth: "85%",
                          maxHeight: "90%",
                          top: "50%",
                          left: '50%',
                          scrollbarWidth: "none", // Firefox
                          msOverflowStyle: "none",
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: darkMode === true ? "#141414":"#F8F8FF",
                          border: "1px solid black",
                          borderRadius: "10px",
                          gap: 10
                        }}>
                          <div className="useless" style={{
                            display: 'flex',

                            justifyContent: 'right',



                          }}>
                            <div className="uselesst" style={{ height: "50px", }}></div>
                            <div className="useless" style={{ width: "100%", justifyContent: "center", display: "flex" }}>
                              {movie.poster_path ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                  alt={movie.title}
                                  style={{ height: '100%', borderRadius: "10px" , border: darkMode === true ? "1px solid #ccc" : "none"}}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: "200px",
                                    height: "300px",
                                    backgroundColor: darkMode === true ? "black":"#ddd",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "5px",
                                     border: darkMode === true ? "1px solid #ccc" : "none"
                                  }}
                                >
                                  No Image
                                </div>
                              )}
                            </div>
                            <button className="mobile-close" style={{ height: "50px",  border: "none", alignItems: "center", fontSize: "2em", display: "flex", justifyContent: "center", borderRadius: "10px",backgroundColor: darkMode === true ? "#141414":"#F8F8FF", color: darkMode === true ? "white":"black",}} onClick={() => {
                              setIsClosing(true);
                              setTimeout(() => {
                                setSelectedMovieId(null);
                                setIsClosing(false);
                              }, 300)
                            }}>✖</button>
                          </div>
                          <div className="movie-info" style={{
                            backgroundColor: darkMode === true ? "#414141" :"#DCDCDC",
                            
                            borderRadius: "10px",
                            padding: '0 10px',
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            height: '100%',
                           
                            
                            justifyContent: "space-between",


                          }}>
                            {/* Inner scrollable content */}

                            <div>
                              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "10px" }}>
                                <h1 style={{ margin: "0" ,color: darkMode === true ? "white":"black",wordBreak: 'break-word',
                          overflowWrap: "break-word"}}>{movie.title}</h1>
                                <button className="pc-close" style={{ minWidth: "50px", height: "50px", backgroundColor: darkMode === true ? "#141414":"#F8F8FF", border: "none", alignItems: "center", fontSize: "2em", display: "flex", justifyContent: "center", borderRadius: "10px",color: darkMode === true ? "white":"black", }} onClick={() => {
                                  setIsClosing(true);
                                  setTimeout(() => {
                                    setSelectedMovieId(null);
                                    setIsClosing(false);
                                  }, 300)
                                }}>✖</button>
                              </div>
                              <div style={{ margin: '10px 0px', display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                {getGenreNames(movie.genre_ids).map((genre, index) => (
                                  <span
                                    key={index}
                                    style={{
                                      backgroundColor: darkMode === true ? "black":"white",
                                      color: darkMode === true ? "white":"black",
                                      padding: "7px 13px",
                                      borderRadius: "15px",
                                      fontSize: "0.8em",
                                      fontWeight: "bold",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {genre}
                                  </span>
                                ))}
                              </div>
                              <p style={{ margin: 10 ,color: darkMode === true ? "white":"black",}}>{movie.overview ? movie.overview : "No description available"
                              }</p>
                              <div style={{ display: 'flex', alignItems: 'center', }}>
                                <Stars  rating={movie.vote_average} />
                                <p className="star-info" style={{
                                  fontSize: "1.5em", margin: 5, fontWeight: "bold", display: 'block',color: darkMode === true ? "white":"black",
                                }}>{Math.trunc(movie.vote_average * 10) / 10}</p>
                              </div>
                              <p style={{ padding: "8px 16px", backgroundColor: darkMode === true ?"teal":"lightblue", borderRadius: "10px", margin: 3,color: darkMode === true ? "white":"black", }}>{movie.release_date ? movie.release_date : "No date available"}</p>


                            </div>
                            <div style={{
                              display: 'flex',
                              justifyContent: "space-between",
                              marginTop: '10px'
                            }}>



                            </div>

                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>

          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
          <p
            style={{
              display: "flex",
              alignItems: "flex-end",
              color: darkMode === true ? "white":"black",
              fontSize: "1.2em",
            }}
          >
            Created By Uyfer
          </p>
        </div>
      </div>
    </>
  );
}

export default MovieSearch;
