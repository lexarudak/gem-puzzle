import music from './sound_15.mp3';
import './index.html'
import './index.scss'
import {setArr, showMenu, hideMenu,} from './js/functions.js'


let state = {
  fieldSize: 4,
  currentField: [],
  moves: 0,
  seconds: 0,
  minutes: 0,
}

let top = {
  3: [[120, 'student1', '04:20'], [130, 'student2', '04:20'], [140, 'student3', '04:20']],
  4: [[320, 'student1', '04:20'], [330, 'student2', '04:20'], [340, 'student3', '04:20']],
  5: [[520, 'student1', '04:20'], [530, 'student2', '04:20'], [540, 'student3', '04:20']],
  6: [[720, 'student1', '04:20'], [730, 'student2', '04:20'], [740, 'student3', '04:20']],
  7: [[920, 'student1', '04:20'], [930, 'student2', '04:20'], [940, 'student3', '04:20']],
  8: [[1120, 'student1', '04:20'], [1130, 'student2', '04:20'], [1140, 'student3', '04:20']],
}

let available = true
let availableTimer = true
let soundOn = false
let currentBlock
let currentBlockPosition


const savedTop = JSON.parse(localStorage.getItem('top'))
if (savedTop !== null) {
  top = savedTop
}

const savedGame = JSON.parse(localStorage.getItem('game'))
if (savedGame !== null) {
  state = savedGame
}



const bodyBox = document.createElement('div')
bodyBox.classList.add('bodyBox')
const nav = document.createElement('ul')
nav.classList.add('nav')
    const start = document.createElement('li')
    start.innerHTML = 'Shuffle and start'
    start.classList.add('start', 'navButton', 'active')
    const sound = document.createElement('li')
    sound.innerHTML = 'Sound'
    sound.classList.add('sound', 'navButton')
    sound.addEventListener('click', function() {
      sound.classList.toggle('active')
      if (soundOn === false ) {
        soundOn = true
      } else {
        soundOn = false
      }
    })
    const save = document.createElement('li')
    save.innerHTML = 'Save'
    save.classList.add('save', 'navButton', 'active')
    save.addEventListener('click', saveGame)
    const result = document.createElement('li')
    result.innerHTML = 'Results'
    result.classList.add('result', 'navButton', 'active')
    result.addEventListener('click', showPopupTop)
    const xButton = document.createElement('li')
    const xButtonSpan1 = document.createElement('span')
    xButtonSpan1.classList.add('xButtonSpan1')
    const xButtonSpan2 = document.createElement('span')
    xButtonSpan2.classList.add('xButtonSpan2')
    xButton.append(xButtonSpan1, xButtonSpan2)
    xButton.classList.add('xButton')
    xButton.addEventListener('click', hideMenu)
    xButton.addEventListener('click', hidePausePopup)
nav.append(start, sound, save, result, xButton)
nav.addEventListener('click', function(e) {
  if(e.target.closest('.navButton')) {
    hideMenu()
    hidePausePopup()
  }
})

const burgerButton = document.createElement('div')
burgerButton.classList.add('burgerButton')
burgerButton.addEventListener('click', showMenu)
burgerButton.addEventListener('click', showPausePopup)
    const burgerSpan1 = document.createElement('span')
    const burgerSpan2 = document.createElement('span')
    const burgerSpan3 = document.createElement('span')
burgerButton.append(burgerSpan1, burgerSpan2, burgerSpan3)

const infoBar = document.createElement('div')
infoBar.classList.add('infoBar')
    const moves = document.createElement('div')
    moves.classList.add('moves')
    const movesText = document.createElement('span')
    movesText.classList.add('movesText')
    movesText.innerHTML = 'Moves: '
    const movesNum = document.createElement('span')
    movesNum.classList.add('movesNum', 'numbers')
    movesNum.innerHTML = state.moves
    moves.append(movesText, movesNum)

    const time = document.createElement('div')
    time.classList.add('time')
    const timeText = document.createElement('span')
    timeText.classList.add('timeText')
    timeText.innerHTML = 'Time: '
    const timeNum = document.createElement('span')
    timeNum.classList.add('timeNum', 'numbers')
    const timeMinutes = document.createElement('span')
    timeMinutes.innerHTML = state.minutes.toString().padStart(2, 0)
    const timeSeconds = document.createElement('span')
    timeSeconds.innerHTML = state.seconds.toString().padStart(2, 0)
    timeNum.append(timeMinutes, ':' , timeSeconds)
    time.append(timeText, timeNum)
