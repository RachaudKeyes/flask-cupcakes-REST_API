const BASE_URL = "http://localhost:5000/api";

// Given cupcake data, generate html

function createCupcakeHTML(cupcake) {

    return `
            <div data-cupcake-id=${cupcake.id}>
                <li>
                    ${cupcake.flavor} / ${cupcake.size} / ${cupcake.rating}
                    <button class="delete-button">X</button>
                </li>
                <img    class="Cupcake-img"
                        src="${cupcake.image}"
                        alt="(no image provided)">
            </div>
    `;
}


// put initial cupcakes on page

async function showCupcakes() {
    const response = await axios.get(`${BASE_URL}/cupcakes`);

    for (let cupcake of response.data.cupcakes) {
        let newCupcake = $(createCupcakeHTML(cupcake));
        $("#cupcake-list").append(newCupcake);
    }
}


// handle form for adding new cupcakes

$("#cupcake-form").on("submit", async function(evt) {
    evt.preventDefault();

    let flavor = $("#form-flavor").val();
    let size = $("#form-size").val();
    let rating = $("#form-rating").val();
    let image = $("#form-image").val();

    const newCupcakeResponse = await axios.post(`${BASE_URL}/cupcakes`, {flavor, 
        size, rating, image}
    );

    // generate new HTML for new cupcake, append to DOM, reset form 
    let newCupcake = $(createCupcakeHTML(newCupcakeResponse.data.cupcake));
    $("#cupcake-list").append(newCupcake);
    $("#cupcake-form").trigger("reset");
});



// handle clicking delete: delete cupcake

$("#cupcake-list").on("click", ".delete-button", async function(evt) {
    evt.preventDefault();

    let $cupcake = $(evt.target).closest("div");
    let cupcakeId = $cupcake.attr("data-cupcake-id");

    // remove from DOM and database
    await axios.delete(`${BASE_URL}/cupcakes/${cupcakeId}`);
    $cupcake.remove();
});

$(showCupcakes);