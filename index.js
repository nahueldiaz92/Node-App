const fs = require("fs");
const http = require("http");


const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not_organic");
    return output;
}

const server = http.createServer((req, res) => {
    const pathName = req.url;

    if (pathName === "/" || pathName === "/overview") {

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
        const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml)

        res.writeHead(200, {
            "Content-type": "text/html",
        })
        res.end(output);
    } else if (pathName === "/product") {
        res.end("product");
    } else if (pathName === "/api") {
        res.writeHead(200, {"Content-type": "application/json"});
        res.end("api");
    } else {
        res.writeHead(404, {
            "Content-type": "text/html",
        })
        res.end("<h1>Page not found</h1>")
    }

})

server.listen(8000, () => {
    console.log("Listening to request on port 8000")
})
