import React from "react"
import './App.css';
import Title from "./components/Title"
import Form from "./components/Form"


const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};


const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};


function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: "150px", border: "1px solid red" }} alt='' />
    </li>
  );
}


function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장하세요.</div>
  };

  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}


const MainCard = ({ img, onHeartClick, alreadyFavorites }) => {
  const heartIcon = alreadyFavorites ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};



const App = () => {
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem('counter')
  });

  const [mainCat, setMainCat] = React.useState('');

  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem('favorites') || [];
  });

  //배열 내에 이미 존재할 경우 
  const alreadyFavorites = favorites.includes(mainCat);

  async function setInitialCat() {
    const newCat = await fetchCat("First Cat");
    setMainCat(newCat);
  };

  React.useEffect(() => {
    setInitialCat();
  }, []);


  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    setMainCat(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem('counter', nextCounter);
      return nextCounter;
    });
  };

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem('favorites', nextFavorites);
  };

  const counterTitle = counter === null ? "" : counter + "번째 ";

  return (
    <div>
      <Title>{counterTitle}고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorites={alreadyFavorites} />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
