let express = require("express");
let app = express(); //inisialising
let port = 3000;
let cors = require("cors");
let mongoose = require("mongoose");
let mongoUrl = "mongodb://127.0.0.1:27017/nyka";
let bodyParser = require("body-parser");

// middleware (supporting library)
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>Hi from express</h1>");
});

const Category = mongoose.model(
  "categories",
  new mongoose.Schema({
    name: String,
  })
);

const Product = mongoose.model(
  "products",
  new mongoose.Schema({
    name: String,
    category_id: { type: Object, ref: Category },
  })
);

app.post("/categories", async (req, res) => {
  const category_data = req.body;
  const category = new Category(category_data);
  const result = await category.save();
  res.send(result);
});

app.get("/categories/:_id", async (req, res) => {
  const { _id } = req.params;
  const category = await Category.findOne({ _id });
  res.send(category);
});

app.post("/products", async (req, res) => {
  const product_data = req.body;
  const category = await Category.findOne({ _id: product_data.category_id });
  product_data.category_id = category;
  console.log({ product_data });
  const product = new Product(product_data);
  const result = await product.save();
  res.send(result);
});
app.get("/products/:_id", async (req, res) => {
  const { _id } = req.params;
  const category = await Product.findOne({ _id });
  res.send(category);
});

mongoose
  .connect(mongoUrl)
  .then((_) => {
    connection = _;
    app.listen(port, async () => {
      console.log(`server is running on port ${port}`);
    });
  })
  .catch((e) => {
    console.log({ e });
  });