infoBar.append(moves, time)

const playField = document.createElement('ul')
playField.classList.add('playField', `size${state.fieldSize}`)
playField.addEventListener('click', function(e){
  go((e), state.currentField, state.fieldSize) 
})





const sizeInfo = document.createElement('div')
sizeInfo.classList.add('sizeInfo')
    const sizeInfoText = document.createElement('span')
    sizeInfoText.classList.add('sizeInfoText')
    sizeInfoText.innerHTML = 'Frame size:'
    const sizeInfoSize = document.createElement('span')
    sizeInfoSize.classList.add('sizeInfoSize', 'numbers')
    sizeInfoSize.innerHTML = `${state.fieldSize}x${state.fieldSize}`
sizeInfo.append(sizeInfoText, sizeInfoSize)

const sizeButtons = document.createElement('ul')
sizeButtons.classList.add('sizeButtons')

for (let i = 3; i < 9; i++ ) {
const li = document.createElement('li')
 const radio = document.createElement('input')
 radio.classList.add('radioInput')
 radio.setAttribute('type', 'radio')
 radio.setAttribute('name', 'radioSize')
 radio.setAttribute('value', `${i}`)
 radio.setAttribute('id', `size${i}`)
 const label = document.createElement('label')
 label.setAttribute('for', `size${i}`)
 label.classList.add(`radio${i}`, 'radioButton', 'numbers')
 if (i === 4) {
   radio.setAttribute('checked', 'checked')
 }
 label.innerHTML = `${i}x${i}`
 label.append(radio)
 li.append(label)
 sizeButtons.appendChild(li)
}

const popupPause = document.createElement('div')
popupPause.classList.add('popupPause')
popupPause.addEventListener('click', hideMenu)
popupPause.addEventListener('click', hidePausePopup)

const popupTop = document.createElement('div')
popupTop.classList.add('popupTop')
popupTop.addEventListener('click', hidePopupTop)
    const popupTopTitle = document.createElement('span')
    popupTopTitle.classList.add('popupTopTitle')
    const popupTopUl = document.createElement('ul')
    popupTopUl.classList.add('popupTopUl')
popupTop.append(popupTopTitle, popupTopUl)

const popupWin = document.createElement('div')
popupWin.classList.add('popupWin')
    const winTitle = document.createElement('h1')
    winTitle.classList.add('winTitle')
    winTitle.innerHTML = `Hooray!`
    const winText = document.createElement('span')
    winText.classList.add('winText')
    const winButton = document.createElement('div')
    winButton.classList.add('navButton', 'active')
    winButton.innerHTML = 'Ok'


popupWin.append(winTitle, winText, winButton)


bodyBox.append(nav, infoBar, playField, sizeInfo, sizeButtons)
document.body.append(bodyBox, popupPause, burgerButton, popupTop, popupWin)


let newArr
if (savedGame !== null) {
  newArr = state.currentField
} else {
  newArr = shuffle(setArr(state.fieldSize))
}
shuffleAndStart(newArr)
state.currentField = newArr

function startNewGame () {
   while (playField.lastChild) {
    playField.lastChild.remove()
  }
  const newDeck = setArr(state.fieldSize)
  const shuffledDeck = shuffle(newDeck)
  shuffleAndStart(shuffledDeck)
  state.currentField = shuffledDeck
  state.moves = 0
  movesNum.innerHTML = state.moves
  resetTimer()
  localStorage.setItem('game', null)
}

start.addEventListener('click', startNewGame)


//
function saveGame () {
  localStorage.setItem('game', JSON.stringify(state))
}

function saveTop () {
  localStorage.setItem('top', JSON.stringify(top))
}

