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