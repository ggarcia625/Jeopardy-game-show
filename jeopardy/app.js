let QUESTIONS = 5;
let CATEGORIES = 6; 
const BASE_API_URL = "http://jservice.io/api/";
let button = document.getElementById("start");
let = buttonStatus = "start";
let table = document.getElementById("board");
let categories = [];

button.addEventListener("click", function() {
    categories = [];
    table.innerHTML = "";
    setupAndStart();
    button.innerText = "Restart";
});


async function getCategoryIds(){
  let response = await axios.get(`${BASE_API_URL}categories`, {
    params: {
      count: "100",
      offset: Math.floor(Math.random() * (500 - 1) + 1)
    }
  });

  let randomCategories = _.sampleSize(response.data, CATEGORIES)
  let categories = [];
  for ( let category of randomCategories) {
    categories.push(category.id);
  }
  return categories;
} 


async function getCategory(catId) {
  let response = await axios.get(`${BASE_API_URL}category`, {
    params: {
      id: catId
    }
  })
  let categoryClues = response.data.clues;
  for(let i = 0; i < categoryClues.length; i++){
    categoryClues[i].showing = null;
  }
  return {title: response.data.title, clues: categoryClues}

}

function fillTable() {    
  var top = document.createElement("tr");
    top.setAttribute("id", "Categories");
    for (var x = 0; x < CATEGORIES; x++) {
      var headCell = document.createElement("td");
      headCell.setAttribute("id", x);
      headCell.innerText = categories[x].title;
      top.append(headCell);
    }
    table.append(top);
    
    for (var y = 0; y < QUESTIONS; y++) {
      const row = document.createElement("tr");
      for (var x = 0; x < CATEGORIES; x++) {
        const cell = document.createElement("td");
        cell.setAttribute("id", `${x}-${y}`);
        cell.addEventListener("click", handleClick);
        cell.innerText = "**?**";
        row.append(cell);
      }
      table.append(row);
    }  
  }


function handleClick(evt) {
  var id = evt.target.id;
  let tableId = id.split("-");
  let clueObj = categories[tableId[0]].clues[tableId[1]]
  let cell = evt.target;
    if (clueObj.showing === null){
      cell.innerText = clueObj.question;
      clueObj.showing = "question"
      return
    }
    if (clueObj.showing === "question"){
      cell.innerText = clueObj.answer;
      clueObj.showing = "answer";
      let tdBackground = document.getElementById(id);
      tdBackground.style.background = "#28a200";
    }
    return categories[tableId[0]];
}
  
function showLoadingView() {
  $('body').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
  $('window').on('load', function(){
    setTimeout(removeLoader, 6000);
  });

}

function hideLoadingView() {
  $('#loadingDiv').fadeOut(2000, function(){
    $('#loadingDiv').remove();
  });
}


async function setupGameBoard() {
  let catIds = await getCategoryIds()
  for (let catId of catIds){
    categories.push(await getCategory(catId));
  }
  fillTable();
}

function setupAndStart() {
  showLoadingView();
  hideLoadingView()
  setupGameBoard();
}

