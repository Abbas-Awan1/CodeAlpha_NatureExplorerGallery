const gallery=document.querySelector(".gallery");
const galleryTitle=document.querySelector(".gallery-title");
const categoryCards=document.querySelectorAll(".category-card");
const lightbox=document.querySelector(".lightbox");
const lightboxImage=document.getElementById("lightbox-image");
const closeBtn=document.querySelector(".close");
const nextBtn=document.querySelector(".next");
const prevBtn=document.querySelector(".prev");
const imageUpload=document.getElementById("image-upload");
const imageCategory=document.getElementById("image-category");
const addImageBtn=document.getElementById("add-image-btn");
const uploadMessage=document.getElementById("upload-message");

let currentIndex=0;
let visibleImages=[];

function getImages(){
    return Array.from(
        document.querySelectorAll(".gallery img")
    );
}
categoryCards.forEach(card=>{
    card.addEventListener("click",()=>{
        categoryCards.forEach(item=>{
            item.classList.remove("active-card");
        });
        card.classList.add("active-card");
        const filter=card.dataset.filter;
        const images=getImages();
        images.forEach(image=>{
            if(filter==="all"||image.dataset.category===filter){
                image.style.display="block";
            }else{
                image.style.display="none";
            }
        });
        gallery.style.display="grid";
        galleryTitle.style.display="block";
        gallery.style.animation="none";
        gallery.offsetHeight;
        gallery.style.animation="fadeGallery 0.8s ease";
        galleryTitle.scrollIntoView({
            behavior:"smooth",
            block:"start"
        });
    });
});
gallery.addEventListener("click",event=>{
    if(event.target.tagName!=="IMG"){
        return;
    }
    visibleImages=getImages().filter(image=>{
        return image.style.display!=="none";
    });
    currentIndex=visibleImages.indexOf(event.target);
    lightboxImage.src= visibleImages[currentIndex].src;
    lightbox.style.display="flex";
});

function showImage(){
    lightboxImage.src=visibleImages[currentIndex].src;
}

nextBtn.addEventListener("click",()=>{
    currentIndex++;
    if(currentIndex>=visibleImages.length){
        currentIndex=0;
    }
     showImage();
});

prevBtn.addEventListener("click",()=>{
    currentIndex--;
    if(currentIndex<0){
        currentIndex=visibleImages.length-1;
    }
    showImage();
});

closeBtn.addEventListener("click",()=>{
    lightbox.style.display="none";
});

lightbox.addEventListener("click",event=>{
    if(event.target===lightbox){
        lightbox.style.display="none";
    }
});

document.addEventListener("keydown",event=>{
    if(lightbox.style.display!=="flex"){
        return;
    }
    if(event.key==="ArrowRight"){
        nextBtn.click();
    }
    if(event.key==="ArrowLeft"){
        prevBtn.click();
    }
    if(event.key==="Escape"){
        lightbox.style.display="none";
    }
});
function saveImagesToLocalStorage(){
    const images=document.querySelectorAll(".gallery img");
    const imageData=[];
    images.forEach(image=>{
        if(image.src.startsWith("data:")){
            imageData.push({
                src:image.src,
                category:image.dataset.category,
                alt:image.alt
            });
        }
    });
    localStorage.setItem(
        "uploadedImages",
        JSON.stringify(imageData)
    );
}
addImageBtn.addEventListener("click",()=>{
    const file=imageUpload.files[0];
    const category=imageCategory.value;
    if(!file||category===""){
        uploadMessage.textContent="Please Choose an Image and Category";
        return;
    }
    const reader=new FileReader();
    reader.onload=function(event){
        const newImage=document.createElement("img");
        newImage.src=event.target.result;
        newImage.alt="User Added Nature Image";
        newImage.dataset.category=category;
        newImage.style.display="block";
        gallery.appendChild(newImage);
        saveImagesToLocalStorage();
        uploadMessage.textContent="Image Added Successfully!";
        imageUpload.value="";
        imageCategory.value="";
    };
    reader.readAsDataURL(file);
});
function loadImagesFromLocalStorage(){
    const saveImages=JSON.parse(
        localStorage.getItem("uploadedImages")
    ) || [];
    saveImages.forEach(image=>{
        const newImage=document.createElement("img");
        newImage.src=image.src;
        newImage.alt=image.alt;
        newImage.dataset.category=image.category;
        gallery.appendChild(newImage);
    });
}
loadImagesFromLocalStorage();





