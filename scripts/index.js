// DOM elements
const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
let html = '';


const setupUI = (user) => {
  if (user) {
    // account info
    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().bio}</div>
      `;
      accountDetails.innerHTML = html;
    });
    // toggle user UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // clear account info
    accountDetails.innerHTML = '';
    // toggle user elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};
function myFunc() {
  var sel;
  sel = document.getElementById('list').value;
  console.log(sel)
  location.href = "index.html";
  console.log('reloading');
  localStorage.setItem("new_filter", sel);
}

function myFunction() {
    var input;
    input = document.getElementById('searchInput');
    filter = input.value.toLowerCase();
    console.log(typeof filter);
    location.href = "index.html";
    console.log('redirecting');
    localStorage.setItem("new_filter", filter);
    document.getElementById("searchInput").value = "";

}
filter = localStorage.getItem("new_filter");
console.log(typeof filter) 
console.log(filter) 

function petInfo(petId){
  console.log("in petInfo with id "+petId);
  localStorage.setItem("reqPetId",petId);
  location.href="pet_info.html";
}
// setup guides
const renderPet = (data) => {
    
      const pet = data.data();
      console.log('I am in renderPet with data');
      const idVal=data.id;
      const li = `
        <li>
          <div class="block center grey lighten-4"> <h5>Name: ${pet.name}</h5> ${pet.breed}<br> 
          <img src=${pet.image} height="200px"><br><br>
          <button class="btn yellow darken-2 z-depth-0" onclick="petInfo('${idVal}/${pet.breed}')">See More</button></div>
        </li>
      `;
      console.log(li);
      html += li;
    guideList.innerHTML = html
  
};
const setupGuides=(data)=>{
    if (filter=='') {
      db.collection('pets').doc('allPets').collection('cats').get().then((snapshot)=>{
        console.log(snapshot.docs);
                snapshot.docs.forEach(doc=>{
                    renderPet(doc);
        
                })
        })
        db.collection('pets').doc('allPets').collection('dogs').get().then((snapshot)=>{
          console.log(snapshot.docs);
                  snapshot.docs.forEach(doc=>{
                      renderPet(doc);
          
                  })
          })
    } else {
      db.collection('pets').doc('allPets').collection(filter).get().then((snapshot)=>{
        console.log(snapshot.docs);
                snapshot.docs.forEach(doc=>{
                    renderPet(doc);
        
                })
        })
    }
    
  } 




// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

});
let img = document.getElementById('img');
let file={}

function chooseFile(e){
  file=e.target.files[0];
}
let random=0;

function uploadImg(){
  random=Math.random();
  firebase.storage().ref('photos/'+random+'.png')
    .put(file).then(()=>{
      console.log('successfully uploaded');
    firebase.storage().ref('photos/'+random+'.png').getDownloadURL().then(ref=>{
      localStorage.setItem('imgRef',ref);
    console.log(ref)
  })
    })
  
}