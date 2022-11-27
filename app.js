const { rejects } = require('assert');
const express = require('express')
const app = express();
const https = require("https");
const { resolve } = require('path');
const port = 3000

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }))
// app.get('/', (req, res) => {
// //   res.send('Hello World!')
//     // res.render("index");
//     let url="https://www.themealdb.com/api/json/v1/1/categories.php"
//     https.get(url,function(response){
//         let finaldata=""
//         response.on("data",function(data){
//               finaldata+=data.toString();
//         });
//         response.on("end",function(){
//             finaldata=JSON.parse(finaldata)
//             finaldata= finaldata.categories;

//             res.render("index",{list:finaldata});
//         })

//     });
// })
function getrandomfood() {
    return new Promise((resolve, reject) => {
        let url = `https://www.themealdb.com/api/json/v1/1/random.php`
        https.get(url, function (response) {
            let finaldata = "";
            response.on("data", function (data) {
                finaldata += data.toString();
            });
            response.on("end", function () {
                finaldata = JSON.parse(finaldata);
                finaldata = finaldata.meals[0];
                // res.send(finaldata);
                // res.render("meal_detail",{meal_details:finaldata})
                // console.log(finaldata)
                if (finaldata != undefined) {
                    resolve(finaldata);
                }
                else {
                    reject(null)
                }
                // return finaldata;
            });

        });

    });
}

app.get('/', (req, res) => {
    //   res.send('Hello World!')
    // res.render("index");
    let url = "https://www.themealdb.com/api/json/v1/1/categories.php"
    https.get(url, function (response) {
        let finaldata = ""
        response.on("data", function (data) {
            finaldata += data.toString();
        });
        response.on("end", async function () {
            finaldata = JSON.parse(finaldata)
            finaldata = finaldata.categories;
            const random_food = await getrandomfood();
            // res.send(random_food)
            res.render("index", { list: finaldata, random: random_food });
        })

    });
})


