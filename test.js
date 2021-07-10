const rooms = {
  'asdofij': {
    'aosifj': { name: 'redwan' },
    'aisdfjio': {name: 'jack'}
  },
  '234tgeaf': {
    'rq32qrf': { name: 'hom' },
    'asgwqr32': {name: 'john'}
  },
}



console.log(rooms)


console.log({...rooms, '234tgeaf': {'asgwqr32': undefined}  })