function isWin () {
  let res = 0
  state.currentField.forEach((value, index, arr) => {
    if(index === arr.length - 1 && value === 0) {
      res++
    } else {
      if (value === index + 1) {
        res++
      }
    }
  })
  if (res === state.fieldSize * state.fieldSize) {
    const moves = state.moves
    const time = state.minutes.toString().padStart(2, 0) + ':' + state.seconds.toString().padStart(2, 0)
    popupWin.classList.add('active')
    winText.insertAdjacentHTML("afterbegin", `You solved the puzzle in <span>${time}</span> and <span>${moves}</span> moves!`)
    
    if (top[state.fieldSize].length < 10 || top[state.fieldSize][9][0] >  moves) {

      const nameInput = document.createElement('input')
      nameInput.classList.add('nameInput')
      nameInput.setAttribute('placeholder', 'Enter your name')
      nameInput.setAttribute('type', 'text')
      nameInput.setAttribute('maxlength', '10')
      winText.after(nameInput)
      winButton.innerHTML = 'Save result'
      winButton.addEventListener('click', function() {
        popupWin.classList.remove('active')
        let playerName = 'student1'
        if (nameInput.value.length >= 1) {
          playerName = nameInput.value
        }
        if (top[state.fieldSize][9]) {
          top[state.fieldSize].pop()
        }
        
        
        top[state.fieldSize].push([moves, playerName, time])
        top[state.fieldSize] = top[state.fieldSize].sort(function (a, b) {
          if (a[0] < b[0]) {
            return -1
          } else {
            return 1
          }
          
        })
        popupWin.classList.remove('active')
        saveTop()
        nameInput.remove()
        winText.innerHTML = ''  
        startNewGame()
      }, {'once': true})
    } else {
      winButton.addEventListener('click', function(){
      popupWin.classList.remove('active') 
      winText.innerHTML = ''  
      startNewGame()
    },{'once': true })
    }

  }
}


function showPopupTop () {

  popupTopTitle.innerHTML = `TOP of ${state.fieldSize}x${state.fieldSize}`
  
  for( let i = 0; i <= 10; i++){
    const li = document.createElement('li')
    const num = document.createElement('span')
    num.classList.add('topNum', 'numbers')
    const name = document.createElement('span')
    name.classList.add('topName', 'numbers')
    const moves = document.createElement('span')
    moves.classList.add('topMoves', 'numbers')
    const time = document.createElement('span')
    time.classList.add('topTime', 'numbers')

    if (i === 0) {
      num.innerHTML = '#'
      name.innerHTML = 'Name'
      moves.innerHTML = 'Moves'
      time.innerHTML = 'Time'
    } else {

    num.innerHTML = i

    if (top[state.fieldSize][i - 1]){
      name.innerHTML = top[state.fieldSize][i - 1][1]
    } else {
      name.innerHTML = '---'
    }
    if (top[state.fieldSize][i - 1]){
      moves.innerHTML = top[state.fieldSize][i - 1][0]
    } else {
      moves.innerHTML = '---'
    }
    if (top[state.fieldSize][i - 1]){
      time.innerHTML = top[state.fieldSize][i - 1][2]
    } else {
      time.innerHTML = '---'
    }
    }
    li.append(num, name, moves, time)
    popupTopUl.append(li)
  }
  popupTop.classList.add('active')
  
}

function hidePopupTop () {
  popupTop.classList.remove('active')
  for (let i = 0; i <= 10; i++ ) {
    popupTopUl.lastChild.remove()
  }
}

function isPossible (arr) {
  let res = 0
  let i = 0
  let answer

  while (i < arr.length) {
    const currentNum = arr[i]
    arr.forEach((value, index, arr) => {
      if (index > i) {
        if (value < currentNum && value !== 0) {
          res++
        }
      }
    })
    i++
  }
  i = 0
  if (res % 2 === 0) {
    answer = true
  } else {
    answer = false
  }
  res = 0
  return answer
}

function shuffle (arr) {
const arr2 = arr.map((value) => {
    return [Math.random(), value]
  }).sort().map((newValue) => {
      return newValue[1]
    })
  if (isPossible(arr2)) {
    return arr2
  } else {
   return shuffle(arr)
  }
}

