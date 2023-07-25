//
// https://stackoverflow.com/questions/65770449/react-onclick-not-working-in-any-of-my-browsers-but-for-colleagues-it-does
// https://en.wikipedia.org/wiki/Charlieplexing
//
export default function Instructions() {
  //
  const openInNewTab = (url) => {
    //console.log('openInNewTab ', url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }
  //
  const openLink = (event) => {
    event.stopPropagation()
    openInNewTab('https://en.wikipedia.org/wiki/Charlieplexing')
  }
  //
  return (
    <>
      <div className="interface">
        Charlieplexing Simulator:
        <br />
        Click on the background to power down all the wires.
        <br />
        Click on a SOURCE ('square') to cycle through its output states.
        <br />
        Click on a LED to power it up.
        <br />
        Zoom with the mouse wheel.
        <br />
        Pan with the shift+left_mouse.
        <br />
      </div>
      <div className="interface2">
        <a href="https://en.wikipedia.org/wiki/Charlieplexing" target="_blank">
          See Wikipedia Charlieplexing
        </a>
      </div>
    </>
  )
  //
}
//
//
// <button role="link" onClick={openLink}>
//   See https://en.wikipedia.org/wiki/Charlieplexing
// </button>
