let direction = 1;
let h_index = 0, p_index = 0;
let Heart, PPG;
let PPGV, HRV, SPO2V;
let maximum = 120;
function preload(){
  Heart = loadTable("../Data/Heart.csv", "csv", "header");
  PPG   = loadTable("../Data/PPG.csv", "csv", "header");
  HRV   = Heart.getColumn("hr");
  SPO2V = Heart.getColumn("spo2");
  PPGV  = PPG.getColumn("value");
}

function setup() {
  createCanvas(windowWidth * 0.8, windowHeight * 0.8);
  // noLoop();
  setSpeed( 1 );
}

function draw() {
  background(220);
  let pass_counter_h = 0, cross_over_index_f = 0, cross_over_index_l = 0;
  for(let i = 0, hi=0 ; i < maximum ; i++){
    // need to check last item
    let _p1 = PPG.rows[p_index+i]['arr'],
        _p2 = PPG.rows[p_index+i+1]['arr'],
        _h = Heart.rows[h_index+hi]['arr'],
        _fh = Heart.rows[h_index]['arr'];
    let P1 = parseInt(_p1[2]),
        P2 = parseInt(_p2[2]),
        H  = parseInt(_h[2]),
        S  = parseInt(_h[3]);
    let x1 = ( i ) * ( width / maximum ),
        x2 = (i+1) * ( width / maximum ),
        y1 = map( P1, 0, 180, height, 0 ),
        y2 = map( P2, 0, 180, height, 0 );

    // inverted
    stroke(255, 0,0);
    line( x1, y1, x2, y2 );
    
    // correct one
    stroke(0, 0, 255);
    line( x1, height*0.6-P1 + height/5, x2, height*0.6-P2 + height/5 );
    document.querySelector("#time").innerText = PPG.rows[p_index+i+1]['arr'][3];
    if( direction > 0 && dtot(_fh[4]) <= dtot(_p1[3].replace(/\.\d{3}/, "")) ){
      cross_over_index_f++;
      if( cross_over_index_f == 120 ){
        h_index++;
      }
    }
    if( direction < 0 && h_index > 0 && i==0 ){
      let pre_h = Heart.rows[h_index-1]['arr'];
      if( dtot(pre_h[4]) >= dtot(_p1[3].replace(/\.\d{3}/, "")) )
        h_index--;
    }
    if( h_index < Heart.rows.length && dtot(_h[4]) <= dtot(_p1[3].replace(/\.\d{3}/, "")) ){
      // h_index++;
      hi++;
      noStroke();
      // stroke(255,0,0);
      // noFill();
      H = map( H, 0, 180, 0, height );
      S = map( S, 0, 180, 0, height );
      fill(color( 255, 0, 0, 125 ));
      rect( x1, height-H, 5, H );
      fill(color( 0, 50, 125, 125 ));
      rect( x1+2, height-S, 5, S );
    }else{

    }
  }
  
  if( (p_index + maximum + direction < PPG.rows.length && direction > 0 ) || 
      (p_index + direction > 0 && direction < 0) )
  {
    p_index = PPG.length == p_index + 1 ? 0 : p_index+direction;
    h_index = max( pass_counter_h, h_index );
  }
}
function setSpeed( n ){
  direction = n;
  document.querySelector( "#speed" ).innerText = n;
}

function dtot( date ){
  let d = Date.parse( date );
  return d;
}
