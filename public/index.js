function createConfig( data ){
  let config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Combined Line/Bar Chart'
        }
      }
    },
  };
  return config;
}

function dtot( date ){
  let d = Date.parse( date );
  return d;
}

function combineDataset( _heart_data, _ppg_data, max ){
  // let labels = _ppg_data.map( (v, i)=> i );
  let labels = [ ];
  for( let i = 0 ; i<max ; i++ ){
    labels.push( i );
  }
  
  let total_length = labels.length;
  let heart_data = [ ];
  let spo2_data  = [ ];
  let ppg_data   = [ ];

  for( p_index ; p_index < total_length ; p_index++ ){
    let _p =   _ppg_data[p_index];
    let _h = _heart_data[h_index];
    if( h_index < _heart_data.length && dtot(_h.date.replace(/"/g, "")) <= dtot(_p.date.replace(/"/g, "").replace(/\.\d{3}/, "")) ){
      heart_data.push( _heart_data[h_index].hr );
      spo2_data.push( _heart_data[h_index].spo2 );
      h_index++;
    }else{
      heart_data.push( null );
      spo2_data.push( null );
    }
    ppg_data.push( _p.value );
  }
  let final_data = {
    labels,
    datasets: [
      {
        label: 'Heart',
        data: heart_data,
        borderColor: "red",
        backgroundColor: "#f01f01",
        type: 'bar',
        order: 0
      },
      {
        label: 'spo2',
        data: spo2_data,
        borderColor: "gary",
        backgroundColor: "#cccccc",
        type: 'bar',
        order: 1
      },
      {
        label: 'PPG',
        data: ppg_data,
        borderColor: "#36a2eb",
        backgroundColor: "#36a2eb9a",
        type: 'line',
        order: 2
      }
    ]
  }
  return final_data;
}
var heart, ppg, h_index, p_index;
var chart, data, config, max;
var cur;
window.addEventListener("load", async () => {
  let canvas = document.getElementById("myChart")
  let ctx = canvas.getContext("2d");

  heart = csv2data(await fetch( "data_A.csv" ).then( res => res.text() ));
  ppg   = csv2data(await fetch( "c_data_b.csv" ).then( res => res.text() ));
  p_index = 0;
  h_index = 0;
  max = 120;
  cur = max - 1;
  data = combineDataset( heart, ppg, max );
  config = createConfig( data );
  

  // set ctx or canvas maximum size = 1000 * 500
  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - 100;
  chart = new Chart(ctx, config);

  let last_ppg = ppg[cur],
      next_ppg = ppg[cur + 1];
  let delay = Date.parse(next_ppg.date.replace(/"/g, "")) - Date.parse(last_ppg.date.replace(/"/g, ""));
  cur+=1;
  setTimeout( updateChart, delay );
});

function updateChart(){
  let _ppg_data = ppg;
  let _heart_data = heart;
  let heart_data = data.datasets[0].data;
  let spo2_data  = data.datasets[1].data;
  let ppg_data   = data.datasets[2].data;


  data.labels.shift();
  // remove the first ppg_data
  ppg_data.shift();
  
  // remove the first heart_data
  // for( let i = 0 ; i < 5 ; i++ ){
  heart_data.shift();
  spo2_data.shift();
  // }

  data.labels.push(data.labels.length);
  let _p = _ppg_data[p_index];
  let _h = _heart_data[h_index];


  if( h_index < _heart_data.length && dtot(_h.date.replace(/"/g, "")) <= dtot(_p.date.replace(/"/g, "").replace(/\.\d{3}/, "")) ){
    // for( let i = 0 ; i < 5 ; i++ ){
      heart_data.push( _heart_data[h_index].hr );
      spo2_data.push( _heart_data[h_index].spo2 );
    // }
    h_index++;
  }else{
    // for( let i = 0 ; i < 5 ; i++ ){
    spo2_data.push( null );
    heart_data.push( null );
    // }
  }
  ppg_data.push( _p.value );
  p_index++;

  // pop 
  document.querySelector("#time").innerText = _p.date;
  chart.update();

  let last_ppg = ppg[cur],
      next_ppg = ppg[cur + 1];
  let delay = Date.parse(next_ppg.date.replace(/"/g, "")) - Date.parse(last_ppg.date.replace(/"/g, ""));
  cur++;
  setTimeout( updateChart, delay );
}



function csv2data( txt ){
  let lines = txt.split( "\n" );
  let result = [];
  let keys = lines[0].split( "," );
  for( let i = 1; i < lines.length; i++ ){
    let line = lines[i].split(",");
    let obj = new Object( );
    for( let i = 0 ; i < keys.length ; i++ ){
      let key = keys[i];
      obj[key] = line[i];
    }
    if( obj[keys[0]] != "" ){
      result.push( obj );
    }
  }
  return result;
}