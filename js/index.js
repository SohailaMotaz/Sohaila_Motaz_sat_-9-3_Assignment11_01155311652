var productNameInput = document.getElementById("productNameInput")
var productPriceInput = document.getElementById("productPriceInput")
var productCategoryInput = document.getElementById("productCategoryInput")
var productImageInput = document.getElementById("productImageInput")
var productDescInput = document.getElementById("productDescInput")
var productSearch = document.getElementById("productSearch")
var addbtn = document.getElementById("addBtn")
var updateBtn = document.getElementById("updateBtn")
var productList = []


if (localStorage.getItem("products") != null) {
    productList = JSON.parse(localStorage.getItem("products"));
    displayProducts(productList);
}




function addProduct() {
    if (
        validateFormInputs(productNameInput) &&
        validateFormInputs(productPriceInput) &&
        validateFormInputs(productCategoryInput) &&
        validateFormInputs(productImageInput) &&
        validateFormInputs(productDescInput)
    ) {
        var product = {
            name: productNameInput.value,
            price: productPriceInput.value,
            category: productCategoryInput.value,
            image: `images/${productImageInput.files[0].name}`,
            description: productDescInput.value
        }

        productList.push(product);
        localStorage.setItem("products", JSON.stringify(productList));
        displayProducts(productList);
        clearForm();


    }



}

function clearForm() {
    productNameInput.value = ""
    productPriceInput.value = ""
    productCategoryInput.value = ""
    productImageInput.value = ""
    productDescInput.value = ""
    productSearch.value = ""


    productNameInput.classList.remove("is-valid");
    productPriceInput.classList.remove("is-valid");
    productCategoryInput.classList.remove("is-valid");
    productImageInput.classList.remove("is-valid");
    productDescInput.classList.remove("is-valid");
}

function displayProducts(list, realIndexes = []) {
    var blackbox = '';
    if (list.length == 0) {
        blackbox = `<div class="col-12">
                        <div class="alert alert-danger text-center" role="alert">
                            No Products Found
                        </div>
                    </div>`;
        document.getElementById("products").innerHTML = blackbox;
        return;
    }
    list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));


    for (var i = 0; i < list.length; i++) {
        var realIndex = (realIndexes.length > 0) ? realIndexes[i] : i;
        blackbox += `<div class="col-md-3">
                    <div class="card product">
                        <figure class="bg-light p-3">
                            <img src="${list[i].image}" class="card-img-top" alt="...">
                        </figure>
                        <div class="d-flex justify-content-between p-3">
                            <span class="badge text-bg-primary">${list[i].category}</span>
                            <span class="text-danger">${list[i].price}</span>
                        </div>
                        <div class="card-body">
                            <h3 class="card-title h5">${list[i].highlightedName ? list[i].highlightedName : list[i].name}</h3>
                            <p class="card-text">${list[i].description}</p>
                        </div>
                        <div class="d-flex justify-content-between p-3">
                            <button onClick="editProduct(${realIndex})" class="btn btn-outline-warning"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button onClick="deleteProduct(${realIndex})" class="btn btn-outline-danger"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>

                </div>`;
    }

    document.getElementById("products").innerHTML = blackbox

}

function deleteProduct(index) {
    productList.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(productList))
    displayProducts(productList);
}

var updateIndex
function editProduct(index) {
    productNameInput.value = productList[index].name;
    productPriceInput.value = productList[index].price;
    productCategoryInput.value = productList[index].category;
    productDescInput.value = productList[index].description;


    updateIndex = index;
    addbtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");

}

function updateProduct() {
    if (
        validateFormInputs(productNameInput) &&
        validateFormInputs(productPriceInput) &&
        validateFormInputs(productCategoryInput) &&
        validateFormInputs(productImageInput) &&
        validateFormInputs(productDescInput)
    ) {
        productList[updateIndex].name = productNameInput.value;
        productList[updateIndex].price = productPriceInput.value;
        productList[updateIndex].category = productCategoryInput.value;
        productList[updateIndex].image = `images/${productImageInput.files[0].name}`;
        productList[updateIndex].description = productDescInput.value;

        productSearch.value = "";

        
        for (let product of productList) {
            delete product.highlightedName;
        }

        localStorage.setItem("products", JSON.stringify(productList));
        displayProducts(productList);
        clearForm();

        addbtn.classList.remove("d-none");
        updateBtn.classList.add("d-none");
    }


}



function searchByProductName(keyword) {
    var matchedResults = [];
    var matchedIndexes = [];
 

    for (var i = 0; i < productList.length; i++) {
        const name = productList[i].name;
        if (name.toLowerCase().includes(keyword.value.toLowerCase())) {
            const regex = new RegExp(`(${keyword.value})`, 'gi');
            productList[i].highlightedName = name.replace(regex, '<span class="text-danger">$1</span>');
            matchedResults.push(productList[i]);
            matchedIndexes.push(i);


        }
    }

     var blackbox = '';
    if (matchedResults.length == 0) {
        blackbox = `<div class="col-12">
                        <div class="alert alert-danger text-center" role="alert">
                            No Products Found
                        </div>
                    </div>`;
        document.getElementById("products").innerHTML = blackbox;
        return;
    }
    displayProducts(matchedResults, matchedIndexes);
    
    
}


function validateFormInputs(element) {

    if (element.id == "productImageInput") {
        if (element.files.length > 0) {
            element.classList.remove("is-invalid");
            element.classList.add("is-valid");
            element.nextElementSibling.classList.replace("d-block", "d-none");
            return true;
        } else {
            element.classList.remove("is-valid");
            element.classList.add("is-invalid");
            element.nextElementSibling.classList.replace("d-none", "d-block");
            return false;
        }
    }

    var regex = {
        productNameInput: /\S{3,}/g,
        productPriceInput: /^(6000|[6-9]\d{3}|[1-4]\d{4}|5\d{4}|60000)$/gm,
        productCategoryInput: /^(Phones|Screens|Airpods|Watches)$/gmi,
        productDescInput: /^.{0,250}$/

    }


    var isValid = regex[element.id].test(element.value);
    if (isValid) {
        element.classList.remove("is-invalid");
        element.classList.add("is-valid");
        element.nextElementSibling.classList.replace("d-block", "d-none");
    
    }
    else {
        element.classList.remove("is-valid");
        element.classList.add("is-invalid");
        element.nextElementSibling.classList.replace("d-none", "d-block");

    }


    return isValid


}