function shuffleAndStart (arr) {
  
  const field = document.querySelector('.playField')
  for (let i = 0; i < arr.length; i++) {
    const block = document.createElement('li')
    block.setAttribute('id', `${arr[i]}`)
    block.innerHTML = arr[i]
    if (arr[i] === 0) {
      block.classList.add('nullBlock')
      block.addEventListener('drop', drop)
      block.addEventListener('dragover', dragOver)
    } else {
      block.setAttribute('draggable', 'true')
      block.addEventListener('dragstart', dragStart)
      block.addEventListener('dragend', dragEnd)
    }
    field.append(block)
  }
  
}

function playSound () {
  if (soundOn) {
    const newMusic = new Audio
    newMusic.src = music
    newMusic.volume = 1
    newMusic.play()
  }
}

function changeFieldSize() {
  playField.classList.remove(`size${state.fieldSize}`)
  const radioInput = document.querySelector('input[name="radioSize"]:checked').value
  state.fieldSize = Number(radioInput)
  playField.classList.add(`size${state.fieldSize}`)
  sizeInfoSize.innerHTML = `${radioInput}x${radioInput}`
  while (playField.lastChild) {
    playField.lastChild.remove()
    
  }
  const newDeck = setArr(state.fieldSize)
  const shuffledDeck = shuffle(newDeck)
  shuffleAndStart(shuffledDeck)
  state.currentField = shuffledDeck
  state.moves = 0
  movesNum.innerHTML = state.moves
  resetTimer()
  localStorage.setItem('game', null)
}

function startTimer() {
  if (availableTimer === false) {
  if (state.seconds === 59) {
    state.seconds = 0
    state.minutes++
  } else {
    state.seconds++
  }
  timeSeconds.innerHTML = state.seconds.toString().padStart(2, 0)
  timeMinutes.innerHTML = state.minutes.toString().padStart(2, 0)
  setTimeout(startTimer, 1000)      
  }
}

function resetTimer() {
    availableTimer = true
    state.seconds = 0
    state.minutes = 0
    timeSeconds.innerHTML = state.seconds.toString().padStart(2, 0)
    timeMinutes.innerHTML = state.minutes.toString().padStart(2, 0)
}



function showPausePopup() {
  popupPause.classList.add('active')
}

function hidePausePopup() {
  popupPause.classList.remove('active')
}

function go (click, arr, fieldSize) {

  if (available) {
  const field = document.querySelector('.playField')
  let nullBlock = document.getElementById('0')
  let block = document.getElementById(click.target.id)
  let blockPosition = arr.indexOf(Number(click.target.id))
  let nullPosition = arr.indexOf(0)
  let privBlock

  if (blockPosition === nullPosition - fieldSize) {
    available = false
    state.moves++
    movesNum.innerHTML = state.moves
    privBlock = document.getElementById(arr[nullPosition - fieldSize + 1].toString())
    block.classList.add('toBottom')
    block.addEventListener('animationend', function() {
      privBlock = document.getElementById(arr[nullPosition - fieldSize + 1].toString())
      privBlock.before(field.replaceChild(block, nullBlock))
      state.currentField[nullPosition] = Number(click.target.id)
      state.currentField[blockPosition] = 0
      this.classList.remove('toBottom')
      available = true
        isWin()
    }, {'once': true})
    playSound()
      if (availableTimer) {
    availableTimer = false
    startTimer()
  }
      
  }
  if (blockPosition === nullPosition + fieldSize) {
    available = false
    state.moves++
    movesNum.innerHTML = state.moves

    block.classList.add('toTop')
    block.addEventListener('animationend', function() {
    privBlock = document.getElementById(arr[nullPosition + fieldSize - 1].toString())
    privBlock.after(field.replaceChild(block, nullBlock))
    state.currentField[nullPosition] = Number(click.target.id)
    state.currentField[blockPosition] = 0
    this.classList.remove('toTop')
    available = true
      isWin()
    }, {'once': true})
    playSound()
      if (availableTimer) {
    availableTimer = false
    startTimer()
  }
  }
  if (blockPosition === nullPosition + 1 && (blockPosition % fieldSize !== 0)) {
    available = false
    state.moves++
    movesNum.innerHTML = state.moves

    block.classList.add('toLeft')
    block.addEventListener('animationend', function() {
    block.after(field.replaceChild(block, nullBlock))
    state.currentField[nullPosition] = Number(click.target.id)
    state.currentField[blockPosition] = 0

    this.classList.remove('toLeft')
    available = true
      isWin()
    }, {'once': true})
    playSound()
      if (availableTimer) {
    availableTimer = false
    startTimer()
  }
  }
  if (blockPosition === nullPosition - 1 && nullPosition % fieldSize !== 0) {
    available = false
    state.moves++
    movesNum.innerHTML = state.moves
    
    block.classList.add('toRight')
    block.addEventListener('animationend', function() {
      
    block.before(field.replaceChild(block, nullBlock))
    state.currentField[nullPosition] = Number(click.target.id)
    state.currentField[blockPosition] = 0
    this.classList.remove('toRight')
    available = true
    isWin()
    }, {'once': true})
    playSound()
    if (availableTimer) {
    availableTimer = false
    startTimer()
  }
  }   
  }
}


