window.run(resolve => {
  const details = document.createElement('details')
  details.setAttribute('id', 'riddle')

  const summary = document.createElement('summary')
  summary.innerHTML = `
I have multiple keys but only one lock. I have space but no room.
You can enter but can't leave. What am I?
  `
  details.appendChild(summary)

  const span = document.createElement('span')
  span.innerHTML = `A keyboard.`
  details.appendChild(span)

  resolve(details)
})
