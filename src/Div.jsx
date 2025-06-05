function Div() {
    return(
        <>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: '10px', padding: '30px 0', justifyContent: 'center'}} className="dock-container">
          <div style={{height: '100px', width: '150px', backgroundColor: 'red'}} className="dock-item"></div>
          <div style={{height: '100px', width: '110px', backgroundColor: 'blue'}} className="dock-item"></div>
          <div style={{height: '100px', width: '100px', backgroundColor: 'green'}} className="dock-item"></div>
          <div style={{height: '100px', width: '100px', backgroundColor: 'yellow'}} className="dock-item"></div>
          <div style={{height: '100px', width: '100px', backgroundColor: 'purple'}} className="dock-item"></div>
          <div style={{height: '100px', width: '100px', backgroundColor: 'orange'}} className="dock-item"></div>
          <div style={{height: '100px', width: '100px', backgroundColor: 'pink'}} className="dock-item"></div>
          <div style={{height: '100px', width: '100px', backgroundColor: 'brown'}} className="dock-item"></div>
          <div style={{height: '100px', width: '100px', backgroundColor: 'gray'}} className="dock-item"></div>
          <div style={{height: '100px', width: '100px', backgroundColor: 'black'}} className="dock-item"></div>
        </div>


        <div className="main">
        <div className="dock-items01" style={{height: '100px', width: '80px', backgroundColor: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Color Theme</div>
        </div>
        </>
    )
}

export default Div;