app.post("/search_item", function (req, res) {

    let item = req.body.fsearch;
    console.log(item);
    let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`;
    console.log(url);
    https.get(url, function (response) {
        let finaldata = ""
        response.on("data", function (data) {
            finaldata += data.toString();
        });
        response.on("end", function () {
            finaldata = JSON.parse(finaldata)
            finaldata = finaldata.meals;
            // console.log(finaldata)
            // res.send(finaldata);
            if (finaldata != null) {
                res.render("category_show", { list: finaldata, category: item });
            }
            else {
                res.render("cannot_found_page", { search_item: item });

            }
        })

    });

});
// app.get("/random-recipe",function(req,res){
//     let url=`https://www.themealdb.com/api/json/v1/1/random.php`
//     https.get(url,function(response){
//         let finaldata="";
//         response.on("data",function(data){
//             finaldata+=data.toString();
//         });
//         response.on("end",function(){
//             finaldata=JSON.parse(finaldata);
//             finaldata=finaldata.meals[0];
//             // res.send(finaldata);
//             res.render("meal_detail",{meal_details:finaldata})
//         });

//     });
// });
app.get("/ingrediants", function (req, res) {
    // www.themealdb.com/api/json/v1/1/list.php?i=list
    let order = req.query.sort || "asc";
    // if (order == undefined) {
    //     order = "asc"
    // }
    let url = "https://www.themealdb.com/api/json/v1/1/list.php?i=list";
    https.get(url, function (response) {
        let finaldata = ""
        response.on("data", function (data) {
            finaldata += data.toString();
        });
        response.on("end", function () {
            finaldata = JSON.parse(finaldata)
            finaldata = finaldata.meals;
            if (order == "asc") {
                finaldata.sort((a, b) => {
                    fa = a.strIngredient.toLowerCase();
                    fb = b.strIngredient.toLowerCase();
                    if (fa > fb) {
                        return 1;
                    }
                    if (fa < fb) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                    // return b.idIngredient - a.idIngredient;
                });
            }
            else {
                finaldata.sort((a, b) => {
                    fa = a.strIngredient.toLowerCase();
                    fb = b.strIngredient.toLowerCase();
                    if (fa > fb) {
                        return -1;
                    }
                    if (fa < fb) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                    // return b.idIngredient - a.idIngredient;
                });

            }
            // res.send(finaldata)
            res.render("all_ingrediants", { list: finaldata });
        })

    });
});

app.get("/area", function (req, res) {
    // www.themealdb.com/api/json/v1/1/list.php?i=list
    let url = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";
    https.get(url, function (response) {
        let finaldata = ""
        response.on("data", function (data) {
            finaldata += data.toString();
        });
        response.on("end", function () {
            finaldata = JSON.parse(finaldata)
            finaldata = finaldata.meals;
            res.render("sort_area", { list: finaldata });
        })

    });
});


app.get("/Ingredient/:ingrediant_item", function (req, res) {
    let ingrediant = req.params.ingrediant_item;
    // console.log(categorynm);
    let url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediant}`;
    https.get(url, function (response) {
        let finaldata = ""
        response.on("data", function (data) {
            finaldata += data.toString();
        });
        response.on("end", function () {
            finaldata = JSON.parse(finaldata)
            finaldata = finaldata.meals;
            // console.log(finaldata)
            // res.send(finaldata);
            if (finaldata != null) {

                res.render("category_show", { list: finaldata, category: ingrediant });
            }
            else {
                res.render("cannot_found_page", { search_item: ingrediant });
            }
        })

    });
});
app.get("/filter_letter", (req, res) => {
    let first_letter = req.query.letter;
    // res.send(first_letter)
    let url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${first_letter}`;
    https.get(url, function (response) {
        let finaldata = ""
        response.on("data", function (data) {
            finaldata += data.toString();
        });
        response.on("end", function () {
            finaldata = JSON.parse(finaldata)
            finaldata = finaldata.meals;
            // console.log(finaldata)
            // res.send(finaldata);
            if (finaldata != null) {

                res.render("category_show", { list: finaldata, category: first_letter });
            }
            else {
                res.render("cannot_found_page", { search_item: first_letter });
            }
        })

    });
});
app.get("/area/:area", function (req, res) {
    let place = req.params.area;
    // console.log(categorynm);
    let url = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${place}`;
    https.get(url, function (response) {
        let finaldata = ""
        response.on("data", function (data) {
            finaldata += data.toString();
        });
        response.on("end", function () {
            finaldata = JSON.parse(finaldata)
            finaldata = finaldata.meals;
            // console.log(finaldata)
            // res.send(finaldata);
            res.render("category_show", { list: finaldata, category: place });
        })

    });
});


app.get("/category/:category", function (req, res) {
    let categorynm = req.params.category;
    // console.log(categorynm);
    let url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categorynm}`;
    https.get(url, function (response) {
        let finaldata = ""
        response.on("data", function (data) {
            finaldata += data.toString();
        });
        response.on("end", function () {
            finaldata = JSON.parse(finaldata)
            finaldata = finaldata.meals;
            // console.log(finaldata)
            // res.send(finaldata);
            res.render("category_show", { list: finaldata, category: categorynm });
        })

    });
});
function get_ingrediant(object) {
    return new Promise((resolve, reject) => {
        console.log(object)
        let ingrediant_array = []
        for (i = 1; i <= 20; i++) {
            let ingrediant_name_id = `strIngredient${i}`;
            let ingrediant_measure_id = `strMeasure${i}`;

            // console.log(ingrediant_name
            let ingrediant_name = object[ingrediant_name_id];
            let ingrediant_measure = object[ingrediant_measure_id];
            if (ingrediant_name != "" || ingrediant_name != " " || ingrediant_measure != " " || ingrediant_measure != "" ) {
                let ingrediant_obj = {
                    "Name": ingrediant_name,
                    "Measure": ingrediant_measure
                };
                ingrediant_array.push(ingrediant_obj);
            }
        }
        if (ingrediant_array != null) {
            resolve(ingrediant_array);
        }
        else {
            reject(null)
        }

    });
}

function get_similar(category_search){
    return new Promise((resolve,reject)=>{
        let url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category_search}`;
        let similar_array=new Array
        https.get(url, function (response) {
            let finaldata = ""
            response.on("data", function (data) {
                finaldata += data.toString();
            });
            response.on("end", function () {
                finaldata = JSON.parse(finaldata)
                finaldata = finaldata.meals;
                // console.log(finaldata)
                // res.send(finaldata);
                len=finaldata.length;
                for (let index = 0; index < 4; index++) {
                    let item=finaldata[Math.floor(Math.random()*len)]
                    console.log(item);
                    console.log(similar_array);
                    if(item in similar_array){
                        index=index-1;
                    }
                    else{
                        similar_array.push(item);                    
                    }
                }
                if(similar_array!=null){
                    resolve(similar_array);
                }
                else{
                    reject(null);
                }
                // res.render("category_show", { list: finaldata, category: categorynm });
            })
    
        });
    });
}
app.get("/meal/:id", function (req, res) {
    let meal_id = req.params.id;
    let url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal_id}`
    https.get(url, function (response) {
        let finaldata = "";
        response.on("data", function (data) {
            finaldata += data.toString();
        });
        response.on("end", async function () {
            finaldata = JSON.parse(finaldata);
            finaldata = finaldata.meals[0];
            // res.send(finaldata);
            let ingrediant = await get_ingrediant(finaldata);
            // res.send(ingrediant);
            let similar_food = await get_similar(finaldata.strCategory);
            // res.send(similar_food);
            res.render("meal_detail",{meal_details:finaldata,ingrediant_list:ingrediant,similar_item:similar_food})
        });

    });
});
app.get("/contact", (req, res) => {
    res.render("contact");
});
app.get("*", (req, res) => {
    res.render("404");
});
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})