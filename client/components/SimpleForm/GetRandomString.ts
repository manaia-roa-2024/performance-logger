const ranges = [
  [48, 57],
  [95, 95],
  [65, 90],
  [97, 122]
]

const chars = (function(){
  const arr = []
  for (let range = 0; range < ranges.length; range++){
    for (let i = ranges[range][0]; i <= ranges[range][1]; i++){
      arr.push(String.fromCharCode(i))
    }
  }
  return arr
})()


function randomChar(start: number, end=chars.length){
  const rand = Math.random()
  const char = chars[Math.floor(rand * (end-start)) + start]
  
  return char
}

export default function getRandomHtmlId(num = 10){
  let text = ''
  for (let i = 0; i < num; i++){
    text += randomChar(i === 0 ? 10 : 0)
  }
  return text
}