sizeButtons.addEventListener('click', function(e) {
  if (e.target.closest('li')) {
    changeFieldSize()
  }
})

function dragStart (e) {
  console.log(e.target);
  currentBlock = e.target
  currentBlockPosition = state.currentField.indexOf(Number(currentBlock.id))
  let nullPosition = state.currentField.indexOf(0)
    if (currentBlockPosition === nullPosition - state.fieldSize ||
      currentBlockPosition === nullPosition + state.fieldSize ||
      currentBlockPosition === nullPosition - 1 && nullPosition % state.fieldSize !== 0 ||
      currentBlockPosition === nullPosition + 1 && (currentBlockPosition % state.fieldSize !== 0))  {

      currentBlock.classList.add('dragstart', 'hide')
  } 
}

function dragEnd (e) {
  e.target.classList.remove('hide', 'dragstart')
}

function dragOver (e) {
  e.preventDefault()
}

function drop (e) {
  console.log(e.target);
  const field = document.querySelector('.playField')
  let arr = state.currentField
  let fieldSize = state.fieldSize
  let nullBlock = e.target
  let nullPosition = arr.indexOf(0)
  let privBlock

  if (currentBlockPosition === nullPosition - fieldSize) {
      state.moves++
      movesNum.innerHTML = state.moves
      privBlock = document.getElementById(arr[nullPosition - fieldSize + 1].toString())
      privBlock.before(field.replaceChild(currentBlock, nullBlock))
      state.currentField[nullPosition] = Number(currentBlock.id)
      state.currentField[currentBlockPosition] = 0
      isWin()
      playSound()
      if (availableTimer) {
        availableTimer = false
        startTimer()
      }
    }
  if (currentBlockPosition === nullPosition + fieldSize) {
      state.moves++
      movesNum.innerHTML = state.moves
      privBlock = document.getElementById(arr[nullPosition + fieldSize - 1].toString())
      privBlock.after(field.replaceChild(currentBlock, nullBlock))
      state.currentField[nullPosition] = Number(currentBlock.id)
      state.currentField[currentBlockPosition] = 0
      isWin()
      playSound()
      if (availableTimer) {
        availableTimer = false
        startTimer()
      }
    }
  if (currentBlockPosition === nullPosition + 1 && (currentBlockPosition % fieldSize !== 0)) {
    state.moves++
    movesNum.innerHTML = state.moves
    currentBlock.after(field.replaceChild(currentBlock, nullBlock))
    state.currentField[nullPosition] = Number(currentBlock.id)
    state.currentField[currentBlockPosition] = 0
    isWin()
    playSound()
    if (availableTimer) {
      availableTimer = false
      startTimer()
    }
  }
  if (currentBlockPosition === nullPosition - 1 && nullPosition % fieldSize !== 0) {
    state.moves++
    movesNum.innerHTML = state.moves
    currentBlock.before(field.replaceChild(currentBlock, nullBlock))
    state.currentField[nullPosition] = Number(currentBlock.id)
    state.currentField[currentBlockPosition] = 0
    isWin()
    playSound()
    if (availableTimer) {
      availableTimer = false
      startTimer()
    }
  }
}