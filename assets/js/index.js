/**
         * 
         * @async - async main function that allow to inner function to use await expressin (a)
         */
async function main() {

    // The url address of the API
    const API_URL = `https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=c4e2f731926eefa6fe1d3e9c2c9f9449&privacy_filter=1&per_page=15&page=2&format=json&nojsoncallback=1`;

    // Take the tags <table></table> that thier id is 'photos-table' and represent them as an object inside table
    const table = document.getElementById('photos-table');

    // Take the tags <tbody></tbody> and represent them as an object inside tbody
    const tbody = table.querySelector(`tbody`);

    try {


        // await expression can be used only on async function, we use it on fetch because we dont want to run to the 
        // next command before the server will return the response, await expression say: "Until I finish my business // everyone will wait", if we will run to the next command befor the server will have the chance to return
        // the "Promise" fetch_photos will still be empty and "fetch_photos.photos" will throw us to the catch and
        // error will be thrown. fetch get the API url address and return "Promise" that contain the response, 
        // from the Promise we use the method then, before return the response be then we created a function that
        // return the response in jason form to then, then will return the jason in form of an object and put it
        // inside fetch_photos.
        const fetch_photos = await fetch(API_URL)
            .then(function (response) {
                return response.json()
            });


        // We extract an array of Object that contain details about the photos from the jason (inside the block of photos)      
        const photos = fetch_photos.photos;
        const photosArray = photos.photo;

        // Check if photo is array and if it contains objects
        if (Array.isArray(photosArray) && photosArray.length) {

            function printLabel(isWhat) {
                return isWhat.toString() === '1' ? '✔' : '✕'
            }


            /**
             * Get an Object that contain the photos details
             * returns String table row that contains all the photo paramenters and the photo 
             */
            function getTrHTML(photo) {
                return `
                        <tr>
                            <td class="id">${photo.id}</td>
                            <td class="owner">${photo.owner}</td>
                            <td class="secret">${photo.secret}</td>
                            <td class="server">${photo.server}</td>
                            <td class="farm">${photo.farm}</td>
                            <td class="title">${photo.title}</td>
                            <td class="ispublic">${printLabel(photo.ispublic)}</td>
                            <td class="isfriend">${printLabel(photo.isfriend)}</td>
                            <td class="isfamily">${printLabel(photo.isfamily)}</td>
                            <td class="image">
                                <img src="https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg" alt="${photo.title}" />
                            </td>
                        </tr>
                    `;
            }

            // For each photo insert inside <tbody></tbody> the lock that return from getTrHTML() and use NinsertAdjacentHTML()
            // to adjust a string to an HTML format, 'beforeend' is for the position of the inserted row: "Just inside the element, after 
            // its last child" The intent is for the rows to enter one after the other in descending order   
            photosArray.forEach(function (photoObj) {
                tbody.insertAdjacentHTML('beforeend', getTrHTML(photoObj))
            });
        }
    }
    catch (e) {
        console.error(e)
    }

    // Take the tags that thier id is 'search-form' and represent them as an object inside searchForm 
    const searchForm = document.getElementById('search-form');

    // Take the tags inside the objects search form that thier type is 'search' and represent them as an 
    // object inside input (that is the <input> tag)
    const input = searchForm.querySelector('[type="search"]');

    // We add an event to the search form, the event type is 'submit' that happend when the user submit the the form
    // what the event does is prevents a web page from reloading
    searchForm.addEventListener('submit', function (e) {
        return e.preventDefault()
    });

    // Take the <tr> tags inside tbody and represent them as an array of objects inside searchForm 
    const tbodyAllTr = Array.from(tbody.querySelectorAll('tr'));


    // We add an event to the <input> tag, when we release the key after entering the input a new object 
    // called value is created, if the length of value is 3 or more then we enter the block, add to
    // every row in the table an attribute that  makes hem disappear then check which row contains
    // an object with a title that contains the user's input and removefrom hem the attribute that
    // he could be seen, after the user delete the input from the search bar we will remove the
    // reset of the attributes from the rows and they willreturn to be seen.
    input.addEventListener('keyup', function (e) {

        const value = this.value.toLowerCase().trim();

        if (value.length >= 3) {

            tbodyAllTr.forEach(function (tr) {
                tr.style.display = 'none'
            });

            // Find the titles that contain the user's input
            const trDisplay = tbodyAllTr.filter(function (tr) {
                return tr.querySelector(`.title`).innerText.toLowerCase().trim().includes(value)
            });

            trDisplay.forEach(function (tr) {
                tr.removeAttribute('style')
            });
        }
        else {
            tbodyAllTr.forEach(function (tr) {
                tr.removeAttribute('style')
            });
        }
    });
}

// Run the program
main();
