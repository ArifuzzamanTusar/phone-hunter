// Necessary Functions 
const getById = id => {return document.getElementById(id)};
const hide = id => {return (document.getElementById(id).style.display = "none")};
const show = id => {return (document.getElementById(id).style.display = "block")};

// Search Button onClick funtion [get data from api]
const findPhone = () => {
    getById("allPhones").innerHTML = "";
 
    
    const searchQuery = getById("query").value;
    // Empty search validation 
    if (searchQuery == '') {
        show("emptyInput");

    }
    //Passed then strt process
    else {
        hide("emptyInput"); //validation hide
        hide("btnSearch"); //hide search icon
        show("btnLoading"); // Loding icon animation show
        show("searchSpinner"); //content area spinner show
        hide("noResultFound"); // no result valisaion hide
        hide("successMessage"); // hide the success message
        getById("loadMore").innerHTML= ''; //clear load more btn
        

        fetch(`https://openapi.programming-hero.com/api/phones?search=${searchQuery}`)
            .then(response => response.json())
            .then(data => loadApiData(data.data, searchQuery)); //passing data and query
    }

};

// loading first 20 data 
const loadApiData = (data, query) => {
    // no result found
    if (data.length == 0) {
        show("noResultFound");
    } else {
        show("successMessage");
        getById("successMessage").innerText = `found ${data.length} phones, Showing 20 of ${data.length}`;


        // Slicing Array to 20 elements 
        slicedData = data.slice(0, 20);

        // Displaying the Phone Loops
        slicedData.forEach((phone) => {
            const div = document.createElement("div");
            div.classList.add("col-md-4");
            // Loop template
            div.innerHTML = `
            <div class="card shadow-lg rounded border-0 my-3">
                <img src="${phone.image}" class="card-img-top phone-image" alt="...">
                <div class="card-body ">
                    <div class="card-text">
                        <p>${phone.brand}</p>
                        <h3>${phone.phone_name}</h3>
                        <button onclick="seeDetails('${phone.slug}')" type="button" class="btn btn-info text-white">See Details</button>
                    </div>
                </div>
            </div>
            `;

            // Appending to Element 
            getById("allPhones").appendChild(div);


        });
        //Load More handelling If data is more than 20
        if (data.length > 20) {
            getById("loadMore").innerHTML = `
            <button onclick="loadMore('${query}')" type="button" class="btn btn-primary">Load More Phones</button>
            `;
        }
    }
    show("btnSearch");
    hide("btnLoading");
    hide("searchSpinner");
};

// Phone Detailes 
//-----------------

const seeDetails = slug => {
    const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
    myModal.show();
    // show("modalSpinner");
    fetch(`https://openapi.programming-hero.com/api/phone/${slug}`)
        .then(response => response.json())
        .then(data => modalPhoneDetils(data.data));


}
const modalPhoneDetils = data => {
    // console.log(data.mainFeatures.sensors);
    getById('phoneModalLabel').innerText = data.name;
    const sensors = data.mainFeatures.sensors;
    console.log(data.others);
    const template = `
                    <div class="row">
                        <div class="col-md-6">
                            <figure id="phone_image">
                                <img class="phone_images" src="${data.image}" alt="">
                            </figure>
                        </div>
                        <div class="col-md-6 d-flex justify-content-center align-items-center">
                            <div class="w-100">
                                <h2 id="phone_name">${data.name}</h2>
                                <div class="p-3"></div>
                                <table  class="table table-striped">
                                    <tr> <td>Release Date</td> <td>${data.releaseDate ? data.releaseDate : "Not Released yet"}</td> </tr>
                                    <tr> <td>Brand</td> <td>${data.name ? data.brand : 'Not Available'}</td> </tr>
                                    <tr> <td>storage</td> <td>${data.mainFeatures.storage ? data.mainFeatures.storage : 'Not Available'}</td> </tr>
                                    <tr> <td>displaySize</td> <td>${data.mainFeatures.displaySize ? data.mainFeatures.displaySize : 'Not Available'}</td> </tr>
                                    <tr> <td>chipSet</td> <td>${data.mainFeatures.chipSet ? data.mainFeatures.chipSet : 'Not Available'}</td> </tr>
                                    <tr> <td>memory</td> <td>${data.mainFeatures.memory ? data.mainFeatures.memory : 'Not Available'}</td> </tr>
                                    <tr> <td>sensors</td> <td>${sensors.map(element => element).join(", ")}</td> </tr>
                                    <tr><th colspan ="2" class="p-2" > Other features</th></tr>
                                    ${data.others ? `
                                    <tr> <td>WLAN</td> <td>${data.others.WLAN ? data.others.WLAN : 'Not Available'}</td> </tr>
                                    <tr> <td>Bluetooth</td> <td>${data.others.Bluetooth}</td> </tr>
                                    <tr> <td>GPS</td> <td>${data.others.GPS}</td> </tr>
                                    <tr> <td>NFC</td> <td>${data.others.NFC}</td> </tr>
                                    <tr> <td>Radio</td> <td>${data.others.Radio}</td> </tr>
                                    <tr> <td>USB</td> <td>${data.others.USB}</td> </tr>
                                    `
            : ' <tr><td colspan ="2"> No other features</td></tr>'}


                                </table>
                            </div>                                       
                        </div>
                    </div>
    `;
    hide("modalSpinner");
    getById('phone_details').innerHTML = template;
    console.log(data.name);
}


// ========================= 
// LOAD MORE Data

const loadMore = data => {
    fetch(`https://openapi.programming-hero.com/api/phones?search=${data}`)
    .then(response => response.json())
    .then(data => appendLoadedMoreData(data.data));
}
// Load 20 to the rest data 
const appendLoadedMoreData = (data) =>{
    console.log(data);
        // no result found
        if (data.length === 0) {
            show("noResultFound");
        } else {
            show("successMessage");
            getById("successMessage").innerText = `found ${data.length} phones, Showing ${data.length} of ${data.length}`;   
            // Slicing Array to 20 elements 
            slicedData = data.slice(20, data.length);   
            // Displaying the Phone Loops
            slicedData.forEach((phone) => {
                const div = document.createElement("div");
                div.classList.add("col-md-4");
                // Loop template
                div.innerHTML = `
                <div class="card shadow-lg rounded border-0 my-3">
                    <img src="${phone.image}" class="card-img-top phone-image" alt="...">
                    <div class="card-body ">
                        <div class="card-text">
                            <p>${phone.brand}</p>
                            <h3>${phone.phone_name}</h3>
                            <button onclick="seeDetails('${phone.slug}')" type="button" class="btn btn-info text-white">See Details</button>
                        </div>
                    </div>
                </div>
                `;
    
                // Appending to Element 
                getById("allPhones").appendChild(div);  
            });
            //Load More handelling If data is more than 20  
                getById("loadMore").innerHTML = `No more data`;       
        }
        show("btnSearch");
        hide("btnLoading");
        hide("searchSpinner");

};