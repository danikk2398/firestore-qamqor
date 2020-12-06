// listen for auth status changes
petInfo=localStorage.getItem("reqPetId")
console.log(petInfo)
var petId = petInfo.split('/')[0];
console.log("reqPetId is "+petId);
var petBreed = petInfo.split('/')[1].toLowerCase();
console.log("reqPetBreed is "+petBreed);

const form = document.querySelector('#modal-create');

db.collection('pets').doc('allPets').collection(petBreed)
      .where(firebase.firestore.FieldPath.documentId(), '==', petId).get().then((snapshot)=>{
        console.log(snapshot.docs);
        snapshot.docs.forEach(doc=>{
        loadPet(doc);
  })
})
db.collection('pets').doc('allPets').collection('cats')
      .where(firebase.firestore.FieldPath.documentId(), '==', petId).get().then((snapshot)=>{
        console.log(snapshot.docs);
        snapshot.docs.forEach(doc=>{
        loadPet(doc);
  })
})

db.collection('pets').doc('allPets').collection('dogs')
      .where(firebase.firestore.FieldPath.documentId(), '==', petId).get().then((snapshot)=>{
        console.log(snapshot.docs);
        snapshot.docs.forEach(doc=>{
        loadPet(doc);
  })
})

auth.onAuthStateChanged(user => {
  if (user) {
      setupUI(user);
    
  } else {
      setupUI();

  }
})

function uploadInfo(){

  let breed=document.getElementById("newpetbreed").value.toLowerCase();
  let name=document.getElementById("newpetname").value;
  let species=document.getElementById("newpetspecies").value.toLowerCase();
  console.log('img ref=',localStorage.getItem('imgRef'));
  db.collection('pets').doc('allPets').collection(breed).add({
    name: createForm.newpetname.value,
    breed: createForm.newpetbreed.value,
    image: localStorage.getItem('imgRef')
  }).then(() => {
    db.collection(species).add({
      name: createForm.newpetname.value,
      breed: createForm.newpetbreed.value,
      image: localStorage.getItem('imgRef')
    }).then(()=>{
      const modal = document.querySelector('#modal-create');
      M.Modal.getInstance(modal).close();
      createForm.reset();
    })
    // close the create modal & reset form
    
  })
}
// create new guide
const createForm = document.querySelector('#create-form');
/*createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let breed=document.getElementById("newpetbreed").value.toLowerCase();
  let name=document.getElementById("newpetname").value;
  let species=document.getElementById("newpetspecies").value;
  console.log(breed);
  db.collection('pets').doc('allPets').collection(breed).add({
    name: createForm.newpetname.value,
    breed: createForm.newpetbreed.value,
    image: localStorage.getItem('imgRef')
  }).then(() => {
    // close the create modal & reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err => {
    console.log(err.message);
  });
});*/

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user & add firestore data
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      bio: signupForm['signup-bio'].value
    });
  }).then(() => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
  });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
  });

});
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
const loadPet = (data) => {
    
      const pet = data.data();
      console.log('I am in renderPet with data');
      const li = `
        <li>
          <br>
          <div class="block center grey lighten-4"> 
          <br>
          <h6 class="padding 10px">More information on pet</h6> 
          <h4>Name: ${pet.name}</h4> 
          <h5>Breed: ${pet.breed}</h5><br> 
          <h6> Description: This pet is the calmest pet in the world</h6>
          <br>
          <img src=${pet.image} height="200px"><br><br>
          <button class="btn green-2">Contact owner</button>
          <br>
          </div>
        </li>
      `;
      console.log(li);
      html += li;
    guideList.innerHTML = html
  
};
const setupGuides=(data)=>{
    petId=localStorage.getItem("reqPetId")
    console.log("reqPetId is "+reqPetId)
      db.collection('pets').doc('allPets').collection(petId).get().then((snapshot)=>{
        console.log(snapshot.docs);
                snapshot.docs.forEach(doc=>{
                    renderPet(doc);
        
                })
        })
     
    
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