import React, {useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid'
import { randomColor } from 'randomcolor'
import Draggable from 'react-draggable'
import './App.css';

function App() {
//стейт для тодо  элемента
const [item, setItem] = useState('');
//стейт для элементов, которые помещаются в локал сторадж
//если там ничего нет, то это пустой массив
const [items, setItems ] = useState(
    JSON.parse(localStorage.getItem('items')) || []
);

useEffect( () => {
  localStorage.setItem('items', JSON.stringify(items))
}, [items]);

const newItem = () => {
  //console.log(item)
  if (item.trim() !== '') {
    const newItem = {
      id: uuidv4(),
      item: item,
      color: randomColor({
        luminosity: 'light',
      }),
      defaultPos: {
        x: 500,
        y: -500
      }
    }
    //добавление items в массив
    //спредим (...) существующий массив
    setItems((items) => [...items, newItem])
    setItem('')

  } else {
    alert('Enter is empty') 
    setItem('')
  }
}

const deleteNode = (id) => {
  // метод filter создает массив, который НЕ содержит элемент
  // в условии и обновляем стейт
  setItems(items.filter((item) => item.id !== id));
};

const updatePos = (data, index) => {
   let newArray = [...items]
   newArray[index].defaultPos = { x: data.x, y: data.y}
   setItems(newArray)
} 

const keyPress = (e) => {
  const code = e.keyCode || e.which
  if (code === 13) {
    newItem()
  }
}

  return (
    <div className="App">
      <div className = "wrapper">
        <input  
          value = {item}
          type = 'text' 
          placeholder='Enter something...'
          onChange={(e) => setItem(e.target.value)}
          onKeyPress={ (e) => keyPress(e) }  
        />
        <button className="enter" onClick={newItem}>ENTER</button>
      </div>
      {
        items.map((item, index) => {
          return (
            <Draggable 
              key = {index}
              defaultPosition={item.defaultPos}
              // первый аргумент не используем
              onStop={(_, data) => {
                updatePos(data, index)
              }}
            >
              <div className = "todo__item" style={{backgroundColor: item.color}}>
                {`${item.item}`}
                <button 
                  className='delete' 
                  onClick={() => deleteNode(item.id)}>
                  X
                </button>
              </div>  
            </Draggable>
          )
        })
      }    
    </div>
  );
}

export default App;
