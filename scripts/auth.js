// listen for auth status changes
db.collection('pets').onSnapshot(snapshot => {
      setupGuides(snapshot.docs);
})
auth.onAuthStateChanged(user => {
  if (user) {
      setupUI(user);
    
  } else {
      setupUI();

  }
})

// create new guide
const createForm = document.querySelector('#create-form');

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