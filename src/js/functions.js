



export function showMenu () {
  const nav = document.querySelector('.nav')
  nav.classList.add('active')
}

export function hideMenu () {
  const nav = document.querySelector('.nav')
  nav.classList.remove('active')
}

export function setArr (fieldSize) {
  const arr = []
  for (let i = 0; i < fieldSize * fieldSize; i++) {
    arr.push(i)
  }
  return arr
}







// && (blockPosition % blockPosition !== 0)